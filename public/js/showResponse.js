function screenSizeResponse(){
    const target1 = document.getElementById('show-listing-div');
    const target2 = document.getElementById('show-title-div');
    if(window.innerWidth<900){
      target1.classList.remove("col-8");
      target1.classList.remove("offset-2");
      target1.classList.add("col-12");

      target2.classList.remove("col-8");
      target2.classList.remove("offset-2");
      target2.classList.add("col-12");
    }
    else{
      target1.classList.remove("col-12");
      target1.classList.add("col-8");
      target1.classList.add("offset-2");

      target2.classList.add("col-8");
      target2.classList.add("offset-2");
      target2.classList.remove("col-12");
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    screenSizeResponse();
  })
  window.addEventListener('resize', function() {
    screenSizeResponse();
  });