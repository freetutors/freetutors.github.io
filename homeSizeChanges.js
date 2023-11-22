if (window.innerWidth <= 800){
  var questions = document.querySelector(".questions").innerHTML = 
    `   
        <div class= "top-question-header2">Top Questions</div>
        <div class = "top-questions-box">
        </div>
        <div class="question_header">
            <div id="arrow-left"></div>
            <ul class="subject-list"></ul>
            <div id="arrow-right"></div>
        </div>
        <div class="questions_list questions_list_profile"></div>
  `
var navbar = document.querySelector(".navbar-area")
  document.querySelector(".open-navbar-icon").
addEventListener("click", () => {
   navbar.classList.add("change");
});

document.querySelector(".close-navbar-icon").
addEventListener("click",() => {
   navbar.classList.remove("change");
});

document.querySelector('.nav-list').
addEventListener("click", () => {
    location.reload()
});

    document.querySelector(".open-navbar-icon").
    addEventListener("click", () => {
    navbar.classList.add("change");
    });
}