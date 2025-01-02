document.addEventListener('DOMContentLoaded', function() { 
document.getElementById('loginForm').addEventListener('submit',function(event){
    event.preventDefault();

    const email=document.querySelector('input[name="email"]').value;
    const password=document.querySelector('input[name=password]').value;

    if(!password){
        alert('input password')
        return;
    }
    if(!email){
        alert('input email')
        return;
    }
    fetch('/auth/userlogin',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
    })
    .then(response =>response.json())
    .then(data =>{
        if(data.success){
            window.location.href='/index.html'
        }else{
            alert(data.message)
        }
    })
    .catch(error=>{
        console.error('Error',error)
        alert('Error occured during login')
    })

});
})