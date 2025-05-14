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
            <!-- <link href="../public/css/ticket.css" rel="stylesheet" type="text/css"> -->
            <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&amp;display=swap');

        *,
        ::after,
        ::before {
            box-sizing: border-box;
        }

        body {
            color: #000;
            font-size: 12px;
            font-weight: 400;
            line-height: 1.4em;
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f5f6fa;
        }

        .tm_pos_invoice_wrap {
            max-width: 340px;
            margin: auto;
            margin-top: 0px;
            padding: 30px 20px;
            background-color: #fff;
        }

        .tm_pos_company_logo {
            display: flex;
            justify-content: center;
            margin-bottom: 7px;
        }

        .tm_pos_company_logo img {
            vertical-align: middle;
            border: 0;
            max-width: 100%;
            height: auto;
            max-height: 45px;
        }

        .tm_pos_invoice_top {
            text-align: center;
            margin-bottom: 18px;
        }

        .tm_pos_invoice_heading {
            display: flex;
            justify-content: center;
            position: relative;
            text-transform: uppercase;
            font-size: 12px;
            font-weight: 500;
            margin: 10px 0;
        }

        .tm_pos_invoice_heading:before {
            content: '';
            position: absolute;
            height: 0;
            width: 100%;
            left: 0;
            top: 46%;
            border-top: 1px dashed #666;
        }

        .tm_pos_invoice_heading span {
            display: inline-flex;
            padding: 0 5px;
            background-color: #fff;
            z-index: 1;
            font-weight: 500;
            position: relative;
        }

        .tm_list.tm_style1 {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
        }

        .tm_list.tm_style1 li {
            display: flex;
            width: 50%;
            font-size: 12px;
            line-height: 1.2em;
            margin-bottom: 7px;
        }

        .text-right {
            text-align: right;
            justify-content: flex-end;
        }

        .tm_list_title {
            color: #111;
            margin-right: 4px;
            font-weight: 500;
        }

        .tm_invoice_seperator {
            width: 150px;
            border-top: 1px dashed #666;
            margin: 9px 0;
            margin-left: auto;
        }

        .tm_pos_invoice_table {
            width: 100%;
            margin-top: 2px;
            line-height: 1.3em;
            font-size: 10px;
        }

        .tm_pos_invoice_table thead th {
            font-weight: 500;
            color: #111;
            text-align: left;
            padding: 8px 3px;
            border-top: 1px dashed #666;
            border-bottom: 1px dashed #666;
        }

        .tm_pos_invoice_table td {
            padding: 4px;
        }

        .tm_pos_invoice_table tbody tr:first-child td {
            padding-top: 10px;
        }

        .tm_pos_invoice_table tbody tr:last-child td {
            padding-bottom: 10px;
            border-bottom: 1px dashed #666;
        }

        .tm_pos_invoice_table th:last-child,
        .tm_pos_invoice_table td:last-child {
            text-align: right;
            padding-right: 0;
        }

        .tm_pos_invoice_table th:first-child,
        .tm_pos_invoice_table td:first-child {
            padding-left: 0;
        }

        .tm_pos_invoice_table tr {
            vertical-align: baseline;
        }

        .tm_bill_list {
            list-style: none;
            margin: 0;
            padding: 12px 0;
            border-bottom: 1px dashed #666;
        }

        .tm_bill_list_in {
            display: flex;
            text-align: right;
            justify-content: flex-end;
            padding: 0px 0;
        }

        .tm_bill_title {
            padding-right: 20px;
        }

        .tm_bill_value {
            width: 90px;
        }

        .tm_bill_value.tm_bill_focus,
        .tm_bill_title.tm_bill_focus {
            font-weight: 500;
            color: #111;
        }

        .tm_pos_invoice_footer {
            text-align: center;
            margin-top: 20px;
        }

        .tm_pos_sample_text {
            text-align: center;
            padding: 12px 0;
            border-bottom: 1px dashed #666;
            line-height: 1.6em;
            color: #9c9c9c;
        }

        .tm_pos_company_name {
            font-weight: 500;
            color: #111;
            font-size: 13px;
            line-height: 1.4em;
        }

        /* Start Receipt Section */
        .tm_container {
            max-width: 480px;
            padding: 30px 15px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
        }

        @media (min-width: 575px) {
            .tm_invoice_btns {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -ms-flex-direction: column;
                flex-direction: column;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                margin-top: 0px;
                margin-left: 0;
                position: absolute;
                right: 0px;
                top: 30px;
                -webkit-box-shadow: -2px 0 24px -2px rgba(43, 55, 72, 0.05);
                box-shadow: -2px 0 24px -2px rgba(43, 55, 72, 0.05);
                border: 3px solid #fff;
                border-radius: 6px;
                background-color: #fff;
            }

            .tm_invoice_btn {
                display: -webkit-inline-box;
                display: -ms-inline-flexbox;
                display: inline-flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                border: none;
                font-weight: 600;
                cursor: pointer;
                padding: 0;
                background-color: transparent;
                position: relative;
            }

            .tm_invoice_btn svg {
                width: 24px;
            }

            .tm_invoice_btn .tm_btn_icon {
                padding: 0;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                height: 42px;
                width: 42px;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
            }

            .tm_invoice_btn .tm_btn_text {
                position: absolute;
                left: 100%;
                background-color: #111;
                color: #fff;
                padding: 3px 12px;
                display: inline-block;
                margin-left: 10px;
                border-radius: 5px;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                font-weight: 500;
                min-height: 28px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                opacity: 0;
                visibility: hidden;
            }

            .tm_invoice_btn .tm_btn_text:before {
                content: "";
                height: 10px;
                width: 10px;
                position: absolute;
                background-color: #111;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                left: -3px;
                top: 50%;
                margin-top: -6px;
                border-radius: 2px;
            }

            .tm_invoice_btn:hover .tm_btn_text {
                opacity: 1;
                visibility: visible;
            }

            .tm_invoice_btn:not(:last-child) {
                margin-bottom: 3px;
            }

            .tm_invoice_btn.tm_color1 {
                background-color: rgba(0, 122, 255, 0.1);
                color: #007aff;
                border-radius: 5px 5px 0 0;
            }

            .tm_invoice_btn.tm_color1:hover {
                background-color: rgba(0, 122, 255, 0.2);
            }

            .tm_invoice_btn.tm_color2 {
                background-color: rgba(52, 199, 89, 0.1);
                color: #34c759;
                border-radius: 0 0 5px 5px;
            }

            .tm_invoice_btn.tm_color2:hover {
                background-color: rgba(52, 199, 89, 0.2);
            }
        }

        @media (max-width: 574px) {
            .tm_invoice_btns {
                display: -webkit-inline-box;
                display: -ms-inline-flexbox;
                display: inline-flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                margin-top: 0px;
                margin-top: 20px;
                -webkit-box-shadow: -2px 0 24px -2px rgba(43, 55, 72, 0.05);
                box-shadow: -2px 0 24px -2px rgba(43, 55, 72, 0.05);
                border: 3px solid #fff;
                border-radius: 6px;
                background-color: #fff;
                position: relative;
                left: 50%;
                -webkit-transform: translateX(-50%);
                transform: translateX(-50%);
            }

            .tm_invoice_btn {
                display: -webkit-inline-box;
                display: -ms-inline-flexbox;
                display: inline-flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                border: none;
                font-weight: 600;
                cursor: pointer;
                padding: 0;
                background-color: transparent;
                position: relative;
                border-radius: 5px;
                padding: 6px 15px;
                text-decoration: none;
            }

            .tm_invoice_btn svg {
                width: 24px;
            }

            .tm_invoice_btn .tm_btn_icon {
                padding: 0;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                margin-right: 8px;
            }

            .tm_invoice_btn:not(:last-child) {
                margin-right: 3px;
            }

            .tm_invoice_btn.tm_color1 {
                background-color: rgba(0, 122, 255, 0.1);
                color: #007aff;
            }

            .tm_invoice_btn.tm_color1:hover {
                background-color: rgba(0, 122, 255, 0.2);
            }

            .tm_invoice_btn.tm_color2 {
                background-color: rgba(52, 199, 89, 0.1);
                color: #34c759;
            }

            .tm_invoice_btn.tm_color2:hover {
                background-color: rgba(52, 199, 89, 0.2);
            }
        }

        @media print {
            .tm_hide_print {
                display: none !important;
            }
        }

        /* End Receipt Section */
    </style>
        </head>

        <body onload="window.print();">
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

        ?>  
    <div class="tm_container">
        <div class="tm_pos_invoice_wrap" id="tm_download_section">
            <div class="tm_pos_invoice_top">
                <div class="tm_pos_company_logo">
                    <img src="<?php echo $logo; ?>" width="50" height="120">
                </div>
                <div class="tm_pos_company_name">.::<strong>
                        <?php echo utf8_decode(htmlspecialchars_decode($datose->nombre_comercial)) ?>
                    </strong>::.</div>
                <div class="tm_pos_company_ruc"><strong> R.U.C.
                        <?php echo $datose->numero_ruc; ?>
                    </strong></div>
                <div class="tm_pos_company_address"><?php echo mb_convert_encoding($datose->domicilio_fiscal, 'UTF-8', 'auto'); ?></div>
                <div class="tm_pos_company_mobile"><?php echo utf8_decode($datose->telefono1) . ' - ' . $datose->telefono2;?></div>
                <div class="tm_pos_company_mobile"><?php echo utf8_decode(strtolower($datose->correo)); ?></div>
            </div>
            <div class="tm_pos_invoice_body">
            <div class="tm_pos_invoice_heading"><span><strong> BOLETA DE VENTA ELECTRÓNICA </strong></span></div>
                <div class="tm_pos_invoice_heading"><span><strong> <?php echo $reg->numeracion_07; ?> </strong></span></div>
                <ul class="tm_list tm_style1">
                    <li>
                        <div class="tm_list_title">Cliente:</div>
                        <div class="tm_list_desc"> <?php echo $reg->cliente; ?></div>
                    </li>
                    <li class="text-right">
                        <div class="tm_list_title">DNI:</div>
                        <div class="tm_list_desc"> <?php echo $reg->numero_documento; ?></div>
                    </li>
                    <li>
                        <div class="tm_list_title">Dirección:</div>
                        <div class="tm_list_desc"> <?php echo $reg->direccion; ?></div>
                    </li>
                    <li class="text-right">
                        <div class="tm_list_title">Fecha</div>
                        <div class="tm_list_desc">  <?php echo $reg->fecha ?></div>
                    </li>
                    <li>
                        <div class="tm_list_title">Hora:</div>
                        <div class="tm_list_desc"> <?php echo $reg->hora; ?></div>
                    </li>
                    <li class="text-right">
                        <div class="tm_list_title">Moneda:</div>
                        <div class="tm_list_desc"> Soles</div>
                    </li>
                    <li>
                        <div class="tm_list_title">Atención:</div>
                        <div class="tm_list_desc"> <?php echo $reg->vendedorsitio; ?></div>
                    </li>
                    <li class="text-right">
                        <div class="tm_list_title">Tipo de pago:</div>
                        <div class="tm_list_desc"> <?php echo $reg->tipopago; ?></div>
                    </li>
                   
                </ul>
                <div>
                <?php if (!empty($reg->descripcion_leyenda_31_2)): ?>
                        <label for="">Observación: <?php echo $reg->descripcion_leyenda_31_2; ?></label>
                    <?php endif; ?>
                </div>

                <?php
        if ($reg->tipopago == "Contado") {
            echo "<div style='font-size: 12px;text-align: center;' class='tm_pos_invoice'><span><strong> Métodos de pago </strong></span></div>";

            
            echo "<table style='font-size:12px;position: relative;left: 21px;top: -3px'>"; // Abrir fila de los nombres de los tipos de pago

            if ($reg->yape > 0) {
                echo "<td><strong>Yape:</strong> $reg->yape</td>";
            }

            if ($reg->visa > 0) {
                echo "<td><strong>Visa:</strong> $reg->visa</td>";
            }

            if ($reg->efectivo > 0) {
                echo "<td><strong>Efectivo:</strong> $reg->efectivo</td>";
            }

            if ($reg->plin > 0) {
                echo "<td><strong>Plin:</strong> $reg->plin</td>";
            }

            if ($reg->masterC > 0) {
                echo "<td><strong>MasterC:</strong> $reg->masterC</td>";
            }

            if ($reg->dep > 0) {
                echo "<td><strong>Dep.</strong> $reg->dep</td>";
            }

            echo "</table>"; // Cerrar fila de los nombres

        

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
        
                <table class="tm_pos_invoice_table">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Cant.</th>
                            <th>U.M.</th>
                            <th>P.u</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
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
                                echo "<td>" . strtolower($regd->articulo) . "</td>";
                                echo "<td>" . $regd->cantidad_item_12 . "</td>";
                                echo "<td>" . $regd->umedidacompra . "</td>";
                                echo "<td>" . number_format($pv, 2) . "</td>";
                                echo "<td align='right'>" . $subt . "</td>";
                                echo "</tr>";
                                $cantidad += $regd->cantidad_item_12;
                            }
                            ?>
                    </tbody>
                </table>
                <div class="tm_bill_list">
                    
                    <div class="tm_bill_list_in">
                        <?php if ($tdescuento > 0): ?>
                            <div class="tm_bill_title">Descuento:</div>
                            <div class="tm_bill_value"><?php echo $tdescuento; ?></div>
                        <?php endif; ?>
                    </div>

                    <div class="tm_bill_list_in">
                        <?php if ($nombretigv > 0): ?>
                            <div class="tm_bill_title">Op. Gravada:</div>
                            <div class="tm_bill_value"><?php echo $nombretigv; ?></div>
                        <?php endif; ?>
                    </div>

                    <div class="tm_bill_list_in">
                        <?php if ($nombretexo > 0): ?>
                            <div class="tm_bill_title">Op. Exonerado:</div>
                            <div class="tm_bill_value"><?php echo $nombretexo; ?></div>
                        <?php endif; ?>
                    </div>

                    <div class="tm_bill_list_in">
                        <?php if (0.00 > 0): ?>
                            <div class="tm_bill_title">Op. Inafecto:</div>
                            <div class="tm_bill_value">0.00</div>
                        <?php endif; ?>
                    </div>

                    <div class="tm_invoice_seperator"></div>

                    <div class="tm_bill_list_in">
                        <?php if ($reg->igv > 0): ?>
                            <div class="tm_bill_title">I.G.V.:</div>
                            <div class="tm_bill_value"><?php echo $reg->igv ?></div>
                        <?php endif; ?>
                    </div>

                    <div class="tm_invoice_seperator"></div>

                    <div class="tm_bill_list_in">
                        <?php if ($reg->ipagado > 0): ?>
                            <div class="tm_bill_title">Importe pagado:</div>
                            <div class="tm_bill_value"><?php echo $reg->ipagado ?></div>
                        <?php endif; ?>
                    </div>

                    <div class="tm_bill_list_in">
                            <div class="tm_bill_title">Vuelto :</div>
                            <div class="tm_bill_value"><?php echo $reg->saldo ?></div>
                    </div>

                    <div class="tm_bill_list_in">
                        <?php if ($reg->Itotal > 0): ?>
                            <div class="tm_bill_title tm_bill_focus">Total a pagar:</div>
                            <div class="tm_bill_value tm_bill_focus"><?php echo $reg->Itotal ?></div>
                        <?php endif; ?>
                    </div>

                 
                </div>
                <?php
                require_once "Letras.php";
                $V = new EnLetras();
                $con_letra = strtoupper($V->ValorEnLetras($reg->Itotal, "NUEVOS SOLES"));
                echo "<div class='tm_pos_sample_text' >";
                echo "<strong>SON: </strong>" . $con_letra . "</div>";
                ?>
                <br>
                <div style="text-align: center;">
                    <img src=<?php echo $logoQr; ?> width="90" height="90"><br>
                    <label>
                        <?php echo $reg->hashc;
                        ; ?>
                    </label>
                    <br>
                    <br>
                    <label>Representación impresa de la Boleta de<br>Venta Electrónica puede ser consultada<br>en
                        <?php echo utf8_decode(htmlspecialchars_decode($datose->webconsul)) ?>
                    </label>
     
                </div>

                
                <div class="tm_pos_invoice_footer">::.GRACIAS POR SU COMPRA.::</div>
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
   
</body>

        </html>
        <?php
    } else {
        echo 'No tiene permiso para visualizar el reporte';
    }

}
ob_end_flush();
?>