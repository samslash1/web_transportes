import {chk_camiones} from './chk_camiones.js';
import {tab_custodia} from './tab_custodia.js';

document.addEventListener('DOMContentLoaded', function () {
  
  // cargar datos que vienen del php
  fetch('database/conect_db.php') 
  .then(response => response.json())
  .then(data => {

    // devuelve solo los items de un diccionario 
    const id_ud = data.datos_envio.map(item => item.id_unidad);
    const nombre_ud = data.datos_envio.map(item => item.nombre);
    const combus_ud = data.datos_envio.map(item => item.combustible);
    
    chk_camiones (id_ud, nombre_ud, combus_ud); // coloca los checkbox
    
    // esta funcion coloca la tabla de autos custodios
    const conceptosTotales = tab_custodia(data.datos_custodia);

    // variables de objetos en html
    const costoForm = document.getElementById('costoForm');
    // los checkbox
    const chkbotons = document.querySelectorAll('input[name="btnradio"]');
    // lugares donde van las tablas
    const ctoViajeEnvio = document.getElementById('ctoViajeEnvio');
    const utilidadCam = document.getElementById('utilidadCam');
    const totalCamion = document.getElementById('totalCamion');

    class calculo {
      constructor(unidad) {
        this.costo_llanta = parseFloat(unidad.costo_x_llanta);
        this.vida_util_km_xllanta = parseFloat(unidad.vida_util_km_x_llanta);
        this.pago_operad_xdia = parseFloat(unidad.pago_operador_x_dia);
        this.pago_ayudan_xdia = parseFloat(unidad.pago_ayudante_x_dia);
        this.dias_xano_sdomingos = parseFloat(313);
        this.linea_cel_datos_GPS_mens_pesos = parseFloat(unidad.linea_cel_datos_gps_mensual);
        this.linea_cel_operador_mens = parseFloat(unidad.linea_cel_operador_mensual);
        this.plataforma_gps_mens_pesos = parseFloat(unidad.gps_mensual);

        this.intervalo_mntto_km = parseFloat(unidad.intervalo_mntto_en_km);
        this.costo_mntoo_xunidad = parseFloat(unidad.costo_mntto_x_ud);
        this.depreciacion_anual = parseFloat(unidad.depreciacion_anual); //poner el 10%

        this.cantidad_llantas = parseFloat(unidad.cantidad_de_llantas);
        this.costo_poliza_seguro_año = parseFloat(unidad.cto_pol_seg);
        this.rendimiento_kml = parseFloat(unidad.rendimiento);
        this.pago_operador_eco = parseFloat(unidad.pago_operador)
      } // termina constructor datosCamion

      constantes_diarias() {
        const Sueldo_y_abono_xdia_operador = this.pago_operad_xdia;
        const Sueldo_y_abono_xdia_ayudante = this.pago_ayudan_xdia;
        const linea_celular_xdia_operador = this.linea_cel_operador_mens / 30;
        const rastreo_satelital_xdia_plat_y_datos =
          ((this.plataforma_gps_mens_pesos + this.linea_cel_datos_GPS_mens_pesos) / 30) * 2;
        const depreciacion_diaria =
          this.depreciacion_anual / this.dias_xano_sdomingos;
        const poliza_seguro_xdia =
          this.costo_poliza_seguro_año / this.dias_xano_sdomingos;

        const resultado = (
          Sueldo_y_abono_xdia_operador +
          Sueldo_y_abono_xdia_ayudante +
          linea_celular_xdia_operador +
          rastreo_satelital_xdia_plat_y_datos +
          depreciacion_diaria + poliza_seguro_xdia);
        
        return resultado
      }

      constantes_xkm(precio_combus_xlitro) {
        const costo_total_llantas = this.costo_llanta * this.cantidad_llantas;
        const costo_combus_xkm = precio_combus_xlitro / this.rendimiento_kml;
        const costo_xkm_llantas = costo_total_llantas / this.vida_util_km_xllanta;
        const costo_mntto_xkm = this.costo_mntoo_xunidad / this.intervalo_mntto_km;

        return costo_combus_xkm + costo_xkm_llantas + costo_mntto_xkm;
      }

      variables_por_viaje(viaticos, casetasCamion) {
        // sumables
        const viaje_sencillo = this.pago_operador_eco;
        return casetasCamion + viaje_sencillo + viaticos;
      }

      costo_total_viaje(
        duracionDias, 
        kilometros_a_recorrer,
        precio_combus_xlitro, 
        viaticos, 
        casetasCamion) {
        const total_xdia_duracion_viaje = this.constantes_diarias() * duracionDias;
        const costo_total_km_recorridos = kilometros_a_recorrer * this.constantes_xkm(precio_combus_xlitro);
        const total_casetas_eco_viaticos_cop = this.variables_por_viaje(viaticos, casetasCamion);

        return (
          total_xdia_duracion_viaje + costo_total_km_recorridos + total_casetas_eco_viaticos_cop);
      }
    } // termina datosCamion

    function calculoGatos () {

      // variables camion
      const precio_disel_xlitro = parseFloat(
        document.getElementById('precioDiesel').value);

      const casetas_camion = parseFloat(
        document.getElementById('casetas_camion').value);
        
      const casetas_auto = parseFloat(
        document.getElementById('casetas_auto').value);

      const casetas_camioneta = parseFloat(
        document.getElementById('casetas_camioneta').value);
          
      const viaticos = parseFloat(
        document.getElementById('viaticosEnvio').value);

      const precioGasolina = parseFloat(
        document.getElementById('precioGasolina').value);


      const viaticosCustidia = parseFloat(
        document.getElementById('viaticosCus').value);

      // variables generales
      const kmRecorrer = parseFloat(document.getElementById('kmRecorrer').value);
      const duracionDias = parseFloat(document.getElementById('duracionDias').value);

      /*  ###################################################  */

      // array que contienen los datos de las base de datos.
      const php_db = data.datos_envio;
      // obtiene los checkboxes con el name "btnradio"
      const checkboxes = document.querySelectorAll('input[name="btnradio"]:checked');
      const unidad_seleccionada = [];
      // almacena en una lista los id de cada checkbox
      checkboxes.forEach(checkbox => {
          unidad_seleccionada.push(checkbox.id);
      });

      let sumaCostos = 0

      for (let e = 0; e < unidad_seleccionada.length; e++) {
        let unidad = php_db.find(ud => ud.id_unidad === unidad_seleccionada[e] )

        let combustible_ud;
        switch (unidad.combustible) {
          case 'diesel' :
            combustible_ud = precio_disel_xlitro;
            break;

          case 'gasolina' :
            combustible_ud = precioGasolina;
            break;
        }

        let casetas;
        switch (unidad.tipo_unidad) {
          case 'camion' :
            casetas = casetas_camion;
            break;

          case 'camioneta' :
            casetas = casetas_camioneta;
            break;

          case 'auto' :
            casetas = casetas_auto;
            break;
        }

        // calculo camion
        const envio = new calculo(unidad);
        const costoEnvio = envio.costo_total_viaje( 
          duracionDias,
          kmRecorrer,
          combustible_ud,
          viaticos,
          casetas);

        sumaCostos += costoEnvio
      }

      const porcUtilidad = 0.35;
      const costoUtilidad = sumaCostos * porcUtilidad;
      const costoTotalCamion = sumaCostos + costoUtilidad;

      ctoViajeEnvio.textContent = `${sumaCostos
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      utilidadCam.textContent = `${costoUtilidad
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      totalCamion.textContent = `${costoTotalCamion
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      /*  ###################################################  */

      // calculo custodia
        
      const php_db_cust = data.datos_custodia;

      let var_tcc_coche = 0 ;
      let var_cust_coche = 0;
      let var_cc_coche = 0;

      function totales_generales (importe, id_concepto, id_cust) {

        const total = document.getElementById(id_concepto + '_' + id_cust);//elemento del html

        total.textContent = `${importe
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      }

      for (let i = 0; i < php_db_cust.length; i++ ) {
        let ud_custodia = php_db_cust[i]

        let comb_custudia;
        switch (ud_custodia.combustible) {
          case 'diesel' :
            comb_custudia = precio_disel_xlitro;
            break;

          case 'gasolina' :
            comb_custudia = precioGasolina;
            break;
        }

        let casetas_cust;
        switch (ud_custodia.tipo_unidad) {
          case 'camion' :
            casetas_cust = casetas_camion;
            break;

          case 'camioneta' :
            casetas_cust = casetas_camioneta;
            break;

          case 'auto' :
            casetas_cust = casetas_auto;
            break;
        }
        const custodia = new calculo(ud_custodia);
        const costoTotalCustodia = custodia.costo_total_viaje( 
          duracionDias,
          kmRecorrer,
          comb_custudia,
          viaticos,
          casetas_cust);

          const id_cust = ud_custodia.id_unidad
          const id_total_cust = document.getElementById(id_cust) 

          // total de cada custodia
          id_total_cust.textContent =  `${costoTotalCustodia
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  
          // calculos por concepto de cada custodia
          var_tcc_coche = (sumaCostos + costoTotalCustodia);
          totales_generales(var_tcc_coche, conceptosTotales[0].id, id_cust);
  
          var_cust_coche = (costoTotalCustodia / 2);
          totales_generales(var_cust_coche, conceptosTotales[1].id, id_cust);
  
          var_cc_coche = (sumaCostos + var_cust_coche)
          totales_generales(var_cc_coche, conceptosTotales[2].id, id_cust);

      }

    } // termina funcion calculoGastos

    costoForm.addEventListener('submit', function (e) {
      e.preventDefault();

      calculoGatos ();

    }); // termina evento submit

    // por cada cambio en los checkbox
    chkbotons.forEach(function(chkbotons) {
      chkbotons.addEventListener('change', function(e){
        e.preventDefault();

        calculoGatos ();

      })
    })  // termina seleccionar checkbox
    
  }) 
  .catch(error => {
    console.error('Hubo un error:', error);
  })

});
