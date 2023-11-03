console.log('adsaf')
if (window.innerWidth <= 800){
    console.log("hi")
    var topbar = document.querySelector("#topbar").innerHTML = 
    `
    <span class="open-navbar-icon navbar-icon center" >
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    </span>
    <img id="logo" src="Logo.svg" alt="Logo" onclick="window.location='/'">
  <input type="search" class="search-bar" placeholder="Search..."
         onkeydown="if (event.keyCode == 13) handleSearchTrigger()">
  <button class="button ask-question-button">Ask Question</button>
  <div class="possibleSearchResultContainer"></div>

  `
    document.querySelector(".open-navbar-icon").
    addEventListener("click", () => {
    container.classList.add("change");
    });
}