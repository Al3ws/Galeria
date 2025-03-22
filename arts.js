const artessec = document.querySelector('.artessec');

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
}

artes.imagens.forEach((imagem) => {
    const div = document.createElement('div');
    div.classList.add('arte');
    div.innerHTML = `<div><img src="${imagem}" alt="Imagem"><div class="descricao"><h2>${artes.titulos[artes.imagens.indexOf(imagem)]}</h2><p>${artes.descricoes[artes.imagens.indexOf(imagem)]}</p><p>(<i>${artes.sobre[artes.imagens.indexOf(imagem)]}</i>)</p></div></div><img src="${artes.software[artes.imagens.indexOf(imagem)]}" alt="Software">`;
    artessec.appendChild(div);
});