const fase_inicial = Number(document.getElementById("info-fase").getAttribute('data-inicio'));
console.log(fase_inicial);
let fase_atual = fase_inicial;
fases = document.getElementsByClassName("fase");

atualizarFases();

function pegarInfoFormulario(form, botao) {
    const formData = new FormData(form);
    const formEntries = {};

    formData.forEach((value, key) => {
        if (formEntries[key]) {
            formEntries[key] = Array.isArray(formEntries[key]) ? [...formEntries[key], value] : [formEntries[key], value];
        } else {
            formEntries[key] = value;
        }
    });
    
    console.log(formEntries, pegarRespostasCorretas(form));
    corrigirEnvioFormulario(formEntries, pegarRespostasCorretas(form), botao, form);
}

function pegarRespostasCorretas(form) {
    const respostas_corretas = form.getElementsByClassName("c");
    const respostas_corretas_formatadas = {};

    Array.from(respostas_corretas).forEach(input => {
        respostas_corretas_formatadas[input.name] = input.getAttribute("type") !== "text" ? input.value : input.getAttribute('data-c');
    });

    return respostas_corretas_formatadas;
}

function corrigirEnvioFormulario(respostas, respostas_corretas, botao, form) {
    respostas = JSON.stringify(respostas);
    respostas_corretas = JSON.stringify(respostas_corretas);
    let feedback = form.getElementsByClassName('feedback')[0];

    if (respostas === respostas_corretas) {
        feedback.innerHTML = "Parabéns, você acertou todas as questões!";
        form.parentElement.parentElement.querySelectorAll('button').forEach(btn => btn.style.display = 'none');
        incrementarFase(botao);
    } else {
        feedback.innerHTML = "Ops, uma ou mais questões estão incorretas e/ou não foram preenchidas, tente novamente.";
    }
}

function atualizarFases() {
    Array.from(fases).forEach(fase => {
        let num_fase = Number(fase.getAttribute('data-fase'));
        let conteudoFase = document.getElementById("conteudo" + num_fase);
        let estadoFase = pegarEstadoFase(num_fase, fase_atual);

        if (estadoFase === "Desbloqueada") {
            atualizarCor(fase);
            if (!conteudoFase.innerHTML.includes('Você concluiu essa fase!')) {
                conteudoFase.innerHTML += '<p>Você concluiu essa fase!</p><br>';
            }
        } else if (estadoFase === "Atual") {
            const tipoFase = conteudoFase.classList[1];
            conteudoFase.querySelector('main').classList.remove('conteudo-bloqueado');
            conteudoFase.querySelector('div').classList.remove("feedback-estado");
            atualizarCor(fase);

            if (["exercicio", "prova"].includes(tipoFase)) {
                conteudoFase.innerHTML += `<div class="btn-container"><button onclick="pegarInfoFormulario(formulario_fase_${fase_atual}, this)">Entregar</button></div>`;
            } else if (tipoFase === "desafio") {
                conteudoFase.innerHTML += `<div class="btn-container"><button onclick="pegarInfoFormulario(formulario_fase_${fase_atual}, this)">Entregar</button><button ondblclick="this.parentElement.querySelectorAll('button').forEach(btn => btn.style.display='none'); incrementarFase(this)">Pular</button></div>`;
            } else {
                conteudoFase.innerHTML += '<div class="btn-container"><button onclick="incrementarFase(this)">Desbloquear próxima fase</button></div>';
            }
        } else if (estadoFase === "Bloqueada") {
            fase.style.backgroundColor = "var(--nao-selecionado)";
            fase.style.outlineColor = "var(--nao-selecionado)";
            document.querySelector('.prova-icon').classList.add('bloqueado');
            conteudoFase.querySelector('div').classList.add("feedback-estado");
            conteudoFase.querySelector('main').classList.add('conteudo-bloqueado');
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

function incrementarFase(botao) {
    botao.disabled = true;
    botao.style.display = 'none';

    fetch('incrementar_fase', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(response => response.json())
    .then(data => {
        fase_atual = data.fase_atual;
        atualizarFases();
    });
}

document.querySelectorAll('input[type="text"]').forEach(form => {
    form.addEventListener('keypress', function(e) {
        if (e.keycode == 13) {
            e.preventDefault();
        }
    });
});
