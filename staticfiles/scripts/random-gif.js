// Lista de URLs dos GIFs animados
const gifs = [
    '../../static/img/avatar1.gif',
    '../../static/img/avatar2.gif',
    '../../static/img/avatar3.gif',
    '../../static/img/avatar4.gif',
    '../../static/img/avatar5.gif',
    '../../static/img/avatar6.gif',
    '../../static/img/avatar7.gif',
    '../../static/img/avatar8.gif',
];

// Função para iescolher um GIF aleatório
function getRandomGif() {
    const randomIndex = Math.floor(Math.random() * gifs.length);
    return gifs[randomIndex];
}

// Atualizar o src da magem com o GIF aleatório
window.onload = function() {
    const avatar = document.getElementById('avatar');
    avatar.src = getRandomGif();
};
