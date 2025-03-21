const artessec = document.querySelector('.artessec');

let imagens = [
    'imgs/AGN.png',
    'imgs/AGN.png',
];

let titulos = [
    'AGN',
    'AGN',
];

let descricoes = [
    'AGN',
    'AGN',
];

imagens.forEach((imagem) => {
    const div = document.createElement('div');
    div.classList.add('arte');
    div.innerHTML = `<img src="${imagem}" alt="Imagem"><div class="descricao"><h2>${titulos[imagens.indexOf(imagem)]}</h2><p>${descricoes[imagens.indexOf(imagem)]}</p></div>`;
    artessec.appendChild(div);
});