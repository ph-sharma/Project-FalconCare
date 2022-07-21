// var email = document.getElementById("email");
// var pass = document.getElementById("pass");
// var login =  document.getElementById("login");

// login.addEventListener("click",function()
// {
//     if(email.value && pass.value)
//     {
//         var request=new XMLHttpRequest();
//         request.open("post","/login");
//         request.setRequestHeader("Content-type","application/json")
//         request.send(JSON.stringify({ email: email.value, password: password.value}));

//         request.addEventListener("load",function()
//         {
//             if(request.status===200)
//             {
//                 window.location.href="/userhome";
//             }
//             else{
//                 console.log("login Error", request.responseText)
//             }
//         })
//     }
//     else{
//         console.log("Error due to uninitialsied variables")
//     }
// })