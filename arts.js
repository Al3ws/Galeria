const artessec = document.querySelector('.artessec');
const pagct = document.querySelector('.pagct');

window.onbeforeunload = () => scrollToTop();

class Artes {
    constructor(artes) {
        this.artes = artes;
    }
}

const carregarArtes = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!Array.isArray(data.artes)) throw new Error('Invalid data format');
        return new Artes(data.artes);
    } catch (error) {
        errorHandler(error);
    }
};

const itemsPerPage = 3;
let currentPage = 1;

const createButton = (text, classes, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(...classes);
    button.onclick = onClick;
    return button;
};

const renderPage = (page) => {
    artessec.innerHTML = '';
    showLoading();
    carregarArtes().then(artesObj => {
        if (!artesObj) return;
        const { artes } = artesObj;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        artes.slice(start, end).forEach(arte => {
            const div = document.createElement('div');
            div.classList.add('arte');
            div.innerHTML = `
                <div class='artect'>
                    <img src="${arte.imagem}" alt="${arte.titulo}" class="clickable-image">
                    <div class="descricao">
                        <h2>${arte.titulo}</h2>
                        <p>${arte.descricao}</p>
                        <p>(<i>${arte.sobre}</i>)</p>
                    </div>
                </div>
                <img src="${arte.software}" alt="Software">
            `;
            artessec.appendChild(div);
        });
        addImageClickEvents();
        renderPagination(artes.length);
    }).catch(errorHandler)
    .finally(hideLoading);
};

const addImageClickEvents = () => {
    const images = document.querySelectorAll('.clickable-image');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeModal = document.querySelector('.close');

    images.forEach(img => {
        img.onclick = () => {
            if (!modal || !modalImg || !captionText) return;
            modal.style.display = 'flex';
            modalImg.src = img.src;
            captionText.innerHTML = img.alt;
            setTimeout(() => modal.classList.add('show'), 10);
        };
    });

    if (closeModal && modal) {
        closeModal.onclick = () => {
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        };
    }

    if (modal) {
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => { modal.style.display = 'none'; }, 300);
            }
        };
    }
};

const renderPagination = (totalItems) => {
    pagct.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const firstPageButton = createButton('<<', ['page-btn', 'first-page-btn'], () => {
        currentPage = 1;
        renderPage(currentPage);
        scrollToTop();
    });
    if (currentPage === 1) disable(firstPageButton);
    pagct.appendChild(firstPageButton);

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    pagct.appendChild(pagination);

    for (let i = 1; i <= totalPages; i++) {
        const button = createButton(i, ['page-btn'], () => {
            currentPage = i;
            renderPage(currentPage);
            scrollToTop();
        });
        button.style.opacity = Math.max(1 - Math.abs(i - currentPage) * 0.2, 0.1);
        if (i === currentPage) {
            button.classList.add('active');
            setTimeout(() => button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 0);
            scrollToTop();
        }
        pagination.appendChild(button);
    }

    const lastPageButton = createButton('>>', ['page-btn', 'last-page-btn'], () => {
        currentPage = totalPages;
        renderPage(currentPage);
        scrollToTop();
    });
    if (currentPage === totalPages) disable(lastPageButton);
    pagct.appendChild(lastPageButton);
};

const disable = (button) => {
    button.disabled = true;
    button.classList.add('disabled');
};

const scrollToTop = () => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
};

const showLoading = () => {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loader');
    loadingDiv.innerHTML = `<div class="loader-spinner"></div>`;
    artessec.appendChild(loadingDiv);
};
const hideLoading = () => {
    const loadingDiv = document.querySelector('.loader');
    if (loadingDiv) loadingDiv.remove();
};

const errorHandler = (error) => {
    console.error('Error loading arts:', error);
    artessec.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    errorDiv.textContent = 'Erro ao carregar as artes. Tente novamente mais tarde.';
    artessec.appendChild(errorDiv);
};

renderPage(currentPage);