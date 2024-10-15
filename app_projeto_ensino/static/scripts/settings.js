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

// Listener para alternar o tema
switch_modo_escuro.addEventListener('click', function() {
    modo_escuro = !modo_escuro; // Inverte o valor de modo_escuro
    console.log(modo_escuro ? "Modo escuro ativado" : "Modo claro ativado");
    toggleTema();
});

// Salva as alterações no localStorage
function salvarAlteracoes() {
    console.log("Salvando alterações...");
    localStorage.setItem('theme', modo_escuro ? "dark" : "light");
    console.log("Tema salvo como:", localStorage.getItem('theme'));
}
