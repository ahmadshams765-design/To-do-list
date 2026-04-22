// // تأكد إن الصفحة اتحمّلت
// document.addEventListener("DOMContentLoaded", () => {

//     // كل عناصر الـ nav
//     const navItems = document.querySelectorAll(".nav-item");

//     navItems.forEach(item => {
//         item.addEventListener("click", () => {

//             // 1. إزالة active من الكل
//             navItems.forEach(i => i.classList.remove("active"));

//             // 2. إضافة active للعنصر الحالي
//             item.classList.add("active");

//             // 3. الانتقال للصفحة
//             const link = item.getAttribute("data-link");
//             if (link) {
//                 window.location.href = link;
//             }
//         });
//     });


//     // ✨ optional: تحديد الصفحة الحالية تلقائيًا
//     const currentPath = window.location.pathname;

//     navItems.forEach(item => {
//         const link = item.getAttribute("data-link");

//         if (link && currentPath.includes(link.split("/").pop())) {
//             item.classList.add("active");
//         }
//     });


//     // ✨ زر إنشاء مشروع جديد
//     const createProjectBtn = document.querySelector(".side-bottom");

//     if (createProjectBtn) {
//         createProjectBtn.addEventListener("click", () => {
//             alert("Create New Project feature coming soon 🚀");
//         });
//     }

// });