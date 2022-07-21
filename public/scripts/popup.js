document.querySelector("#open-popup").addEventListener("click",function(){
  document.querySelector(".popup").classList.add("active");
});

document.querySelector(".popup .popup-container .popup-close").addEventListener("click",function(){
  document.querySelector(".popup").classList.remove("active");
});