let segundos = 0;
let minutos = 0;
let timer;

let header = document.getElementsByTagName('header')[0]
let aba_lateral = document.getElementById('abaLateral')

function iniciarTimer(id) { 
    // A variavel timer guarda uma funcao que ativa a cada um segundo
    timer = setInterval(() => {
        segundos++

        if (segundos >= 60) {
            minutos++; segundos = 0;
        }

        if (id !== undefined) {
            document.getElementById(id).innerHTML = `${minutos}:${segundos}`
        }

        console.log(`${minutos}:${segundos}`);
    }, 500); // Cada minuto é na verdade 30 segundos.
}

function pararTimer() {
    clearInterval(timer)
    console.log("Timer parado")
}

function resetarTimer() {
    clearInterval(timer)
    segundos = 0;
    minutos = 0;
    console.log("Timer resetado")
}


function sumirHeader() {
    header.classList.add('header-shift-out')
}

function surgirHeader() {
    header.classList.remove('header-shift-out')
    header.style.display = 'flex'
}

function abrirAba(fase) {
    let conteudoFase = document.getElementById('conteudo' + fase)
    aba_lateral.classList.add('ativa');
    
    // Exibe o conteúdo correspondente
    document.querySelectorAll('.conteudo').forEach(el => el.classList.remove('ativo'));
    conteudoFase.classList.add('ativo');

   
    const tipoFase = conteudoFase.classList[1];
    

    if (pegarEstadoFase(fase, fase_atual) == "Atual" && tipoFase != 'ativo') {
        iniciarTimer('info-tempo')
    }

    sumirHeader()
}

function retornarAba() {
    aba_lateral.classList.remove('ativa')
    
    pararTimer()
    
    //resetarTimer() Ainda nao sei se devo resetar ou devo resetar só quando entregar
    
    surgirHeader()
}

function maximizarAba() {
    aba_lateral.classList.toggle('maximizado'); 
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
const stopDragging = () => {
    isDragging = false;
    mapaContainer.style.cursor = 'grab';
};
mapaContainer.addEventListener('mouseup', stopDragging);
mapaContainer.addEventListener('mouseleave', stopDragging); // Corrige o bug

// Continuar o arraste enquanto o mouse se move
mapaContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - mapaContainer.offsetLeft;
    const y = e.pageY - mapaContainer.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;
    mapaContainer.scrollLeft = scrollLeft - walkX;
    mapaContainer.scrollTop = scrollTop - walkY;
});

// Cursor inicial
mapaContainer.style.cursor = 'grab';

// Centralizar o mapa no carregamento da página
window.onload = () => {
    setTimeout(() => {
        const scrollX = (mapaContainer.scrollWidth - window.innerWidth) / 2 - 350; 
        const scrollY = (mapaContainer.scrollHeight - window.innerHeight) / 2 - 1540;
        mapaContainer.scrollTo(scrollX, scrollY);
    }, 25); // Pequeno atraso para garantir que o conteúdo esteja carregado
};