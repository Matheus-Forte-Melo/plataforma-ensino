// Declaração de variáveis
// Nota: Algumas variáveis utilizadas neste bloco de código são criadas no arquivo "lógica_conteudo.js", e vice versa.

let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let mobile = vw <= 700

checarTela()
window.addEventListener('resize', checarTela)
ajustarTela()

function checarTela() {
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    vw <= 700 ? mobile = true : mobile = false

}

let header = document.getElementsByTagName('header')[0]
let aba_lateral = document.getElementById('abaLateral')

let fase
let fases = document.getElementsByClassName("fase");
let fases_pos = []

// Declaração de variáveis do canvas.

let mapa = document.getElementById('mapa')
const canvas = document.getElementById('canvas')
const context = canvas.getContext("2d")
canvas.width =  mapa.clientWidth
canvas.height =  mapa.clientHeight

// Loop para pegar a posição absoluta de todas as fases, transformando cada set de informação e um objeto e atribuindo-os a uma lista.
for (let fase of fases) {
    const x = window.getComputedStyle(fase).left
    const y = window.getComputedStyle(fase).top

    fases_pos.push({
        'id': fase.id,
        'x': Number(x.slice(0, x.indexOf('px'))) + 37.5,
        'y': Number(y.slice(0, y.indexOf('px'))) + 38       
    })
}

// Definição de variáveis para o timer
let segundos = 0;
let minutos = 0;
let timer;

// ============================================ Fim da definição de variáveis ============================================ 

// Módulos de tratamento de conteúdo das fases

function tratarFaseBloqueada(fase, conteudoFase) {
    fase.style.backgroundColor = "var(--nao-selecionado)";
    fase.style.outlineColor = "var(--nao-selecionado)";

    fase.classList.add('bloqueado')

    conteudoFase.querySelector('div').classList.add("feedback-estado");
    conteudoFase.querySelector('main').classList.add('conteudo-bloqueado');
}

function tratarFaseAtual(fase, tipoFase, conteudoFase ,conteudo_fase_main, conteudo_fase_feedback) {
    conteudo_fase_main.classList.remove('conteudo-bloqueado');
    conteudo_fase_feedback.classList.remove("feedback-estado")
     
    atualizarCor(fase);

    if (tipoFase == "exercicio") {
        conteudoFase.innerHTML += `<div class="btn-container"><button onclick="pegarInfoFormulario(formulario_fase_${fase_atual}, this)">Entregar</button></div>`;
    } else if (tipoFase == "prova") { 
        conteudoFase.querySelector('main').classList.add('conteudo-bloqueado')
        conteudoFase.querySelector('div').innerHTML = `<p><b>ATENÇÃO:</b> Este nível é uma prova, assim que você clicar em iniciar, você terá um determinado tempo para responder todas as questões corretamente. A aba irá se maximizar e não poderá ser minimizada nem fechada, a unica forma de sair dessa tela é entregando. Além disso, você consegue entregar apenas uma vez antes de obter sua nota. Você precisa de pelo menos SETE para passar adiante. Você pode repetir a prova quantas vezes quiser. Fechar a prova/página/aba no meio de sua execução cancelará sua tentativa e não irá salvar seus resultados, ou seja, terá que tentar novamente. </p> <button type="button" onclick="setarProva(this); resetarTimer(); iniciarTimer('info-tempo')">Começar prova</button> <hr>`
         
     } else if (tipoFase === "desafio") {
        conteudoFase.innerHTML += `<div class="btn-container"><button onclick="pegarInfoFormulario(formulario_fase_${fase_atual}, this)">Entregar</button><button ondblclick="this.parentElement.querySelectorAll('button').forEach(btn => btn.style.display='none'); atualizarFaseEPontuacao(this, 0);">Pular</button></div>`;
     } else {
        conteudoFase.innerHTML += '<div class="btn-container"><button onclick="atualizarFaseEPontuacao(this, 125)">Desbloquear próxima fase</button></div>'; // Se tiver algum erro com incrementacao de fase, tava aqui, por conta da falta de dois pontos aparantemente
     }
}

