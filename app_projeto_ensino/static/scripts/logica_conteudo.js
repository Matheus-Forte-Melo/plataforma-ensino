const fase_inicial = Number(document.getElementById("info-fase").getAttribute('data-inicio'));
console.log(fase_inicial);
let fase_atual = fase_inicial;
fases = document.getElementsByClassName("fase")

atualizarFases()

function pegarInfoFormulario(form, botao) {
    const formData = new FormData(form); // Cria um objeto FormData com os dados do formulário
    const formEntries = {}; // Objeto para armazenar as respostas

    // Converte os dados em um objeto de chave-valor
    formData.forEach((value, key) => {
      // Verifica se a chave já existe (para campos com múltiplos valores, como checkboxes)
      if (formEntries[key]) {
        if (Array.isArray(formEntries[key])) {
          formEntries[key].push(value); // Adiciona o valor em um array se já houver múltiplos valores
        } else {
          formEntries[key] = [formEntries[key], value]; // Converte para array se já houver um valor
        }
      } else {
        formEntries[key] = value; // Adiciona o valor normalmente
      }
    });
    
    console.log(formEntries, pegarRespostasCorretas(form))
    corrigirEnvioFormulario(formEntries, pegarRespostasCorretas(form), botao)
  }


// Pega as respostas corretas de um formulario e as transforma em um objeto para comparação.
function pegarRespostasCorretas(form) {
    const respostas_corretas = form.getElementsByClassName("c");
    const respostas_corretas_formatadas = {};
    
    for (let index = 0; index < respostas_corretas.length; index++) {
        const input = respostas_corretas[index]
        
        if (input.getAttribute("type") != "text") {
            respostas_corretas_formatadas[input.name] = input.value
        } else {
            respostas_corretas_formatadas[input.name] = input.getAttribute('data-c')
        }
        
    }

    return respostas_corretas_formatadas;

}
        
// Pega as respostas enviadas + as respostas corretas e as compara, passando o usuario de nível se estiverem corretas
function corrigirEnvioFormulario(respostas, respostas_corretas, botao) {
    respostas = JSON.stringify(respostas);
    respostas_corretas = JSON.stringify(respostas_corretas);

    if (respostas === respostas_corretas) {
        console.log("Respostas corretas")
        incrementarFase(botao)
    }
    else {
        console.log("Respostas incorretas")
    }
}

function atualizarFases() {
    Array.from(fases).forEach(fase => {
        // fase é o DOM inteiro da fase
        // node_fase contém o número da fase
        num_fase = Number(fase.getAttribute('data-fase'))
        conteudoFase = document.getElementById("conteudo" + num_fase)
        let estadoFase = pegarEstadoFase(num_fase, fase_atual);

        if (estadoFase == "Desbloqueada") { 
            // Ou precisa ser executado uma vez por fase ou precisa substituir invez de adicionar o atual.
            atualizarCor(fase)
            console.log('O conteudo ' + num_fase + " foi atualizado." )
            if (!conteudoFase.innerHTML.includes('Você concluiu essa fase!')) {
                conteudoFase.innerHTML += '<p>Você concluiu essa fase!</p> <br>'
            }
        
        } else if (estadoFase == "Atual") { // Adicionar algo para diferenciar fases com resposta e fases com conteudo
            const tipoFase = conteudoFase.classList[1];  
            atualizarCor(fase)
            if (tipoFase == "desafio" || tipoFase == "atividade" || tipoFase == "prova")  {
                conteudoFase.innerHTML += `<div><input type="button" value="Entregar" onclick="pegarInfoFormulario(${"formulario_fase_" + fase_atual}, this)"></input></div>`;
            }
            else {
                conteudoFase.innerHTML += '<div><button onclick="incrementarFase(this)">Desbloquear proxima fase.</button></div>'
            }   
        } else if (estadoFase == "Bloqueada") {
            fase.style.backgroundColor = "var(--nao-selecionado)"
            fase.style.outlineColor = "var(--nao-selecionado)"
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


// Prevenção de comportamentos default de formulários

document.querySelectorAll('input[type="text"]').forEach(form => {
    form.addEventListener('keypress', function(e) {
        try {
            if (e.keycode == 13) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false)
            }
        }
        catch(err) {
            console.log(err.message)
        }
    })
})
