const theme = localStorage.getItem("theme")

console.log(theme)
if (theme=="light"){
    console.log(theme)
    document.documentElement.style.setProperty('--primary-color', '#ffdaa2ff');
    document.documentElement.style.setProperty('--background-color', '#fffaedff');
    document.documentElement.style.setProperty('--header-color', '#8dd8ffff');
    document.documentElement.style.setProperty('--text-box-bar-color', '#6d9ffdff');
    document.documentElement.style.setProperty('--secondary-color', '#8dd8ffff');
    document.documentElement.style.setProperty('--border-color', 'rgba(0,0,0,1)');
    document.documentElement.style.setProperty('--text-color', '#31323b');
    document.documentElement.style.setProperty('--ask-question-button', '#6d9ffdff');
    document.documentElement.style.setProperty('--search-bar', '#ffdaa2ff');
    document.documentElement.style.setProperty('--subject-hover-color', 'rgb(154, 192, 255)')
    document.documentElement.style.setProperty('--menu-hover-color', 'rgb(141, 216, 255, 0.475)');
    document.documentElement.style.setProperty('--profile-box-color', 'rgb(137, 178, 255)');
    ;
    // --primary-color:#113265ff;
    // --background-color:#08162bff;
    // --header-color:#242424ff;
    // --text-box-bar-color: #424242ff;
    // --secondary-color:#a32f80ff;
    // --border-color: #474b4eff;
    // --text-color:white;
    // --ask-question-button: #2c74b3ff;
}