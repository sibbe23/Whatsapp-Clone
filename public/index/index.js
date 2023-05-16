const url = "http://localhost:3000"
const form = document.getElementById("form")
const messageInput = document.getElementById("new-message")
const chatList = document.querySelector('.chatbox-messages')
const createGroup = document.getElementById("create-group-btn")
const groupList = document.getElementById("group-list")

const addMemberBtn = document.getElementById("add-member")
const logOut = document.getElementById("logout-btn")
const username = document.getElementById("current-user")
const showMemberBtn = document.getElementById("show-members")
const membersContainer = document.querySelector('.members-container');
const memberListUl = document.querySelector(".members-list")
const chatbox = document.querySelector('.chatbox');
const groupContainer = document.querySelector('.group-container');

const socket = io("http://localhost:8000")
socket.on("connect", () => {
    console.log(`youre connected with id ${socket.id}`)
})
socket.on("recieve", (message) => {
    updateChatList(message.message, message.name)
})

window.addEventListener("DOMContentLoaded", async () => {
    try {
        username.textContent = localStorage.getItem("username")
        displayGroupOnLoad();
    } catch (err) {
        console.log(err)
    }
})

form.addEventListener("submit", sendChat)

createGroup.addEventListener("click", () => {
    window.location.href = "../group/group.html"
})

addMemberBtn.addEventListener("click", () => {
    window.location.href = "../member/member.html"
})

async function displayGroupOnLoad() {
    try {
        const token = localStorage.getItem("token");
        const serverResponse = await axios.get(`${url}/groups/getAllGroups`,{ headers: { "Authorization": token } });
        groupList.innerHTML = "";
        const groupName = serverResponse.data.groups;
        if (groupName) {
            groupName.forEach((group) => { 
    groupList.innerHTML += `<li class="btn btn-light w-100 border border-0 p-4 mb-2 ms-2 fw-bolder" style="height:90px;"  id=${group.id}>${group.name}<button class="del btn-small btn btn-danger float-end">X</button></li>`}) }
    } catch (error) {
        console.log(error)}
}

groupList.addEventListener("click", (e) => {
    let groupId;
    if (e.target.nodeName == "BUTTON") {
        groupId = e.target.parentElement.id;
        return deleteGroup(groupId);   }
    if (e.target.nodeName == "LI") {
        const chatbox = document.querySelector(".chatbox");
        chatbox.classList.add("visible");
        groupId = e.target.id
        localStorage.setItem("groupId", `${groupId}`)
        return fetchAndShowChat(groupId);
    }
    fetchAndShowChat(groupId);
})

async function sendChat(e) {
    try {
        e.preventDefault()
        const groupId = localStorage.getItem("groupId")
        const newMessage = { message: messageInput.value,groupId}
        const token = localStorage.getItem("token")
        const serverResponse = await axios.post(`${url}/chat/sendmessage`, newMessage,{ headers: { "Authorization": token } })
        socket.emit("new-chat", serverResponse.data)
        updateChatList(serverResponse.data.message, serverResponse.data.name)
        messageInput.value = ""
    } catch (err) {
        console.log(err)
    }
}

function updateChatList(message, sender) {
    const newMessageEl = document.createElement('div')
    if (sender === username.textContent) {
        newMessageEl.classList.add('chatbox-message', 'sent');newMessageEl.innerHTML = ` <p>${message}</p>`
    } else {
        newMessageEl.classList.add('chatbox-message')
        newMessageEl.innerHTML = `<span>${sender} :</span><p>${message}</p>`
    }
    chatList.appendChild(newMessageEl)
}

async function fetchAndShowChat(groupId) {
    let previousmsg = JSON.parse(localStorage.getItem("messages"));
    let lastMsgId = localStorage.getItem("lastChatId");
    if (!previousmsg || previousmsg.length === 0) { previousmsg = []; lastMsgId = 0;
    } else lastMsgId = previousmsg[previousmsg.length - 1].id;
    const token = localStorage.getItem("token")
    const response = await axios.get(`${url}/chat/fetchchat/${lastMsgId}`,{ headers: { "Authorization": token } });
    if (response.status == 200) {
        const newMsg = response.data.chat;
        let msg = previousmsg.concat(newMsg);
        if (msg.length > 10) {
            msg = msg.slice(msg.length - 10, msg.length);}
        localStorage.setItem("messages", JSON.stringify(msg));
        chatList.innerHTML = ""
        const msgToShow = msg.filter((item) => item.groupId == groupId);
        msgToShow.forEach(element => {
            updateChatList(element.message, element.sender)
        })}}

