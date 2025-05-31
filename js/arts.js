const artsSection = document.querySelector('.artsSection');
const paginationContainer = document.querySelector('.paginationContainer');

window.onbeforeunload = () => scrollToTop();

class Arts {
    constructor(arts) {
        this.arts = arts;
    }
}

const loadArts = async () => {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!Array.isArray(data.arts)) throw new Error('Invalid data format');
        return new Arts(data.arts);
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
    artsSection.innerHTML = '';
    showLoading();
    loadArts().then(artsObj => {
        if (!artsObj) return;
        const { arts } = artsObj;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        arts.slice(start, end).forEach(art => {
            const div = document.createElement('div');
            div.classList.add('art');
            div.innerHTML = `
                <div class='artContainer'>
                    <img src="${art.image}" alt="${art.title}" class="clickable-image">
                    <div class="description">
                        <h2>${art.title}</h2>
                        <p>${art.description}</p>
                        <p>(<i>${art.about}</i>)</p>
                    </div>
                </div>
                <img src="${art.software}" alt="Software">
            `;
            artsSection.appendChild(div);
        });
        addImageClickEvents();
        renderPagination(arts.length);
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
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const firstPageButton = createButton('<<', ['page-btn', 'first-page-btn'], () => {
        currentPage = 1;
        renderPage(currentPage);
        scrollToTop();
    });
    if (currentPage === 1) disable(firstPageButton);
    paginationContainer.appendChild(firstPageButton);

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    paginationContainer.appendChild(pagination);

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
    paginationContainer.appendChild(lastPageButton);
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
    artsSection.appendChild(loadingDiv);
};
const hideLoading = () => {
    const loadingDiv = document.querySelector('.loader');
    if (loadingDiv) loadingDiv.remove();
};

const errorHandler = (error) => {
    console.error('Error loading arts:', error);
    artsSection.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    errorDiv.textContent = 'Erro ao carregar as artes. Tente novamente mais tarde.';
    artsSection.appendChild(errorDiv);
};

renderPage(currentPage);