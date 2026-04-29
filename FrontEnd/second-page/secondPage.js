
// ================== 1. SIDEBAR ==================
fetch("../side-Bar/sideBar.html")
    .then(res => res.text())
    .then(data => {
        const sideBar = document.getElementById("sidebar-container");
        if (sideBar) {
            sideBar.innerHTML = data;

            const btn = sideBar.querySelector('.side-bottom');
            if (btn) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    document.getElementById('project-modal')?.classList.add('is-visible');
                };
            }
        }
    });

// ================== 2. SELECTORS ==================
const taskDetails = document.querySelector('.task-details');
const closeBtn = document.querySelector('.actions-icons');
const markDoneBtn = document.querySelector('.mark-done-btn');

const attachmentsGrid = document.querySelector('.attachments-grid');
const tagInput = document.getElementById('tag-text-input');
const tagContainer = document.getElementById('tag-chips-container');

const commentInput = document.querySelector('.comment-input-wrapper input');
const sendBtn = document.querySelector('.send-comment');
const commentsSection = document.querySelector('.comments-section');

const subtaskList = document.querySelector('.subtask-list');
const addSubtaskBtn = document.querySelector('.add-subtask-btn-link');
const inputWrapper = document.getElementById('subtask-input-wrapper');
const inputField = document.getElementById('subtask-input-field');

const fileInput = document.getElementById('file-input');
const addFileBtn = document.getElementById('add-file-btn');

// QUICK ADD
const quickAddBtn = document.getElementById('open-quick-add');
const quickAddModal = document.getElementById('quick-add-modal');
const closeModalBtn = document.getElementById('close-modal');
const confirmAddTaskBtn = document.getElementById('confirm-add-task');
const modalTitleInput = document.getElementById('modal-task-title');
const modalDateInput = document.getElementById('modal-task-date');

let currentTaskCard = null;
let currentTaskData = null;

// ================== 3. ENSURE PROGRESS BAR ==================
function ensureProgressBar(card) {
    if (!card.querySelector('.progress-bar')) {
        const container = document.createElement('div');
        container.className = 'task-progress-container';

        container.innerHTML = `
            <div class="progress-bar">
                <div class="fill" style="width:0%"></div>
            </div>
        `;

        card.appendChild(container);
    }
}

// ================== 4. OPEN TASK ==================
function openTaskDetails(task) {
    currentTaskData = task;

    const title = document.querySelector('.task-title h1');
    const date = document.getElementById('detail-date');

    if (title) title.textContent = task.title;
    if (date) date.textContent = task.dueDate;

    const isDone = currentTaskCard.classList.contains('card-completed');

    markDoneBtn.querySelector('.done').textContent =
        isDone ? "Completed" : "Mark as Done";

    renderTags();
    renderAttachments();
    renderComments();
    renderSubtasks();
    updateTaskProgress();

    taskDetails.classList.add('is-active');
}

// ================== 5. TASK CLICK ==================
function attachTaskClickListeners() {
    document.querySelectorAll('.task-card').forEach(card => {
        card.onclick = (e) => {
            if (e.target.classList.contains('drag-handle')) return;

            currentTaskCard = card;
            ensureProgressBar(card); // 🔥

            if (!card.taskData) {
                card.taskData = {
                    title: card.querySelector('h4')?.textContent || "Untitled",
                    dueDate: card.querySelector('.due-date')?.textContent || "No deadline",
                    tags: ["DEV"],
                    attachments: [],
                    comments: [],
                    subtasks: []
                };
            }

            openTaskDetails(card.taskData);
        };
    });
}

// ================== 6. TAG ==================
tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = tagInput.value.trim();
        if (!val || !currentTaskData) return;

        currentTaskData.tags = [val];
        tagInput.value = "";
        renderTags();
    }
});

function renderTags() {
    tagContainer.innerHTML = "";
    if (!currentTaskData || !currentTaskCard) return;

    currentTaskData.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = "tag-chip";
        span.textContent = tag;
        tagContainer.appendChild(span);

        const cardTag = currentTaskCard.querySelector('.card-top .tag');
        if (cardTag) {
            cardTag.textContent = tag;
            cardTag.className = "tag " + tag.toLowerCase();
        }
    });
}

// ================== 7. ATTACHMENTS ==================
addFileBtn?.addEventListener('click', () => fileInput.click());

fileInput?.addEventListener('change', () => {
    const files = Array.from(fileInput.files);
    if (!currentTaskData) return;

    const currentCount = currentTaskData.attachments.length;

    if (currentCount >= 2) {
        alert("Max 2 attachments only");
        fileInput.value = "";
        return;
    }

    const remaining = 2 - currentCount;

    files.slice(0, remaining).forEach(file => {
        const reader = new FileReader();

        reader.onload = (e) => {
            currentTaskData.attachments.push({
                name: file.name,
                size: (file.size / 1024).toFixed(1) + " KB",
                data: e.target.result
            });
            renderAttachments();
        };

        reader.readAsDataURL(file);
    });

    fileInput.value = "";
});

function renderAttachments() {
    attachmentsGrid.innerHTML = "";
    if (!currentTaskData) return;

    currentTaskData.attachments.forEach(file => {
        const div = document.createElement('div');
        div.className = 'attachment-card';

        const isImage = file.data?.startsWith("data:image");

        div.innerHTML = `
            <div class="file-icon">
                ${isImage
                ? `<img src="${file.data}" style="width:100%;border-radius:6px;">`
                : `<i class="fa-regular fa-file-lines"></i>`}
            </div>
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-meta">${file.size}</span>
            </div>
        `;

        attachmentsGrid.appendChild(div);
    });
}

