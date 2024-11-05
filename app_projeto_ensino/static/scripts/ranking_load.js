let leaderboard = document.getElementById('leaderboard');
var offset = 10;

async function carregarMais(botao) {
    
    botao.innerHTML = `<div class="dot-falling"></div>`;

    // const pausar = (tempo) => {
    //     return new Promise(resolve => setTimeout(resolve, tempo));
    // };

    // await pausar(10000); 
    
    try {
        const response = await fetch(`mostrar_mais_leaderboard/?offset=${offset}`);
        offset += 10; 

        if (response.ok) {
            let data = await response.json();
            data = data.data;
            mostrarDadosLeaderBoard(data, botao);
        }
    } catch (error) {
        console.log("[DEBUG] Erro: " + error);
    } finally {
        //  texto do botão para "Mostrar mais" após o carregamento
        botao.textContent = "Mostrar mais";
    }
}

function mostrarDadosLeaderBoard(data, botao) {
    if (data.length > 0) {
        let pos_leaderboard = offset - 10;

        for (user of data) {
            pos_leaderboard++;

            leaderboard.innerHTML += `<a href="/profile/${user.id}"><div class="ranking"><div class="ranking-pos-avatar"><div> ${pos_leaderboard}° </div><div class="loaded-avatars" id="${user.avatar}"></div></div><div class="ranking-info"><p>${user.username}</p><p>fase ${user.fase}</p><p>${user.pontuacao} pontos</p></div></div></a>`;
        }
    } else {
        let main = botao.parentElement;
        botao.style.display = 'none';
        main.innerHTML += "<p style='text-align: center;'>Não existem mais usuários.</p>";
    }
}
