const theme = localStorage.getItem("theme")
var darkBlue = 'rgb(132, 175, 255)'
console.log(theme)
if (theme=="light"){
    console.log(theme)
    document.documentElement.style.setProperty('--primary-color', '#ffdaa2ff');
    document.documentElement.style.setProperty('--background-color', '#fffaedff');
    document.documentElement.style.setProperty('--header-color', '#8dd8ffff');
    document.documentElement.style.setProperty('--text-box-bar-color', darkBlue);
    document.documentElement.style.setProperty('--secondary-color', '#8dd8ffff');
    document.documentElement.style.setProperty('--border-color', 'rgba(0,0,0,1)');
    document.documentElement.style.setProperty('--text-color', '#31323b');
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

    ;
}
else{
    localStorage.setItem('theme', "dark")
}