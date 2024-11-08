let botao = document.getElementById('hamburguinho')

let header = document.querySelector('header')

let nav = document.querySelector('nav')
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

function toggleHeader() {
    header.classList.toggle('hidden_header')
}

botao.addEventListener('click', toggleHeader) 