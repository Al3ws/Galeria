const projetossec = document.querySelector('.projetossec');
const pagct = document.querySelector('.pagct');

window.onbeforeunload = () => {
    scrollToTop();
};

class Projetos {
    constructor(imagens, titulos, descricoes, disponibilidade, sistema) {
        this.imagens = imagens;
        this.titulos = titulos;
        this.descricoes = descricoes;
        this.disponibilidade = disponibilidade;
        this.sistema = sistema;
    }
}

const carregarProjetos = async () => {
    const response = await fetch('projects.json');
    const data = await response.json();

    return new Projetos(
        data.projetos.map(projeto => projeto.imagem),
        data.projetos.map(projeto => projeto.titulo),
        data.projetos.map(projeto => projeto.descricao),
        data.projetos.map(projeto => projeto.disponibilidade),
        data.projetos.map(projeto => projeto.sistema)
    );
}

const itemsPerPage = 3;
let currentPage = 1;

const createButton = (text, classes, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(...classes);
    button.addEventListener('click', onClick);
    return button;
}

const renderPage = (page) => {
    carregarProjetos().then(projetos => {
    projetossec.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    projetos.imagens.slice(startIndex, endIndex).forEach((imagem, index) => {
        const globalIndex = startIndex + index;
        const div = document.createElement('div');
        div.classList.add('projeto');
        div.innerHTML = `
            <div>
                <img src="${imagem}" alt="${projetos.titulos[globalIndex]}" class="clickable-image">
                <div class="descricao">
                    <h2>${projetos.titulos[globalIndex]}</h2>
                    <p>${projetos.descricoes[globalIndex]}</p>
                    <p>(<i>${projetos.disponibilidade[globalIndex]}</i>)</p>
                </div>
            </div>
            <img src="${projetos.sistema[globalIndex]}" alt="Sistema">
        `;
        projetossec.appendChild(div);
    });

    addImageClickEvents();
    renderPagination();
});
}

const addImageClickEvents = () => {
    const images = document.querySelectorAll('.clickable-image');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeModal = document.querySelector('.close');

    images.forEach((img) => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
            captionText.innerHTML = img.alt;

            setTimeout(() => modal.classList.add('show'), 10);
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
}

const renderPagination = () => {
    pagct.innerHTML = '';

    const totalPages = Math.ceil(projetossec.children.length / itemsPerPage);

    const firstPageButton = createButton('<<', ['page-btn', 'first-page-btn'], () => {
        currentPage = 1;
        renderPage(currentPage);
        scrollToTop();
    });
    if (currentPage === 1) {
        disable(firstPageButton);
    }
    pagct.appendChild(firstPageButton);

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    pagct.appendChild(pagination);

    for (let i = 1; i <= totalPages; i++) {
        const button = createButton(i, ['page-btn'], () => {
            scrollToTop();
            currentPage = i;
            renderPage(currentPage);
        });

        const distance = Math.abs(i - currentPage);
        button.style.opacity = Math.max(1 - distance * 0.2, 0.1);

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
    if (currentPage === totalPages) {
        disable(lastPageButton);
    }
    pagct.appendChild(lastPageButton);
}

const disable = (button) => {
    button.disabled = true;
    button.classList.add('disabled');
}

const scrollToTop = () => {
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
}

renderPage(currentPage);