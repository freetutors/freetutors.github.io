function checkCookieExists(cookieName) { //checking cookie
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${cookieName}=`));
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
var darkBlue = 'rgb(132, 175, 255)'
console.log(theme)
if (theme=="light"){
    console.log(theme)
    document.documentElement.style.setProperty('--primary-color', '#ffdaa2ff');
    document.documentElement.style.setProperty('--background-color', '#fffaedff');
    document.documentElement.style.setProperty('--header-color', '#8dd8ffff');
    document.documentElement.style.setProperty('--text-box-bar-color', darkBlue);
    document.documentElement.style.setProperty('--secondary-color', '#8dd8ffff');
    document.documentElement.style.setProperty('--tertiary-color', '#84CAEF');
    document.documentElement.style.setProperty('--quatenary-color', '#4F92CA');
    document.documentElement.style.setProperty('--quinary-color', '#3875BE');
    document.documentElement.style.setProperty('--senary-color', '#295DB7');
    document.documentElement.style.setProperty('--border-color', 'rgba(0,0,0,1)');
    document.documentElement.style.setProperty('--text-color', '#3E3F4C');
    document.documentElement.style.setProperty('--ask-question-button', darkBlue);
    document.documentElement.style.setProperty('--search-bar', '#ffdaa2ff');
    document.documentElement.style.setProperty('--subject-hover-color', 'rgb(154, 192, 255)')
    document.documentElement.style.setProperty('--menu-hover-color', 'rgb(141, 216, 255, 0.475)');
    document.documentElement.style.setProperty('--profile-box-color', 'rgb(157, 191, 255)');
    document.documentElement.style.setProperty('--top-questions-box', '#ffdaa2ff');
    document.documentElement.style.setProperty('--qotw-hover-color', 'rgb(141, 216, 255, 0.275)');
    document.documentElement.style.setProperty('--top-questions-hover', 'rgb(141, 216, 255, 0.275)');
    document.documentElement.style.setProperty('--about-me-color', 'rgba(175, 175, 175, 0.349)');
    document.documentElement.style.setProperty('--tool-bar', '#ffbf5f');
    document.documentElement.style.setProperty('--sign-up-button', darkBlue);
    document.documentElement.style.setProperty('--tutor-sign-up', darkBlue);
    document.documentElement.style.setProperty('--underline-color', '#ffdaa2ff');
    ;
}
else{
    localStorage.setItem('theme', "dark")
}