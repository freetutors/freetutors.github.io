console.log("sadasdasd")


function checkWindowSize() {
    if (window.innerWidth <= 800){
        const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");
        var option_5 = 'Sign Up'
        var link_5 = '/signup'
        if (username != null) {
            option_5 = 'Profile'
            link_5 = `/profile?username=${username}`
        }
        console.log(option_5)
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
						<a href="/index" class="nav-link option-1 center">Home</a>
						<a href="/ourTeam" class="nav-link option-2 center">Our Team</a>
						<a href="/contactUs" class="nav-link option-3 center">Contact Us</a>
						<a href="/help" class="nav-link option-4 center">Help</a>
                        <a href="${link_5}" class="nav-link option-5 center">${option_5}</a>
					</div>
				</nav>
			</div>
            <img class="color-change-icon" src="moon.svg" width='25px' height='25px' style='margin-top: 2.3px;'></img>
    </div>
    <img id="logo" src="LogoWithoutName.png" alt="Logo" onclick="window.location='/'"   >
  <input type="search" class="search-bar" placeholder="Search..."
         onkeydown="if (event.keyCode == 13) handleSearchTrigger()">
  <div class="possibleSearchResultContainer"></div>
    <img id="MobileAskQuestion" src="MobileAskQuestion.png"  onclick="window.location='/createQuestion'"   >


 `
        var navbar = document.querySelector(".navbar-area")
        document.querySelector(".open-navbar-icon").
        addEventListener("click", () => {
            navbar.classList.add("change");
            document.querySelector('.color-change-icon').classList.add('change')
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
        // <button class="button ask-question-button">Ask Question</button> idk where to put this
    }
}

// Add event listener for window resize
window.addEventListener('resize', checkWindowSize);

// Run the function once to check the size on page load
checkWindowSize();





var path = window.location.pathname;
var pageName = path.split("/").pop();

const usernameBandPSC = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")


const askQuestionButton = document.querySelector('.ask-question-button');
const searchBar = document.querySelector('.search-bar');
const signUpAsTutorButton = document.querySelector('#sign_up_as_tutor_button');
const profileButton = document.querySelector('.profileButton');
const banner = document.querySelector('.banner');
const infoInputGroupElements = document.getElementsByClassName('info_input_group');
// if (usernameBandPSC == null) {
//   searchBar.style.marginRight = '2px';
// } else{
//     searchBar.style.marginRight = '200px';
//     askQuestionButton.style.marginLeft = 'calc(100vw - 342px)';
// }

// const info = bowser.parse(window.navigator.userAgent)
// var browserName = info["browser"]["name"];

// if (browserName == "Safari") {

//     if (pageName == '') {
//         signUpAsTutorButton.style.fontSize = '13px';
//     }

//     searchBar.style.fontSize = '13px';
//     profileButton.style.width = '180px';
// }

// if (browserName == "Firefox") {

//     if (pageName == 'profile') {
//         banner.style.left = '0';
//         Array.from(infoInputGroupElements).forEach(element => {
//           element.style.width = '137.5px';
//         });
//     }
// }

// askQuestionButton.addEventListener('mouseover', () => {
//   askQuestionButton.style.transform = 'scale(1.06)';
// });

// askQuestionButton.addEventListener('mouseout', () => {
//   askQuestionButton.style.transform = 'scale(1)';
// });


// async function updateRightmostPosition() {
//     var elementWidth = searchBar.offsetWidth;
//     var elementLeftPosition = searchBar.offsetLeft;
//     var rightmostPosition = elementLeftPosition + elementWidth;
//     askQuestionButton.style.marginLeft = rightmostPosition - 128.5 + 'px';
// }

// for (let i = 0; i < 20; i++) {
//     setTimeout(function() {
//         updateRightmostPosition()
//     }, 100 * i);
// }
// window.addEventListener('resize', updateRightmostPosition);

// Function to check if an element overflows its container
// function isOverflowing(element) {
//     return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
// }

// // Function to find and log overflowing elements
// function logOverflowingElements() {
//     // Get all elements on the page
//     const allElements = document.querySelectorAll('*');

//     // Iterate through all elements
//     allElements.forEach(element => {
//         if (isOverflowing(element)) {
//             console.log('Overflowing Element:', element);
//         }
//     });
// }

// // Call the function to log overflowing elements when needed
// // For example, you can call it on page load or user interaction
// logOverflowingElements();
