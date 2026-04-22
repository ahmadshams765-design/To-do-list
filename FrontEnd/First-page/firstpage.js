// side bar fetching
fetch("../side-Bar/sideBar.html")
    .then(response => response.text())
    .then(data => {
        const sideBar = document.getElementById("sidebar-container");
        sideBar.innerHTML = data;

        const unwanted = sideBar.querySelector(".side-bottom");
        if(unwanted) unwanted.style.display = "none";
    });


// task details
const taskDetails = document.querySelector('.task-details');
const closeBtn = document.querySelector('.actions-icons');
const subtaskList = document.querySelector('.subtask-list');
const addSubtaskBtn = document.querySelector('.add-subtask-btn');
const inputWrapper = document.getElementById('subtask-input-wrapper');
const inputField = document.getElementById('subtask-input-field');
const markDoneBtn = document.querySelector('.mark-done-btn');
let currentTaskCard = null;



function openTaskDetails(task) {
    const detailTitle = taskDetails.querySelector('.task-title h1');
    const dueDateText = document.querySelector('.date-display span');
    const priorityText = document.querySelector('.priority-badge .urgent');
    const priorityBadge = document.querySelector('.priority-badge');
    const statusText = document.querySelector('.status-badge .progress');
    const markDoneBtn = document.querySelector('.mark-done-btn'); // Get button reference

    if (detailTitle) detailTitle.textContent = task.title;
    if (dueDateText) dueDateText.textContent = task.dueDate;
    if (priorityText) priorityText.textContent = task.priority;

    
    const isTaskChecked = currentTaskCard.querySelector('input[type="checkbox"]').checked;
    
    if (isTaskChecked) {
        markDoneBtn.classList.add('completed');
        markDoneBtn.style.background = "#4caf50";
        markDoneBtn.style.color = "#fff";
        markDoneBtn.querySelector('.done').textContent = "Completed";
        if (statusText) statusText.textContent = "Done";
    } else {
        markDoneBtn.classList.remove('completed');
        markDoneBtn.style.background = "";
        markDoneBtn.style.color = "";
        markDoneBtn.querySelector('.done').textContent = "Mark as Done";
        if (statusText) statusText.textContent = "In Progress";
    }

    if (priorityBadge) {
        const p = task.priority.toLowerCase();
        if (p.includes("low")) {
            priorityBadge.style.background = "#e6f7ec";
            priorityBadge.style.color = "green";
        } else if (p.includes("medium")) {
            priorityBadge.style.background = "#fff4e5";
            priorityBadge.style.color = "orange";
        } else if (p.includes("high")) {
            priorityBadge.style.background = "#ffe5e9";
            priorityBadge.style.color = "red";
        }
    }

    taskDetails.classList.add('is-active');
}




function attachTaskClickListeners() {
    const taskCards = document.querySelectorAll('.task-card, .schedule-item li');

    taskCards.forEach(card => {
        card.onclick = (e) => {
            if (e.target.type === 'checkbox') return;
            currentTaskCard = card;

            const task = {
                title: card.querySelector('h3, .task-title')?.textContent || "",
                dueDate: card.querySelector('.time')?.textContent || "No time",
                priority: card.querySelector('.level')?.textContent || "HIGH"
            };

            openTaskDetails(task);
        };
    });
}




closeBtn.addEventListener('click', () => {
    taskDetails.classList.remove('is-active');
});




if (addSubtaskBtn) {
    addSubtaskBtn.onclick = () => {
        inputWrapper.style.display = "block";
        inputField.focus();
    };
}

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = inputField.value.trim();

        if (text !== "") {
            const div = document.createElement('div');
            div.className = 'subtask-item';
            const id = 'st-' + Date.now();

            div.innerHTML = `
                <input type="checkbox" id="${id}">
                <label for="${id}" class="label">${text}</label>
            `;

            subtaskList.insertBefore(div, inputWrapper);

            inputField.value = "";
            inputWrapper.style.display = "none";
        }
    }
});




if (markDoneBtn) {
    markDoneBtn.addEventListener('click', () => {


        // to make sure the current task isn't still null as i asigned it the first time
        if (!currentTaskCard) return;

        let isTaskChecked = currentTaskCard.querySelector('input[type="checkbox"]').checked;
        const statusText = document.querySelector('.status-badge .progress');
        
        // Toggle the checkbox status
        isTaskChecked = !isTaskChecked;

        // Update Button UI based on the NEW checkbox status
        if (isTaskChecked) {
            markDoneBtn.classList.add('completed');
            markDoneBtn.style.background = "#4caf50";
            markDoneBtn.style.color = "#fff";
            markDoneBtn.querySelector('.done').textContent = "Completed";
            if (statusText) statusText.textContent = "Done";
        } else {
            markDoneBtn.classList.remove('completed');
            markDoneBtn.style.background = "";
            markDoneBtn.style.color = "";
            markDoneBtn.querySelector('.done').textContent = "Mark as Done";
            if (statusText) statusText.textContent = "In Progress";
        }
        
        // Update momentum and count
        updateMomentum();
    });
}
attachTaskClickListeners();




