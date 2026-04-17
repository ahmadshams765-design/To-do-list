const container = document.getElementById("container");
const signUpBtn = document.getElementById("signUp");
const loginBtn = document.getElementById("login");
const nextBtn = document.querySelector('.next-btn');
const entryPage = document.querySelector('.entry-page');
const loginPage = document.querySelector('.container');

nextBtn.addEventListener('click', () => {
    entryPage.classList.add('fade-out');
    loginPage.classList.add('appear');
})

signUpBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");




// sign-up section
signupForm.addEventListener("submit", async (e) => {
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!username || !password) {
        alert("please fill all fields !");
        return;
    }

    try {
        const response = await fetch("https://", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("username", username);
            window.location.href = "firstpage.html";
        }
        else {
            alert("sign up failed!");
        }
    }
    catch (error) {
        console.log(error);
        alert("server error!");
    }

});





// login-section
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }
    try {
        const response = await fetch("https://", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("username", username);
            window.location.href = "firstpage.html";
        }
        else {
            alert(data.message || "login faile1d");
        }
    }

    catch (error) {
        console.log(error);
        alert("server error!");
    }
});



