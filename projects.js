const projectsSection = document.querySelector('.projectsSection');
const paginationContainer = document.querySelector('.paginationContainer');

window.onbeforeunload = () => scrollToTop();

class Projects {
    constructor(projects) {
        this.projects = projects;
    }
}

const loadProjects = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!Array.isArray(data.projects)) throw new Error('Invalid data format');
        return new Projects(data.projects);
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
    projectsSection.innerHTML = '';
    showLoading();
    loadProjects().then(projectsObj => {
        if (!projectsObj) return;
        const { projects } = projectsObj;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        projects.slice(start, end).forEach(project => {
            const div = document.createElement('div');
            div.classList.add('project');
            div.innerHTML = `
                <div class='projectContainer'>
                    <img src="${project.image}" alt="${project.title}" class="clickable-image">
                    <div class="description">
                        <h2>${project.title}</h2>
                        <p>${project.description}</p>
                        <p>(<i>${project.availability}</i>)</p>
                    </div>
                </div>
                <img src="${project.sistem}" alt="Sistema">
            `;
            projectsSection.appendChild(div);
        });
        addImageClickEvents();
        renderPagination(projects.length);
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
    projectsSection.appendChild(loadingDiv);
};
const hideLoading = () => {
    const loadingDiv = document.querySelector('.loader');
    if (loadingDiv) loadingDiv.remove();
};

const errorHandler = (error) => {
    console.error('Error loading projects:', error);
    projectsSection.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    errorDiv.textContent = 'Erro ao carregar os projetos. Tente novamente mais tarde.';
    projectsSection.appendChild(errorDiv);
};

renderPage(currentPage);