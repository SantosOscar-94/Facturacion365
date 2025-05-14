<?php


if (strlen(session_id()) < 1) {
    session_start();
}

require_once "../modelos/Consultas.php";
$consulta = new Consultas();

$rsptav = $consulta->totalventahoyFactura($_SESSION['idempresa']);
$regv = $rsptav->fetch_object();
$totalvfacturahoy = $regv->total_venta_factura_hoy;

$rsptav = $consulta->totalventahoyBoleta($_SESSION['idempresa']);
$regv = $rsptav->fetch_object();
$totalvboletahoy = $regv->total_venta_boleta_hoy;

$rsptav = $consulta->totalventahoyNotapedido($_SESSION['idempresa']);
$regv = $rsptav->fetch_object();
$totalvnpedidohoy = $regv->total_venta_npedido_hoy;


$totalventas = $totalvfacturahoy + $totalvboletahoy + $totalvnpedidohoy;
$rsptav = $consulta->insertarVentaDiaria($totalventas);
//echo $rsptav ? "Venta guardada" : "Error al guardar";

// Establece la zona horaria a Lima, Perú
date_default_timezone_set('America/Lima');

?>
<!DOCTYPE html>
<html lang="es" dir="ltr" data-nav-layout="vertical" data-theme-mode="light" data-header-styles="light"
    data-menu-styles="dark" data-toggled="close">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>SISTEMA WFACX | Facturación electrónica</title>

    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="stylesheet" href="../custom/modules/fontawesome6.1.1/css/all.css">
    <link rel="stylesheet" href="../public/css/factura.css">

    <!-- Favicon icon -->
	<link rel="icon" type="image/png" sizes="32x32" href="../custom/login/images/fev.png">
    
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="apple-mobile-web-app-title" content="wfacx - Home">
        <!-- Choices JS -->
        <script src="../assets/libs/choices.js/public/assets/scripts/choices.min.js"></script>
        <!-- Main Theme Js -->
        <script src="../assets/js/main.js"></script>
        <!-- Bootstrap Css -->
        <link id="style" href="../assets/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <!-- Style Css -->
        <link href="../assets/css/styles.css" rel="stylesheet">
        <!-- Icons Css -->
        <link href="../assets/css/icons.css" rel="stylesheet">
        <!-- Node Waves Css -->
        <link href="../assets/libs/node-waves/waves.min.css" rel="stylesheet">
        <!-- Simplebar Css -->
        <link href="../assets/libs/simplebar/simplebar.min.css" rel="stylesheet">
        <!-- Color Picker Css -->
        <link rel="stylesheet" href="../assets/libs/flatpickr/flatpickr.min.css">
        <link rel="stylesheet" href="../assets/libs/@simonwep/pickr/themes/nano.min.css">
        <!-- Choices Css -->
        <link rel="stylesheet" href="../assets/libs/choices.js/public/assets/styles/choices.min.css">
        <link rel="stylesheet" href="../assets/libs/jsvectormap/css/jsvectormap.min.css">
        <link rel="stylesheet" href="../assets/libs/swiper/swiper-bundle.min.css">

        <link rel="stylesheet" href="../public/css/toastr.css">

        <link rel="stylesheet" href="../custom/css/custom.css">

        <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">

        <!-- DATATABLES -->
        <link rel="stylesheet" type="text/css" href="../public/datatables/jquery.dataTables.min.css">
        <!-- <link href="../public/datatables/buttons.dataTables.min.css" rel="stylesheet" />
    <link href="../public/datatables/responsive.dataTables.min.css" rel="stylesheet" /> -->

        <link rel="stylesheet" href="../public/css/autobusqueda.css">
        <link rel="stylesheet" href="style.css">
        <link rel="manifest" href="../manifest.json">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>

        
         <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('../service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registrado con ��xito:', registration);
                })
                .catch((error) => {
                    console.error('Error al registrar el Service Worker:', error);
                });
        }
    </script>
    
    
    
</head>


<body>

<script>
// Declara una variable global para almacenar la respuesta
let resultadoGlobal = null;
// Función para realizar la solicitud fetch
async function obtenerIdsaldoini(idusuario) {
    try {
        const response = await fetch(`../ajax/cajachica.php?action=traeridsaldoini`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idusuario,
            }),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud fetch');
        }

        // Parsea la respuesta como JSON
        const data = await response.json();

        // Almacena la respuesta en la variable global
        resultadoGlobal = data;

        // Puedes realizar otras acciones con la respuesta si es necesario
        console.log('Resultado obtenido:', resultadoGlobal);
    } catch (error) {
        console.error('Error al realizar la solicitud fetch:', error.message);
    }
}
// Ejemplo de uso
const idusuario = sessionStorage.getItem("idusuario");
obtenerIdsaldoini(idusuario);

</script>

    <input type="hidden" name="iva" id="iva" value='<?php echo $_SESSION['iva']; ?>'>

    <?php include_once "template/switcher.php" ?>

    <!-- Loader -->
    <div id="loader">
        <img src="../assets/images/media/loader.svg" alt="">
    </div>
    <!-- Loader -->
    <div class="page">

        <?php include_once "template/app-header.php" ?>

        <?php include_once "template/sidebar.php" ?>

        <div class="main-content app-content">
            <div class="container-fluid">