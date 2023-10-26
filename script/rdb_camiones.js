function rdb_camiones (options_camiones) {

  // Contenedor donde se agregarán los elementos
  var cont_rdb_camiones = document.getElementById('rdb_camiones');
  
  // Contador para rastrear los elementos agregados
  var counter = 0;
  
  // Iterar sobre el array y crear los elementos
  for (var i = 0; i < options_camiones.length; i++) {
    var option = options_camiones[i];
  
    // Crear el input radio
    var radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.className = 'btn-check';
    radioButton.name = 'btnradio';
    radioButton.id = option;
    radioButton.autocomplete = 'off';
    if (i === 0) {radioButton.checked = true}
  
    // Crear la etiqueta
    var label = document.createElement('label');
    label.className = 'btn btn-outline-primary';
    label.setAttribute('for', option);
    label.textContent = option;
  
    // Agregar el input radio y la etiqueta al contenedor
    cont_rdb_camiones.appendChild(radioButton);
    cont_rdb_camiones.appendChild(label);
  
  }

}

export {rdb_camiones};