const submitEmail = document.querySelector('#submit');

submitEmail.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../html/reset-password.html';
});