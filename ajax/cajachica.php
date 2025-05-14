<?php 
require_once "../modelos/Cajachica.php";

$cajachica=new Cajachica();

if (isset($_GET['action'])) {
	$action = $_GET['action'];
  } else {
	$action = '';
  }
  
  $data = json_decode(file_get_contents("php://input"), true);
  $saldo_inicial = isset($data["saldo_inicial"]) ? $data["saldo_inicial"] : "";
  $idusuario = isset($data["idusuario"]) ? $data["idusuario"] : "";
  $idsaldoini = isset($data["idsaldoini"]) ? $data["idsaldoini"] : "";
  $nombre_vendedor = isset($data["nombre_vendedor"]) ? $data["nombre_vendedor"] : "";
  $cargo_vendedor = isset($data["cargo_vendedor"]) ? $data["cargo_vendedor"] : "";
  $turno = isset($data["turno"]) ? $data["turno"] : "";
  

  if ($action == 'TotalVentas') {
    
    // Llamar a la función TotalVentas con el parámetro $idusuario
    $rspta = $cajachica->TotalVentas($idusuario, $idsaldoini);
    $data = array();

    while ($reg = $rspta->fetch_object()) {
        $data[] = array(
            "total_venta" => $reg->total_venta,
            "ingreso" => $reg->ingreso,
            "egreso" => $reg->egreso,
            "saldo_inicial" => $reg->saldo_inicial
        );
    }
    $results = array(
        "aaData" => $data
    );

    header('Content-type: application/json');
    echo json_encode($results);
}



  if ($action == 'listar') {
	$rspta = $cajachica->listar($idusuario);
	$data = array();
  
	while ($reg = $rspta->fetch_object()) {
		$data[] = array(
			"idsaldoini" => $reg->idsaldoini,
			"idusuario" => $reg->idusuario,
			"saldo_inicial" => $reg->saldo_inicial,
			"caja_abierta" => $reg->caja_abierta,
			"fecha_creacion" => $reg->fecha_creacion,
			"nombre_vendedor" => $reg->nombre_vendedor,
			"cargo_vendedor" => $reg->cargo_vendedor,
			"turno" => $reg->turno,
			"fechadecierre" => $reg->fechadecierre,
			"totalcaja" => $reg->totalcaja,
			"totalingreso" => $reg->totalingreso,
			"totalegreso" => $reg->totalegreso,
			"totalcompras" => $reg->totalcompras,
			"montoarqueocaja" => $reg->montoarqueocaja,
			"montocuadrecaja" => $reg->montocuadrecaja,
			"cierre_parcial" => $reg->cierre_parcial,
			"fechadecierre_parcial" => $reg->fechadecierre_parcial,
			"totalcaja_parcial" => $reg->totalcaja_parcial,
			"totalingreso_parcial" => $reg->totalingreso_parcial,
			"totalegreso_parcial" => $reg->totalegreso_parcial,
			"totalcompras_parcial" => $reg->totalcompras_parcial,
			"montoarqueocaja_parcial" => $reg->montoarqueocaja_parcial,
			"montocuadrecaja_parcial" => $reg->montocuadrecaja_parcial,
			"saldo_faltante" => $reg->saldo_faltante,
			"saldo_sobrante" => $reg->saldo_sobrante
		);
	}
	
	$results = array(
		"aaData"=>$data
	);
	
	header('Content-type: application/json');
	echo json_encode($results);
  }


  if ($action == 'mostrartodo') {
	$rspta = $cajachica->mostrartodo();
	$data = array();
  
	while ($reg = $rspta->fetch_object()) {
		$data[] = array(
			"idsaldoini" => $reg->idsaldoini,
			"idusuario" => $reg->idusuario,
			"saldo_inicial" => $reg->saldo_inicial,
			"caja_abierta" => $reg->caja_abierta,
			"fecha_creacion" => $reg->fecha_creacion,
			"nombre_vendedor" => $reg->nombre_vendedor,
			"cargo_vendedor" => $reg->cargo_vendedor,
			"turno" => $reg->turno,
			"fechadecierre" => $reg->fechadecierre,
			"totalcaja" => $reg->totalcaja,
			"totalingreso" => $reg->totalingreso,
			"totalegreso" => $reg->totalegreso,
			"totalcompras" => $reg->totalcompras,
			"montoarqueocaja" => $reg->montoarqueocaja,
			"montocuadrecaja" => $reg->montocuadrecaja,
			"cierre_parcial" => $reg->cierre_parcial,
			"fechadecierre_parcial" => $reg->fechadecierre_parcial,
			"totalcaja_parcial" => $reg->totalcaja_parcial,
			"totalingreso_parcial" => $reg->totalingreso_parcial,
			"totalegreso_parcial" => $reg->totalegreso_parcial,
			"totalcompras_parcial" => $reg->totalcompras_parcial,
			"montoarqueocaja_parcial" => $reg->montoarqueocaja_parcial,
			"montocuadrecaja_parcial" => $reg->montocuadrecaja_parcial,
			"saldo_faltante" => $reg->saldo_faltante,
			"saldo_sobrante" => $reg->saldo_sobrante
		);
	}
	
	$results = array(
		"aaData"=>$data
	);
	
	header('Content-type: application/json');
	echo json_encode($results);
  }


  if ($action == 'traeridsaldoini') {
	$rspta = $cajachica->traeridsaldoini($idusuario);
	$data = array();
  
	while ($reg = $rspta->fetch_object()) {
		$data[] = array(
			"idsaldoini" => $reg->idsaldoini
		);
	}
	
	$results = array(
		"aaData"=>$data
	);
	header('Content-type: application/json');
	echo json_encode($results);
  }


  if ($action == 'CerrarCaja') {
    // Llamar a la función CerrarCaja con el parámetro $idusuario
    $cajachica->CerrarCaja($idusuario, $idsaldoini);

    // Puedes devolver una respuesta simple si es necesario
    $response = array("success" => true);
    header('Content-type: application/json');
    echo json_encode($response);
}



//  switch ($_GET["op"]){
	
//	case 'guardaryeditar':
//		$resultado = $cajachica->insertarSaldoInicial($saldo_inicial, $idusuario, $nombre_vendedor, $cargo_vendedor, $turno);
//		if (is_string($resultado)) {
			// Si la función devuelve un mensaje de error
//			echo $resultado;
//		} else {
			// Si la función devuelve true (éxito)
//			echo "Saldo registrado";
//		}
//	break;


if (isset($_GET["op"])) {
    switch ($_GET["op"]) {
        case 'guardaryeditar':
            $resultado = $cajachica->insertarSaldoInicial($saldo_inicial, $idusuario, $nombre_vendedor, $cargo_vendedor, $turno);
            if (is_string($resultado)) {
                // Si la función devuelve un mensaje de error
                echo $resultado;
            } else {
                // Si la función devuelve true (éxito)
                echo "Saldo registrado";
            }
        break;

        // Puedes agregar más casos aquí

        default:
            echo "Operación no reconocida";
        break;
    }
}



	

	
	// case 'cerrarcaja':
	// 	$cajachica->resetearValoresCierreCaja();
	// 	$resultado = $cajachica->cerrarCaja($idusuario);
	// 	echo $resultado ? "Caja cerrada" : "No se pudo cerrar la caja";
	// 	break;



?>