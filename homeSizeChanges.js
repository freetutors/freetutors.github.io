console.log('adsaf')
if (window.innerWidth <= 800){
    console.log("hi")
    var topbar = document.querySelector("#topbar").innerHTML = 
    `
    <div class="navbar-area">
      <span class="open-navbar-icon navbar-icon center" >
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </span>
      <div class="navbar-wrapper">
				<nav class="navbar">
					<div class="close-navbar-icon navbar-icon center">
						<div class="line line-1"></div>
						<div class="line line-2"></div>
					</div>
					<div class="nav-list">
						<a href="index.html#header" class="nav-link option-1 center">Home</a>
						<a href="painting.html" class="nav-link option-2 center">Paintings</a>
						<a href="cart.html" class="nav-link option-4 center">Cart</a>
						<a href="index.html#contact" class="nav-link option-5 center">Contact</a>
					</div>
				</nav>
			</div>
    </div>
    <img id="logo" src="Logo.svg" alt="Logo" onclick="window.location='/'">
  <input type="search" class="search-bar" placeholder="Search..."
         onkeydown="if (event.keyCode == 13) handleSearchTrigger()">
  <button class="button ask-question-button">Ask Question</button>
  <div class="possibleSearchResultContainer"></div>

  `
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