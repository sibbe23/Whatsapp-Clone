const chattable=document.getElementById('chattable');

const message=document.getElementById('message');

const uploadbtn=document.getElementById('uploadbtn');

const file=document.getElementById('file');

const sendbtn=document.getElementById('sendbtn');

const memberlist=document.getElementById('memberslist');

const groupname=document.getElementById('groupname');

const deletegroupbtn=document.getElementById('deletegroupbtn');

const adminname=document.getElementById('adminname');

const adminbtn=document.getElementById('adminbtn')


const socket = io('http://localhost:8000');

sendbtn.addEventListener('click',sendmessage);

const logout = document.getElementById('logout')
logout.addEventListener('click',logouts)
async function logouts(){
    alert('Redirecting to Home page..')
     window.location.replace('../group/group.html')
}


async function sendmessage(e){
    try{
        e.preventDefault();
           if(message.value==='' )
           {
               msg.innerHTML="Please Enter message";
               setTimeout(()=>{
                   msg.innerHTML="";
               },3000)
           }
           else{
               const messagedata={
                  message:message.value
               }
               const token=localStorage.getItem('token');
               const groupId=JSON.parse(localStorage.getItem('groupId'));
            
               const response= await axios.post(`http://localhost:3000/chat/add-message/${groupId}`,messagedata,{headers:{"Authorization":token}})

               console.log(response.data,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

               socket.emit('send-message', groupId);
               
               
                    showmessage(response.data.message.username,response.data.message.message)
                    message.value='';
           }
       }
       catch(err){
           console.log(err);
           msg.innerHTML="";
         msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
         setTimeout(()=>{
           msg.innerHTML="";
       },3000)
       }
    }

    //decode token
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
    async function showmessage(username,message){
        try{
            const token=localStorage.getItem('token');
            const decodedtoken=parseJwt(token);
            let className;
            if(username===decodedtoken.name)
            {
              className='currentuser'
            }
            else{
                className='otheruser'
            }
            chattable.className="tbody";
            chattable.innerHTML+=`<tr class=${className}><td>${username}-${message}</td></tr>`;
        }catch(err){
            console.log(err);
        }
    }


    window.addEventListener('DOMContentLoaded',getchats);
    window.addEventListener('DOMContentLoaded',getgroupmembers);

    async function getchats(){
        try{
            const token=localStorage.getItem('token')
            const decodedtoken=parseJwt(token);
            const userId = decodedtoken.userId
          localStorage.setItem('userId',userId)
        if(token==undefined||token.length===0)
            {
                alert('Login to continue!')
                window.location.href="../Login/loginPage.html"
            }
            else{
                   groupname.innerHTML=JSON.parse(localStorage.getItem('groupName'));

                   let groupId=JSON.parse(localStorage.getItem('groupId'));
                   let lastmsgId=JSON.parse(localStorage.getItem(`lastmsgId${groupId}`));
                   

                   console.log(lastmsgId,">>>>>>>>>>>>")
                   const response= await axios.get(`http://localhost:3000/chat/get-message?lastmsgId=${lastmsgId}&groupId=${groupId}`);
                   console.log(response,">>>>>>>>>>>>>")
                   lastmsgId+=parseInt(response.data.message.length);
                   console.log(lastmsgId,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

                  
                   let existingArray=JSON.parse(localStorage.getItem(`messages${groupId}`))||[];

                   if(existingArray.length>=10){
                    existingArray=[];
                   }

                   let responseArray=response.data.message;

                   let mergedArray=existingArray.concat(responseArray);

                   localStorage.setItem(`lastmsgId${groupId}`,JSON.stringify(lastmsgId));

                   localStorage.setItem(`messages${groupId}`,JSON.stringify(mergedArray));

                   chattable.innerHTML='';

                   for(let i=0;i<mergedArray.length;i++){
                        showmessage(mergedArray[i].username,mergedArray[i].message)
                   }
                   chattable.scrollTop=chattable.scrollHeight;
                }   
           }
           catch(err){
               console.log(err);
               msg.innerHTML="";
             msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
             setTimeout(()=>{
               msg.innerHTML="";
           },3000)
           }
        }

        socket.on('receive-message', async (group) => {
            const groupId=JSON.parse(localStorage.getItem('groupId'));
            console.log(">>>>>",group,groupId);
            console.log(group===groupId);
            if(group === groupId){
                getchats();
                getgroupmembers();
            }
          })

        /*  setInterval(()=>{
            getchats();
            getgroupmembers();
        },1000);   */

        async function getgroupmembers(){
            try{

                const groupId=JSON.parse(localStorage.getItem('groupId'));
                const response= await axios.get(`http://localhost:3000/group/get-members?groupId=${groupId}`);
                console.log(response);
                    
                   
                adminname.innerHTML=`Admin :<li>${response.data.username.username}</li>`;
                memberlist.innerHTML='';
                for(let i=0;i<response.data.message.length;i++){
                    memberlist.innerHTML+=`<li>${response.data.message[i].username}</li>`;
                    memberlist.appendChild(adminbtn)
                }
               
            }catch(err){
                console.log(err);
                msg.innerHTML="";
              msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
              setTimeout(()=>{
                msg.innerHTML="";
            },3000)
            }
        }

        deletegroupbtn.addEventListener('click',deleteGroup)
   
       async function deleteGroup(){
        try{
            const groupId=JSON.parse(localStorage.getItem('groupId'));
            const token=localStorage.getItem('token');
            const response= await axios.delete(`http://localhost:3000/group/delete-group?groupId=${groupId}`,{headers:{"Authorization":token}});
            alert(response.data.message);
            localStorage.removeItem(`messages${groupId}`);
            localStorage.removeItem(`lastmsgId${groupId}`);
            localStorage.removeItem('groupName');
            localStorage.removeItem('groupId');
            window.location.href='../Group/group.html';

            
        }catch(err){
            console.log(err);
            msg.innerHTML="";
          msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
          setTimeout(()=>{
            msg.innerHTML="";
        },3000)
        }
       }

       uploadbtn.addEventListener('click',uploadFile);

       async function uploadFile(e){
        try{
            e.preventDefault();
            const uploadedfile=file.files[0];
            console.log(uploadedfile);
            if(!uploadedfile){
               msg.innerHTML="Please Upload a file ";
               setTimeout(()=>{
                   msg.innerHTML="";
               },3000)
           }
           else{
            const formData=new FormData();
            formData.append('file',uploadedfile);
            console.log(formData);
            const groupId=JSON.parse(localStorage.getItem('groupId'));
            const token=localStorage.getItem('token');
            const response=await axios.post(`http://localhost:3000/chat/sendfile/${groupId}`,formData,{headers:{"Authorization":token,'Content-Type':'multipart/form-data'}});
                console.log(response);
                showmessage(response.data.message.username,response.data.message.message)
                uploadedfile.value=null;
           }
        }catch(err){
            console.log(err);
            msg.innerHTML="";
          msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
          setTimeout(()=>{
            msg.innerHTML="";
        },3000)
        }
       }


const invite = document.getElementById('invite')

invite.addEventListener('click',copyUrl)

async function copyUrl() {
    var url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("URL copied! ");
  }
       async function makeadmin(){
        try{
                const userId = '2'
             const groupId=JSON.parse(localStorage.getItem('groupId'));
             const response = await axios.post(`http://localhost:3000/group/makeadmin?groupId=${groupId}&userId=${userId}`)
            adminbtn.style.display = "none";
            
        }catch(err){
            console.log(err);
            msg.innerHTML="";
          msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
          setTimeout(()=>{
            msg.innerHTML="";
        },3000)
        }
       }