function screenSizeResponse(){
    const target1 = document.getElementById('show-listing-div');
    const target2 = document.getElementById('show-title-div');
    const toggle = document.getElementById("taxToggle");
    const filters = document.getElementById("filters")
    // const indexCard = document.getElementById("index-listing");
    // if(window.innerWidth<500){
    //   indexCard.style.width = "24rem";
    // }
    // else{

    // }
    if(window.innerWidth<900){
      target1.classList.remove("col-8");
      target1.classList.remove("offset-2");
      target1.classList.add("col-12");

      target2.classList.remove("col-8");
      target2.classList.remove("offset-2");
      target2.classList.add("col-12");

      toggle.style.display="none";
      filters.style.display="none";
    }
    else{
      target1.classList.remove("col-12");
      target1.classList.add("col-8");
      target1.classList.add("offset-2");

      target2.classList.add("col-8");
      target2.classList.add("offset-2");
      target2.classList.remove("col-12");

      filters.style.display="flex";
      toggle.style.display="flex";
    }
    
  }
  document.addEventListener('DOMContentLoaded',()=>{
    screenSizeResponse();
  })
  window.addEventListener('resize', function() {
    screenSizeResponse();
  });