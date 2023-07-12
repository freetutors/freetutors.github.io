const routes = {
  '/mainPage': 'index.html',
};

function handleRouteChange() {
  const path = window.location.pathname;

  if (routes.hasOwnProperty(path)) {
    const filename = routes[path];
    loadContent(filename);
  }
}

function loadContent(filename) {
  fetch(filename)
    .then(response => response.text())
    .then(html => {
      document.open();
      document.write(html);
      document.close();
    })
    .catch(error => console.error(error));
}

window.addEventListener('popstate', handleRouteChange);

handleRouteChange();
