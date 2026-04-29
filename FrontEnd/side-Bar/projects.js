
// ================== LOAD PROJECTS ==================
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let activeProjectId = localStorage.getItem("activeProjectId") || null;

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
    initProjects();
});

function initProjects() {
    bindModal();
    renderProjects();
}

// ================== MODAL BINDING ==================
function bindModal() {
    const modal = document.getElementById("project-modal");

    const openBtn = document.querySelector(".side-bottom");
    const closeBtn = document.getElementById("close-project-modal");
    const createBtn = document.getElementById("confirm-add-project");

    const titleInput = document.getElementById("proj-title");
    const descInput = document.getElementById("proj-desc");

    // OPEN MODAL
    openBtn?.addEventListener("click", () => {
        modal?.classList.add("is-visible");
    });

    // CLOSE MODAL
    closeBtn?.addEventListener("click", () => {
        modal?.classList.remove("is-visible");
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("is-visible");
        }
    });

    // CREATE PROJECT
    createBtn?.addEventListener("click", () => {
        const name = titleInput.value.trim();
        const desc = descInput.value.trim();

        if (!name) {
            alert("Project name is required!");
            return;
        }

        const newProject = {
            id: Date.now(),
            name,
            description: desc,
            tasks: [],
            collaborators: []
        };

        projects.push(newProject);
        saveProjects();

        setActiveProject(newProject.id);

        titleInput.value = "";
        descInput.value = "";

        modal.classList.remove("is-visible");

        renderProjects();
    });
}

// ================== SAVE ==================
function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

// ================== SET ACTIVE PROJECT ==================
function setActiveProject(id) {
    activeProjectId = id;
    localStorage.setItem("activeProjectId", id);
}

// ================== GET ACTIVE PROJECT ==================
function getActiveProject() {
    return projects.find(p => p.id == activeProjectId);
}

// ================== RENDER PROJECTS ==================
function renderProjects() {
    const container = document.querySelector(".options");
    if (!container) return;

    // remove old projects
    container.querySelectorAll(".project-item").forEach(el => el.remove());

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

// ================== ADD TASK TO PROJECT (helper for later) ==================
function addTaskToActiveProject(task) {
    const project = getActiveProject();
    if (!project) return;

    project.tasks.push(task);
    saveProjects();
}