function tratarFaseDesbloqueada(fase, num_fase, tipoFase, conteudoFase, conteudo_fase_feedback) {
    atualizarCor(fase);
    if (!conteudoFase.innerHTML.includes('Você concluiu essa fase!')) {
        if (tipoFase === 'desafio' || tipoFase === 'exercicio' || tipoFase === 'prova') {
            conteudo_fase_feedback.innerHTML += '<p class="feedback-fase">Você concluiu essa fase! Mostrando resultados corretos. <br> <small style="color: green;">- Pontos foram adicionados na sua conta de acordo com seu desempenho.</small></p>';
        } else {
            conteudo_fase_feedback.innerHTML += '<p class="feedback-fase">Você concluiu essa fase!</p>';
        }
    }

    if (conteudoFase.innerHTML.includes('/form')) {
        let formulario = document.getElementById("formulario_fase_" + num_fase); // Pega o formulario 
        let inputs = formulario.querySelectorAll("input"); // Pega os inputs de dentro do formulario
    
        inputs.forEach(input => {
            if (input.classList[0] == 'c') {
                input.style.accentColor = "green"
                input.checked = 'true';
                
                input.type == 'text' ? input.value = input.value = input.getAttribute('data-c') : ""
            }
        });
    }
}

// Função que conecta as fases com base na pontuacao e nível atual.

function conectarFases() {
    const tema = localStorage.getItem('theme');

    fases_pos.forEach((fase, index, array) => {
        if (index + 2 <= fase_atual && array[index+1] !== undefined) {
           
            context.beginPath()
            context.moveTo(fase.x, fase.y)
            context.lineTo(array[index+1].x, array[index+1].y)
            
            if (tema === "dark") {
                context.strokeStyle = "#344d69"
            } else {
                context.strokeStyle = "#808080"  
            }
            

            context.lineWidth = 1;
            context.stroke()
            
        }
    })
}

function pegarEstadoFase(num_fase, fase_atual) {
    if (num_fase < fase_atual) {
        return 'Desbloqueada';
    } else if (num_fase == fase_atual) { // Mudei para == invez de ===, se der merda a partir de agr sei que é daqui.
        return 'Atual';
    } else {
        return 'Bloqueada';
    }
    
}

/* Funcão central da disposição de estado de fases e mapa. */

function atualizarFases() { 

    conectarFases()

    for (fase of fases) { 
        let num_fase = Number(fase.getAttribute('data-fase'));
        let conteudoFase = document.getElementById("conteudo" + num_fase);
        const tipoFase = conteudoFase.classList[1]; // Mudei isso de lugar, ele tava no "Ativo" antes
        let estadoFase = pegarEstadoFase(num_fase, fase_atual);
        let conteudo_fase_main = conteudoFase.querySelector('main')
        let conteudo_fase_feedback = conteudoFase.querySelector('div')  

        if (estadoFase === "Desbloqueada") {
            tratarFaseDesbloqueada(fase, num_fase, tipoFase, conteudoFase, conteudo_fase_feedback)
        } else if (estadoFase === "Atual") {
           tratarFaseAtual(fase, tipoFase, conteudoFase, conteudo_fase_main, conteudo_fase_feedback)
        } else if (estadoFase === "Bloqueada") {
            tratarFaseBloqueada(fase, conteudoFase)
        }
    };
}

/* =================  Timer, Navegação é disposição de conteúdo ==================== */ 

function iniciarTimer(id) { 
    timer = setInterval(() => {
        segundos++

        if (segundos >= 60) {
            minutos++; segundos = 0;
        }

        if (id !== undefined) {
            if (minutos == 30) {
                document.getElementById(id).innerHTML = `PROVA ENTREGUE AUTOMÁTICAMENTE, TEMPO ESGOTADO`
            } else if (minutos >= 25) {
                document.getElementById(id).style.color = 'red'
                document.getElementById(id).innerHTML = `<small>ATENÇÃO, TEMPO ESGOTANDO</small> <br> ${minutos}:${('0' + segundos).slice(-2)}`
            } else {
                document.getElementById(id).innerHTML = `${minutos}:${('0' + segundos).slice(-2)}`
            }
            
        }

        console.log(`${minutos}:${('0' + segundos).slice(-2)}`);
    }, 1000); 
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
    let conteudoFase = document.getElementById('conteudo' + fase);
    aba_lateral.classList.add('ativa');

    mobile == true ? aba_lateral.classList.add('maximizado') : null

    console.log(mobile)
    
    document.querySelectorAll('.conteudo').forEach(el => el.classList.remove('ativo'));
    conteudoFase.classList.add('ativo');
    
    const tipoFase = conteudoFase.classList[1];
    if (pegarEstadoFase(fase, fase_atual) == "Atual" && tipoFase != 'ativo') {
        iniciarTimer('info-tempo');
    }

    sumirHeader();
}

