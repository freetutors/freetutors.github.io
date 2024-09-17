function checkWindowSize() {
    const username = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser");
    if (window.innerWidth <= 800){
        var option_5 = 'Sign Up'
        var link_5 = '/signup'
        if (username != null) {
            option_5 = 'Profile'
            link_5 = `/profile?username=${username}`
        }
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
    } else {
        var topbar = document.querySelector("#topbar").innerHTML =
            `
    <div id="topbar">
  <img id="logo" src="Logo.svg" alt="Logo" onclick="window.location='/'">
  <div id="searchCont">
  <input type="search" class="search-bar" placeholder="Search..."
         onkeydown="if (event.keyCode == 13) handleSearchTrigger()">
  <button class="button ask-question-button" onclick="window.location='/createQuestion'">Ask Question</button>
  <div class="possibleSearchResultContainer"></div>
  </div>
  <div id="loginSignupArea"></div>
</div>
 `
        if (username == null) {
            if (theme == "light"){
                document.getElementById("loginSignupArea").innerHTML = //other wise it will show login and signup buttons
                    `<img class="color-change-icon" src="sunny.svg" width='30px' height='30px'></img>
      <button class="button login-button">Log in</button>
       <button class="button signup-button">Sign up</button>`;
            }else{
                document.getElementById("loginSignupArea").innerHTML = //other wise it will show login and signup buttons
                    `<img class="color-change-icon" src="moon.svg" width='25px' height='25px' style='margin-top: 2.3px;'></img>
      <button class="button login-button">Log in</button>
       <button class="button signup-button">Sign up</button>`;
            }
        } else {
            document.getElementsByClassName("ask-question-button")[0].style.right = "190px";
            const userData = localStorage.getItem('userData');
            const user = JSON.parse(userData); // Parse it back into an object
            const pfp = user.user[0].pfp
            const profileButton = document.createElement('div');
            const theme = getCookie("theme")
            let themeChange
            let themeChangeText
            if (!theme){
                setCookie('theme', 'dark',500)
            }
            else if (theme=="dark"){
                themeChange = "light"
                themeChangeText = "Light Mode"
            }
            else{
                themeChange = "dark"
                themeChangeText = "Dark Mode"
            }

            profileButton.classList.add('profileButton');//info for profile click button
            profileButton.innerHTML = `
    <div class="notif"></div>
    <img class="inboxButton" src="inbox.png">
    <div class="userInfoContainerHome">
      <img class="profilePicHome" src="data:image/png;base64,${pfp}">
      <p class="usernameOnProfileButton">${username}</p>
      <div class="dropdown-profile">
      <div class="dropdown-content-profile">
        <a href="#" class="option go-to-profile">Profile</a>
        <a href="#" class="option" id="theme-change">${themeChangeText}</a>
        <a href="#" id="sign-out" class="option">Log Out</a>
      </div>
      </div>
    </div>
  `;
            profileButton.querySelector('.go-to-profile').addEventListener("click", function(event){
                event.preventDefault(); // Prevent the default action if needed
                window.location = `/profile?username=${username}`
            })
            profileButton.querySelector("#theme-change").addEventListener("click", () =>{
                setCookie("theme", themeChange,500)
                location.reload()
            })
            profileButton.querySelector("#sign-out").addEventListener("click",() => { //signout
                if (confirm("Do you want sign out?") == true){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location ='/'
                }
            })
            var dropdown = profileButton.querySelector(".dropdown-profile");
            var dropdownContent = profileButton.querySelector(".dropdown-content-profile");
            var dropbtn = profileButton.querySelector(".userInfoContainerHome");

            dropbtn.addEventListener("click", function() {
                dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block"
            });

            dropdownContent.addEventListener("click", function(event) {
                if (event.target.classList.contains(".option")) {
                    dropbtn.textContent = event.target.textContent;
                    dropdownContent.style.display = "none"; // Always hide content after selecting an item
                }
            });

            const inbox = document.createElement('div'); //showing inbox
            inbox.classList.add('inbox');

            profileButton.appendChild(inbox);

            document.getElementById("loginSignupArea").innerHTML = '';
            document.getElementById("loginSignupArea").appendChild(profileButton);
        }
    }
}

window.addEventListener('resize', checkWindowSize);

let resizeTimeout;

// window.addEventListener('resize', () => {
//     console.log("ooga booga");
//     clearTimeout(resizeTimeout);

//     resizeTimeout = setTimeout(() => {
//         location.reload();
//     }, 50); // You can adjust the delay (500 ms) as needed
// });
checkWindowSize();

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

console.log(window.mobileAndTabletCheck())
if (!window.mobileAndTabletCheck()) {
    let resizeTimeout;

    window.addEventListener('resize', () => {
        console.log("ooga booga");
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            location.reload();
        }, 50); // You can adjust the delay (500 ms) as needed
    });
} else {
    screen.orientation.addEventListener("change", function(e) {
        window.location.reload()
    });
}



var path = window.location.pathname;
var pageName = path.split("/").pop();


const askQuestionButton = document.querySelector('.ask-question-button');
const searchBar = document.querySelector('.search-bar');
const signUpAsTutorButton = document.querySelector('#sign_up_as_tutor_button');
const profileButton = document.querySelector('.profileButton');
const banner = document.querySelector('.banner');
const infoInputGroupElements = document.getElementsByClassName('info_input_group');

const usernameBandPSC = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")
if (usernameBandPSC === null && theme === "light") {
    askQuestionButton.style.right = "237px";
}

const possibleSearchResultContainer = document.getElementsByClassName("possibleSearchResultContainer")[0]

if (usernameBandPSC !== null && window.innerWidth > 800) {
    console.log("hilalala")
    possibleSearchResultContainer.style.width = "calc(100% - 362.5px)";
}


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



