const submitNewPassword = document.querySelector('#submit');

submitNewPassword.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../html/admin-view-parties.html';
});