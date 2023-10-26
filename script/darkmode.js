const themeController = document.getElementById('switchDarkMode');
const elemento = document.getElementById("html"); 
const logotipo = document.getElementById('logotipo')

themeController.addEventListener("change", function(event){

    if (event.target.checked) {
        // Cambia el valor del atributo data-bs-theme a "dark"
        elemento.setAttribute("data-bs-theme", "dark");
        logotipo.setAttribute("src", "images/Logo Fut Horizontal light.png")

    } else {
        elemento.dataset.bsTheme = "light";
        logotipo.setAttribute("src", "images/Logo Fut Horizontal dark.png")

    }

})
