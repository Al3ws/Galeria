const artessec = document.querySelector('.artessec');
const pagct = document.querySelector('.pagct');

window.onbeforeunload = () => {
    scrollToTop();
};

const artes = {
    imagens: [
        'imgs/AGN.png',
        'imgs/fundo.png'
    ],
    titulos: [
        'Aventura nas Geleiras Norlândesas',
        'O Naufrágio Esquecido'
    ],
    descricoes: [
        'Essa é uma arte sobre uma aventura ao norte de uma terra predominantemente gelada, em busca de continuar sua jornada.',
        'Essa é uma arte sobre um naufrágio em um local desconhecido, onde o tempo parece ter parado.'
    ],
    sobre: [
        'Arte conceitual de um futuro projeto de jogo',
        'Arte conceitual de um futuro projeto de jogo'
    ],
    software: [
        'imgs/blender.png',
        'imgs/blender.png'
    ]
};

const itemsPerPage = 3;
let currentPage = 1;

function createButton(text, classes, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(...classes);
    button.addEventListener('click', onClick);
    return button;
}

function renderPage(page) {
    artessec.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    artes.imagens.slice(startIndex, endIndex).forEach((imagem, index) => {
        const globalIndex = startIndex + index;
        const div = document.createElement('div');
        div.classList.add('arte');
        div.innerHTML = `
            <div class='artect'>
                <img src="${imagem}" alt="Imagem">
                <div class="descricao">
                    <h2>${artes.titulos[globalIndex]}</h2>
                    <p>${artes.descricoes[globalIndex]}</p>
                    <p>(<i>${artes.sobre[globalIndex]}</i>)</p>
                </div>
            </div>
            <img src="${artes.software[globalIndex]}" alt="Software">
        `;
        artessec.appendChild(div);
    });

    renderPagination();
}

function renderPagination() {
    pagct.innerHTML = '';

    const totalPages = Math.ceil(artes.imagens.length / itemsPerPage) + 10;

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

function disable(button) {
    button.disabled = true;
    button.classList.add('disabled');
}

function scrollToTop() {
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
}

renderPage(currentPage);