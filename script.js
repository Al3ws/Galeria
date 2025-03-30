const ano = document.querySelector('#ano');

ano.textContent = new Date().getFullYear();

window.onbeforeunload = () => {
    window.scrollTo(0, 0);
};