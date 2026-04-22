// side bar fetching
fetch("../side-Bar/sideBar.html")
    .then(response => response.text())
    .then(data => {
        const sideBar = document.getElementById("sidebar-container");
        sideBar.innerHTML = data;
    });