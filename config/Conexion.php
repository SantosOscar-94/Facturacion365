<?php

require_once("Config.php");
// Conexión a la base de datos
$connect = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Verificar si hay errores en la conexión
if ($connect->connect_errno) {
    die("Falló la conexión a la base de datos: " . $connect->connect_error);
}

// Establecer el conjunto de caracteres de la conexión
$connect->set_charset(DB_ENCODE);
//$connect->query("SET NAMES 'utf8'");
//$connect->query("SET CHARACTER SET utf8");


// Funciones para ejecutar consultas y limpiar cadenas
if (!function_exists('ejecutarConsulta')) {
    function ejecutarConsulta($sql) {
        global $connect;
        $query = $connect->query($sql);
        if (!$query) {
            die("Error en la consulta: " . $connect->error);
        }
        return $query;
    }

    function ejecutarConsultaSimpleFila($sql) {
        $result = ejecutarConsulta($sql);
        $row = $result->fetch_assoc();
        $result->free();
        return $row;
    }

    function ejecutarConsulta_retornarID($sql) {
        global $connect;
        if (!$connect->query($sql)) {
            die("Error en la consulta: " . $connect->error);
        }
        return $connect->insert_id;
    }

    function limpiarCadena($str) {
        global $connect;
        $str = mysqli_real_escape_string($connect, trim($str));
        return htmlspecialchars($str);
    }

   
}

?>
