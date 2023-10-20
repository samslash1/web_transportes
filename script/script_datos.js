document.addEventListener('DOMContentLoaded', function () {
     
    fetch('resultado.php') 
        .then(response => response.json())
        .then(data => {
            
            // Ahora puedes trabajar con tus datos en JavaScript.
            const datosCamion = data.datos_camion;
            const datosCustodia = data.datos_custodia;
            const dbCamion = data.db_camion;
            const dbCustodia = data.db_custodia;

            // Ejemplo: Imprimir uno de los arrays.
            console.log('Datos del datosCamion:', datosCamion);
            console.log('Datos del datosCustodia:', datosCustodia);
            console.log('Datos del dbCamion:', dbCamion);
            console.log('Datos del dbCustodia:', dbCustodia);

            
            console.log(datosCustodia[2].nombre);
        })


        
        .catch(error => {
            console.error('Hubo un error:', error);
        });
        
});

