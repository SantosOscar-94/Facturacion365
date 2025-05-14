<?php
ob_start();
session_start();

if (!isset($_SESSION["nombre"])) {
  $swsession = 0;
  header("Location: ../vistas/login");
} else {
  $swsession = 1;
  // require 'header.php';

  if ($_SESSION['Ventas'] == 1) {
    ?>

    <?php include_once 'template/head-pos.php'?>

    <style>
      .logo {
        display: block;
        /* o cualquier otro estilo que desees para dispositivos no móviles */
      }

      .dataTables_wrapper .dt-buttons {
          margin-bottom: 15px !important;
      }

      /* Estilo para el botón de Excel */
      .btn-excel {
        background: #4CAF50 !important; /* Verde */
        color: white !important;
        padding: 8px;
        position: relative;
        text-decoration: none;
      }

      /* Estilo para el botón de PDF */
      .btn-pdf {
        background: #DC143C !important;
        color: white !important;
        padding: 8px;
        left: 10px;
        position: relative;
        text-decoration: none;
      }

      /* Estilos para dispositivos móviles (ancho de pantalla igual o menor a 767px) */
      @media (max-width: 767px) {
        .logo {
          display: none;
          /* Ocultar el elemento en dispositivos móviles */
        }
      }
    </style>
    <form name="formulario" id="formulario" method="POST" autocomplete="off">
      <input hidden name="iva" id="iva" value='<?php echo $_SESSION['iva']; ?>'>

      <div class="container-fluid mb-3 p-1 pe-3 ps-3 bg-white sticky-top" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div class="d-flex justify-content-between align-items-center">
          <div class="logo">
            <strong>POS</strong> WFACX
          </div>

          <div class="d-flex gap-2">

            <button title="Pantalla Completa" type="button" id="fullscreen" class="btn btn-warning"><i
                class="fa-solid fa-expand" title="Pantalla Completa"></i></button>

            <div class="searchBox" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Impuesto">

              <div class="searchToggle">
                <i class="fa-solid fa-xmark cancel"></i>
                <i class="fa-solid fa-calculator search"></i>
              </div>

              <div class="search-field">
                <select class="form-select" name="codigo_tributo_18_3" id="codigo_tributo_18_3"
                  onchange="()"></select>
              </div>

            </div>

            <div class="searchBox" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Precios">

              <div class="searchToggle">
                <i class="fa-solid fa-xmark cancel"></i>
                <i class="fa-solid fa-tag search"></i>
              </div>

              <div class="search-field">
                <select class="form-select" id="s_tipo_precio">
                  <option value="0" selected>Precio Normal</option>
                  <option value="1">Precio por Mayor</option>
                  <option value="2">Precio Distribuidor</option>
                </select>
              </div>

            </div>

            
            <button title="Lista ventas" type="button" id="btn_modalventas" data-bs-toggle="modal" data-bs-target="#ModalListaVentas"
              class="btn btn-blue"><i class="fa-solid fa-sack-dollar"></i></button>

            <button title="Cajas" type="button" class="btn btn-blue" id="btn_modalproducto"><i class="fa-solid fa-weight-hanging"></i></button>

            <a class="btn btn-warning d-flex align-items-center" href="boleta"><i class="fa fa-backward"></i></a>

            <input hidden name="nombre_trixbuto_4_p" id="nombre_trixbuto_4_p">
            <!-- <select class="form-control w-auto" name="codigo_tributo_18_3" id="codigo_tributo_18_3" onchange="tributocodnon()">TRIBUTO</select> -->
            <div id="ContenedorVendedor"></div>
            <!-- <select class="form-select w-auto" autofocus name="vendedorsitio" id="vendedorsitio"
              data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Vendedor"></select> -->

            <!-- <select class="form-control" name="tipo_moneda_24" id="tipo_moneda_24" onchange="tipodecambiosunat();"> -->
            <select hidden class="form-select w-auto" name="tipo_moneda_24" id="tipo_moneda_24" data-bs-toggle="tooltip"
              data-bs-placement="bottom" data-bs-title="Moneda" onchange="tipodecambiosunat();">
              <option value="PEN" selected="true">PEN</option>
              <option value="USD" disabled>USD</option>
            </select>

            <select hidden name="tipo_moneda" id="tipo_moneda">
              <option value="PEN" selected="true">PEN</option>
              <option value="USD" disabled>USD</option>
            </select>

            <!--Datos de empresa -->
            <input type="hidden" name="idempresa" id="idempresa" value="<?php echo $_SESSION['idempresa']; ?>">
          </div>


          <!-- <div hidden class="d-flex flex-column">
            <span class="fs-5 fw-bolder">Order #246</span>
            <span class="text-end color-gray-600 fs-14">Opened 7:45 am</span>
          </div> -->

        </div>
      </div>

      <div class="container-fluid">

        <div class="row">
          <div class="col-lg-8 position-relative">

            <div id="loader_product">
              <svg class="lp" viewBox="0 0 128 128" width="50" height="50px" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#000"></stop>
                    <stop offset="100%" stop-color="#fff"></stop>
                  </linearGradient>
                  <mask id="mask1">
                    <rect x="0" y="0" width="128" height="128" fill="url(#grad1)"></rect>
                  </mask>
                </defs>
                <g fill="none" stroke-linecap="round" stroke-width="16">
                  <circle class="lp__ring" r="56" cx="64" cy="64" stroke="#ddd"></circle>
                  <g stroke="#00548d">
                    <polyline class="lp__fall-line" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay1" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay2" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay3" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay4" points="64,8 64,120"></polyline>
                    <circle class="lp__drops" r="56" cx="64" cy="64" transform="rotate(90,64,64)"></circle>
                    <circle class="lp__worm" r="56" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
                  </g>
                  <g stroke="#0092d8" mask="url(#mask1)">
                    <polyline class="lp__fall-line" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay1" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay2" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay3" points="64,8 64,120"></polyline>
                    <polyline class="lp__fall-line lp__fall-line--delay4" points="64,8 64,120"></polyline>
                    <circle class="lp__drops" r="56" cx="64" cy="64" transform="rotate(90,64,64)"></circle>
                    <circle class="lp__worm" r="56" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
                  </g>
                </g>
              </svg>
            </div>

            <div class="card mb-3">
              <div class="card-header">
                <div class="row">
                  <div class="col-12 col-md-9 row pe-0">
                    <div class="col-12 col-md-6 pe-0 d-flex align-items-center">

                      <div class="input-group" style="border: 1px solid #ccc; border-radius: 0.25rem;">
                        <input class="form-control border-0" type="text" id="search_product"
                          placeholder="Filtro por código o nombre">
                        <button class="btn btn-outline-secondary border-0 color-gray-500 pe-1 ps-0" type="button" disabled>
                          <i class="fas fa-search"></i>
                        </button>
                        <button class="btn btn-outline-secondary delete border-0 color-gray-500" type="button"
                          id="btn_deletefilter">
                          <i class="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                    </div>

                    <div class="col-12 col-md-6 pe-0 d-flex align-items-center">

                      <div class="form-check form-switch" data-bs-toggle="tooltip" data-bs-placement="right"
                        data-bs-title="Ingresar código de barra">
                        <input class="form-check-input" type="checkbox" role="switch" id="active_codigobarra">
                      </div>

                      <input class="form-control" type="text" id="search_codigobarra"
                        placeholder="Filtro por código de barra" data-bs-toggle="tooltip" data-bs-placement="right"
                        data-bs-title="Press ENTER" onkeypress="eventoProductoxCodigo(event)" onkeyup="mayus(this);">


                    </div>
                  </div>

                  <div class="col-12 col-md-3 text-start text-md-end pe-0">
                    <!-- <div class="col-12 col-md-3 d-flex align-items-center text-start text-md-end pe-0"> -->
                    <a href="#" class="fw-500 text-dark text-decoration-none fs-14" id="ver-todos-link"
                      style="top: 9px; position: relative;">Ver Todos</a>
                  </div>
                </div>
              </div>

              <div class="card-body">

                <div class="w-100" style="position: relative;">

                  <div class="swiper ms-3-5 me-3-5">
                    <!-- Additional required wrapper -->
                    <div class="swiper-wrapper" id="category-content">
                      <!-- Slides -->

                    </div>


                  </div>
                  <!-- If we need navigation buttons -->
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-button-next"></div>

                </div>
              </div>
            </div>

            <div class="cards-products contenedor">

              <div class="row pe-1" id="product-container">
                <!--  Product cards will be dynamically added here -->
              </div>
            </div>


          </div>


          <!-- <div class="col-4 d-none d-lg-inline sticky-bottom pedido-container"> -->
          <div class="col-lg-4 pedido-container" style="position: sticky;">
            <div class="card pedido-card contenedor" style="overflow: scroll; overflow-y: visible; overflow-x: hidden;">
              <div class="card-header d-flex justify-content-between align-items-baseline">
                <span class="fw-bold">Nuevo Pedido</span>
                <span id="currentDateTime" class="color-gray-400 fs-14"></span>
                <!-- Hora Actual -->
                <script>
                  window.onload = function () {
                    var current = new Date();
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                    var formattedDate = current.toLocaleDateString('es-ES', options);

                    document.getElementById("currentDateTime").textContent = formattedDate;
                  }

                </script>


              </div>

              <!-- <div class="card-body pb-0"> -->
              <div class="p-3 pb-0">

                <fieldset>
                  <legend>
                    <button class="btn btn-blue btn-sm w-100 fw-500" id="btn_datos" data-bs-toggle="tooltip"
                      data-bs-placement="bottom" data-bs-title="Completa los datos de tu pedido">Datos</button>
                  </legend>
                </fieldset>

                <div id="container_datos" class="row">

                  <div class="col-12 mb-2">
                    <select name="d_tipocomprobante" id="d_tipocomprobante" class="form-select">
                      <option value="" disabled>Seleccionar Tipo de Compra</option>
                      <option value="0"> Boleta </option>
                      <option value="1"> Factura </option>
                      <option value="2"> Nota de Venta </option>
                      <option hidden value="3"> Cotización </option>
                    </select>
                  </div>

            
                  <div class="col-sm-6 mb-2">
                    
                    <label for="serie" class="label-data">Serie:</label>
                    <select class="form-select" name="serie" id="serie" onchange="incremetarNum()"></select>

                    <input type="hidden" name="idnumeracion" id="idnumeracion">
                    <input type="hidden" name="SerieReal" id="SerieReal">
                  </div>

                  <div class="col-sm-6 mb-2">
                    <!-- <input type="text" class="form-control" disabled id="d_numero" placeholder="Número"> -->

                    <label for="numero_boleta" class="label-data">Número:</label>
                    <input type="text" name="numero_boleta" id="numero_boleta" class="form-control" required="true"
                      readonly>
                    <input hidden type="text" name="numero_factura" id="numero_factura" class="form-control" required="true"
                      readonly>
                  </div>

                  <select hidden class="form-select" name="tipoboleta" id="tipoboleta">
                    <option value="productos" selected="true">PRODUCTOS</option>
                    <option value="servicios">SERVICIOS</option>
                  </select>

                  <select hidden class="form-select" name="tipofactura" id="tipofactura">
                    <option value="productos" selected="true">PRODUCTOS</option>
                    <option value="servicios">SERVICIOS</option>
                  </select>

                  <!--Campos para guardar comprobante -->
                  <input type="hidden" name="idboleta" id="idboleta">
                  <input type="hidden" name="idfactura" id="idfactura">
                  <input type="hidden" name="firma_digital_36" id="firma_digital_36" value="44477344">
                  <input type="hidden" name="firma_digital" id="firma_digital" value="44477344">

                  <input type="hidden" name="tipo_documento_06" id="tipo_documento_06" value="03">
                  <input type="hidden" name="tipo_documento" id="tipo_documento" value="01">
                  <input type="hidden" name="numeracion_07" id="numeracion_07" value="">
                  <input type="hidden" name="numeracion" id="numeracion" value="">

                  <!--Datos del cliente-->
                  <input type="hidden" name="idcliente" id="idcliente" value="N">
                  <input type="hidden" name="idpersona" id="idpersona" value="N">

                  <input type="hidden" name="tipo_documento_cliente" id="tipo_documento_cliente" value="0">
                  <!--Datos del cliente-->

                  <!--Datos de impuestos-->
                  <input type="hidden" name="codigo_tipo_15_1" id="codigo_tipo_15_1" value="1001">
                  <input type="hidden" name="total_operaciones_gravadas_codigo" id="total_operaciones_gravadas_codigo"
                    value="1001">

                  <input type="hidden" name="codigo_tributo_h" id="codigo_tributo_h">
                  <input type="hidden" name="nombre_tributo_h" id="nombre_tributo_h">
                  <input type="hidden" name="codigo_internacional_5" id="codigo_internacional_5" value="">
                  <input type="hidden" name="tipo_documento_25_1" id="tipo_documento_25_1" value="">
                  <input type="hidden" name="tipo_documento_guia" id="tipo_documento_guia" value="">

                  <input type="hidden" name="codigo_leyenda_26_1" id="codigo_leyenda_26_1" value="1000">
                  <input type="hidden" name="codigo_leyenda_1" id="codigo_leyenda_1" value="1000">

                  <input type="hidden" name="version_ubl_37" id="version_ubl_37" value="2.0">
                  <input type="hidden" name="version_ubl" id="version_ubl" value="2.0">

                  <input type="hidden" name="version_estructura_38" id="version_estructura_38" value="1.0">
                  <input type="hidden" name="version_estructura" id="version_estructura" value="1.0">

                  <input type="hidden" name="tasa_igv" id="tasa_igv" value="0.18">
                  <!--Fin de campos-->

                  <input type="hidden" name="codigo_precio_14_1" id="codigo_precio" value="01">
                  <input type="hidden" name="codigo_precio" id="codigo_precio" value="01">

                  <!--DETALLE-->

                  <input type="hidden" name="hora" id="hora">

                  <div hidden class="col-sm-6 mb-2">
                    <label for="fecha_emision_01" class="">Fe. emisión:</label>
                    <input type="date" disabled="true" style="font-size: 12pt;" class="form-control" name="fecha_emision_01"
                      id="fecha_emision_01" required="true" onchange="focusTdoc()">

                    <input hidden type="date" name="fecha_emision" id="fecha_emision">
                    <!-- disabled="true" required="true" onchange="focusTdoc()"> -->

                  </div>

                  <div hidden class="col-sm-6 mb-2">
                    <label for="fechavenc" class="">F. vencimiento:</label>
                    <input type="date" class="form-control" name="fechavenc" id="fechavenc" required="true"
                      min="<?php echo date('Y-m-d'); ?>">
                  </div>

                  <div hidden class="col-sm-6 mb-2">
                    <label for="tcambio" class="">T. camb:</label>
                    <input type="text" name="tcambio" id="tcambio" class="form-control" readonly="true">
                  </div>

                  <div class="col-sm-6 mb-2">
                    <label for="tipo_doc_ide" class="label-data">Tipo de DOC:</label>
                    <select class="form-select" name="tipo_doc_ide" id="tipo_doc_ide" onchange="focusI()"></select>
                  </div>

                  <div class="col-sm-6 mb-2 doc_dni">
                    <label for="numero_documento" class="label-data">Nro <small>(Busqueda automática):</small></label>
                    <!-- <input type="text" class="form-control" name="numero_documento" id="numero_documento"
                      placeholder="Número" value="-" required="true" onkeypress="agregarClientexDoc(event)"
                      onchange="agregarClientexDocCha();"> -->

                    <input type="text" class="form-control" name="numero_documento" id="numero_documento"
                      placeholder="Número" value="-" required="true" onkeypress="agregarClientexDoc(event)" onblur="quitasuge33()">
                    <div id="suggestions33" style="background: #fff;"></div>
                    <!-- <div id="suggestions"></div> -->
                    <!-- <input hidden type="text" name="numero_documento2" id="numero_documento2" value="-"> -->
                  </div>

                  <div class="col-sm-6 mb-2 doc_ruc">
                    <label for="numero_documento2" class="label-data">Ruc <small>(Busqueda automática):</small>:</label>
                    <input type="text" class="form-control" name="numero_documento2" id="numero_documento2" maxlength="11"
                      placeholder="RUC DE CLIENTE-ENTER" onkeypress="agregarClientexRuc(event)" onblur="quitasuge1()">
                    <div id="suggestions" style="background: #fff;"></div>
                  </div>

                  <div class="col-sm-6 mb-2 doc_dni">
                    <label for="razon_social" class="label-data">Nombres y apellidos:</label>
                    <input type="text" class="form-control" name="razon_social" id="razon_social" maxlength="50"
                      placeholder="NOMBRE COMERCIAL" width="50x" value="-" required="true" onkeyup="mayus(this);"
                      onkeypress="focusDir(event)" onblur="quitasuge22()">
                    <div id="suggestions22"></div>
                    <!-- <input hidden type="text" name="razon_social2" id="razon_social2" value="-"> -->
                  </div>

                  <div class="col-sm-6 mb-2 doc_ruc">
                    <label for="razon_social2" class="label-data">Nombre comercial:</label>
                    <input type="text" class="form-control" name="razon_social2" id="razon_social2" required="true"
                      placeholder="NOMBRE COMERCIAL" onblur="quitasuge2()" onfocus="focusTest(this)">
                    <div id="suggestions2"></div>
                  </div>

                  <div class="col-sm-6 mb-2 doc_dni">
                    <label for="domicilio_fiscal" class="label-data">Dirección:</label>
                    <input type="text" class="form-control" name="domicilio_fiscal" id="domicilio_fiscal" value="-"
                      onkeyup="mayus(this);" placeholder="Dirección" onkeypress="agregarArt(event)">
                    <!-- <input hidden type="text" name="domicilio_fiscal2" id="domicilio_fiscal2" value="-"> -->
                  </div>

                  <div class="col-sm-6 mb-2 doc_ruc">
                    <label for="domicilio_fiscal2" class="label-data">Domicilio fiscal:</label>
                    <input type="text" class="form-control" name="domicilio_fiscal2" id="domicilio_fiscal2" required="true"
                      placeholder="DIRECCIÓN CLIENTE">
                  </div>

                  <div hidden class="col-sm-6 mb-2">
                    <label for=" guia_remision_25" class="">Nro Guia:</label>
                    <input type="text" name="guia_remision_25" id="guia_remision_25" class="form-control"
                      placeholder="NRO DE GUÍA">
                    <input hidden type="text" name="guia_remision_29_2" id="guia_remision_29_2">
                  </div>

                  <div hidden class="col-sm-6 mb-2">
                    <label for="nroreferencia" class="">Nro transferencia:</label>
                    <input type="text" name="nroreferencia" id="nroreferencia" class="form-control" style="color: blue;"
                      placeholder="N° Operación">
                  </div>


                  <!-- ************************HACER MODAL OBSERVACIONES*************-->

                  <div class="col-sm-12 mb-2">
                    <textarea name="descripcion_leyenda_26_2" id="descripcion_leyenda_26_2" cols="5" rows="3"
                      class="form-control" placeholder="Observaciones"></textarea>
                    <textarea hidden name="descripcion_leyenda_2" id="descripcion_leyenda_2"></textarea>
                  </div>
                  <!-- ************************TIPO DE PAGO*************-->

                  <div hidden class="col-sm-6 mb-2">
                    <label for="tipopago" class="col-form-label">Tipo de pago:</label>
                    <!-- <select class="form-select" name="tipopago" id="tipopago" onchange="contadocredito()"> -->
                    <select class="form-select" name="tipopago" id="tipopago">
                      <option value="nn">SELECCIONE LA FORMA DE PAGO</option>
                      <option value="Contado" selected>CONTADO</option>
                      <option value="Credito">CRÉDITO</option>

                    </select>
                  </div>


                  <input type="hidden" name="codigob" id="codigob">
                  <input type="hidden" name="ccuotas" id="ccuotas">
                  <input type="hidden" name="tadc" id="tadc">
                  <input type="hidden" name="trans" id="trans">
                  <input type="hidden" name="itemno" id="itemno">

                  <!-- ***********************FACTURA*************-->
                  <input type="hidden" name="correo" id="correo" value="">
                  <input type="hidden" name="unidadMedida" id="unidadMedida" value="original">
                  <input type="hidden" name="afectacion_igv_3" id="afectacion_igv_3" value="">
                  <input type="hidden" name="afectacion_igv_4" id="afectacion_igv_4" value="">
                  <input type="hidden" name="afectacion_igv_5" id="afectacion_igv_5" value="">
                  <input type="hidden" name="afectacion_igv_6" id="afectacion_igv_6" value="">
                  <input type="hidden" name="iglobal" id="iglobal" value='18.00'>
                  <input type="hidden" name="correocli" id="correocli" value="">


                  <div class="card-footer p-0"></div>

                </div>
              </div>
              <div class="col-12 pe-2 ps-3 contenedor"
                style="height: calc(100vh - 375px); overflow: scroll; overflow-x: hidden; overflow-y: visible; min-height: 147px;">

                <div class="items-order">

                </div>
              </div>


              <div class="card-footer" >

                <div class="row">

                  <div class="col-12">

                    <div class="row mb-2">
                      <small class="col-5 fw-500 text-black col-form-label d-flex justify-content-between p-0 ps-2">
                        Sub Total <span class="fw-bold fs-6">S/ </span></small>
                      <input type="text" class="col fw-bold fs-6 form-control-plaintext text-end p-0 pe-2" readonly
                        name="subtotal_boleta" id="subtotal_boleta" value="0.00">
                      <input hidden type="text" name="subtotal_factura" id="subtotal_factura" value="0.00">

                    </div>
                    <div class="row mb-2">
                      <small class="col-5 fw-500 text-black col-form-label d-flex justify-content-between p-0 ps-2">
                        I.G.V 18% <span class="fw-bold fs-6">S/ </span></small>
                      <input type="text" class="col fw-bold fs-6 form-control-plaintext text-end p-0 pe-2" readonly
                        name="total_igv" id="total_igv" value="0.00">
                    </div>

                    <hr>

                    <div class="row mb-3">
                      <span class="col-5 fw-500 fs-6 text-blue col-form-label d-flex justify-content-between p-0 ps-2">
                        Total <span class="fw-bold text-success fs-6">S/ </span></span>
                      <input type="text" class="col fw-bold text-success fs-6 form-control-plaintext text-end p-0 pe-2"
                        readonly name="totalpagar" id="totalpagar" value="0.00">

                    </div>

                    <input type="hidden" name="pre_v_u" id="pre_v_u">

                    <input type="hidden" name="total_icbper" id="total_icbper" value="0">
                    <input type="hidden" name="total_dcto" id="total_dcto" value="0">
                    <!-- <input type="hidden" name="ipagado_final" id="ipagado_final" value="0"> -->
                    <input type="hidden" name="total_final" id="total_final" >
                    <!-- <input type="hidden" name="saldo_final" id="saldo_final" value="0"> -->

                  </div>


                  <div class="col-12">
                    <button type="button" class="btn btn-blue w-100 fw-500" id="btn_metodopago">Pasar a caja</button>

                  </div>

                </div>
              </div>


            </div>
          </div>

        </div>
      </div>


      </div>

      <!-- RADIO BUTTON -->

      <!-- Modal -->
      <div class="modal fade" id="modal_metodopago" tabindex="-1" aria-labelledby="modal_metodopago" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Método de Pago</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

            </div>
            <div class="modal-body">

              <div class="row">
                <div class="col-lg-7">
                  <div class="mb-3 row fw-600 fs-6">
                    <label for="p_pedido" class="col-sm-4 col-form-label d-flex justify-content-between">Total Pedido
                      <span>S/.</span></label>
                    <div class="col-sm-4">
                      <input type="text" readonly class="form-control-plaintext not-spin text-end fw-600 fs-6" id="p_pedido"
                        value="0.00">
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="efectivo" class="col-sm-4 col-form-label">Efectivo</label>
                    <div class="input-group-no-width col-sm-5">
                      <!-- <input type="number" class="form-control" id="p_contado"> -->
                      <input type="text" class="form-control calculator-input" name="efectivo" id="efectivo" value="0">
                      <button type="button" class="btn btn-blue calculator-button"><i
                          class="fa-solid fa-calculator"></i></button>
                    </div>
                  </div>
                  <div hidden class="mb-3 row">
                    <label for="p_credito" class="col-sm-4 col-form-label">Crédito</label>
                    <div class="input-group-no-width col-sm-5">
                      <input disabled type="text" class="form-control calculator-input" id="p_credito" value="0">
                      <button disabled type="button" class="btn btn-blue calculator-button"><i
                          class="fa-solid fa-calculator"></i></button>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="visa" class="col-sm-4 col-form-label">Visa</label>
                    <div class="input-group-no-width col-sm-5">
                      <input type="text" class="form-control calculator-input" name="visa" id="visa" value="0">
                      <button type="button" class="btn btn-blue calculator-button"><i
                          class="fa-solid fa-calculator"></i></button>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="yape" class="col-sm-4 col-form-label">Yape</label>
                    <div class="input-group-no-width col-sm-5">
                      <input type="text" class="form-control calculator-input" name="yape" id="yape" value="0">
                      <button type="button" class="btn btn-blue calculator-button"><i
                          class="fa-solid fa-calculator"></i></button>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="plin" class="col-sm-4 col-form-label">Plin</label>
                    <div class="input-group-no-width col-sm-5">
                      <input type="text" class="form-control calculator-input" name="plin" id="plin" value="0">
                      <button type="button" class="btn btn-blue calculator-button"><i
                          class="fa-solid fa-calculator"></i></button>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="p_mastercard" class="col-sm-4 col-form-label">MasterCard</label>
                    <div class="input-group-no-width col-sm-5">
                      <input type="text" class="form-control calculator-input" name="mastercard" id="mastercard" value="0">
                      <button type="button" class="btn btn-blue calculator-button"><i
                          class="fa-solid fa-calculator"></i></button>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="deposito" class="col-sm-4 col-form-label">Depósito</label>
                    <div class="input-group-no-width col-sm-5">
                      <input type="text" class="form-control calculator-input" name="deposito" id="deposito" value="0">
                      <button type="button" class="btn btn-blue calculator-button"><i
                          class="fa-solid fa-calculator"></i></button>
                    </div>
                  </div>
                </div>

                <div class="col-lg-5">
                  <div class="teclado">

                    <h6>TECLADO</h6>

                    <div class="row">
                      <button type="button" class="design">1</button>
                      <button type="button" class="design">2</button>
                      <button type="button" class="design">3</button>
                      <button type="button" class="design not" id="backspace"><i
                          class="fa-solid fa-delete-left"></i></button>
                    </div>
                    <div class="row">
                      <button type="button" class="design">4</button>
                      <button type="button" class="design">5</button>
                      <button type="button" class="design">6</button>
                    </div>
                    <div class="row">
                      <button type="button" class="design">7</button>
                      <button type="button" class="design">8</button>
                      <button type="button" class="design">9</button>
                    </div>
                    <div class="row">
                      <button type="button" class="design">0</button>
                      <button type="button" class="design">00</button>
                      <button type="button" class="design">.</button>
                    </div>
                    <div class="row">
                      <button type="button" class="design not two" id="allClear">BORRAR TODO</button>
                    </div>

                  </div>
                </div>

                <div class="col-lg-7">
                  <div class="mb-0 row fw-600 fs-6">
                    <label for="ipagado_final" class="col-sm-4 col-form-label d-flex justify-content-between">Pago con
                      <span>S/.</span></label>
                    <div class="col-sm-4">
                      <input type="text" readonly class="form-control-plaintext not-spin text-end fw-600 fs-6"
                        name="ipagado_final" id="ipagado_final" value="0.00">
                    </div>
                  </div>
                  <div class="row fw-600 fs-17">
                    <label for="saldo_final" id="text_vuelto"
                      class="col-sm-4 col-form-label d-flex justify-content-between">Vuelto
                      <span>S/.</span></label>
                    <div class=" col-sm-4">
                      <input type="text" readonly class="form-control-plaintext not-spin text-end fw-600 fs-17"
                        id="saldo_final" name="saldo_final" value="0.00">
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-blue" id="btn_realizarpago">Realizar Pago</button>
            </div>
          </div>
        </div>
      </div>

    </form>

    <!-- Modal -->
    <input type="hidden" name="idultimocom" id="idultimocom">
    <!-- Modal VISTA PREVIA IMPRESION -->
    <!-- <div class="modal fade" id="modalPreview" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" style="width: 100% !important;">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="modal-title">SELECCIONE EL FORMATO DE IMPRESIÓN</h4>
        </div>
        <div class="text-center">
          <a onclick="preticket()">
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src="../files/vistaprevia/ticket.jpg">
            </div>
          </a>
          <a onclick="prea42copias()">
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src="../files/vistaprevia/a42copias.jpg">
            </div>
          </a>
          <a onclick="prea4completo()">
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src="../files/vistaprevia/a4completo.jpg">
            </div>
          </a>
          <img src="../files/vistaprevia/hoja.jpg"> RECUERDE QUE PUEDE ENVIAR LOS COMPROBANTES POR CORREO. EVITE
          IMPRIMIR.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div> -->

    <!-- MODAL VISUALIZAR COMPROBANTE -->
    <!-- Modal a4-->
    <div class="modal fade text-left" id="modalPreview2" tabindex="-1" role="dialog" aria-labelledby="modalPreview2"
      aria-hidden="true">
      <div class="modal-dialog modal-lg" style="width: 100% !important;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalPreview2">PDF Boleta A4</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <iframe name="modalCom" id="modalCom" border="0" frameborder="0" width="100%" style="height: 800px;"
              marginwidth="1" src="">
            </iframe>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
              <i class="bx bx-x d-block d-sm-none"></i>
              <span class="d-none d-sm-block">Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL PRODUCTOS -->

     <!-- MODAL PRODUCTOS -->

     <div class="modal fade" id="modal_agregarproducto" tabindex="-1" aria-labelledby="modal_agregarproducto"
      aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Manejo de Cajas</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

          </div>
            <div class="modal-body">
            <style>
              .iframe-container {
                  position: relative;
                  overflow: hidden;
                  padding-top: 56.25%; /* Proporción 16:9 (para otras proporciones, ajusta este valor) */
              }

              .iframe-container iframe {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border: 0;
              }
          </style>

          <div class="iframe-container">
              <iframe src="../vistas/CajaPOS" frameborder="0"></iframe>
          </div>

             

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
      </div>
    </div>

    <style>
      @media (min-width: 1200px) {
        .modal-xl {
          max-width: 1340px !important;
        }
      }
    </style>
    <!-- MODAL LISTA DE VENTAS -->
    <div class="modal fade" id="ModalListaVentas" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Lista de ventas</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row">

                <div class="mb-3 col-lg-4">
                  <label for="fechaDesde" class="form-label">Fecha Desde:</label>
                  <input type="date" class="form-control" id="fechaDesde">
                </div>

                <div class="mb-3 col-lg-4">
                  <label for="fechaHasta" class="form-label">Fecha Hasta:</label>
                  <input type="date" class="form-control" id="fechaHasta">
                </div>

                <div class="mb-3 col-lg-4">
                  <label for="tipoComprobante" class="form-label">Tipo de Comprobante:</label>
                  <select class="form-select" id="tipoComprobante">
                    <option value="todos">Todos</option>
                    <option value="recibo">Boleta</option>
                    <option value="factura">Factura</option>
                    <option value="nota">Nota de Venta</option>
                   
                  </select>
                </div>

              </div>

            </form>
            <div class="col-md-12">

              <!-- centro -->
              <div class="table-responsive form-container">
                 <!-- Agrega tu propio botón para generar PDF -->
    
                <table style="text-align:center;" id="tbllistado" class="table text-nowrap table-bordered" cellspacing="0" width="100%">
                  <thead>
                    <th hidden>ID</th>
                    <th>Fecha Emisión</th>
                    <th>Cliente</th>
                    <th>Producto atendido</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <!-- <th>Tipo de comprobante</th>
                    <th>Nombre de articulos</th> -->
                    <!-- <th>Cantidad vendida</th> -->
                    <!-- <th>Total</th> -->
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <!-- <button type="button" class="btn btn-primary">Guardar cambios</button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CLIENTES -->

    <div class="modal fade text-left" id="ModalNcliente" tabindex="-1" role="dialog" aria-labelledby="ModalNcliente"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title" id="ModalNcliente">Añade nuevo cliente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">

            <form role="form" method="post" name="busqueda" id="busqueda">
              <div class="row">

                <div class="mb-3 col-lg-12">
                  <div class="input-group">
                    <span type="submit" style="cursor:pointer;" value="burcarclientesunat" name="btn-submit" id="btn-submit"
                      class="input-group-text">&#9769;</span>
                    <input type="number" class="form-control" name="nruc" id="nruc" placeholder="Ingrese RUC o DNI"
                      pattern="([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]|[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])"
                      autofocus>
                  </div>
                </div>

              </div>
            </form>

            <form name="formularioncliente" id="formularioncliente" method="POST">
              <div class="row">

                <input type="hidden" name="idpersona" id="idpersona">
                <input type="hidden" name="tipo_persona" id="tipo_persona" value="cliente">

                <div class="mb-3 col-lg-6">
                  <label class="col-form-label">Tipo Doc.:</label>
                  <select class="form-control select-picker" name="tipo_documento" id="tipo_documento" required>
                    <option value="6"> RUC </option>
                  </select>
                </div>

                <div class="mb-3 col-lg-6">
                  <label for="message-text" class="col-form-label">N° Doc:</label>
                  <input type="text" class="form-control" name="numero_documento3" id="numero_documento3" maxlength="20"
                    placeholder="Documento" onkeypress="return focusRsocial(event, this)">
                </div>

                <div class="mb-3 col-lg-6">
                  <label for="message-text" class="col-form-label">Razon Social:</label>
                  <input type="text" class="form-control" name="razon_social" id="razon_social3" maxlength="100"
                    placeholder="Razón social" required onkeypress="return focusDomi(event, this)">
                </div>

                <div class="mb-3 col-lg-6">
                  <label for="message-text" class="col-form-label">Domicilio Fizcal:</label>
                  <input type="text" class="form-control" name="domicilio_fiscal" id="domicilio_fiscal3"
                    placeholder="Domicilio fiscal" required onkeypress="focustel(event, this)">
                </div>

                <div class="mb-3 col-lg-6">
                  <label for="iddepartamento" class="col-form-label">Departamento:</label>
                  <input type="text" class="form-control" name="iddepartamento" id="iddepartamento"
                    onchange="llenarCiudad()">

                  <!-- <select name="iddepartamento" class="form-select" id="iddepartamento" onchange="llenarCiudad()"></select> -->
                </div>

                <div class="mb-3 col-lg-6">
                  <label for="idciudad" class="col-form-label">Ciudad:</label>
                  <input type="text" class="form-control" name="idciudad" id="idciudad" onchange="llenarDistrito()">
                  <!-- <select name="idciudad" class="form-select" id="idciudad"
                    onchange="llenarDistrito()"></select> -->

                </div>

                <div class="mb-3 col-lg-6">
                  <label for="iddistrito" class="col-form-label">Distrito:</label>
                  <input type="text" class="form-control" name="iddistrito" id="iddistrito">
                  <!-- <select class="form-select" name="iddistrito" id="iddistrito"></select> -->
                </div>

                <div class="mb-3 col-lg-6">
                  <label for="message-text" class="col-form-label">Teléfono:</label>
                  <input type="number" class="form-control" name="telefono1" id="telefono1" maxlength="15"
                    placeholder="Teléfono 1"
                    pattern="([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]|[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])"
                    onkeypress="return focusemail(event, this)">
                </div>

                <div class="mb-3 col-lg-6">
                  <label for="message-text" class="col-form-label">Correo:</label>
                  <input type="text" class="form-control" name="email" id="email" maxlength="50" placeholder="CORREO"
                    onkeypress="return focusguardar(event, this)">
                </div>

              </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
              <i class="bx bx-x d-block d-sm-none"></i>
              <span class="d-none d-sm-block">Cancelar</span>
            </button>
            <button type="submit" id="btnguardarncliente" name="btnguardarncliente" class="btn btn-primary ml-1"
              data-bs-dismiss="modal">
              <i class="bx bx-check d-block d-sm-none"></i>
              <span class="d-none d-sm-block">Agregar</span>
            </button>
          </div>

          </form>

          <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"
            integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4"
            crossorigin="anonymous"></script>
          <script src="scripts/ajaxview.js"></script>

          <script>
            //============== original ===========================================================
            $(document).ready(function () {
              $("#btn-submit").click(function (e) {
                var $this = $(this);
                e.preventDefault();
                //============== original ===========================================================

                var documento = $("#nruc").val();
                $.post("../ajax/factura.php?op=listarClientesfacturaxDoc&doc=" + documento, function (data, status) {
                  data = JSON.parse(data);
                  if (data != null) {
                    swal.fire({
                      title: "Ya esta registrado cliente, se agregarán sus datos!",
                      type: "success",
                      timer: 2000,
                      showConfirmButton: false
                    });
                    $('#idpersona').val(data.idpersona);
                    $('#numero_documento2').val(data.numero_documento);
                    $("#razon_social2").val(data.razon_social);
                    $('#domicilio_fiscal2').val(data.domicilio_fiscal);
                    $('#correocli').val(data.email);
                    document.getElementById("btnAgregarArt").style.backgroundColor = '#367fa9';
                    document.getElementById("btnAgregarArt").focus();
                    $("#ModalNcliente").modal('hide');
                  }
                  else {

                    //var numero = $('#nruc').val(), url_s = "consulta.php",parametros = {'dni':numero};
                    var numero = $('#nruc').val(),
                      //url_s = "https://incared.com/api/apirest";
                      url_s = "../ajax/factura.php?op=consultaRucSunat&nroucc=" + numero;
                    parametros = { 'action': 'getnumero', 'numero': numero }

                    if (numero == '') {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Atención',
                        text: 'El campo documento está vacío',
                        showConfirmButton: false,
                        timer: 1500
                      });
                      //$.ajaxunblock();
                    } else {
                      $.ajax({
                        type: 'POST',
                        url: url_s,
                        dataType: 'json',
                        //data:parametros,

                        beforeSend: function () {
                        },
                        complete: function (data) {

                        },
                        success: function (data) {
                          $('.before-send').fadeOut(500);
                          if (!jQuery.isEmptyObject(data.error)) {
                            alert(data.error);
                          } else {

                            $("#numero_documento3").val(data.numeroDocumento);
                            $('#razon_social3').val(data.nombre);
                            $('#domicilio_fiscal3').val(data.direccion);
                            $('#iddistrito').val(data.distrito);
                            $('#idciudad').val(data.provincia);
                            $('#iddepartamento').val(data.departamento);
                          }
                          //$.unblockUI();
                          //$.ajaxunblock();
                        },
                        error: function (data) {
                          alert("Problemas al tratar de enviar el formulario");
                          //$.unblockUI();
                          //$.ajaxunblock();
                        }
                      });
                    }

                    document.getElementById("btnguardarncliente").focus();
                    //============== original ===========================================================

                  }
                  //============== original ===========================================================
                });

              });

              $('#ModalNcliente').on('shown.bs.modal', function (e) {
                $("#btn-submit").trigger("click"); // Simula un clic en el botón para ejecutar la lógica que ya tienes definida
              });

              $('#ModalNcliente').on('hidden.bs.modal', function (e) {
                // Encuentra todos los campos de entrada dentro del modal y los limpia
                $(this).find('input').val('');
              });
            });
          </script>

        </div>
      </div>
    </div>

    <?php
  } else {
    require 'noacceso.php';
  }

  require 'template/footer-pos.php';
  ?>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
  <script type="text/javascript" src="scripts/pos.js"></script>


  <script>

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    const swiper = new Swiper('.swiper', {
      // Optional parameters
      direction: 'horizontal',
      autoplay: true,
      slidesPerView: 'auto',
      spaceBetween: 10,
      // allowTouchMove: false,
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

    });


    const searchToggles = document.querySelectorAll(".searchToggle");

    searchToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const isActive = toggle.classList.contains("active");

        // Desactiva todos los botones
        searchToggles.forEach((t) => {
          t.classList.remove("active");
        });

        // Activa solo el botón que se hizo clic si no estaba activo
        if (!isActive) {
          toggle.classList.add("active");
        }
      });
    });

  </script>

  <script>

    document.getElementById('fullscreen').addEventListener('click', toggleFullScreen);

    function toggleFullScreen() {
      if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }

  </script>

  
  <?php
}
ob_end_flush();
?>