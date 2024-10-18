toggleTema()

function toggleTema() {
    if (localStorage.getItem('theme') == "dark") {
        document.body.classList.add('dark');
        console.log("Ativei")
    } else {
        document.body.classList.remove('dark');
    }
}


