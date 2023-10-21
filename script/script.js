document.addEventListener('DOMContentLoaded', function () {

  // cargar datos que vienen del php
  fetch('database/conect_mysql.php') 
    .then(response => response.json())
    .then(data => {
  
      console.log(data);

      // devuelve solo los items de un diccionario 
      const listaCamiones = data.datos_camion.map(item => item.nombre);

      for (var i = 0 ; i < listaCamiones.length; i++) {
        console.log(listaCamiones[i])
      }
      
      console.log(listaCamiones);
    // variables de objetos en html
    const costoForm = document.getElementById('costoForm');

    const ctoViajeCamion = document.getElementById('ctoViajeCamion');
    const utilidadCam = document.getElementById('utilidadCam');
    const totalCamion = document.getElementById('totalCamion');

    const total_cust_tsuru = document.getElementById('total_cust_tsuru');
    const total_cust_tiida = document.getElementById('total_cust_tiida');
    const total_cust_tornado = document.getElementById('total_cust_tornado');
    const total_cust_city = document.getElementById('total_cust_city');

    const tcc_tsuru = document.getElementById('tcc_tsuru');
    const tcc_tiida = document.getElementById('tcc_tiida');
    const tcc_tornado = document.getElementById('tcc_tornado');
    const tcc_city = document.getElementById('tcc_city');

    const cust_tsuru = document.getElementById('cust_tsuru');
    const cust_tiida = document.getElementById('cust_tiida');
    const cust_tornado = document.getElementById('cust_tornado');
    const cust_city = document.getElementById('cust_city');

    const cc_tsuru = document.getElementById('cc_tsuru');
    const cc_tiida = document.getElementById('cc_tiida');
    const cc_tornado = document.getElementById('cc_tornado');
    const cc_city = document.getElementById('cc_city');

    class datosCamion {
      constructor() {

        // arrays que contienen los datos de las base de datos.
        const php_dbCamion = data.db_camion;
        
        //constantes camion
        this.costo_llanta = parseFloat(php_dbCamion[0]["importe/km"]);
        this.vida_util_km_xllanta = parseFloat(php_dbCamion[1]["importe/km"]);
        this.pago_operad_xdia = parseFloat(php_dbCamion[2]["importe/km"]);
        this.pago_ayudan_xdia =parseFloat(php_dbCamion[3]["importe/km"]);
        this.dias_xano_sdomingos = parseFloat(php_dbCamion[4]["importe/km"]);
        this.linea_cel_datos_GPS_mens_pesos = parseFloat(php_dbCamion[5]["importe/km"]);
        this.linea_cel_operador_mens = parseFloat(php_dbCamion[6]["importe/km"]);
        this.plataforma_gps_mens_uds = parseFloat(php_dbCamion[7]["importe/km"]);
      
        // arrays que contienen los datos de las base de datos.
        const php_datosCamion = data.datos_camion;
        
        // devuelve el radioboton seleccionado 
        const camion_seleccionado = document.querySelector('input[name="btnradio"]:checked');

        let id_camion;

        switch(camion_seleccionado.id) {
          case 'eco1':
            id_camion = 0;
            break;

          case 'eco2':
            id_camion = 1;
            break;

          case 'eco3':
            id_camion = 2;
            break;

          case 'eco6':
            id_camion = 3;
            break;

          case 'hino':
            id_camion = 4;
            break;

          case 'trailer':
            id_camion = 5;
            break;
        }

        this.intervalo_mntto_km = parseFloat(php_datosCamion[id_camion].intervalo_mantto_enkm);
        this.costo_mntoo_xcamion = parseFloat(php_datosCamion[id_camion].cto_mantto);
        this.depreciacion_anual = parseFloat(php_datosCamion[id_camion].depreciacion_anual); //poner el 10%
        // datos base constantes unicos del camion
        
        this.cantidad_llantas = parseFloat(php_datosCamion[id_camion].cantidad_llantas);
        this.costo_poliza_seguro_año = parseFloat(php_datosCamion[id_camion].cto_poliza_seguro);
        this.rendimiento_kml = parseFloat(php_datosCamion[id_camion].rendimiento_kmxl);
        this.pago_operador_eco = parseFloat(php_datosCamion[id_camion].pago_operador)
      } // termina constructor datosCamion

      constantes_diarias(tipo_cambio) {
        const Sueldo_y_abono_xdia_operador = this.pago_operad_xdia;
        const Sueldo_y_abono_xdia_ayudante = this.pago_ayudan_xdia;
        const linea_celular_xdia_operador = this.linea_cel_operador_mens / 30;
        const conplataforma_gps_mens_pesos =
          this.plataforma_gps_mens_uds * tipo_cambio;
        const rastreo_satelital_xdia_plat_y_datos =
          ((conplataforma_gps_mens_pesos + this.linea_cel_datos_GPS_mens_pesos) /
            30) *
          2;
        const depreciacion_diaria =
          this.depreciacion_anual / this.dias_xano_sdomingos;
        const poliza_seguro_xdia =
          this.costo_poliza_seguro_año / this.dias_xano_sdomingos;

        return (
          Sueldo_y_abono_xdia_operador +
          Sueldo_y_abono_xdia_ayudante +
          linea_celular_xdia_operador +
          rastreo_satelital_xdia_plat_y_datos +
          depreciacion_diaria +
          poliza_seguro_xdia
        );
      }

      constantes_xkm(precio_disel_xlitro) {
        const costo_total_llantas = this.costo_llanta * this.cantidad_llantas;
        const costo_diesel_xkm = precio_disel_xlitro / this.rendimiento_kml;
        const costo_xkm_llantas = costo_total_llantas / this.vida_util_km_xllanta;
        const costo_mntto_xkm =
          this.costo_mntoo_xcamion / this.intervalo_mntto_km;

        return costo_diesel_xkm + costo_xkm_llantas + costo_mntto_xkm;
      }

      variables_por_viaje(viaticos, casetasCamion) {
        // sumables
        const viaje_sencillo = this.pago_operador_eco;
        return casetasCamion + viaje_sencillo + viaticos;
      }

      costo_total_viaje(
        tipo_cambio,
        duracionDias,
        kilometros_a_recorrer,
        precio_disel_xlitro,
        viaticos,
        casetasCamion
      ) {
        const total_xdia_duracion_viaje =
          this.constantes_diarias(tipo_cambio) * duracionDias;
        const costo_total_km_recorridos =
          kilometros_a_recorrer * this.constantes_xkm(precio_disel_xlitro);
        const total_casetas_eco_viaticos_cop = this.variables_por_viaje(
          viaticos,
          casetasCamion
        );

        return (
          total_xdia_duracion_viaje +
          costo_total_km_recorridos +
          total_casetas_eco_viaticos_cop
        );
      }
    } // termina datosCamion

    class datosCustodia {
      constructor() {

        const php_dbCustodia = data.db_custodia;

        this.costoLlanta = parseFloat(php_dbCustodia[0]['importe/km']);
        this.vidaUtil_km_xllanta = parseFloat(php_dbCustodia[1]['importe/km']);
        this.pagoOperad_xdia = parseFloat(php_dbCustodia[2]['importe/km']);
        this.intervalo_mntto_km = parseFloat(php_dbCustodia[4]['importe/km']);
        this.cantidadLlantas = parseFloat(php_dbCustodia[5]['importe/km']);
        this.costo_mntoo_xauto = parseFloat(php_dbCustodia[6]['importe/km']);
        this.dias_xano_sdomingos = parseFloat(php_dbCustodia[7]['importe/km']);
        this.plataforma_gps_mens_pesos = parseFloat(php_dbCustodia[8]['importe/km']);
        this.linea_cel_datos_GPS_mens_pesos = parseFloat(php_dbCustodia[9]['importe/km']);
        this.linea_cel_operador_mens = parseFloat(php_dbCustodia[10]['importe/km']);

        const php_datosCustodia = data.datos_custodia;

        this.dtosTsuru = [
          parseFloat(php_datosCustodia[0]['depreciacion_anual']), 
          parseFloat(php_datosCustodia[0]['cto_poliza_seguro']), 
          parseFloat(php_datosCustodia[0]['rendimiento_kmxl'])
        ];
        
        this.dtosTiida = [
          parseFloat(php_datosCustodia[1]['depreciacion_anual']), 
          parseFloat(php_datosCustodia[1]['cto_poliza_seguro']), 
          parseFloat(php_datosCustodia[1]['rendimiento_kmxl'])
        ];
        
        this.dtosTornado = [
          parseFloat(php_datosCustodia[2]['depreciacion_anual']), 
          parseFloat(php_datosCustodia[2]['cto_poliza_seguro']), 
          parseFloat(php_datosCustodia[2]['rendimiento_kmxl'])
        ];

        this.dtosCity = [
          parseFloat(php_datosCustodia[3]['depreciacion_anual']), 
          parseFloat(php_datosCustodia[3]['cto_poliza_seguro']), 
          parseFloat(php_datosCustodia[3]['rendimiento_kmxl'])
        ];

      } //termina constructor datosCustodia

      // comiensan los metodos
      const_diarias() {
        const sueldo_ybono_xdia_oper = this.pagoOperad_xdia;
        const linea_celular_xdia_operador = this.linea_cel_operador_mens / 30;
        const rastreo_satelital_xdia_plat_y_datos =
          (this.plataforma_gps_mens_pesos + this.linea_cel_datos_GPS_mens_pesos) /
          30;

        return (
          sueldo_ybono_xdia_oper +
          linea_celular_xdia_operador +
          rastreo_satelital_xdia_plat_y_datos
        );
      }

      const_diarias_xauto(valores, dias_xano_sdomingos) {
        return (valores[0] + valores[1]) / dias_xano_sdomingos;
      }

      suma_diaria() {
        return {
          tsuru:
            this.const_diarias() +
            this.const_diarias_xauto(this.dtosTsuru, this.dias_xano_sdomingos),

          tiida:
            this.const_diarias() +
            this.const_diarias_xauto(this.dtosTiida, this.dias_xano_sdomingos),

          tornado:
            this.const_diarias() +
            this.const_diarias_xauto(this.dtosTornado, this.dias_xano_sdomingos),

          city:
            this.const_diarias() +
            this.const_diarias_xauto(this.dtosCity, this.dias_xano_sdomingos),
        };
      }

      cons_xkm(precioGasolina) {
        const costoLlantas = this.costoLlanta * this.cantidadLlantas;
        const costoPorKmLlantas = costoLlantas / this.vidaUtil_km_xllanta; // Vida útil de las llantas en km
        const costoMantenimientoPorKm =
          this.costo_mntoo_xauto / this.intervalo_mntto_km; // Costo de mantenimiento por cada

        const suma_constantes_km = costoPorKmLlantas + costoMantenimientoPorKm;

        return {
          tsuru: suma_constantes_km + precioGasolina / this.dtosTsuru[2],
          tiida: suma_constantes_km + precioGasolina / this.dtosTiida[2],
          tornado: suma_constantes_km + precioGasolina / this.dtosTornado[2],
          city: suma_constantes_km + precioGasolina / this.dtosCity[2],
        };
      }

      costo_total_viajeCustodia(
        precioGasolina,
        duracionDias,
        kmRecorrer,
        montoCasetas,
        viaticosCustidia
      ) {
        const sumaxkm = this.cons_xkm(precioGasolina);
        const sumaDiaria = this.suma_diaria();
        const var_xviaje = montoCasetas + viaticosCustidia;

        function calculo(auto) {
          const total_xdia_duracion_viaje = sumaDiaria[auto] * duracionDias;
          const costo_total_km_recorridos = sumaxkm[auto] * kmRecorrer;

          return (
            total_xdia_duracion_viaje + costo_total_km_recorridos + var_xviaje
          );
        }

        return {
          tsuru: calculo('tsuru'),
          tiida: calculo('tiida'),
          tornado: calculo('tornado'),
          city: calculo('city'),
        };
      }
    } // termina datosCustodia

    function calculoGatos () {

      // variables camion
      const precio_disel_xlitro = parseFloat(
        document.getElementById('precioDiesel').value);

      const casetasCamion = parseFloat(
        document.getElementById('montoCasetasCamion').value);
        
      const viaticos = parseFloat(
        document.getElementById('viaticosCamion').value);

      // variables custidia
      const precioGasolina = parseFloat(
        document.getElementById('precioGasolina').value);

      const montoCasetas = parseFloat(
        document.getElementById('montoCasetasCus').value);

      const viaticosCustidia = parseFloat(
        document.getElementById('viaticosCus').value);

      // variables generales
      const tipo_cambio = parseFloat(document.getElementById('tipoCambio').value);
      const kmRecorrer = parseFloat(document.getElementById('kmRecorrer').value);
      const duracionDias = parseFloat(document.getElementById('duracionDias').value);

      // calculo camion
      camion = new datosCamion();
      costoCamion = camion.costo_total_viaje(
        tipo_cambio,
        duracionDias,
        kmRecorrer,
        precio_disel_xlitro,
        viaticos,
        casetasCamion
      );

      const porcUtilidad = 0.35;
      const costoUtilidad = costoCamion * porcUtilidad;
      const costoTotalCamion = costoCamion + costoUtilidad;

      ctoViajeCamion.textContent = `${costoCamion
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      utilidadCam.textContent = `${costoUtilidad
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      totalCamion.textContent = `${costoTotalCamion
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      // calculo custodia
      custodia = new datosCustodia();
      costoTotalCustodia = custodia.costo_total_viajeCustodia(
        precioGasolina,
        duracionDias,
        kmRecorrer,
        montoCasetas,
        viaticosCustidia
      );

      const tsuru = costoTotalCustodia.tsuru;
      const tiida = costoTotalCustodia.tiida;
      const tornado = costoTotalCustodia.tornado;
      const city = costoTotalCustodia.city;

      total_cust_tsuru.textContent = `${tsuru
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      total_cust_tiida.textContent = `${tiida
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      total_cust_tornado.textContent = `${tornado
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      total_cust_city.textContent = `${city
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      const var_tcc_tsuru = costoCamion + tsuru;
      const var_tcc_tidda = tiida + costoCamion;
      const var_tcc_tornado = costoCamion + tornado;
      const var_tcc_city = costoCamion + city;

      const var_cust_tsuru = tsuru / 2;
      const var_cust_tidda = tiida / 2;
      const var_cust_tornado = tornado / 2;
      const var_cust_city = city / 2;

      const var_cc_tsuru = costoCamion + var_cust_tsuru;
      const var_cc_tidda = costoCamion + var_cust_tidda;
      const var_cc_tornado = costoCamion + var_cust_tornado;
      const var_cc_city = costoCamion + var_cust_city;

      tcc_tsuru.textContent = `${var_tcc_tsuru
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      tcc_tiida.textContent = `${var_tcc_tidda
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      tcc_tornado.textContent = `${var_tcc_tornado
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      tcc_city.textContent = `${var_tcc_city
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      cust_tsuru.textContent = `${var_cust_tsuru
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      cust_tiida.textContent = `${var_cust_tidda
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      cust_tornado.textContent = `${var_cust_tornado
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      cust_city.textContent = `${var_cust_city
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

      cc_tsuru.textContent = `${var_cc_tsuru
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      cc_tiida.textContent = `${var_cc_tidda
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      cc_tornado.textContent = `${var_cc_tornado
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
      cc_city.textContent = `${var_cc_city
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

    } // termina funcion calculoGastos


    costoForm.addEventListener('submit', function (e) {
      e.preventDefault();

      calculoGatos ();

    }); // termina evento submit
    





  }) 
  .catch(error => {
    console.error('Hubo un error:', error);
  })


});
