// FUNÇÃO DO BOTÃO DE FECHAR PRESENTE NO HEADER
function fecharJanela() {
    window.close();
}

// BOTÃO RESIZABLE PRESENTE NO HEADER
var isFullScreen = false;

document.getElementById("alternarTelaCheia").addEventListener("click", function() {
var element = document.documentElement; 

    if (!isFullScreen) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {  // Chrome, Safari e Opera
            element.webkitRequestFullscreen();
        } 
        isFullScreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {  // Chrome, Safari e Opera
            document.webkitExitFullscreen();
        } 
        isFullScreen = false;
    }
});