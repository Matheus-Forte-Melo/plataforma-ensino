let header = document.getElementsByTagName('header')[0]


function sumirHeader() {
    header.classList.add('header-shift-out')
}

function surgirHeader() {
    header.classList.remove('header-shift-out')
    header.style.display = 'flex'
}

function abrirAba(fase) {
    document.getElementById('abaLateral').classList.add('ativa');
    
    // Exibe o conteúdo correspondente
    document.querySelectorAll('.conteudo').forEach(el => el.classList.remove('ativo'));
    document.getElementById('conteudo' + fase).classList.add('ativo');

    sumirHeader()
}

function retornarAba() {
    document.getElementById('abaLateral').classList.remove('ativa')
    surgirHeader()
}

function maximizarAba() {
    document.getElementById('abaLateral').classList.toggle('maximizado'); 
}

// Adiciona queryselectors aos botoes de fase, que quando clicados, chamam a funcao de abrir aba com o conteudo correspondente.
document.querySelectorAll('.fase').forEach(fase => {
    fase.addEventListener('click', () => {
        const faseSelecionada = fase.getAttribute('data-fase');
        abrirAba(faseSelecionada);
    });
});

// ==============================  Comportamento de arraste  ====================================== 
const mapaContainer = document.getElementById('mapaContainer');
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

// Iniciar o arraste
mapaContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    mapaContainer.style.cursor = 'grabbing';
    startX = e.pageX - mapaContainer.offsetLeft;
    startY = e.pageY - mapaContainer.offsetTop;
    scrollLeft = mapaContainer.scrollLeft;
    scrollTop = mapaContainer.scrollTop;
});

// Parar o arraste
mapaContainer.addEventListener('mouseup', () => {
    isDragging = false;
    mapaContainer.style.cursor = 'grab';
});

// Continuar o arraste enquanto o mouse se move
mapaContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - mapaContainer.offsetLeft;
    const y = e.pageY - mapaContainer.offsetTop;
    const walkX = (x - startX) * 1; // Multiplicador para ajustar a velocidade
    const walkY = (y - startY) * 1;
    mapaContainer.scrollLeft = scrollLeft - walkX;
    mapaContainer.scrollTop = scrollTop - walkY;
});

// Cursor inicial
mapaContainer.style.cursor = 'grab';

window.onload = function() {
    // Adiciona um pequeno atraso para garantir que o conteúdo esteja totalmente carregado
    setTimeout(() => {
        // Obtém o elemento do mapa
        const mapaContainer = document.getElementById('mapaContainer');
        
        // Calcula o centro do mapa, porém o mais interessante seria calcular o centro do viewport
        const scrollX = (mapaContainer.scrollWidth - window.innerWidth) / 2;
        const scrollY = (mapaContainer.scrollHeight - window.innerHeight) / 2;
       
        
        // Define a posição de rolagem para o centro
        mapaContainer.scrollTo(scrollX, scrollY);
    }, 25); // Espera 10 milissegundos antes de centralizar
};