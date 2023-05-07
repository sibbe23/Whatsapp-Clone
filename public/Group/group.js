const groupList=document.getElementById('grouplist');

const groupName=document.getElementById('groupname');

const btn=document.getElementById('btn');

const logout = document.getElementById('logout')
logout.addEventListener('click',logouts)
async function logouts(){
    alert('logged out Successfully!')
    await window.location.replace('../Login/loginPage.html')
}

window.addEventListener('DOMContentLoaded',getUsers)
const memberlist = document.getElementById('memberlist')
async function getUsers(e){
try{
    e.preventDefault();
    const response = await axios.get('http://localhost:3000/user/getall')
    for(let i=0;i<response.data.length;i++){
    memberlist.innerHTML+=JSON.stringify(response.data[i].username+`:`+response.data[i].email)+`<br>`
}}
catch(err){
    console.log(err);
    msg.innerHTML="";
  msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
  setTimeout(()=>{
    msg.innerHTML="";
},3000)
}
}

btn.addEventListener('click',creategroup)

async function creategroup(e){
 try{
 e.preventDefault();
    if(groupName.value==='')
    {
        msg.innerHTML="Please Enter Group Name";
        setTimeout(()=>{
            msg.innerHTML="";
        },3000)
    }
    else{
        const groupdetails={
            groupname:groupName.value
        }
        const token=localStorage.getItem('token')
        const response= await axios.post('http://localhost:3000/group/create-group',groupdetails,{headers:{"Authorization":token}})
        showgroup(response.data.message);
        groupName.value='';

    }}
catch(err){
    console.log(err);
    msg.innerHTML="";
    msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
    setTimeout(()=>{
    msg.innerHTML="";
    },3000)
}
}

async function showgroup(response){
    try{
          const username=JSON.parse(localStorage.getItem(`adminname${response.id}`));
          console.log(username);
            
            groupList.innerHTML+=`<li id='${response.id}'><button class='btn btn-outline-success w-25 m-1' onclick="showchat('${response.groupname}','${response.id}')">${response.groupname}</button></li>`+`<hr>`;
    }catch(err){
        throw new Error(err);
    }
}
window.addEventListener('DOMContentLoaded',getgroups);

async function getgroups(){
    try{
        const token=localStorage.getItem('token')
        
        if(token==undefined||token.length===0)
            {
                alert('Login to continue!')
                window.location.href="../Login/loginPage.html"
            }
            else{
             const response= await axios.get(`http://localhost:3000/group/get-allgroups`)
              
             for(let i=0;i<response.data.message.length;i++)
             {
                showgroup(response.data.message[i]);
             }
              
       }}
       catch(err){
           console.log(err);
           msg.innerHTML="";
         msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
         setTimeout(()=>{
           msg.innerHTML="";
       },3000)
       }
    }

    async function showchat(groupname,id){
        try{
            localStorage.setItem('groupName',JSON.stringify(groupname));
            localStorage.setItem('groupId',JSON.stringify(id));
            const groupId = localStorage.getItem('groupId')
            localStorage.setItem('link',`http://localhost:3000/signup.html?groupId=${groupId}`)
            
            window.location.href=`../chat/chat.html?groupId=${groupId}`;
        }catch(err){
                console.log(err)
        }
    }
