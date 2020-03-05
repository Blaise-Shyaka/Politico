const burgerMenu = document.querySelector('#burger');
const menuItems = document.querySelector('.menu-items');
const viewParties = document.querySelector('#view-parties');
const createParty = document.querySelector('#create-party');
const navViewParties = document.querySelector('#nav-view-parties');
const navCreateParty = document.querySelector('#nav-create-party')

menuItems.classList.add('hide');

burgerMenu.addEventListener('click', () => {
    menuItems.classList.toggle('hide');
});

createParty.addEventListener('click', () => {
    window.location.href='../html/create-political-party.html';
});

viewParties.addEventListener('click', () => {
    window.location.href='../html/admin-view-parties.html';
});

navViewParties.addEventListener('click', () => {
    window.location.href='../html/admin-view-parties.html';
});

navCreateParty.addEventListener('click', () => {
    window.location.href='../html/create-political-party.html';
});