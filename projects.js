const projetossec = document.querySelector('.projetossec');

const projetos = {
    imagens: [
        'imgs/srp.png'
    ],
    titulos: [
        'Sistema de Registro Pedagógico'
    ],
    descricoes: [
        'Esse é um projeto de um sistema de registro pedagógico para escolas, com o intuito de facilitar o registro de informações e ocorrências dos alunos.'
    ],
    sobre: [
        'Projeto de um sistema de registro pedagógico para escolas'
    ],
    software: [
        'imgs/php.png'
    ]
}

projetos.imagens.forEach((projeto) => {
    const div = document.createElement('div');
    div.classList.add('projeto');
    div.innerHTML = `<div><img src="${projeto}" alt="Imagem"><div class="descricao"><h2>${projetos.titulos[projetos.imagens.indexOf(projeto)]}</h2><p>${projetos.descricoes[projetos.imagens.indexOf(projeto)]}</p><p>(<i>${projetos.sobre[projetos.imagens.indexOf(projeto)]}</i>)</p></div></div><img src="${projetos.software[projetos.imagens.indexOf(projeto)]}" alt="Software">`;
    projetossec.appendChild(div);
});