// ================== 8. COMMENTS ==================
sendBtn?.addEventListener('click', () => {
    const text = commentInput.value.trim();
    if (!text || !currentTaskData) return;

    currentTaskData.comments.push({ user: "You", text });
    commentInput.value = "";
    renderComments();
});

function renderComments() {
    const old = commentsSection.querySelectorAll('.comment-item');
    old.forEach(e => e.remove());

    if (!currentTaskData) return;

    currentTaskData.comments.forEach(c => {
        const div = document.createElement('div');
        div.className = "comment-item";

        div.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${c.user}" class="avatar">
            <div class="comment-content">
                <strong>${c.user}</strong>
                <p>${c.text}</p>
            </div>
        `;

        commentsSection.insertBefore(div, commentsSection.querySelector('.comment-input-wrapper'));
    });
}

// ================== 9. SUBTASKS ==================
addSubtaskBtn?.addEventListener('click', () => {
    inputWrapper.style.display = "block";
    inputField.focus();
});

inputField?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = inputField.value.trim();
        if (!text || !currentTaskData) return;

        currentTaskData.subtasks.push({ text, done: false });

        inputField.value = "";
        inputWrapper.style.display = "none";
        renderSubtasks();
        updateTaskProgress();
    }
});

function renderSubtasks() {
    const old = subtaskList.querySelectorAll('.subtask-item');
    old.forEach(e => e.remove());

    if (!currentTaskData) return;

    currentTaskData.subtasks.forEach((sub, i) => {
        const div = document.createElement('div');
        div.className = 'subtask-item';

        div.innerHTML = `
            <input type="checkbox" ${sub.done ? "checked" : ""}>
            <label>${sub.text}</label>
        `;

        div.querySelector('input').onchange = (e) => {
            currentTaskData.subtasks[i].done = e.target.checked;
            updateTaskProgress();
        };

        subtaskList.insertBefore(div, inputWrapper);
    });
}

// ================== 10. PROGRESS ==================
function updateTaskProgress() {
    if (!currentTaskCard || !currentTaskData) return;

    const total = currentTaskData.subtasks.length;
    const done = currentTaskData.subtasks.filter(s => s.done).length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    const fill = currentTaskCard.querySelector('.progress-bar .fill');
    if (fill) fill.style.width = percent + "%";

    const columns = document.querySelectorAll('.column');
    const inProgress = columns[1];

    if (done > 0 && !currentTaskCard.classList.contains('card-completed')) {
        inProgress?.appendChild(currentTaskCard);
    }

    updateColumnCounts();
}

// ================== 11. MARK DONE ==================
markDoneBtn?.addEventListener('click', () => {
    if (!currentTaskCard) return;

    const columns = document.querySelectorAll('.column');
    const doneColumn = columns[2];

    const isCompleting = !currentTaskCard.classList.contains('card-completed');

    if (isCompleting) {
        const arr = Array.from(columns);
        const idx = arr.indexOf(currentTaskCard.closest('.column'));
        currentTaskCard.dataset.originalColumnIndex = idx;

        currentTaskCard.classList.add('card-completed');
        markDoneBtn.querySelector('.done').textContent = "Completed";

        doneColumn?.appendChild(currentTaskCard);
    } else {
        currentTaskCard.classList.remove('card-completed');
        markDoneBtn.querySelector('.done').textContent = "Mark as Done";

        const originalIdx = currentTaskCard.dataset.originalColumnIndex || 0;
        columns[originalIdx]?.appendChild(currentTaskCard);
    }

    updateColumnCounts();
});

// ================== 12. QUICK ADD ==================
quickAddBtn?.addEventListener('click', () => {
    quickAddModal.classList.add('is-visible');
    modalTitleInput.focus();
});

function closeQuickModal() {
    quickAddModal.classList.remove('is-visible');
    modalTitleInput.value = "";
    modalDateInput.value = "";
}

closeModalBtn?.addEventListener('click', closeQuickModal);

confirmAddTaskBtn?.addEventListener('click', () => {
    const title = modalTitleInput.value.trim();
    const date = modalDateInput.value;

    if (!title) return alert("Enter task title");

    let displayDate = "No deadline";
    if (date) {
        const d = new Date(date);
        displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const newCard = document.createElement('article');
    newCard.className = 'task-card';

    newCard.innerHTML = `
        <div class="card-top">
            <span class="tag">NEW</span>
        </div>
        <h4>${title}</h4>
        <p>Added via quick add</p>
        <div class="card-footer">
            <span class="due-date">${displayDate}</span>
        </div>
    `;

    ensureProgressBar(newCard);

    newCard.taskData = {
        title,
        dueDate: displayDate,
        tags: ["NEW"],
        attachments: [],
        comments: [],
        subtasks: []
    };

    document.querySelectorAll('.column')[0].appendChild(newCard);

    attachTaskClickListeners();
    updateColumnCounts();
    closeQuickModal();
});

// ================== 13. COUNTS ==================
function updateColumnCounts() {
    document.querySelectorAll('.column').forEach(col => {
        const span = col.querySelector('.count');
        const count = col.querySelectorAll('.task-card').length;
        if (span) span.textContent = count;
    });
}

// ================== 14. CLOSE ==================
closeBtn?.addEventListener('click', () => {
    taskDetails.classList.remove('is-active');
});

window.addEventListener('click', (e) => {
    if (e.target === quickAddModal) closeQuickModal();
});




// ================== INIT ==================
attachTaskClickListeners();
updateColumnCounts();