function retornarAba() {
    aba_lateral.classList.remove('ativa');
    aba_lateral.classList.remove('maximizado')
    pararTimer();
    surgirHeader();
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
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

mapaContainer.addEventListener('mousedown', iniciarArraste);
mapaContainer.addEventListener('touchstart', iniciarArraste);

function iniciarArraste(e) {
    isDragging = true;
    mapaContainer.style.cursor = 'grabbing';

    // Verifica se o evento é de touch screen. Caso contrário, usa eveno de arraste, e não de toque.
    const event = e.type === 'touchstart' ? e.touches[0] : e;
    startX = event.pageX - mapaContainer.offsetLeft;
    startY = event.pageY - mapaContainer.offsetTop;
    scrollLeft = mapaContainer.scrollLeft;
    scrollTop = mapaContainer.scrollTop;
}

const stopDragging = () => {
    if (isDragging) {
        salvarPosicaoArraste();
        isDragging = false;
        mapaContainer.style.cursor = 'grab';
    }
};

// // Event listeners ara dispotivos com clique
mapaContainer.addEventListener('mouseup', stopDragging);
mapaContainer.addEventListener('mouseleave', stopDragging);
mapaContainer.addEventListener('touchend', stopDragging);
// Event listeners ara dispotivos touch-screen
mapaContainer.addEventListener('mousemove', moverArraste);
mapaContainer.addEventListener('touchmove', moverArraste);

function moverArraste(e) {
    if (!isDragging) return;
    e.preventDefault();

    const event = e.type === 'touchmove' ? e.touches[0] : e;
    const x = event.pageX - mapaContainer.offsetLeft;
    const y = event.pageY - mapaContainer.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;
    mapaContainer.scrollLeft = scrollLeft - walkX;
    mapaContainer.scrollTop = scrollTop - walkY;
}

function pegarPosicaoArraste() {
    return { 'top': mapaContainer.scrollTop, 'left': mapaContainer.scrollLeft };
}

function salvarPosicaoArraste() {
    let pos = pegarPosicaoArraste();
    localStorage.setItem('pos_top', pos['top']);
    localStorage.setItem('pos_left', pos['left']);
}


function ajustarTela() {
    let scrollX, scrollY;
    if (localStorage.getItem('pos_top') === null || localStorage.getItem('pos_left') === null) {
        if (mobile) {
            scrollX = 900;
            scrollY = 280;
        } else {
            scrollX = 900;
            scrollY = 280;
        }
    } else {
        scrollY = parseInt(localStorage.getItem('pos_top'));
        scrollX = parseInt(localStorage.getItem('pos_left'));
    }
    mapaContainer.scrollTo(scrollX, scrollY);
}

document.addEventListener('keydown', function(event) {
    if (event.code == "Space") {
        const scrollX = (mapaContainer.scrollWidth - window.innerWidth) / 2;
        const scrollY = (mapaContainer.scrollHeight - window.innerHeight) / 2;
        mapaContainer.scrollTo(scrollX, scrollY);
    }
});

let lastTouchTime = 0;

document.addEventListener('touchstart', function () {
    // Estou usando o tempo reak mesmo, mas um timer fario o mesmo truque. 
    // Nesta funcão estou comparando o horario atual com o horario do ultimo toque, se o intervalo entre os dois horarios for maior que certos 
    // milisegundos, então ele irá centralizar
    const currentTime = new Date().getTime();
    const tapInterval = currentTime - lastTouchTime;

    if (tapInterval < 300 && tapInterval > 0) { 
        const scrollX = (mapaContainer.scrollWidth - window.innerWidth) / 2;
        const scrollY = (mapaContainer.scrollHeight - window.innerHeight) / 2;
        mapaContainer.scrollTo(scrollX, scrollY);

    }

    lastTouchTime = currentTime; 
});

mapaContainer.style.cursor = 'grab';


/*Controles do header*/

let botao = document.getElementById('hamburguinho');
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

