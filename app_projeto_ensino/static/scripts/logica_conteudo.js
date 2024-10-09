const fase_inicial = Number(document.getElementById("info-fase").getAttribute('data-inicio'));
console.log(fase_inicial);
let fase_atual = fase_inicial;
fases = document.getElementsByClassName("fase")

atualizarFases() // Ja atualiza no começo, depois atualiza quando clicamos para passar. Tudo usa como base o django o valor no tempalte do django, então uma dessincronizaçao é improvavel

function atualizarFases() {
    Array.from(fases).forEach(fase => {
        // fase é o DOM inteiro da fase
        // node_fase contém o número da fase
        num_fase = Number(fase.getAttribute('data-fase'))
        conteudoFase = document.getElementById("conteudo" + num_fase)
        let estadoFase = pegarEstadoFase(num_fase, fase_atual);

        if (estadoFase == "Desbloqueada") {
            atualizarCor(fase)
            conteudoFase.innerHTML += '<br> Você concluiu essa fase!'
        } else if (estadoFase == "Atual") {
            atualizarCor(fase)
            conteudoFase.innerHTML += '<button onclick="incrementarFase(this)">Desbloquear proxima fase.</button>'
        } else if (estadoFase == "Bloqueada") {
            fase.style.backgroundColor = "grey"
            fase.style.outlineColor = "grey"
            document.querySelector('.prova-icon').classList.add('bloqueado'); // Workaround fudido
        }
            
    });
}

function pegarEstadoFase(num_fase, fase_atual) {
    if (num_fase < fase_atual) {
        return 'Desbloqueada';
    } else if (num_fase === fase_atual) {
        return 'Atual';
    } else {
        return 'Bloqueada';
    }
}

function atualizarCor(fase) {
    if (fase.classList[1] == "conteudo-icon") {
        fase.style.backgroundColor = "#84D260"
        fase.style.outlineColor = "#84D260"
    } 
    
    if (fase.classList[1] == "desafio-icon") {
        fase.style.backgroundColor = "#ECA72C"
        fase.style.outlineColor = "#ECA72C"
    } 
    
    if (fase.classList[1] == "exercicio-icon") {
        fase.style.backgroundColor = "#C02666"
        fase.style.outlineColor = "#C02666"
    } 
    
    if (fase.classList[1] == "prova-icon") {
        fase.classList.remove('bloqueado')
        fase.style.backgroundColor = "#EE5622"
        fase.style.outlineColor = "#EE5622"
    }
}

// Função que serve para pegar o cookie com o token csrf, porque o django é cu doce
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function incrementarFase(botao) {
   // Desabilita o botão para que o usuario nao possa ficar espamando essa porra
   botao.disabled = 'true';
   botao.style.display = 'none';

    fetch('incrementar_fase', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    } )
    .then(response => response.json())
    .then(data => {
        fase_atual = data.fase_atual // Atualiza a fase atual setada anteriormente com o valor incrementado
        console.log(fase_atual)
        atualizarFases()
    })
}