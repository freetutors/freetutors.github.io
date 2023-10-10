var browser = bowser.getParser(window.navigator.userAgent);
var browserName = browser.parsedResult.browser.name;

var path = window.location.pathname;
var pageName = path.split("/").pop();

const usernameBandPSC = localStorage.getItem("CognitoIdentityServiceProvider.lact4vt8ge7lfjvjetu1d3sl7.LastAuthUser")


const askQuestionButton = document.querySelector('.ask-question-button');
const searchBar = document.querySelector('.search-bar');
const signUpAsTutorButton = document.querySelector('#sign_up_as_tutor_button');
const profileButton = document.querySelector('.profileButton');
const banner = document.querySelector('.banner');
const infoInputGroupElements = document.getElementsByClassName('info_input_group');

if (usernameBandPSC == null) {
  searchBar.style.marginRight = '30px';
}


if (browserName == "Safari") {

    if (pageName == '') {
        signUpAsTutorButton.style.fontSize = '13px';
    }

    searchBar.style.fontSize = '13px';
    profileButton.style.width = '180px';
}

if (browserName == "Firefox") {

    if (pageName == 'profile') {
        banner.style.left = '0';
        Array.from(infoInputGroupElements).forEach(element => {
          element.style.width = '137.5px';
        });
    }
}

askQuestionButton.addEventListener('mouseover', () => {
  askQuestionButton.style.transform = 'scale(1.06)';
});

askQuestionButton.addEventListener('mouseout', () => {
  askQuestionButton.style.transform = 'scale(1)';
});


async function updateRightmostPosition() {
    var elementWidth = searchBar.offsetWidth;
    var elementLeftPosition = searchBar.offsetLeft;
    var rightmostPosition = elementLeftPosition + elementWidth;
    askQuestionButton.style.marginLeft = rightmostPosition - 128.5 + 'px';
}

for (let i = 0; i < 20; i++) {
    setTimeout(function() {
        updateRightmostPosition();
    }, 100 * i);
}
window.addEventListener('resize', updateRightmostPosition);

// Function to check if an element overflows its container
function isOverflowing(element) {
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
}

// Function to find and log overflowing elements
function logOverflowingElements() {
    // Get all elements on the page
    const allElements = document.querySelectorAll('*');

    // Iterate through all elements
    allElements.forEach(element => {
        if (isOverflowing(element)) {
            console.log('Overflowing Element:', element);
        }
    });
}

// Call the function to log overflowing elements when needed
// For example, you can call it on page load or user interaction
logOverflowingElements();
