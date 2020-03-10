const burgerMenu = document.querySelector('#burger');
const menuItems = document.querySelector('.menu-items');
const viewParties = document.querySelector('#view-parties');
const navViewParties = document.querySelector('#nav-view-parties');
const history = document.querySelector('#history');
const navHistory = document.querySelector('#nav-history');
const viewCandidates = document.querySelector('#view-candidates');
const navViewCandidates = document.querySelector('#nav-view-candidates');
const filePetition = document.querySelector('#file-petition');
const navFilePetition = document.querySelector('#nav-file-petition');

menuItems.classList.add('hide');

burgerMenu.addEventListener('click', () => {
    menuItems.classList.toggle('hide');
});

viewParties.addEventListener('click', () => {
    window.location.href='../html/politician-view-parties.html';
});

navViewParties.addEventListener('click', () => {
    window.location.href='../html/politician-view-parties.html';
});

history.addEventListener('click', () => {
    window.location.href='../html/politician-voting-history.html';
});

navHistory.addEventListener('click', () => {
    window.location.href='../html/politician-voting-history.html';
});

viewCandidates.addEventListener('click', () => {
    window.location.href='../html/politician-view-candidates.html';
});

navViewCandidates.addEventListener('click', () => {
    window.location.href='../html/politician-view-candidates.html';
});

filePetition.addEventListener('click', () => {
    window.location.href='../html/file-petition.html';
});

navFilePetition.addEventListener('click', () => {
    window.location.href='../html/file-petition.html';
});
