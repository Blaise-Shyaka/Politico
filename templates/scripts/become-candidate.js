const burgerMenu = document.querySelector('#burger');
const menuItems = document.querySelector('.menu-items');
const viewParties = document.querySelector('#view-parties');
const navViewParties = document.querySelector('#nav-view-parties');
const viewCandidates = document.querySelector('#view-candidates');
const navViewCandidates = document.querySelector('#nav-view-candidates');

menuItems.classList.add('hide');

burgerMenu.addEventListener('click', () => {
    menuItems.classList.toggle('hide');
});

viewParties.addEventListener('click', () => {
    window.location.href='../html/user-view-parties.html';
});

navViewParties.addEventListener('click', () => {
    console.log(navViewParties);
    window.location.href='../html/user-view-parties.html';
});

viewCandidates.addEventListener('click', () => {
    window.location.href='../html/view-politicians.html';
});

navViewCandidates.addEventListener('click', () => {
    window.location.href='../html/view-politicians.html';
});
