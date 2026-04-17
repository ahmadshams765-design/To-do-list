// side bar fetching
fetch("../side-Bar/sideBar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
    })

// task-details 
const taskDetails = document.querySelector('.task-details');
const closeBtn = document.querySelector('.close-btn');

function openTaskDetails(title) {
    const detailTitle = taskDetails.querySelector('.task-title h1');
    if (detailTitle) detailTitle.textContent = title;
    taskDetails.classList.add('is-active');
}



function attachTaskClickListeners() {
    const taskCards = document.querySelectorAll('.task-card, .schedule-item li');
    taskCards.forEach(card => {
        card.onclick = (e) => {
            if (e.target.type === 'checkbox') return;

            taskDetails.classList.add('is-active');
            const title = card.querySelector('h3, .task-title').textContent;
            openTaskDetails(title);
        };
    });
}


closeBtn.addEventListener('click', () => {
    taskDetails.classList.remove('is-active');
});



// getting user's info
const username = localStorage.getItem("username");

if (username) {
    const welcomeHeader = document.querySelector(".header h1");
    welcomeHeader.textContent = `Good Morning, ${username}.`;
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
                openTaskDetails(title);
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
//const timeBtn = document.querySelector('.time.button');
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




// creating new task
const createNewTask = () => {
    const title = taskInput.value.trim();

    if (title == "") {
        alert("Please enter a task title!");
        return;
    }

    // const hrs = timeInputs[0].value;
    // const mins = timeInputs[1].value;
    // const Mins = (mins < 10 && mins.length == 1) ? "0" + mins : mins;
    // const timeSrting = `${hrs} : ${Mins} ${hrs >= 12 ? "PM" : "AM"}`;

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
        if (value > 12) mins.value = 59;
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
                                    <!-- <p>Requires deep work focus. Review with design team first.</p> -->
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
};

addTaskBtn.addEventListener('click', createNewTask);

updateTaskCount();
attachTaskClickListeners();