// getting user's info from backend
async function loadUsername() {
    try {
        const response = await fetch("http://localhost:3000/user");
        const data = await response.json();

        const welcomeHeader = document.querySelector(".header h1");
        if (welcomeHeader) {
            welcomeHeader.textContent = `Good Morning, ${data.username}.`;
        }

    } catch (error) {
        console.error("Error loading username:", error);
    }
}



// updating no. of tasks 
function updateTaskCount() {
    const DeepTasks = document.querySelectorAll('.task-card');
    const ScheduledTasks = document.querySelectorAll('.schedule-item li');

    const totalTasks = DeepTasks.length + ScheduledTasks.length;

    const CountElement = document.getElementById('task-count');
    if (CountElement) {
        CountElement.textContent = totalTasks;
    }
}






//search bar
const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allTasks = document.querySelectorAll('.task-card, .schedule-item li');

    allTasks.forEach(task => {
        const text = task.querySelector('h3, .task-title').textContent.toLowerCase();
        task.style.display = text.includes(searchTerm) ? "" : "none";
    });
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = e.target.value.toLowerCase();
        const allTasks = document.querySelectorAll('.task-card, .schedule-item li');

        for (let task of allTasks) {
            const title = task.querySelector('h3, .task-title').textContent;
            if (title.toLowerCase().includes(searchTerm) && task.style.display === "") {
                openTaskDetails(task);
                break;
            }
        }
    }
});





// task info
const addTaskBtn = document.querySelector(".Add-Task");
const taskInput = document.querySelector('.search-bar input[type="text"]');
const scheduleList = document.querySelector(".schedule-item");
const priorityOptions = document.querySelectorAll('.priority-dropdown-menu li');
const priorityBtn = document.querySelector('.priority.button');
const timeInputs = document.querySelectorAll('.date-dropdown-menu input');
const leftColumn = document.querySelector(".column-left");
const momentumCard = document.querySelector(".momentum-card");
let selectedPriority = 'MEDIUM';



// priority options
priorityOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedPriority = option.textContent;
        if (!selectedPriority) {
            alert("priority is Required!");
            return;
        }

        priorityBtn.innerHTML = `<div><i class="fa-solid fa-bookmark"></i></div> ${selectedPriority}`;
    });
});




//momentum card
function updateMomentum() {
    const allTasks = document.querySelectorAll('.task-card input[type="checkbox"], .schedule-item input[type="checkbox"]');
    const completedTasks = document.querySelectorAll('.task-card input[type="checkbox"]:checked, .schedule-item input[type="checkbox"]:checked');

    const total = allTasks.length;
    const done = completedTasks.length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    const momentumText = document.querySelector('.momentum-card p');

    let message = "Stay intentional.";

    if (percent === 100) message = "Perfect! You're unstoppable 🔥";
    else if (percent > 70) message = "Great progress, keep going 💪";
    else if (percent < 30) message = "Let’s get started 👀";

    momentumText.textContent = `You've completed ${percent}% of your deep work goals this week. ${message}`;

    document.addEventListener('change', (e) => {

        if (e.target.type === 'checkbox') {
            updateMomentum();
        }
    });
}





// creating new task
const createNewTask = () => {
    const title = taskInput.value.trim();

    if (title == "") {
        alert("Please enter a task title!");
        return;
    }

    const hrs = document.querySelector('.time-hh');
    const mins = document.querySelector('.time-mm');

    // hours
    hrs.addEventListener('input', () => {
        let value = parseInt(hrs.value);

        if (value > 12) hrs.value = 12;
        if (value < 0) hrs.value = 0;
    });

    // mins
    mins.addEventListener('input', () => {

        let value = parseInt(mins.value);
        if (value > 59) mins.value = 59;
        if (value < 0) mins.value = 0;
    });

    const Mins = String(mins.value).padStart(2, "0");
    const timeSrting = `${hrs.value}:${Mins} ${hrs.value >= 12 ? "PM" : "AM"}`;


    if (!hrs.value || !mins.value) {
        alert("Deadline is required!");
        return;
    }

    if (selectedPriority == 'HIGH') {
        const highTask = document.createElement('div');
        highTask.className = 'task-card';
        highTask.innerHTML = `
                            <input type="checkbox">
                                <div class="task-content">
                                    <h3>${title}</h3>
                                    

                                    <div class="clock-badge">
                                        <span class="clock-icon"><i class="fa-regular fa-clock"></i></span>
                                        <span class="time">${timeSrting}</span>
                                    </div>
                                </div>
        `;

        leftColumn.insertBefore(highTask, momentumCard);

    }

    else {
        const lessTask = document.createElement('li');
        lessTask.innerHTML = `
        <input type="checkbox">
            <div class="task-content">
                <span class="task-title">${title}</span>
                <div class="data">
                    <span class="level">${selectedPriority}</span>
                    <span class="clock-icon"><i class="fa-regular fa-clock"></i></span>
                    <span>${timeSrting}</span>
                </div>
            </div>
    `;

        scheduleList.appendChild(lessTask);
    }

    // reset data
    taskInput.value = "";
    document.querySelector('.time-hh').value = "";
    document.querySelector('.time-mm').value = "";
    priorityBtn.innerHTML = `<div><i class="fa-solid fa-bookmark"></i></div> Priority`;

    // update
    updateTaskCount();
    attachTaskClickListeners();
    updateMomentum();
};

