function fecharJanela() {
    window.close();
}

var isFullScreen = false;

document.getElementById("alternarTelaCheia").addEventListener("click", function() {
var element = document.documentElement; 

    if (!isFullScreen) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {  // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {  // Chrome, Safari e Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {  // Internet Explorer
            element.msRequestFullscreen();
        }
        isFullScreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {  // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {  // Chrome, Safari e Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {  // Internet Explorer
            document.msExitFullscreen();
        }
        isFullScreen = false;
    }
});



