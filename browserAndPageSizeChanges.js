var browser = bowser.getParser(window.navigator.userAgent);
var browserName = browser.parsedResult.browser.name;

var path = window.location.pathname;
var pageName = path.split("/").pop();

const askQuestionButton = document.querySelector('.ask-question-button');
const searchBar = document.querySelector('.search-bar');
const signUpAsTutorButton = document.querySelector('#sign_up_as_tutor_button');
const profileButton = document.querySelector('.profileButton');
const banner = document.querySelector('.banner');
const infoInputGroupElements = document.getElementsByClassName('info_input_group');

function checkVSChrome() {

    if (window.innerWidth > document.body.clientWidth) {
        askQuestionButton.style.transform = `translateX(-15px)`;
    } else {
        askQuestionButton.style.transform = `translateX(0px)`;
    }

}

function checkVSSafari() {

    if ((window.innerWidth > document.body.clientWidth) && (window.innerWidth <= 740)) {
        askQuestionButton.style.transform = `translateX(-15px)`;
    } else if (window.innerWidth > document.body.clientWidth) {
        askQuestionButton.style.transform = `translateX(-19px)`;
    } else if ((window.innerWidth <= document.body.clientWidth) && (window.innerWidth <= 740)) {
        askQuestionButton.style.transform = `translateX(0px)`;
    } else if (window.innerWidth <= document.body.clientWidth) {
        askQuestionButton.style.transform = `translateX(-4px)`;
    }

}

function checkVSMicrosoftEdge() {

    if (window.innerWidth > document.body.clientWidth) {
        askQuestionButton.style.transform = `translateX(-15px)`;
    } else {
        askQuestionButton.style.transform = `translateX(0px)`;
    }

}

function checkVSFirefox() {

    if (window.innerWidth > document.body.clientWidth) {
        askQuestionButton.style.transform = `translateX(-15px)`;
    } else {
        askQuestionButton.style.transform = `translateX(0px)`;
    }
}

if (browserName == "Chrome") {

    window.addEventListener('load', checkVSChrome);
    window.addEventListener('resize', checkVSChrome);

}

if (browserName == "Safari") {

    console.log(pageName)

    if ((pageName == 'index.html') || (pageName == '')) {
        signUpAsTutorButton.style.fontSize = '13px';
    }

    searchBar.style.fontSize = '13px';
    profileButton.style.width = '180px';
    window.addEventListener('load', checkVSSafari);
    window.addEventListener('resize', checkVSSafari);
}

if (browserName == "Microsoft Edge") {

    window.addEventListener('load', checkVSMicrosoftEdge);
    window.addEventListener('resize', checkVSMicrosoftEdge);
}

if (browserName == "Firefox") {

    if (pageName == 'profile.html') {
        banner.style.left = '0';
        Array.from(infoInputGroupElements).forEach(element => {
          element.style.width = '137.5px';
        });
    }

    window.addEventListener('load', checkVSFirefox);
    window.addEventListener('resize', checkVSFirefox);

}

