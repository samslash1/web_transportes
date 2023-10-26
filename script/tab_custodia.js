function tab_custodia(custodia_) {
    var tabla = document.getElementById('tab_custodia');
    var tabla_totales = document.getElementById('tab_totales');

    const conceptosTotales = [
    'Traslado Camion + Custodia', 
    '50% de custodia', 
    'Costo de camion + 50% de custodia'
    ];

    console.log(conceptosTotales);
    for (var i = 0; i < custodia_.length; i++ ) {
        const coche = custodia_[i];

        // coloca encabezados
        var encabezado = document.createElement('th');
        encabezado.className = 'text-900 text-center col-1';
        encabezado.textContent = coche.nombre;
        tabla.querySelector('thead tr').appendChild(encabezado);
        
        // coloca fila
        var fila = document.createElement('td');
        fila.id = coche.nombre;
        fila.className = 'text-center';
        fila.textContent = '-';
        tabla.querySelector('tbody tr').appendChild(fila)

        // tabla de totales
        if (i==0) {
            var enc_totales = document.createElement('th');
            enc_totales.className = 'text-900 text-center col-1';
            enc_totales.textContent = " ";
            tabla_totales.querySelector('thead tr').appendChild(enc_totales);
        }

        var enc_totales = document.createElement('th');
        enc_totales.className = 'text-900 text-center col-1';
        enc_totales.textContent = coche.nombre;
        tabla_totales.querySelector('thead tr').appendChild(enc_totales);

        for (var e=0; e < conceptosTotales.length; i++) {
            const concepto = conceptosTotales[e];
            
            console.log(concepto)

        }



        
    }








}

export {tab_custodia};

