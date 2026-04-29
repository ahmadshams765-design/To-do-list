// ================== STATE ==================
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let activeProjectId = localStorage.getItem("activeProjectId");

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", initSidebar);

function initSidebar() {
    waitForSidebar();
    bindActiveNav();
    renderProjects();
}

// ================== SAFE INIT (handles dynamic loading) ==================
function waitForSidebar() {
    const interval = setInterval(() => {
        const btn = document.querySelector(".side-bottom");
        const modal = document.getElementById("project-modal");

        if (btn && modal) {
            clearInterval(interval);
            bindModal();
        }
    }, 100);
}

// ================== MODAL ==================
function bindModal() {
    const btn = document.querySelector(".side-bottom");
    const modal = document.getElementById("project-modal");
    const closeBtn = document.getElementById("close-project-modal");
    const createBtn = document.getElementById("confirm-add-project");

    const titleInput = document.getElementById("proj-title");
    const descInput = document.getElementById("proj-desc");

    let selectedUsers = [];

    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";

    // OPEN MODAL
    btn.addEventListener("click", () => {
        modal.classList.add("is-visible");
    });

    // CLOSE MODAL
    function closeModal() {
        modal.classList.remove("is-visible");
        titleInput.value = "";
        descInput.value = "";
        selectedUsers = [];
    }

    closeBtn?.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // CREATE PROJECT
    createBtn?.addEventListener("click", () => {
        const name = titleInput.value.trim();

        if (!name) {
            alert("Project title required");
            return;
        }

        const project = {
            id: Date.now(),
            name,
            description: descInput.value,
            tasks: [],
            collaborators: selectedUsers
        };

        projects.push(project);
        saveProjects();

        setActiveProject(project.id);

        closeModal();
        renderProjects();
    });
}

// ================== STORAGE ==================
function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

// ================== ACTIVE PROJECT ==================
function setActiveProject(id) {
    activeProjectId = id;
    localStorage.setItem("activeProjectId", id);
}

// ================== RENDER PROJECTS ==================
function renderProjects() {
    const container = document.querySelector(".options");
    if (!container) return;

    // remove old projects only
    document.querySelectorAll(".project-item").forEach(el => el.remove());

    projects.forEach(project => {
        const a = document.createElement("a");
        a.href = "#";
        a.className = "nav-item project-item";

        if (project.id == activeProjectId) {
            a.classList.add("active");
        }

        a.innerHTML = `
            <i class="fa-regular fa-folder"></i>
            <span>${project.name}</span>
        `;

        a.addEventListener("click", (e) => {
            e.preventDefault();
            setActiveProject(project.id);
            renderProjects();

            console.log("Active project:", project);
        });

        container.appendChild(a);
    });
}

// ================== NAV ACTIVE STATE ==================
function bindActiveNav() {
    const links = document.querySelectorAll(".side-bar .nav-item");

    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
}