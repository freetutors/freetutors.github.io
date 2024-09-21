function checkCookieExists(cookieName) { //checking cookie
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${cookieName}=`));
  }
if (checkCookieExists("theme") !== true){
    setCookie("theme", "light", 1000000000)
}
  // Function to set a cookie with a given name and value
function setCookie(cookieName, cookieValue, expirationDays) { //creating cookie
const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + expirationDays);

const cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
document.cookie = cookie;
}
function getCookie(name) {
var cookieArr = document.cookie.split(";");
for(var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if(name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
    }
}
return null;
}

const theme = getCookie("theme")
var lightBlue = '#bfe9ffff'
console.log(theme)
if (theme=="light"){
    console.log(theme)
    document.documentElement.style.setProperty('--primary-color', '#CEEBFF');
    document.documentElement.style.setProperty('--background-color', '#ffffffff');
    document.documentElement.style.setProperty('--header-color', '#8dd8ffff');
    document.documentElement.style.setProperty('--text-box-bar-color', '#edf8ff');
    document.documentElement.style.setProperty('--secondary-color', '#CEEBFF');
    document.documentElement.style.setProperty('--tertiary-color', '#A4D2F2');
    document.documentElement.style.setProperty('--quatenary-color', '#7DB1D5');
    document.documentElement.style.setProperty('--quinary-color', '#5A95BE');
    document.documentElement.style.setProperty('--senary-color', '#3C88BC');
    document.documentElement.style.setProperty('--border-color', '#d4faec');
    document.documentElement.style.setProperty('--text-color', '#3E3F4C');
    document.documentElement.style.setProperty('--ask-question-button', '#f4ffeb');
    document.documentElement.style.setProperty('--search-bar', '#bfe9ffff');
    document.documentElement.style.setProperty('--subject-hover-color', 'rgb(154, 192, 255)')
    document.documentElement.style.setProperty('--menu-hover-color', 'rgb(141, 216, 255, 0.475)');
    document.documentElement.style.setProperty('--profile-box-color', '#f4ffeb');
    document.documentElement.style.setProperty('--top-questions-box', '#ffdaa2ff');
    document.documentElement.style.setProperty('--qotw-hover-color', 'rgb(141, 216, 255, 0.275)');
    document.documentElement.style.setProperty('--top-questions-hover', 'rgb(141, 216, 255, 0.275)');
    document.documentElement.style.setProperty('--about-me-color', 'rgba(175, 175, 175, 0.349)');
    document.documentElement.style.setProperty('--tool-bar', '#f4ffeb');
    document.documentElement.style.setProperty('--sign-up-button', '#f4ffeb');
    document.documentElement.style.setProperty('--tutor-sign-up', '#8dd8ffff');
    document.documentElement.style.setProperty('--underline-color', '#f7f7f7');
    document.documentElement.style.setProperty('--divider-color', '#966afcff');
    ;
}
else{
    localStorage.setItem('theme', "dark")
    // changeColor = () => document.querySelectorAll('*').forEach((node) => node.style.color='white');
}

var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page);

window.onload = function() {
    if (page == "profile") {
        var profileBanner = document.getElementById('profileBanner');
        if (theme == "light") {
            profileBanner.src = "haikei-gradient-light.png";
        } else {
            profileBanner.src = "haikei-gradient.png";
        }
    }
};

