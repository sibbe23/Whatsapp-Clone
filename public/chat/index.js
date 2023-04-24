const chattable=document.getElementById('chattable');

const message=document.getElementById('message');

const sendbtn=document.getElementById('sendbtn');

sendbtn.addEventListener('click',sendmessage);

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
               const token=localStorage.getItem('token')
               const response= await axios.post('http://localhost:3000/chat/add-message',messagedata,{headers:{"Authorization":token}})

               console.log(response.data,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
               
                    showmessage(response.data.message.username,response.data.message.message)
                    message.value='';
           }
       }
       catch(err){
           console.log(err);
           msg.innerHTML="";
         msg.innerHTML=msg.innerHTML+`<div>${err.data.message}</div>`;
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
                className-'otheruser'
            }
            chattable.className="tbody";
            chattable.style="color:white";
            chattable.innerHTML+=`<tr class=${className} ><td style="border:none;text-align: left;">${username} - ${message}</td></tr>`;
        }catch(err){
            console.log(err);
        }
    }


    window.addEventListener('DOMContentLoaded',getchats);

    async function getchats(){
        try{
                   let lastmsgId=JSON.parse(localStorage.getItem('lastmsgId'));
                   console.log(lastmsgId,"originallastmsgId")
                   const response= await axios.get(`http://localhost:3000/chat/get-message/${lastmsgId}`)
                   console.log(response,">>>>>>>>>>>>>")
                   lastmsgId+=parseInt(response.data.message.length);
                   console.log(lastmsgId,'updatedlastmsgId')

                  
                   let existingArray=JSON.parse(localStorage.getItem('messages'))||[];

                   if(existingArray.length>=10){
                    existingArray=[];
                   }

                   let responseArray=response.data.message;

                   let mergedArray=existingArray.concat(responseArray);

                   localStorage.setItem('lastmsgId',JSON.stringify(lastmsgId));

                   localStorage.setItem('messages',JSON.stringify(mergedArray));

                   chattable.innerHTML='';

                   for(let i=0;i<mergedArray.length;i++){
                        showmessage(mergedArray[i].username,mergedArray[i].message)
                   }
                   chattable.scrollTop=chattable.scrollHeight;
                  
           }
           catch(err){
               console.log(err);
               msg.innerHTML="";
             msg.innerHTML=msg.innerHTML+`<div>${err.data.message}</div>`;
             setTimeout(()=>{
               msg.innerHTML="";
           },3000)
           }
        }

      setInterval(()=>{
            getchats();
        },5000);  

   