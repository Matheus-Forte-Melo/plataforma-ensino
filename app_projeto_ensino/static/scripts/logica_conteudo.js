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
   botao.disabled = 'true'

    fetch('incrementar_fase', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    } )
    .then(response => response.json())
    .then(data => {
        let fase = data.fase_atual
        console.log(fase)
    })
    location.reload() 
    // Por enquanto estou usando essa solucao, ele recarrega, para que os IF's da template do django entrem em ação e façam o display correto das paginas bloqueadas/desbloqueadas
}