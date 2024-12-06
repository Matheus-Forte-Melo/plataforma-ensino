let switch_modo_escuro = document.getElementById('chk')
let botao_save = document.getElementById('save-btn')
let modo_escuro;


if (localStorage.getItem('theme') == "dark") {
   switch_modo_escuro.checked = true
   modo_escuro = true
}

if (localStorage.getItem('theme') == "light" || localStorage.getItem('theme') == null ) {
    modo_escuro = false
}


switch_modo_escuro.addEventListener('click', function() {
    modo_escuro = !modo_escuro; // gambiarra
    toggleTema();
});


function salvarAlteracoes() {
    localStorage.setItem('theme', modo_escuro ? "dark" : "light"); // Se modo escuro, dark, senão, light
}

function resetarTema() {
    localStorage.setItem('theme', "light");
}
