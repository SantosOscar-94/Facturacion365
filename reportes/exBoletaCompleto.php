<?php
//Activamos el almacenamiento en el buffer
ob_start();
if (strlen(session_id()) < 1)
    session_start();

if (!isset($_SESSION["nombre"])) {
    echo 'Debe ingresar al sistema correctamente para visualizar el reporte';
} else {
    if ($_SESSION['Ventas'] == 1) {
        ?>
        <html lang="es">

        <head>

            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="../files/assetsa4/css/style.css" rel="stylesheet" type="text/css">

        </head>
<!-- onload="window.print();" -->
        <body >
                <?php

        //Incluímos la clase Venta
        require_once "../modelos/Boleta.php";
        require_once "../modelos/Factura.php";
        //Instanciamos a la clase con el objeto venta
        $boleta = new Boleta();
        $factura = new Factura();
        $datos = $factura->datosempImpresiones($_SESSION['idempresa']);
        //$datose = $datos->fetch_object();

        //En el objeto $rspta Obtenemos los valores devueltos del método ventacabecera del modelo
        $rspta = $boleta->ventacabecera($_GET["id"], $_SESSION['idempresa']);




        //Recorremos todos los valores obtenidos
        $reg = $rspta->fetch_object();
        $datose = $datos->fetch_object();
        $cuotas = explode(",", $reg->cuotas);

        $logo = "../files\logo\\" . $datose->logo;

        //$logo = $datose->rutalogo.$datose->logo;

        $ext_logo = substr($datose->logo, strpos($datose->logo, '.'), -4);


        if ($reg->nombretrib == "IGV") {
            $nombretigv = $reg->subtotal;
            $nombretexo = "0.00";
        } else if ($reg->nombretrib == "EXO") {
            $nombretigv = "0.00";
            $nombretexo = $reg->subtotal;
        } else {
            // En caso de otros valores, puedes establecer un valor predeterminado o manejarlo como desees
            $nombretigv = "0.00";
            $nombretexo = "0.00";
        }

        
        switch ($reg->estado) {
          case 5:
              $mensaje = "Aceptado";
              break;
          case 3:
              $mensaje = "Anulado";
              $background = 'background: url(../files/anulacion.png);';  // Fondo diferente para Anulado
              break;
          case 1:
              $mensaje = "Emitido";
              break;
          case 0:
                $mensaje = "Observado no enviado";
                break;
          default:
              $mensaje = "Otro estado";
        }

        ?>  

<div class="tm_container">
    <div class="tm_invoice_wrap">
      <? 
       echo "<div class='tm_invoice tm_style2 tm_type1 tm_accent_border tm_radius_0 tm_small_border' id='tm_download_section' style='{$background}, background-repeat: no-repeat;background-position: center, center;
       background-size: cover; '>";
       ?>
        <div class="tm_invoice_in">
          <div class="tm_invoice_head tm_mb15 tm_m0_md">
            <div class="tm_invoice_left">
              <div class="tm_logo"> <img src="<?php echo $logo; ?>"></div>
            </div>
            <div class="tm_invoice_right">
              <div class="tm_grid_row tm_col_3">
                <div class="tm_text_center">
                  <p class="tm_accent_color tm_mb0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                      fill="currentColor">
                      <path
                        d="M424 80H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h336a56.06 56.06 0 0056-56V136a56.06 56.06 0 00-56-56zm-14.18 92.63l-144 112a16 16 0 01-19.64 0l-144-112a16 16 0 1119.64-25.26L256 251.73l134.18-104.36a16 16 0 0119.64 25.26z" />
                    </svg>
                  </p>
                  <?php echo utf8_decode(strtolower($datose->correo)); ?>
                </div>
                <div class="tm_text_center">
                  <p class="tm_accent_color tm_mb0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                      fill="currentColor">
                      <path
                        d="M391 480c-19.52 0-46.94-7.06-88-30-49.93-28-88.55-53.85-138.21-103.38C116.91 298.77 93.61 267.79 61 208.45c-36.84-67-30.56-102.12-23.54-117.13C45.82 73.38 58.16 62.65 74.11 52a176.3 176.3 0 0128.64-15.2c1-.43 1.93-.84 2.76-1.21 4.95-2.23 12.45-5.6 21.95-2 6.34 2.38 12 7.25 20.86 16 18.17 17.92 43 57.83 52.16 77.43 6.15 13.21 10.22 21.93 10.23 31.71 0 11.45-5.76 20.28-12.75 29.81-1.31 1.79-2.61 3.5-3.87 5.16-7.61 10-9.28 12.89-8.18 18.05 2.23 10.37 18.86 41.24 46.19 68.51s57.31 42.85 67.72 45.07c5.38 1.15 8.33-.59 18.65-8.47 1.48-1.13 3-2.3 4.59-3.47 10.66-7.93 19.08-13.54 30.26-13.54h.06c9.73 0 18.06 4.22 31.86 11.18 18 9.08 59.11 33.59 77.14 51.78 8.77 8.84 13.66 14.48 16.05 20.81 3.6 9.53.21 17-2 22-.37.83-.78 1.74-1.21 2.75a176.49 176.49 0 01-15.29 28.58c-10.63 15.9-21.4 28.21-39.38 36.58A67.42 67.42 0 01391 480z" />
                    </svg>
                  </p>
                  <?php echo utf8_decode($datose->telefono1) . ' - ' . $datose->telefono2;?> <br>
                  
                </div>
                <div class="tm_text_center">
                  <p class="tm_accent_color tm_mb0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"
                      fill="currentColor">
                      <circle cx="256" cy="192" r="32" />
                      <path
                        d="M256 32c-88.22 0-160 68.65-160 153 0 40.17 18.31 93.59 54.42 158.78 29 52.34 62.55 99.67 80 123.22a31.75 31.75 0 0051.22 0c17.42-23.55 51-70.88 80-123.22C397.69 278.61 416 225.19 416 185c0-84.35-71.78-153-160-153zm0 224a64 64 0 1164-64 64.07 64.07 0 01-64 64z" />
                    </svg>
                  </p>
                  <?php echo mb_convert_encoding($datose->domicilio_fiscal, 'UTF-8', 'auto'); ?>

                </div>
              </div>
            </div>
            <div class="tm_shape_bg tm_accent_bg_10 tm_border tm_accent_border_20"></div>
          </div>
          <div class="tm_invoice_info tm_mb10 tm_align_center">
            <div class="tm_invoice_info_left tm_mb20_md">
              <p class="tm_mb0">
                <b class="tm_primary_color">Comprobante: </b><?php echo $reg->numeracion_07; ?> <br>
                <b class="tm_primary_color">Fecha emisión: </b><?php echo $reg->fecha ?> <br>
                <b class="tm_primary_color">Hora: </b><?php echo $reg->hora; ?> 
              </p>
            </div>
            <div class="tm_invoice_info_right">
              <div class="tm_border tm_accent_border_20 tm_radius_0 tm_accent_bg_10 tm_curve_35 tm_text_center">
                <div>
                  <b class="tm_accent_color tm_f26 tm_medium tm_body_lineheight">Boleta de venta electrónica</b>
                </div>
              </div>
            </div>
          </div>
          <h2 class="tm_f16 tm_section_heading tm_accent_border_20 tm_mb0"><span
              class="tm_accent_bg_10 tm_radius_0 tm_curve_35 tm_border tm_accent_border_20 tm_border_bottom_0 tm_accent_color"><span>Dirigido
                a</span></span></h2>
          <div class="tm_table tm_style1 tm_mb20">
            <div class="tm_border  tm_accent_border_20 tm_border_top_0">
              <div class="tm_table_responsive">
              <table style="font-size:12px;">
                  <tbody>
                    <tr>
                      <td class="tm_width_6 tm_border_top_0">
                        <b class="tm_primary_color tm_medium">Cliente: </b><?php echo $reg->cliente; ?>
                      </td>
                      <td class="tm_width_6 tm_border_top_0 tm_border_left tm_accent_border_20">
                        <b class="tm_primary_color tm_medium">DNI: </b> <?php echo $reg->numero_documento; ?>
                      </td>
                    </tr>
                    <tr>
                      <td class="tm_width_6 tm_accent_border_20">
                        <b class="tm_primary_color tm_medium">Dirección: </b><?php echo $reg->direccion; ?>
                      </td>
                      <td class="tm_width_6 tm_border_left tm_accent_border_20">
                        <b class="tm_primary_color tm_medium">Tipo de pago: </b><?php echo $reg->tipopago; ?>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="tm_table tm_style1">
            <div class="tm_border tm_accent_border_20">
              <div class="tm_table_responsive">
                <table>
                  <thead>
                    <tr>
                      <th class="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10 tm-centrado">Nro</th>
                      <th class="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10 tm-centrado">Código</th>
                      <th class="tm_width_4 tm_semi_bold tm_accent_color tm_accent_bg_10 tm-centrado">Descripción</th>
                      <th class="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10 tm-centrado">Unidad</th>
                      <th class="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10">Cant.</th>
                      <th class="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10">Precio</th>
                      <th class="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10">Dscto.</th>
                      <th class="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10 tm-centrado">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody class="tm_texto_font_11">

                  <?php

                            //======= PARA EXTRAER EL HASH DEL DOCUMENTO FIRMADO ========================================
                            require_once "../modelos/Rutas.php";
                            $rutas = new Rutas();
                            $Rrutas = $rutas->mostrar2($_SESSION['idempresa']);
                            $Prutas = $Rrutas->fetch_object();
                            $rutafirma = $Prutas->rutafirma; // ruta de la carpeta FIRMA
                            $data[0] = "";

                            if ($reg->estado == '5') {
                                $boletaFirm = $reg->numero_ruc . "-" . $reg->tipo_documento_06 . "-" . $reg->numeracion_07;
                                $sxe = new SimpleXMLElement($rutafirma . $boletaFirm . '.xml', null, true);
                                $urn = $sxe->getNamespaces(true);
                                $sxe->registerXPathNamespace('ds', $urn['ds']);
                                $data = $sxe->xpath('//ds:DigestValue');
                            } else {
                                $data[0] = "";
                            }

                            //==================== PARA IMAGEN DEL CODIGO HASH ================================================
                            //set it to writable location, a place for temp generated PNG files
                            $PNG_TEMP_DIR = dirname(__FILE__) . DIRECTORY_SEPARATOR . '/generador-qr/temp' . DIRECTORY_SEPARATOR;
                            //html PNG location prefix
                            $PNG_WEB_DIR = 'temp/';
                            include 'generador-qr/phpqrcode.php';

                            //ofcourse we need rights to create temp dir
                            if (!file_exists($PNG_TEMP_DIR))
                                mkdir($PNG_TEMP_DIR);
                            $filename = $PNG_TEMP_DIR . 'test.png';

                            //processing form input
                            //remember to sanitize user input in real-life solution !!!
                            $dataTxt = $reg->numero_ruc . "|" . $reg->tipo_documento_06 . "|" . $reg->serie . "|" . $reg->numerofac . "|0.00|" . $reg->Itotal . "|" . $reg->fecha2 . "|" . $reg->tipo_documento . "|" . $reg->numero_documento . "|";
                            ;
                            $errorCorrectionLevel = 'H';
                            $matrixPointSize = '2';

                            // user data
                            $filename = 'generador-qr/temp/test' . md5($dataTxt . '|' . $errorCorrectionLevel . '|' . $matrixPointSize) . '.png';
                            QRcode::png($dataTxt, $filename, $errorCorrectionLevel, $matrixPointSize, 2);
                            $PNG_WEB_DIR . basename($filename);
                            // //==================== PARA IMAGEN DEL CODIGO HASH ================================================

                            $logoQr = $filename;
                            $ext_logoQr = substr($filename, strpos($filename, '.'), -4);

                            //===============SEGUNDA COPIA DE BOLETA=========================
                            $rsptad = $boleta->ventadetalle($_GET["id"]);
                            $cantidad = 0;
                            while ($regd = $rsptad->fetch_object()) {

                                if ($regd->nombretribu == "IGV") {
                                    $pv = $regd->precio;
                                    $subt = $regd->subtotal;
                                } else {
                                    $pv = $regd->precio;
                                    $subt = $regd->subtotal2;

                                }
                                echo "<tr>";
                                echo "<td class='tm_width_1 tm_accent_border_20 tm-centrado'>" . ($regd->norden) . "</td>";
                                echo "<td class='tm_width_2 tm_accent_border_20 tm-centrado'>" . ($regd->codigo) . "</td>";
                                echo "<td class='tm_width_4 tm_accent_border_20'>" . strtolower($regd->articulo) . "</td>";
                                echo "<td class='tm_width_2 tm_accent_border_20 tm-centrado'>" . ($regd->umedidacompra) . "</td>";
                                echo "<td class='tm_width_1 tm_accent_border_20 tm-centrado'>" . $regd->cantidad_item_12 . "</td>";
                                echo "<td class='tm_width_1 tm_accent_border_20 tm-centrado'>" . number_format($pv, 2) . "</td>";
                                echo "<td class='tm_width_1 tm_accent_border_20 tm-centrado'>" . number_format($regd->dcto_item, 2) . "</td>";
                                
                                echo "<td class='tm_width_2 tm_accent_border_20 tm-centrado'>" . $subt . "</td>";
                                echo "</tr>";
                                $cantidad += $regd->cantidad_item_12;
                            }
                            ?>
                    
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tm_invoice_footer tm_mb15 tm_m0_md">
             
              <div class="tm_left_footer">

              <?php
              
              // <p class="tm_mb2"><b class="tm_primary_color">Payment info:</b></p>
              // <p class="tm_m0">Jhon Doe <br>Credit Card - 236***********928 <br>Amount: $315</p>
              if ($reg->tipopago == "Contado") {
                
                  echo "<p class='tm_mb2'><b class='tm_primary_color'>Métodos de pago:</b>";
                  // Abrir fila de los nombres de los tipos de pago

                  if ($reg->yape > 0) {
                      echo "<p class='tm_m0'>Yape : s/ $reg->yape </p>";
                  }

                  if ($reg->visa > 0) {
                    echo "<p class='tm_m0'>Visa : s/ $reg->yape </p>";
                  }

                  if ($reg->efectivo > 0) {
                      echo "<p class='tm_m0'>Efectivo : s/ $reg->efectivo </p>";
                  }

                  if ($reg->plin > 0) {
                    echo "<p class='tm_m0'>Plin : s/ $reg->yape </p>";
                  }

                  if ($reg->masterC > 0) {
                    echo "<p class='tm_m0'>Marter Card : s/ $reg->yape </p>";
                  }

                  if ($reg->dep > 0) {
                    echo "<p class='tm_m0'>Depsito Bancario : s/ $reg->yape </p>";
                  }

                

              } elseif ($reg->tipopago == "Credito") {
                  echo "<tr><td>";
                  $cuotas = explode(",", $reg->cuotas);
                  echo "<table>";
                  echo "<tr><th>Nro Cuota</th><th>Monto</th><th>Fecha</th></tr>";
                  foreach ($cuotas as $c) {
                      $detalles = explode("|", $c);
                      echo "<tr>";
                      echo "<td>" . $detalles[0] . "</td>";
                      echo "<td>" . $detalles[1] . "</td>";
                      echo "<td>" . $detalles[2] . "</td>";
                      echo "</tr>";
                  }
                  echo "</table>";
                  echo "</td></tr>";
              }
              ?>


              </div>
              <div class="tm_right_footer tm_pt0">
              <!-- tm_mb15 tm_m0_md -->
                <table class="">
             
                  <tbody>
                    <tr>
                     <?php if ($reg->tdescuento > 0): ?>
                      <td class="tm_width_3 tm_danger_color tm_border_none">Descuento</td>
                      <td class="tm_width_3 tm_danger_color tm_text_right tm_border_none"><?php echo $reg->tdescuento ?></td>
                      <?php endif; ?>
                    </tr>
                    <tr>
                    <?php if ($nombretigv > 0): ?>
                      <td class="tm_width_3 tm_primary_color tm_border_none tm_medium tm_pt0">Op. Gravada</td>
                      <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_medium tm_pt0"><?php echo $nombretigv; ?></td>
                      <?php endif; ?>
                    </tr>
                    <tr>
                    <?php if ($nombretexo > 0): ?>
                      <td class="tm_width_3 tm_primary_color tm_border_none tm_medium tm_pt0">Op. Exonerado</td>
                      <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_medium tm_pt0"><?php echo $nombretexo; ?></td>
                      <?php endif; ?>
                    </tr>
                    <tr>
                    <?php if ($reg->igv > 0): ?>
                      <td class="tm_width_3 tm_primary_color tm_border_none tm_pt0">I.G.V.</td>
                      <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0"><?php echo $reg->igv ?></td>
                      <?php endif; ?>
                    </tr>
                    <tr>
                    <?php if ($reg->ipagado > 0): ?>
                      <td class="tm_width_3 tm_primary_color tm_border_none tm_pt0">Importe pagado</td>
                      <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0"><?php echo $reg->ipagado ?></td>
                      <?php endif; ?>
                    </tr>
                    <tr>
                      <td class="tm_width_3 tm_primary_color tm_border_none tm_pt0">Vuelto</td>
                      <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0"><?php echo $reg->saldo ?></td>
                    </tr>
                    <tr class="tm_accent_border_20 tm_border">
                      <td class="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_accent_bg_10">Total a pagar
                      </td>
                      <td class="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_text_right tm_accent_bg_10"> <?php echo $reg->Itotal ?></td>
                    </tr>
               
                    <tr>
                    <?php
                      require_once "Letras.php";
                      $V = new EnLetras();
                      $con_letra = strtoupper($V->ValorEnLetras($reg->Itotal, "NUEVOS SOLES"));
                      echo "<td class='tm_width_del100' style='width: 100%;font-size: smaller;'>SON: " . $con_letra . "</td>";
                    ?>
                    </tr>
                      
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tm_invoice_footer tm_type1">
              <div class="tm_left_footer">
              <?php
              
              // <p class="tm_mb2"><b class="tm_primary_color">Payment info:</b></p>
              // <p class="tm_m0">Jhon Doe <br>Credit Card - 236***********928 <br>Amount: $315</p>
            

                  if ($datose->cuenta1 > 0) {
                    echo "<p class='tm_mb2'><b class='tm_primary_color'>Cuentas Bancarias:</b>";
                  }
              
                  // Abrir fila de los nombres cuenta bancario
                  if ($datose->cuenta1 > 0) {
                      echo "<p class='tm_m0'>" . $datose->banco1 . ": " . $datose->cuenta1 . " - " . " CCI : " . $datose->cuentacci1 . "</p>";
                  }

                  if ($datose->cuenta2 > 0) {
                    echo "<p class='tm_m0'>" . $datose->banco2 . ": " . $datose->cuenta2 . " - " . " CCI : " . $datose->cuentacci2 . "</p>";
                  }

                  if ($datose->cuenta3 > 0) {
                    echo "<p class='tm_m0'>" . $datose->banco3 . ": " . $datose->cuenta3 . " - " . " CCI : " . $datose->cuentacci3 . "</p>";
                  }

                  if ($datose->cuenta4 > 0) {
                    echo "<p class='tm_m0'>" . $datose->banco4 . ": " . $datose->cuenta4 . " - " . " CCI : " . $datose->cuentacci4 . "</p>";
                  }
             

                 
                 
              
                  
        
              ?>
              </div>
              <div class="tm_right_footer">
                <div class="tm_signqr tm_text_center">
                    <img src=<?php echo $logoQr; ?> ><br>
                    <label>
                        <?php echo $reg->hashc;
                    ?>
                    </label>
                    <br>
                    <br>
                    <label class="tm_m0 tm_f12">Representación impresa de la Boleta de Venta Electrónica puede ser consultada en
                        <?php echo utf8_decode(htmlspecialchars_decode($datose->webconsul)) ?>
                    </label>
     
                </div>
              </div>
            </div>
          </div>
          <div class="tm_bottom_invoice tm_accent_border_20">
            <div class="tm_bottom_invoice_left">
              <p class="tm_m0 tm_f18 tm_accent_color tm_mb5">::.GRACIAS POR SU COMPRA.::</p>
              <?php 
                echo "<p class='tm_primary_color tm_f12 tm_m0 tm_bold'>El comprobante " . $reg->numeracion_07 . " a sido " . $mensaje . "</p>";
              ?>
              
            </div>
            <div class="tm_bottom_invoice_right tm_mobile_hide">
              <div class="tm_logo"><img src="<?php echo $logo; ?>"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tm_invoice_btns tm_hide_print">
      <a href="javascript:window.print()" class="tm_invoice_btn tm_color1">
                <span class="tm_btn_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
                        <path
                            d="M384 368h24a40.12 40.12 0 0040-40V168a40.12 40.12 0 00-40-40H104a40.12 40.12 0 00-40 40v160a40.12 40.12 0 0040 40h24"
                            fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" />
                        <rect x="128" y="240" width="256" height="208" rx="24.32" ry="24.32" fill="none"
                            stroke="currentColor" stroke-linejoin="round" stroke-width="32" />
                        <path d="M384 128v-24a40.12 40.12 0 00-40-40H168a40.12 40.12 0 00-40 40v24" fill="none"
                            stroke="currentColor" stroke-linejoin="round" stroke-width="32" />
                        <circle cx="392" cy="184" r="24" fill='currentColor' />
                    </svg>
                </span>
                <span class="tm_btn_text">Imprimir</span>
            </a>
    
      </div>
    </div>
  </div>
  
</body>

        </html>
        <?php
    } else {
        echo 'No tiene permiso para visualizar el reporte';
    }

}
ob_end_flush();
?>