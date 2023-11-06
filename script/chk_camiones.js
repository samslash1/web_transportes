function chk_camiones (id_ud, nombre_ud, combus_ud) {

  // Contenedor donde se agregarán los elementos
  var cont_chk_camiones = document.getElementById('chk_camiones');
  
  // Contador para rastrear los elementos agregados
  var counter = 0;
  
  // Iterar sobre el array y crear los elementos
  for (var i = 0; i < id_ud.length; i++) {
    var id_ud_ = id_ud[i];
    var nombre_ud_ = nombre_ud[i];
    
    if (combus_ud[i] === "diesel" || combus_ud[i] === "gasolina") {
      // Crear el input radio
      var checkButton = document.createElement('input');
      checkButton.type = 'checkbox';
      checkButton.className = 'btn-check';
      checkButton.name = 'btnradio';
      checkButton.id = id_ud_;
      checkButton.value = nombre_ud_;
      checkButton.autocomplete = 'off';
      if (i === 0) {checkButton.checked = true}
    
      // Crear la etiqueta
      var label = document.createElement('label');
      label.className = 'btn btn-outline-primary';
      label.setAttribute('for', id_ud_);
      label.textContent = nombre_ud_;
    
      // Agregar el input radio y la etiqueta al contenedor
      cont_chk_camiones.appendChild(checkButton);
      cont_chk_camiones.appendChild(label);
    
    } else {
      alert(`Tipo de combustible inválido en: ${nombre_ud[i]}`)
    }

  }

}

export {chk_camiones};