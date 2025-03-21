/* Declaração de variáveis globais */
const fase_inicial = Number(document.getElementById("info-fase").getAttribute('data-inicio'));
let fase_atual = fase_inicial;
let tentativas = 1;
/* Fim das declarações*/ 

atualizarFases();

function calcularPontuacao(pontos, tempo, tentativas) {
    tempo <= 0 ? tempo = 1 : null
    tentativas <= 0 ? tempo = 1 : null
    // Tempo de resolucao em minutos
    // O menor multiplicador que você pode conseguir é o dobro da pontuacao designada
    if (tempo !== undefined && tentativas !== undefined) {
        let fator_tempo = Math.max(1, 10 / tempo)
        let fator_tentativas = Math.max(1, 5 / tentativas)
        let multiplicador = fator_tempo + fator_tentativas

        return  Math.ceil(pontos * multiplicador)
    } 
    
    if (pontos !== undefined) {
        return pontos
    }

    return null

}

function pegarInfoFormulario(form, botao, is_prova) {
    const formData = new FormData(form);
    const formEntries = {};
   

    formData.forEach((value, key) => {
        
        const input = form.elements.namedItem(key) 
        // form.elements retorna TODOS os elementos filhos do form, depois pega APENAS o elemento com name definido, ou seja
        // os inputs selecionados. Com isso, consegumimos achar especificamente os inputs de texto.

        try {
            if (input.getAttribute("type") == "text") {
                value = input.value.trim()
                // Assim, podemos tratar APENAS os inputs de tipo texto.
            }
        } catch(err) {
            
        // Gambiarra nova acaba aqui. 

        }
        
        if (formEntries[key]) {
            formEntries[key] = Array.isArray(formEntries[key]) ? [...formEntries[key], value] : [formEntries[key], value];
        } else {
            formEntries[key] = value;
        }
    });

    

    if (is_prova === undefined) {
        corrigirEnvioFormulario(formEntries, pegarRespostasCorretas(form), botao, form);
    }   
    else {
        corrigirEnvioFormularioProva(formEntries, pegarRespostasCorretas(form), botao, form)
    }
}

function pegarRespostasCorretas(form) { // retorna objeto
    const respostas_corretas = form.getElementsByClassName("c");
    const respostas_corretas_formatadas = {};

    Array.from(respostas_corretas).forEach(input => { // Alterar pode dar mt merda
        respostas_corretas_formatadas[input.name] = input.getAttribute("type") !== "text" ? input.value : input.getAttribute('data-c');
    });

    return respostas_corretas_formatadas;
}

function corrigirEnvioFormularioProva(respostas, respostas_corretas, botao, form) {
    const qnt_respostas_form = Object.keys(respostas_corretas).length;
    const qnt_respostas_enviadas = Object.keys(respostas).length;
    let nota; let pontos = 0; let valor_ponto = 10 / qnt_respostas_form;
    // pacoca == true : faz isso ? senao isso

    for (let chave in respostas_corretas) {
        if (respostas[chave] === undefined) {
            console.log("Resposta inexistente");
        } else if (respostas[chave] !== respostas_corretas[chave]) {
            console.log("Resposta incorreta");
        } else {
            console.log("Resposta correta");
            pontos++;
        }
    }
    nota = pontos * valor_ponto;
    nota >= 7 ? aprovar(form, nota, botao) : reprovar(form, pontos, nota, botao);
    botao.scrollIntoView({behavior: 'smooth'})
}


function aprovar(form, nota, botao) {
    let feedback = form.getElementsByClassName('feedback')[0];
    pararTimer()
    resetarTimer()
    
    form.classList.add('mostrar-corretas')

    feedback.innerHTML = `Parabéns! <b>foste aprovado com nota: ${nota.toFixed(1)}</b>. Destacamos as questões que você acertou. Clique no botão abaixo para concluir e avançar.`

    botao.innerHTML = "Concluir"
    botao.setAttribute('onclick', `atualizarFaseEPontuacao(this, calcularPontuacao(40, ${minutos}, 1)), unsetarAmbienteProva(this), location.reload()`);

}

function reprovar(form, pontos, nota, botao) {
    form.innerHTML = "<p class='feedback'></p>"
    let feedback = form.getElementsByClassName('feedback')[0];
    pararTimer()

    botao.innerHTML = "Voltar"
    botao.setAttribute('onclick', 'location.reload()')

    feedback.innerHTML = `Infelizmente sua tentativa foi anulada, pois, <b>foste reprovado com nota: ${nota.toFixed(1)}</b>. Mas não se preocupe! Você pode tentar novamente. Estude um pouco os níveis anteriores, depois tente novamente aqui. <br><br> <b>Você acertou ${pontos} questões!</b>`
}

function entregarPorTempo(conteudoFase, intervalo_verificacao) {
    clearInterval(intervalo_verificacao)
    
    botao = conteudoFase.querySelector('.btn-container').querySelector('button')

    console.log(botao)
    botao.click()
    
}