async function deleteGroup(groupId) {
    try {
        const confirmDelete = confirm("Delete Group?");
        if (!confirmDelete) return
        const token = localStorage.getItem("token");
        const deleteResponse = await axios.delete(`${url}/groups/deletegroup/${groupId}`,{ headers: { "Authorization": token } });
        alert(deleteResponse.data.message);
        if (deleteResponse.data.success == "true") {
            displayGroupOnLoad();
        }
    } catch (error) {
        console.log(error);
        alert(error.response.data.message)
    }
}

showMemberBtn.addEventListener("click", async () => {
    const groupId = localStorage.getItem("groupId")
    fetchAndShowMembers(groupId)
})

async function fetchAndShowMembers(groupId) {
    try {
        const token = localStorage.getItem("token")
        const getMembersResponse = await axios.get(`${url}/admin/getAllMembers/${groupId}`,{ headers: { "Authorization": token } })
        updateMemberList(getMembersResponse.data.members);
    } catch (error) {
        console.log(err)
    }
}

function updateMemberList(members) {
    memberListUl.addEventListener("click", (e) => handleMembers(e))
    memberListUl.innerHTML = ""
    members.forEach(member => {
        if (member.isAdmin) {
            memberListUl.innerHTML += `<li class="admin">${member.dataValues.name}<div class="edit-box"><button class="rmadminbtn" id="${member.dataValues.id}">Remove Admin</button>&nbsp<button class="rmuserbtn" id="${member.dataValues.id}">Remove User</button></div></li>`
        } else {
            memberListUl.innerHTML += `<li class="member">${member.dataValues.name}<div class="edit-box"><button class="makeadminbtn" id="${member.dataValues.id}">Make Admin</button>&nbsp<button class="rmuserbtn" id="${member.dataValues.id}">Remove User</button></div></li>`;
        }})
    }

function handleMembers(e) {
    let userId = e.target.id;
    let name = e.target.className;
    let token = localStorage.getItem("token");
    let groupID = localStorage.getItem("groupId");
    if (name == "makeadminbtn") makeAdmin(userId, token, groupID);
    if (name == "rmadminbtn") removeAdmin(userId, token, groupID);
    if (name == "rmuserbtn") removeUser(userId, token, groupID);
}
async function makeAdmin(userId, token, groupId) {
    try {
        let res = await axios.post( `${url}/admin/makeAdmin`, { groupId, userId,},{ headers: { "Authorization": token } });
        if (res.status == 200) fetchAndShowMembers(groupId);
        if (res.status == 403) alert("permission denied");
    } catch (error) {
        console.log(error)
        alert(error.response.data.message)
    }
}
async function removeAdmin(userId, token, groupId) {
    try {
        const removeAdminResponse = await axios.post(`${url}/admin/removeAdmin`, {userId: userId, groupId: groupId},{ headers: { "Authorization": token } })
        if (removeAdminResponse.status == 200) fetchAndShowMembers(groupId);
    } catch (error) {
        alert(error.response.data.message)
        console.log(error)
    }
}
async function removeUser(userId, token, groupId) {
    try {
        const removeUserResponse = await axios.post(`${url}/admin/removeUser`, {userId: userId,groupId: groupId}, { headers: { "Authorization": token } })
        if (removeUserResponse.status == 200)fetchAndShowMembers(groupId)
    } catch (error) {
        console.log(error)
        alert(error.response.data.message)
    }
}
const fileInput = document.getElementById('file')
const uploadbtn = document.getElementById('uploadbtn')
uploadbtn.addEventListener('click',uploadFile);
       async function uploadFile(e){
        try{
            e.preventDefault();
            const file = fileInput.files[0];
            console.log(file);
            if(!file){
                console.log('Choose a File to continue')
            }
            else{
                const formData = new FormData();
                formData.append('file', file);
            console.log(formData);
            const response=await axios.post(`http://localhost:3000/chat/sendfile`,formData,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
                console.log(response.data.message.message);
                document.getElementById('new-message').value=response.data.message.message
            }
        }catch(err){
            console.log(err);
        }
       }

       



logOut.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login/login.html"
})

