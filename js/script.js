const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

window.onbeforeunload = () => {
    window.scrollTo(0, 0);
};