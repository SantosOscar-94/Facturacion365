<?php
require_once "../modelos/PosModelo.php";
$posmodelo = new PosModelo();

$idboleta = isset($_POST["idboleta"]) ? limpiarCadena($_POST["idboleta"]) : "";
$idfactura = isset($_POST["idfactura"]) ? limpiarCadena($_POST["idfactura"]) : "";

//Primeros productos
$idarticulo = isset($_POST["idarticulo"]) ? limpiarCadena($_POST["idarticulo"]) : "";
$idfamilia = isset($_POST["idfamilia"]) ? limpiarCadena($_POST["idfamilia"]) : "";
$codigo_proveedor = isset($_POST["codigo_proveedor"]) ? limpiarCadena($_POST["codigo_proveedor"]) : "";
$codigo = isset($_POST["codigo"]) ? limpiarCadena($_POST["codigo"]) : "";
$familia = isset($_POST["familia"]) ? limpiarCadena($_POST["familia"]) : "";
$nombre = isset($_POST["nombre"]) ? limpiarCadena($_POST["nombre"]) : "";
$stock = isset($_POST["stock"]) ? limpiarCadena($_POST["stock"]) : "";
$precio = isset($_POST["precio"]) ? limpiarCadena($_POST["precio"]) : "";
$costo_compra = isset($_POST["costo_compra"]) ? limpiarCadena($_POST["costo_compra"]) : "";
$imagen = isset($_POST["imagen"]) ? limpiarCadena($_POST["imagen"]) : "";
$precio_final_kardex = isset($_POST["precio_final_kardex"]) ? limpiarCadena($_POST["precio_final_kardex"]) : "";
$precio2 = isset($_POST["precio2"]) ? limpiarCadena($_POST["precio2"]) : "";
$precio3 = isset($_POST["precio3"]) ? limpiarCadena($_POST["precio3"]) : "";
$unidad_medida = isset($_POST["unidad_medida"]) ? limpiarCadena($_POST["unidad_medida"]) : "";
$ccontable = isset($_POST["ccontable"]) ? limpiarCadena($_POST["ccontable"]) : "";
$nombreum = isset($_POST["nombreum"]) ? limpiarCadena($_POST["nombreum"]) : "";
$fechavencimiento = isset($_POST["fechavencimiento"]) ? limpiarCadena($_POST["fechavencimiento"]) : "";
$nombreal = isset($_POST["nombreal"]) ? limpiarCadena($_POST["nombreal"]) : "";

//comprobantes:
$fechaDesde = isset($_POST["fechaDesde"]) ? limpiarCadena($_POST["fechaDesde"]) : "";
$fechaHasta = isset($_POST["fechaHasta"]) ? limpiarCadena($_POST["fechaHasta"]) : "";
$tipoComprobante = isset($_POST["tipoComprobante"]) ? limpiarCadena($_POST["tipoComprobante"]) : "";


//personas
$tipo_documento = isset($_POST["tipo_documento"]) ? limpiarCadena($_POST["tipo_documento"]) : "";
$numero_documento = isset($_POST["numero_documento"]) ? limpiarCadena($_POST["numero_documento"]) : "";
$razon_social = isset($_POST["razon_social"]) ? limpiarCadena($_POST["razon_social"]) : "";
$domicilio_fiscal = isset($_POST["domicilio_fiscal"]) ? limpiarCadena($_POST["domicilio_fiscal"]) : "";



//Limpiar Familia 

$idfamilia = isset($_POST["idfamilia"]) ? limpiarcadena($_POST["idfamilia"]) : null;
$idfamilia = isset($_GET["idfamilia"]) ? limpiarcadena($_GET["idfamilia"]) : null;
$busqueda = isset($_GET["busqueda"]) ? limpiarcadena($_GET["busqueda"]) : null;




require_once "../modelos/Rutas.php";
$rutas = new Rutas();
$Rrutas = $rutas->mostrar2("1");
$Prutas = $Rrutas->fetch_object();
$rutaimagen = $Prutas->rutaarticulos; // ruta de la imagen


if (isset($_GET['action'])) {
    $action = $_GET['action'];
} else {
    $action = '';
}

