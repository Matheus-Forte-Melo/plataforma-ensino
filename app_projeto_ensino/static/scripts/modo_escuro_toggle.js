toggleTema()

function toggleTema() {
    if (localStorage.getItem('theme') == "dark") {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}






