function tab_custodia(custodia_) {
    var tabla = document.getElementById('tab_custodia');
    var tabla_totales = document.getElementById('tab_totales');

    const conceptosTotales = [
    {'concepto': 'Traslado Camion + Custodia', 'id' : 'tcc' }, 
    {'concepto': '50% de custodia', 'id' : 'cust' }, 
    {'concepto': 'Costo de camion + 50% de custodia', 'id' : 'cc' }];

    for (var i = 0; i < custodia_.length; i++ ) {
        const coche = custodia_[i];

        // coloca encabezados
        var encabezado = document.createElement('th');
        encabezado.className = 'text-900 text-center col-1';
        encabezado.textContent = coche.nombre;
        tabla.querySelector('thead tr').appendChild(encabezado);

        // coloca fila
        var fila = document.createElement('td');
        fila.id =  coche.id_unidad;
        fila.className = 'text-center';
        fila.textContent = '-';
        tabla.querySelector('tbody tr').appendChild(fila)

        // tabla de totales - solo encabezados
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
    }

    // este for coloca las filas y asigna los id de los valores del calculo
    for (var e = 0; e < conceptosTotales.length; e++ ) {
        const concepto = conceptosTotales[e]; // el array de los conceptos de los totales 

        var fila_totales = document.createElement('tr'); //agrega fila por cada concepto
        fila_totales.id = concepto.id; // le asigna un id segun el array de conceptos
        tabla_totales.querySelector('tbody').appendChild(fila_totales); // es la tabla donde se agregan los totales
        
        // este for recorre el array de los coches, para ir agregando una columna por coche, mas el concepto
        for (var i = 0; i < custodia_.length; i++ ) {
            const coche = custodia_[i];
            var tr_fila_totales = document.getElementById(concepto.id); // es la fila antes agregada

            // este if agrega el concepto del calculo en la primera columna 
            if (i==0) {
                var column_totales = document.createElement('th'); // agrega una columna 
                column_totales.textContent = concepto.concepto; 
                tr_fila_totales.appendChild(column_totales); // lo agrega en la fila
            } 

            var column_totales = document.createElement('th'); // agrega una columna 
            column_totales.id = concepto.id + '_' + coche.id_unidad;
            column_totales.className = 'text-center';
            column_totales.textContent = '-';
        
            tr_fila_totales.appendChild(column_totales);
        }
    }
    return conceptosTotales;
}
export {tab_custodia};