if ($action == 'listarProducto') {
    $rspta = $posmodelo->listarProducto(1, $idfamilia, $busqueda);
    $data = array();

    // Obtiene la URL base
    $baseURL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
    $currentDir = dirname($_SERVER['REQUEST_URI']); // Obtiene el directorio actual sin el script
    $baseURL = $baseURL . $currentDir; // Concatena el host con el directorio
    $baseURL = preg_replace('#/ajax$#', '', $baseURL); // Elimina la parte "/ajax" si existe

    while ($reg = $rspta->fetch_object()) {
        $imagenURL = $baseURL . '/files/articulos/' . $reg->imagen;

        $data[] = array(
            'idarticulo' => $reg->idarticulo,
            'idfamilia' => $reg->idfamilia,
            'codigo_proveedor' => $reg->codigo_proveedor,
            'codigo' => $reg->codigo,
            'familia' => $reg->familia,
            'nombre' => $reg->nombre,
            'stock' => $reg->stock,
            'precio' => $reg->precio,
            'costo_compra' => $reg->costo_compra,
            'precio_unitario' => $reg->precio_unitario,
            'cicbper' => $reg->cicbper,
            'mticbperu' => $reg->mticbperu,
            // 'factorconversion' => $reg->factorconversion,
            //(a.factorc * a.stock) as factorconversion,
            'factorc' => $reg->factorc,
            'descrip' => $reg->descrip,
            'tipoitem' => $reg->tipoitem,
            'imagen' => $imagenURL,
            // Utilizar la URL completa de la imagen
            'precio_final_kardex' => $reg->precio_final_kardex,
            'precio2' => $reg->precio2,
            'precio3' => $reg->precio3,
            'unidad_medida' => $reg->unidad_medida,
            'ccontable' => $reg->ccontable,
            'st2' => $reg->st2,
            'nombreum' => $reg->nombreum,
            'abre' => $reg->abre,
            'fechavencimiento' => $reg->fechavencimiento,
            'nombreal' => $reg->nombreal
        );
    }
    $results = array(
        "ListaProductos" => $data
    );

    header('Content-type: application/json');
    echo json_encode($results);
}


//Listar Categorias : 

if ($action == 'listarCategorias') {
    $rspta = $posmodelo->listarcategorias();
    $data = array();

    while ($reg = $rspta->fetch_object()) {
        $data[] = array(
            'idfamilia' => $reg->idfamilia,
            'familia' => $reg->familia,
            'estado' => $reg->estado
        );
    }
    $results = array(
        "ListaCategorias" => $data
    );

    header('Content-type: application/json');
    echo json_encode($results);
}



//Comprobantes boleta, factura y nota de venta

$data = json_decode(file_get_contents("php://input"), true);
if ($data) { // Verificamos si se ha enviado algo en formato JSON
    $idempresa = isset($data['idempresa']) ? $data['idempresa'] : "";
    $fechainicio = isset($data['fechainicio']) ? $data['fechainicio'] : "";
    $fechafinal = isset($data['fechafinal']) ? $data['fechafinal'] : "";
    $tipocomprobante = isset($data['tipocomprobante']) ? $data['tipocomprobante'] : "";
    $idusuario = isset($data['idusuario']) ? $data['idusuario'] : "";
}

if ($action == 'listarcomprobantesvarios') {
    $resultados = $posmodelo->listarcomprobantesvarios($idempresa, $fechainicio, $fechafinal, $tipocomprobante, $idusuario);

    $data = array();

    if (isset($resultados['boletas'])) {
        while ($reg = $resultados['boletas']->fetch_object()) {
            $data[] = array(
                'id' => $reg->id,
                'fecha' => $reg->fecha,
                'cliente' => $reg->cliente,
                'productos' => $reg->nombre_articulo,
                'unidades_vendidas' => $reg->unidades_vendidas,
                'respuestaComprobante' => $reg->respuestaComprobante,
                'total' => $reg->total
                // 'tipo_comprobante' => $reg->tipo_documento_06,
                // 'productos' => $reg->nombre_articulo,
                // 'total' => $reg->importe_total_23
            );
        }
    }

    if (isset($resultados['facturas'])) {
        while ($reg = $resultados['facturas']->fetch_object()) {
            $data[] = array(
                'id' => $reg->id,
                'fecha' => $reg->fecha,
                'cliente' => $reg->cliente,
                'productos' => $reg->nombre_articulo,
                'unidades_vendidas' => $reg->unidades_vendidas,
                'respuestaComprobante' => $reg->respuestaComprobante,
                'total' => $reg->total
                // 'tipo_comprobante' => $reg->tipo_documento_07,
                // 'productos' => $reg->nombre_articulo,
                // 'total' => $reg->importe_total_venta_27
            );
        }
    }

    if (isset($resultados['notaspedido'])) {
        while ($reg = $resultados['notaspedido']->fetch_object()) {
            $data[] = array(
                'id' => $reg->id,
                'fecha' => $reg->fecha,
                'cliente' => $reg->cliente,
                'productos' => $reg->nombre_articulo,
                'unidades_vendidas' => $reg->unidades_vendidas,
                'respuestaComprobante' => $reg->respuestaComprobante,
                'total' => $reg->total
                // 'tipo_comprobante' => $reg->tipo_documento_06,
                // 'productos' => $reg->nombre_articulo,
                // 'total' => $reg->importe_total_23
            );
        }
    }

    $results = array(
        "ListaComprobantes" => $data
    );

    header('Content-type: application/json');
    echo json_encode($results);
}








//insertar personas  - clientes : 



if ($action == 'insertarClientePOS') {


    // Primero verifica si el cliente ya existe.
    if ($persona->clienteExiste($numero_documento)) {
        echo json_encode(['status' => 'error', 'message' => 'El cliente ya existe.']);
    } else {
        // Si el cliente no existe, inserta el nuevo cliente.
        if ($persona->insertarClientePOS($tipo_documento, $numero_documento, $razon_social, $domicilio_fiscal)) {
            echo json_encode(['status' => 'success', 'message' => 'Cliente insertado correctamente.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al insertar el cliente.']);
        }
    }
}







?>