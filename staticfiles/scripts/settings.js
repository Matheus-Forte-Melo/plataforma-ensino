let switch_modo_escuro = document.getElementById('chk')
let botao_save = document.getElementById('save-btn')
let modo_escuro;

console.log(localStorage.getItem('theme'))

if (localStorage.getItem('theme') == "dark") {
   switch_modo_escuro.checked = true
   modo_escuro = true
}

if (localStorage.getItem('theme') == "light" || localStorage.getItem('theme') == null ) {
    modo_escuro = false
}


switch_modo_escuro.addEventListener('click', function() {
    modo_escuro = !modo_escuro; // gambiarra
    console.log(modo_escuro ? "Modo escuro ativado" : "Modo claro ativado"); // Se modo escuro, modo escuro ativado, senao, modo claro ativado
    toggleTema();
});


function salvarAlteracoes() {
    console.log("Salvando alterações...");
    localStorage.setItem('theme', modo_escuro ? "dark" : "light"); // Se modo escuro, dark, senão, light
    console.log("Tema salvo como:", localStorage.getItem('theme'));
}

function resetarTema() {
    localStorage.setItem('theme', "light");
}