function corrigirEnvioFormulario(respostas, respostas_corretas, botao, form) {
    respostas = JSON.stringify(respostas); 
    respostas_corretas = JSON.stringify(respostas_corretas);
    let feedback = form.getElementsByClassName('feedback')[0];


    if (respostas === respostas_corretas) {
        atualizarFaseEPontuacao(botao, calcularPontuacao(20, minutos, tentativas))
        
        feedback.innerHTML = "Parabéns, você acertou todas as questões!";
        form.parentElement.parentElement.querySelectorAll('button').forEach(btn => btn.style.display = 'none')
        
        tentativas = 1
        resetarTimer()
    } else {
        tentativas++

        feedback.classList.add("feedback-blink")

        setTimeout(() => {
            feedback.classList.remove("feedback-blink")
        }, 800)

        feedback.innerHTML = "Ops, uma ou mais questões estão incorretas e/ou não foram preenchidas, tente novamente.";
        botao.scrollIntoView({behavior: 'smooth'})
    }
}


function pegarElementosProva(botao) {
    let conteudoFase = botao.parentElement.parentElement
    let conteudo_fase_main = conteudoFase.querySelector('main')
    let icones = conteudoFase.getElementsByClassName('ui-icon')

    return [conteudoFase, conteudo_fase_main, icones]
}

function setarProva(botao) {
    let [conteudoFase, conteudo_fase_main, icones] = pegarElementosProva(botao) // Igual python, interessante
    let timer_feedback = document.getElementById(`info-tempo`)
    // se fosse desempactor como argumentos usario funcao(...pegarElementos(botao))

    var intervalo_verificacao = setInterval( function() {
        if (minutos >= 30) {
            entregarPorTempo(conteudoFase, intervalo_verificacao)
        }
    }, 500)
    
    Array.from(icones).forEach(icon => {
        icon.setAttribute('style', 'display: none !important;');
    })
    
    if (!aba_lateral.classList.contains('maximizado')) { // contains é a funcao certa, nao includes
        aba_lateral.classList.toggle('maximizado'); 
    }
    
    botao.disabled = 'true'
    botao.style.display = 'none'
    conteudo_fase_main.classList.remove("conteudo-bloqueado")

    conteudoFase.innerHTML += `<div class="btn-container"><button onclick="pegarInfoFormulario(formulario_fase_${fase_atual}, this, true), unsetarAmbienteProva(this)">Entregar</button></div>`; // True para os dados do form serem tratados diferentemente na funcao
}


function unsetarAmbienteProva(botao) {
    let [conteudoFase, conteudo_fase_main, icones] = pegarElementosProva(botao)

    // Array.from(icones).forEach(icon => {
    //     icon.setAttribute('style', 'display: inline !important;');
    // })
    
    conteudo_fase_main.classList.remove("conteudo-bloqueado")
    
}

function atualizarCor(fase) {
    const cores = {
        "conteudo-icon": "#84D260",
        "desafio-icon": "#ECA72C",
        "exercicio-icon": "#C02666",
        "prova-icon": "#EE5622"
    };

    const cor = cores[fase.classList[1]];

    if (cor) {
        fase.style.backgroundColor = cor;
        fase.style.outlineColor = cor;
        if (fase.classList[1] === "prova-icon") {

            fase.classList.remove('bloqueado');
        }
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}

function atualizarFaseEPontuacao(botao, pontuacao_add) {
    let conteudoFase = document.getElementById("conteudo" + fase_atual);
    let conteudo_fase_feedback = conteudoFase.querySelector('div')
    conteudo_fase_feedback.innerHTML = `<p class='feedback-fase'><small>+ ${pontuacao_add} pontos</small></p>`
    conteudoFase.querySelector(".ui-icon").scrollIntoView({ behavior: 'smooth'});

    botao.disabled = true;
    botao.style.display = 'none';

    fetch('atualizar_fase_e_pontuacao', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'pontuacao_adicional': pontuacao_add // Post pq to enviando a posicao adicional pro back
        })
    })
    .then(response => response.json())
    .then(data => { // Aqui está a resposta para debug que o back envia pro front como resposta
        console.log("Resposta recebida; Fase atual:", data.fase_atual);
        console.log("Pontuação atual do usuário após envio:", data.pontuacao_atual, "Pontuação adicionada:", data.pontuacao_adicionada);
        
    
        fase_atual = data.fase_atual;
        atualizarFases();

    
        // setTimeout(retornarAba, 1000);
    })
    .catch(error => console.error('Erro:', error));
}

/* Configurações de comportamento de input e form  */

function desativarComportamento(event) {
    if (event.key == "Enter") {
        event.preventDefault()
    }
}

const inputsText = Array.from(document.querySelectorAll('input[type="text"]'))
for (const input of inputsText) {
    input.addEventListener('keydown', desativarComportamento)
}

const formularios = document.querySelectorAll('form');

formularios.forEach((formulario) => {
    formulario.addEventListener('submit', (event) => {
        const activeElement = document.activeElement; 
        if (activeElement.tagName === "INPUT" && activeElement.type === "text") {
            event.preventDefault();
            console.log(`Envio bloqueado para o formulário com ID: ${formulario.id}`);
        }
    });
});

/* Lógica PopUps */

function setarPopup(popup) {
    popup.setAttribute('style', 'display: block !important;'); // Gambiarra, mas vai ficar aqui porque preciso terminar logo
    const button_popup = popup.querySelector('button');
    const bg = document.getElementsByClassName('mapa-container')[0];
    bg.classList.toggle('escurecedor')

    button_popup.addEventListener('click', function () { 
        popup.style.display = 'none'
        bg.classList.toggle('escurecedor')
    }) 
}

if (fase_atual == 1){
    const popup = document.getElementById('p1'); 
    setarPopup(popup)  
} 

if (fase_atual == 21){
    const popup = document.getElementById('p2');
    const video = popup.querySelector('video')
    setarPopup(popup)
} 