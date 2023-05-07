const username=document.getElementById('username');
const email=document.getElementById('email');
const number=document.getElementById('number');
const password=document.getElementById('password');
const msg=document.getElementById('msg');
const form=document.getElementById('form');
const btn=document.getElementById('btn');


btn.addEventListener('click',signup)

async function signup(e){
 try{
 e.preventDefault();
    if(username.value===''|| email.value==='' ||number.value===''||password.value=='')
    {
        
        msg.innerHTML="Please Fill All Details";
        setTimeout(()=>{
            msg.innerHTML="";
        },3000)
    }
    else{
        const userdetails={
            username:username.value,
            email:email.value,
            number:number.value,
            password:password.value
        }
        console.log(userdetails)
        const response = await axios.post('http://54.234.48.123:3000/user/signup',userdetails)
        localStorage.setItem('name',username.value);
        form.reset();
        window.location.href='../Login/loginPage.html'
    }
}
catch(err){
    console.log(err);
    msg.innerHTML=""
  msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
  setTimeout(()=>{
    msg.innerHTML="";
},3000)
}

}