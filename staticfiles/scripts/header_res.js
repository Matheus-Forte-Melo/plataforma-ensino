let botao = document.getElementById('hamburguinho');
let header = document.querySelector('header');
let estado_header = sessionStorage.getItem('header-state');

function toggleHeader() {
    header.classList.toggle('hidden_header');

    if (header.classList.contains('hidden_header')) {
        sessionStorage.setItem('header-state', 'closed'); 
    } else {
        sessionStorage.setItem('header-state', 'open'); 
    }
}

botao.addEventListener('click', toggleHeader);

if (estado_header === 'open') {
    header.classList.remove('hidden_header'); 
} else {
    header.classList.add('hidden_header'); 
}
