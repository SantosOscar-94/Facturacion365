<?php 
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";

Class Cajachica
{
	//Implementamos nuestro constructor
	public function __construct()
	{

	}

    public function TotalVentas($idusuario, $idsaldoini){
        try {
            // Validar y limpiar datos
            $idusuario = filter_var($idusuario, FILTER_SANITIZE_NUMBER_INT);
            $idsaldoini = filter_var($idsaldoini, FILTER_SANITIZE_NUMBER_INT);
            // Obtener la fecha actual en formato MySQL
            $fecha_actual = date('Y-m-d');
    
            // Consulta SQL
            $sql = "
            SELECT 
                ROUND(SUM(total_venta), 2) as total_venta,
                (SELECT SUM(ingreso) FROM insumos WHERE DATE(fecharegistro) = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini') as ingreso,
                (SELECT SUM(gasto) FROM insumos WHERE DATE(fecharegistro) = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini') as egreso,
                (SELECT saldo_inicial FROM saldocaja WHERE fecha_creacion = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini' LIMIT 1) as saldo_inicial
            FROM (
                SELECT ROUND(SUM(importe_total_venta_27), 2) as total_venta
                FROM factura 
                WHERE DATE(fecha_emision_01) = '$fecha_actual' AND estado IN ('5','1','6') AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
                UNION ALL
                SELECT ROUND(SUM(importe_total_23), 2) as total_venta
                FROM boleta 
                WHERE DATE(fecha_emision_01) = '$fecha_actual' AND estado IN ('5','1','6') AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
                UNION ALL
                SELECT ROUND(SUM(importe_total_23), 2) as total_venta
                FROM notapedido 
                WHERE DATE(fecha_emision_01) = '$fecha_actual' AND estado IN ('5','1','6') AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
                UNION ALL
                SELECT ROUND(SUM(ingreso - gasto), 2) as total_venta
                FROM insumos
                WHERE DATE(fecharegistro) = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
            ) as tbl1";
        
            // Ejecutar la consulta y retornar el resultado
            return ejecutarConsulta($sql);
        } catch (Exception $e) {
            // Manejar errores
            return "Error en la consulta: " . $e->getMessage();
        }
    }
    

    
    public function CerrarCaja($idusuario, $idsaldoini) {
        try {
            // Validar y limpiar datos
            $idusuario = filter_var($idusuario, FILTER_SANITIZE_NUMBER_INT);
            $idsaldoini = filter_var($idsaldoini, FILTER_SANITIZE_NUMBER_INT);
            // Obtener la fecha actual en formato MySQL
            $fecha_actual = date('Y-m-d');
    
            // Consulta SQL original
            $sql = "
            SELECT 
                ROUND(SUM(total_venta), 2) as total_venta,
                (SELECT SUM(ingreso) FROM insumos WHERE DATE(fecharegistro) = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini') as ingreso,
                (SELECT SUM(gasto) FROM insumos WHERE DATE(fecharegistro) = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini') as egreso,
                (SELECT saldo_inicial FROM saldocaja WHERE fecha_creacion = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini' LIMIT 1) as saldo_inicial
            FROM (
                SELECT ROUND(SUM(importe_total_venta_27), 2) as total_venta
                FROM factura 
                WHERE DATE(fecha_emision_01) = '$fecha_actual' AND estado IN ('5','1','6') AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
                UNION ALL
                SELECT ROUND(SUM(importe_total_23), 2) as total_venta
                FROM boleta 
                WHERE DATE(fecha_emision_01) = '$fecha_actual' AND estado IN ('5','1','6') AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
                UNION ALL
                SELECT ROUND(SUM(importe_total_23), 2) as total_venta
                FROM notapedido 
                WHERE DATE(fecha_emision_01) = '$fecha_actual' AND estado IN ('5','1','6') AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
                UNION ALL
                SELECT ROUND(SUM(ingreso - gasto), 2) as total_venta
                FROM insumos
                WHERE DATE(fecharegistro) = '$fecha_actual' AND idusuario = '$idusuario' AND idsaldoini = '$idsaldoini'
            ) as tbl1;";
    
            // Ejecutar la consulta
            $resultado = ejecutarConsulta($sql);
    
            // Verificar si la consulta se ejecutó correctamente
            if ($resultado) {
                // Obtener la fila como un array asociativo
                $fila = $resultado->fetch_assoc();
    
                // Verificar si la caja está abierta antes de realizar el UPDATE
                $cajaAbierta = "SELECT caja_abierta FROM saldocaja WHERE idusuario = '$idusuario' AND caja_abierta = b'0'";
                $cajaAbiertaResultado = ejecutarConsultaSimpleFila($cajaAbierta);
    
                if ($cajaAbiertaResultado) {
                    // La caja está abierta, podemos proceder con el cierre
                    $total_venta = $fila['total_venta'];
                    $ingreso = $fila['ingreso'];
                    $egreso = $fila['egreso'];
    
                    $updateSQL = "UPDATE saldocaja 
                                SET caja_abierta = b'1',
                                    fechadecierre = '$fecha_actual',
                                    totalcaja = '$total_venta',
                                    totalingreso = '$ingreso',
                                    totalegreso = '$egreso'
                                WHERE idusuario = '$idusuario' AND idsaldoini = '$idsaldoini' AND caja_abierta = b'0'";
      
    
                    ejecutarConsulta($updateSQL);
                }
    
                // Cerrar la conexión
                $resultado->close();
            }
    
            // Retornar el resultado de la consulta original
            return $resultado;
        } catch (Exception $e) {
            // Manejar errores
            return "Error en la consulta: " . $e->getMessage();
        }
    }
    

    public function ReiniciarTotalVentas($idusuario) {
        // Reiniciar valores en la tabla correspondiente
        $updateReinicio = "UPDATE saldocaja 
                           SET totalcaja = 0,
                               totalingreso = 0,
                               totalegreso = 0
                           WHERE idusuario = '$idusuario' AND caja_abierta = b'1'";
    
        ejecutarConsulta($updateReinicio);
    }
    
    
    



// INSERTAR saldo inicial por día actual
public function insertarSaldoInicial($saldo_inicial, $idusuario, $nombre_vendedor, $cargo_vendedor, $turno)
{
    // Consulta para verificar si hay una caja abierta
    $consultaCajaAbierta = "SELECT COUNT(*) AS cantidad FROM saldocaja WHERE idusuario = '$idusuario' AND caja_abierta = b'0'";
    $resultado = ejecutarConsultaSimpleFila($consultaCajaAbierta);

    // Verificar el resultado de la consulta
    if ($resultado['cantidad'] > 0) {
        // Ya hay una caja abierta, no se puede aperturar otra
        return "Error: Ya hay una caja abierta.";
    } else {
        // No hay caja abierta, se puede aperturar una nueva
        $sql = "INSERT INTO saldocaja (idusuario, saldo_inicial, caja_abierta, fecha_creacion, nombre_vendedor, cargo_vendedor, turno) 
                VALUES ('$idusuario', '$saldo_inicial', b'0', CURRENT_DATE(), '$nombre_vendedor', '$cargo_vendedor', '$turno')";

        return ejecutarConsulta($sql);
    }
}


public function listar($idusuario){

    $sql = "
    SELECT * FROM saldocaja 
    WHERE idusuario = '$idusuario' AND cargo_vendedor != 9 
    ORDER BY idsaldoini;
    ";
		return ejecutarConsulta($sql);
}



public function mostrartodo(){

        $sql = "
        SELECT * FROM saldocaja 
        WHERE cargo_vendedor != 9 
        ORDER BY idsaldoini;
        ";
            return ejecutarConsulta($sql);
}

public function traeridsaldoini($idusuario){
    $sql = "SELECT idsaldoini FROM saldocaja WHERE idusuario = '$idusuario' AND caja_abierta = b'0';";
		return ejecutarConsulta($sql);

}

// // Listar cierre
// public function listarCierre($idusuario)
// {
//     $sql = "";
//     return ejecutarConsulta($sql);
// }



}


