const fase_inicial = Number(document.getElementById("info-fase").getAttribute('data-inicio'));
console.log(fase_inicial);
let fase_atual = fase_inicial;
fases = document.getElementsByClassName("fase")

atualizarFases()

function atualizarFases() {
    Array.from(fases).forEach(fase => {
        // fase é o DOM inteiro da fase
        // node_fase contém o número da fase
        num_fase = Number(fase.getAttribute('data-fase'))
        conteudoFase = document.getElementById("conteudo" + num_fase)
        let estadoFase;

        if (num_fase < fase_atual) {
            estadoFase = 'Desbloqueada';
        } else if (num_fase === fase_atual) {
            estadoFase = 'Atual';
        } else {
            estadoFase = 'Bloqueada';
        }

        if (estadoFase == "Desbloqueada") {
            fase.style.backgroundColor = "teal"
            conteudoFase.innerHTML += '<br> Você concluiu essa fase!'
        } else if (estadoFase == "Atual") {
            fase.style.backgroundColor = "blue"
            conteudoFase.innerHTML += '<button onclick="incrementarFase(this)">Desbloquear proxima fase.</button>'
        } else if (estadoFase == "Bloqueada") {
            fase.style.backgroundColor = "red"
        }
            
    });
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