addTaskBtn.addEventListener('click', createNewTask);

updateTaskCount();
attachTaskClickListeners();
updateMomentum();

attachTaskClickListeners();
updateTaskCount();
updateMomentum();


// i put it here to make sure all elements are loaded
document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {

        const card = e.target.closest('.task-card, .schedule-item li');
        if (!card) return;

        if (card === currentTaskCard) {

            const isChecked = e.target.checked;

            const statusText = document.querySelector('.status-badge .progress');
            const markDoneBtn = document.querySelector('.mark-done-btn');

            if (isChecked) {
                if (statusText) statusText.textContent = "Done";

                markDoneBtn.classList.add('completed');
                markDoneBtn.style.background = "#4caf50";
                markDoneBtn.style.color = "#fff";
                markDoneBtn.querySelector('.done').textContent = "Completed";

            } else {
                if (statusText) statusText.textContent = "In Progress";

                markDoneBtn.classList.remove('completed');
                markDoneBtn.style.background = "";
                markDoneBtn.style.color = "";
                markDoneBtn.querySelector('.done').textContent = "Mark as Done";
            }
        }
    }
});



// profile
const profileBtn = document.querySelector('.profile-btn');
const profileModal = document.getElementById('profileModal');
const closeModal = document.querySelector('.close-modal');
const profileForm = document.getElementById('modal-profile-form');
const usernameInput = document.getElementById('modal-username-field');
const newPassInput = document.getElementById('modal-new-pass');
const confirmPassInput = document.getElementById('modal-confirm-pass');
const imageUpload = document.getElementById('modal-image-upload');
const profileImg = document.getElementById('modal-profile-img');
const statusMsg = document.getElementById('modal-status-msg');
const greetingName = document.querySelector('.header h1');


// load profile from backend
async function loadProfileData() {
    try {
        const res = await fetch("");
        const data = await res.json();

        usernameInput.value = data.username;
        profileImg.src = data.profilePic;

        greetingName.textContent = `Good Morning, ${data.username}.`;

    } catch (err) {
        alert("server error!");
        console.log(err);
    }
}


// image preview
imageUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => profileImg.src = e.target.result;
        reader.readAsDataURL(file);
    }
});


// save profile
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newUsername = usernameInput.value.trim();
    const newPass = newPassInput.value;
    const confirmPass = confirmPassInput.value;


    if (newUsername === "") {
        statusMsg.textContent = "Username cannot be empty";
        statusMsg.style.color = "red";
        return;
    }

    if (newPass === "") {
        statusMsg.textContent = "New password cannot be empty";
        statusMsg.style.color = "red";
        return;
    }

    if (newPass !== confirmPass) {
        statusMsg.textContent = "Passwords don't match";
        statusMsg.style.color = "red";
        return;
    }

    try {
        await fetch("http://localhost:3000/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: newUsername,
                profilePic: profileImg.src
            })
        });

        if (newPass) {
            await fetch("", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: newUsername,
                    password: newPass
                })
            });
        }

        greetingName.textContent = `Good Morning, ${newUsername}.`;
        statusMsg.textContent = "Updated!";
        statusMsg.style.color = "green";

    } catch (err) {
        console.error(err);
        // alert(err);
    }
});


// modal controls
profileBtn.addEventListener('click', () => profileModal.classList.add('active'));
closeModal.addEventListener('click', () => profileModal.classList.remove('active'));

window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.classList.remove('active');
    }
});


// init
loadUsername();
loadProfileData();
updateTaskCount();
attachTaskClickListeners();
updateMomentum();






//notification

// --- Notification Modal Logic ---
const notifBtn = document.querySelector('.notification-btn');
const notifModal = document.getElementById('notificationModal');
const closeNotif = document.getElementById('notif-close');
const markAllRead = document.querySelector('.mark-all-btn');

// Open Notifications
notifBtn.addEventListener('click', () => {
    notifModal.classList.add('active');
});

// Close Notifications
closeNotif.addEventListener('click', () => {
    notifModal.classList.remove('active');
});

// Mark all as read functionality
markAllRead.addEventListener('click', () => {
    const unreadItems = document.querySelectorAll('.notif-item.unread');
    const dots = document.querySelectorAll('.unread-dot');

    unreadItems.forEach(item => item.classList.remove('unread'));
    dots.forEach(dot => dot.style.display = 'none');
});

// Close when clicking outside 
window.addEventListener('click', (e) => {
    if (e.target === notifModal) {
        notifModal.classList.remove('active');
    }
});