<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "Admin123$";
$dbname = "ctos_viaje";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$campos = [
    'id_unidad', 
    'nombre',
    'tipo_unidad', 
    'uso', 
    'combustible',
    'costo_x_llanta',
    'vida_util_km_x_llanta',
    'pago_operador_x_dia',
    'pago_ayudante_x_dia',
    'linea_cel_datos_gps_mensual',
    'linea_cel_operador_mensual',
    'gps_mensual',
    'intervalo_mntto_en_km',
    'costo_mntto_x_ud',
    'depreciacion_anual',
    'cantidad_de_llantas',
    'cto_pol_seg',
    'rendimiento',
    'pago_operador'
];

$tbl_envio = $conn->query(
    "SELECT " . implode(", ", $campos) . "
    FROM uds 
    WHERE uso='envio'"
);
$datos_envio =  $tbl_envio->fetch_all(MYSQLI_ASSOC);

$tbl_custodia = $conn->query(
    "SELECT " . implode(", ", $campos) . "
    FROM uds 
    WHERE uso='custodia'"
);
$datos_custodia =  $tbl_custodia->fetch_all(MYSQLI_ASSOC);

$conn->close(); // cerrar la coneccion a la base de datos

$response = array(
    'datos_envio' => $datos_envio,
    'datos_custodia' => $datos_custodia,
);

// Configura las cabeceras HTTP para indicar que la respuesta es en formato JSON.
header('Content-Type: application/json');

// Imprime los datos en formato JSON.
echo json_encode($response);

?>