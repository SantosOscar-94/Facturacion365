<?php
//Activamos el almacenamiento del Buffer
ob_start();
session_start();
if (!isset($_SESSION["nombre"])) {
  header("Location: ../vistas/login");
} else {
  require 'header.php';
  if ($_SESSION['almacen'] == 1) {
    ?>
            <!-- Custom CSS -->

            <!-- <link rel="stylesheet" href="../public/css/main.css" > -->

            <!-- html5tooltips Styles & animations -->

            <link href="../public/css/html5tooltips.css" rel="stylesheet">
            <link href="../public/css/html5tooltips.animation.css" rel="stylesheet">



            <!--Contenido-->



            <!-- Content Wrapper. Contains page content -->

            <div class="content-wrapper">

              <!-- Main content -->

              <section class="content">

                <div class="row">

                  <div class="col-md-12">

                    <div class="">

                      <div class="box-header with-border">

                        <h1 class="box-title">ARTÍCULOS: <button class="btn btn-primary" id="btnagregar"
                            onclick="mostrarform(true)"><i class="fa fa-newspaper-o"></i> Agregar artículo</button>



                          <a data-toggle="modal" href="#ModalNalmacen" class="btn btn-success"><i
                              class="fa fa-newspaper-o"></i>Nuevo almacén </a>



                          <a data-toggle="modal" href="#ModalNfamilia" class="btn btn-success">

                            <i class="fa fa-newspaper-o"></i> Nueva Categoría</a>



                          <a data-toggle="modal" href="#ModalNumedida" class="btn btn-success">

                            <i class="fa fa-newspaper-o"></i> Nueva u. medida</a>







                          <a href="../reportes/rptarticulos.php" target="_blank"> <button class="btn btn-success"> <i
                                class="fa fa-newspaper-o"></i> Reporte</button>

                          </a>



                          <button class="btn btn-primary" id="refrescartabla" onclick="refrescartabla()"><i
                              class="fa fa-refresh fa-spin fa-1x fa-fw"></i>
                            <span class="sr-only"></span> Refrescar</button>


                        </h1>
                        <div class="box-tools pull-right">
                        </div>
                      </div>

                      <!-- /.box-header -->
                      <!-- centro -->
                      <div class="panel-body table-responsive" id="listadoregistros">
                        <h1>PRODUCTOS</h1>
                        <table id="tbllistado" class="table table-striped table-bordered table-condensed table-hover">
                          <thead>
                            <th>Opciones</th>
                            <th>Descripción</th>
                            <th>Almacen</th>
                            <th>Cod. interno</th>
                            <th>Stock</th>
                            <th>Precio venta</th>
                            <th>Cta. contable</th>
                            <th>...</th>
                            <th>Estado</th>
                          </thead>
                          <tbody>
                          </tbody>
                          <tfoot>
                          </tfoot>

                        </table>
                      </div>



                      <h1>SERVICIOS</h1>
                      <div class="panel-body table-responsive" id="listadoregistrosservicios">
                        <table id="tbllistadoservicios" class="table table-striped table-bordered table-condensed table-hover">
                          <thead>
                            <th>Opciones</th>
                            <th>Descripción</th>
                            <th>Almacen</th>
                            <th>Cod. interno</th>
                            <th>Stock</th>
                            <th>Precio venta</th>
                            <th>Cta. contable</th>
                            <!-- <th>...</th> -->
                            <th>Estado</th>
                          </thead>
                          <tbody>
                          </tbody>
                          <tfoot>
                          </tfoot>

                        </table>
                      </div>










                      <div class="panel-body" id="formularioregistros">

                        <form name="formulario" id="formulario" method="POST">

                          <div class="form-group col-lg-2 col-md-4 col-sm-6 col-xs-12">
                            <label>Mostrar + campos</label>
                            NO <input type="checkbox" name="chk1" id="chk1" onclick="mostrarcampos()"> SI
                          </div>






                          <div class="form-group col-lg-3 col-md-4 col-sm-6 col-xs-12">

                            <label>Almacen</label>

                            <input type="hidden" name="idarticulo" id="idarticulo">

                            <input type="hidden" name="idempresa" id="idempresa" value="<?php echo $_SESSION['idempresa']; ?>">

                            <select class="x select-picker" name="idalmacen" id="idalmacen" required data-live-search="true"
                              onchange="focusfamil()">
                            </select>

                          </div>





                          <div class="form-group col-lg-3 col-md-4 col-sm-6 col-xs-12">

                            <label>Categoría</label>

                            <select class=" select-picker" name="idfamilia" id="idfamilia" required data-live-search="true">



                            </select>

                          </div>





                          <div class="form-group col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <label>Tipo</label>
                            <select class="" name="tipoitem" id="tipoitem" onchange="focuscodprov()">
                              <option value="productos" selected>PRODUCTO</option>
                              <option value="servicios">SERVICIO</option>
                            </select>
                          </div>





                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Código proveedor:</label>

                            <input type="text" class="" name="codigo_proveedor" id="codigo_proveedor" maxlength="100"
                              placeholder="Código de proveedor" required="" onkeyup="mayus(this)"
                              onkeypress="return focusnomb(event, this)" data-tooltip="Información de este campo"
                              data-tooltip-more="Aquí ingrese si su artículo tiene un código que viene desde el proveedor, es opcional, si no tiene un codigo puede poner un . o -"
                              data-tooltip-stickto="right" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green">

                          </div>









                          <div class="form-group col-lg-4 col-md-6 col-sm-6 col-xs-12">

                            <label>Descripción / Nombre:</label>

                            <input type="text" class="" name="nombre" id="nombre" maxlength="100" placeholder="Nombre"
                              required="true" onkeyup="mayus(this);" onkeypress=" return limitestockf(event, this)"
                              data-tooltip="Información de este campo"
                              data-tooltip-more="Descripción del artículo,  aparecera en el detalle del comprobante."
                              data-tooltip-stickto="top" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green" onchange="generarcodigonarti()">

                          </div>



                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Limite stock:</label>

                            <input type="text" class="" name="limitestock" id="limitestock" maxlength="100"
                              placeholder="Limite de stock" data-tooltip="Información de este campo"
                              data-tooltip-more="Aquí ingrese el milite de stock para que se bloquee las ventas al llegar a su limite."
                              data-tooltip-stickto="right" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green" onkeypress=" return limitest(event, this)">

                          </div>





                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">
                            <label>U. medida compra:</label>
                            <select class="form-control" name="umedidacompra" id="umedidacompra" required data-live-search="true"
                              onchange="cinicial()">

                            </select>
                          </div>









                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Factor conversión:</label>

                            <input type="text" name="factorc" id="factorc" onkeypress=" return umventa(event, this)">

                            </select>

                          </div>





                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>U. medida venta:</label>

                            <select class="form-control" name="unidad_medida" id="unidad_medida" required data-live-search="true"
                              onchange="costoco()">

                            </select>

                          </div>







                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Costo inicial (S/.):</label>

                            <input type="text" class="" name="costo_compra" id="costo_compra" maxlength="100"
                              placeholder="Costo de compra" required="true" onkeypress="return focussaldoi(event, this)"
                              readonly="false" data-tooltip="Información de este campo"
                              data-tooltip-more="Costo de compra de su proveedor." data-tooltip-stickto="right"
                              data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin" data-tooltip-color="green">

                          </div>



                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Saldo inicial :</label>

                            <input type="text" class="" name="saldo_iniu" id="saldo_iniu" maxlength="100"
                              placeholder="Saldo inicial" onBlur="calcula_valor_ini()" required="true"
                              onkeypress="return valori(event, this)" data-tooltip="Información de este campo"
                              data-tooltip-more="Si es la primera vez que llena este campo poner el saldo final de su inventario físico. "
                              data-tooltip-stickto="right" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green">

                          </div>



                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Valor inicial (S/.):</label>

                            <input type="text" class="" name="valor_iniu" id="valor_iniu" maxlength="100"
                              placeholder="Valor inicial" required="true" onkeypress="return saldof(event, this)"
                              data-tooltip="Información de este campo"
                              data-tooltip-more="El valor inicial es el costo compra x saldo inicial." data-tooltip-stickto="right"
                              data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin" data-tooltip-color="green">

                          </div>







                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Saldo final (mts):</label>

                            <input type="text" class="" name="saldo_finu" id="saldo_finu" maxlength="100" placeholder="Saldo final"
                              required="true" onkeypress="return valorf(event, this)" onBlur="sfinalstock()"
                              data-tooltip="Información de este campo"
                              data-tooltip-more="La primera vez en el registro será igual a saldo inicial (saldofinal=saldo inicial)."
                              data-tooltip-stickto="right" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green">

                          </div>



                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Valor final (S/.):</label>

                            <input type="text" class="" name="valor_finu" id="valor_finu" maxlength="100" placeholder="Valor Final"
                              required="true" onkeypress="return st(event, this)" data-tooltip="Información de este campo"
                              data-tooltip-more="El valor final es igual al valor incial (valor final=valor inicial)."
                              data-tooltip-stickto="top" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green">

                          </div>



                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Stock:</label>

                            <input type="text" class="" name="stock" id="stock" maxlength="100" placeholder="Stock" required="true"
                              onkeypress="return totalc(event, this)" data-tooltip="Información de este campo"
                              data-tooltip-more="El stock sera igual al saldo final y saldo inicial (stock = saldo final = saldo inicial)."
                              data-tooltip-stickto="right" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green">

                          </div>



                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Precio venta (S/.):</label>

                            <input type="text" class="" name="valor_venta" id="valor_venta" onkeypress="return codigoi(event, this)"
                              data-tooltip="Información de este campo"
                              data-tooltip-more="El precio que se muestra en los ocmprobantes, incluye IGV."
                              data-tooltip-stickto="right" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green">

                          </div>


                          <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                            <label>Conversión um venta:</label>

                            <input type="text" class="" name="fconversion" id="fconversion"
                              data-tooltip="Cantidad según factor de conversión por stock actual." data-tooltip-stickto="top"
                              data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin" data-tooltip-color="green"
                              readonly>

                          </div>


                          <div class="form-group col-lg-12 col-md-6 col-sm-6 col-xs-12">
                            <label>Descripción:</label>
                            <textarea id="descripcion" name="descripcion" rows="5" cols="70" onkeyup="mayus(this)"
                              onkeypress="return focusDescdet(event, this)"> </textarea>
                          </div>










                          <div id="masdatos" name="masdatos">



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Total compras (mts):</label>

                              <input type="text" class="" name="comprast" id="comprast" onkeypress="return totalv(event, this)"
                                placeholder="No se llena" readonly data-tooltip="Información de este campo"
                                data-tooltip-more="Este campo no se llena." data-tooltip-stickto="right" data-tooltip-maxwidth="200"
                                data-tooltip-animate-function="foldin" data-tooltip-color="green">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Total ventas (mts):</label>

                              <input type="text" class="" name="ventast" id="ventast" onkeypress="return porta(event, this)"
                                placeholder="No se llena" readonly data-tooltip="Información de este campo"
                                data-tooltip-more="Este campo no se llena." data-tooltip-stickto="right" data-tooltip-maxwidth="200"
                                data-tooltip-animate-function="foldin" data-tooltip-color="green">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Portador:</label>

                              <input type="text" class="" name="portador" id="portador" maxlength="5"
                                onkeypress="return mer(event, this)">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Merma :</label>

                              <input type="text" class="" name="merma" id="merma" maxlength="5"
                                onkeypress="return preciov(event, this)">

                            </div>













                            <div class="form-group col-lg-4 col-md-6 col-sm-6 col-xs-12">

                              <label>Código SUNAT:</label>

                              <input type="text" class="" name="codigosunat" id="codigosunat" placeholder="Código SUNAT"
                                onkeyup="mayus(this);" data-tooltip="Información de este campo"
                                data-tooltip-more="Validar con el catálogo de productos que brinda SUNAT."
                                data-tooltip-stickto="top" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                                data-tooltip-color="green">



                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Cta. contable:</label>

                              <input type="text" class="" name="ccontable" id="ccontable" placeholder="Cuenta contabe"
                                data-tooltip="Información de este campo" data-tooltip-more="Opcional." data-tooltip-stickto="top"
                                data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin" data-tooltip-color="green">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Précio por mayor:</label>

                              <input type="text" class="" name="precio2" id="precio2" placeholder="Précio por mayor">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Precio distribuidor:</label>

                              <input type="text" class="" name="precio3" id="precio3" placeholder="Précio distribuidor">

                            </div>



                            <!-- NUEVOS CAMPOS PARA BOLSAS PLASTICAS  -->



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Cód. tributo ICBPER:</label>

                              <input type="text" class="" name="cicbper" id="cicbper" placeholder="7152" onkeyup="mayus(this);">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>n. tributo ICBPER:</label>

                              <input type="text" class="" name="nticbperi" id="nticbperi" placeholder="ICBPER"
                                onkeyup="mayus(this);">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Cód. tributo ICBPER:</label>

                              <input type="text" class="" name="ctticbperi" id="ctticbperi" placeholder="OTH"
                                onkeyup="mayus(this);">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Mto trib. ICBPER und:</label>

                              <input type="text" class="" name="mticbperu" id="mticbperu" placeholder="0.10" onkeyup="mayus(this);">

                            </div>



                            <!-- NUEVOS CAMPOS PARA BOLSAS PLASTICAS  -->



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Lote:</label>

                              <input type="text" name="lote" id="lote" class="">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Marca:</label>

                              <input type="text" name="marca" id="marca" class="">

                            </div>





                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Fecha de fabricación:</label>

                              <input type="date" name="fechafabricacion" id="fechafabricacion" class="" style="color:blue;">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Fecha de vcto:</label>

                              <input type="date" name="fechavencimiento" id="fechavencimiento" class="" style="color:blue;">

                            </div>





                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Procedencia:</label>

                              <input type="text" name="procedencia" id="procedencia" class="">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Fabricante:</label>

                              <input type="text" name="fabricante" id="fabricante" class="">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Reg. sanitario:</label>

                              <input type="text" name="registrosanitario" id="registrosanitario" class="">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Fecha ing. almacen:</label>

                              <input type="date" name="fechaingalm" id="fechaingalm" class="" style="color:blue;">

                            </div>





                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Fecha fin stock:</label>

                              <input type="date" name="fechafinalma" id="fechafinalma" class="" style="color:blue;">

                            </div>





                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Proveedor:</label>

                              <input type="text" name="proveedor" id="proveedor" class="">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Serie fac. compra:</label>

                              <input type="text" name="seriefaccompra" id="seriefaccompra" class="">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Número fac. compra:</label>

                              <input type="text" name="numerofaccompra" id="numerofaccompra" class="">

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Fecha fac. compra:</label>

                              <input type="date" name="fechafacturacompra" id="fechafacturacompra" class="" style="color:blue;">

                            </div>







                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Código tipo de tributo:</label>

                              <select name="codigott" id="codigott" class="form-control">

                                <option value="1000">1000</option>

                                <option value="1016">1016</option>

                                <option value="2000">2000</option>

                                <option value="7152">7152</option>

                                <option value="9995">9995</option>

                                <option value="9996">9996</option>

                                <option value="9997">9997</option>

                                <option value="9998">9998</option>

                                <option value="9999">9999</option>

                              </select>

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Descripción tributo:</label>

                              <select name="desctt" id="desctt" class="form-control">

                                <option value="IGV Impuesto General a las Ventas">IGV Impuesto General a las Ventas</option>

                                <option value="Impuesto a la Venta Arroz Pilado">Impuesto a la Venta Arroz Pilado</option>

                                <option value="ISC Impuesto Selectivo al Consumo">ISC Impuesto Selectivo al Consumo</option>

                                <option value="mpuesto al Consumo de las bolsas de plástico">mpuesto al Consumo de las bolsas de
                                  plástico</option>

                                <option value="Exportación">Exportación</option>

                                <option value="Gratuito">Gratuito</option>

                                <option value="Exonerado">Exonerado</option>

                                <option value="Inafecto">Inafecto</option>

                                <option value="Otros tributos">Otros tributos</option>

                              </select>

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Código internacional:</label>

                              <select name="codigointtt" id="codigointtt" class="form-control">

                                <option value="VAT">VAT</option>

                                <option value="VAT">VAT</option>

                                <option value="EXC">EXC</option>

                                <option value="EXC">EXC</option>

                                <option value="FRE">FRE</option>

                                <option value="FRE">FRE</option>

                                <option value="VAT">VAT</option>

                                <option value="FRE">FRE</option>

                                <option value="OTH">OTH</option>

                              </select>

                            </div>



                            <div class="form-group col-lg-2 col-md-6 col-sm-6 col-xs-12">

                              <label>Nombre:</label>

                              <select name="nombrett" id="nombrett" class="form-control">

                                <option value="IGV">IGV</option>

                                <option value="IVAP">IVAP</option>

                                <option value="ISC">ISC</option>

                                <option value="ICBPER">ICBPER</option>

                                <option value="EXP">EXP</option>

                                <option value="GRA">GRA</option>

                                <option value="EXO">EXO</option>

                                <option value="INA">INA</option>

                                <option value="OTROS">OTROS</option>

                              </select>

                            </div>





                          </div>



















                          <div class="form-group col-lg-4 col-md-6 col-sm-6 col-xs-12">

                            <label>Código Interno:</label>

                            <input type="text" class="" name="codigo" id="codigo" placeholder="Código Barras" required="true"
                              onkeyup="mayus(this);" onblur="generarbarcode()" onchange="validarcodigo()"
                              data-tooltip="Información de este campo"
                              data-tooltip-more="Es el código único RECORDAR que se utilizará para los reportes como kardex o inventarios, también es el que puede agregar en la búsqueda de cada comprobante, si va generar códigos de barra este campo es el que será necesario para crear los códigos de barra y cuando escanee un artículo con código de barra será este el descifrado, deben coincidir."
                              data-tooltip-stickto="top" data-tooltip-maxwidth="200" data-tooltip-animate-function="foldin"
                              data-tooltip-color="green">

                            <button class="btn btn-success" type="button" onclick="generarbarcode()">Generar</button>
                            <button class="btn btn-info" type="button" onclick="imprimir()"> <i class="fa fa-print">Imprimir
                                codigos</i></button>

                            <input type="hidden" name="stockprint" id="stockprint">

                            <input type="hidden" name="codigoprint" id="codigoprint">

                            <input type="hidden" name="precioprint" id="precioprint">





                            <div id="print">
                              <svg id="barcode"></svg>
                            </div>

                          </div>









                          <div class="form-group col-lg-6 col-md-4 col-sm-6 col-xs-12">
                            <label>Imagen:</label>
                            <input type="file" class="" name="imagen" id="imagen" value="">
                            <input type="hidden" name="imagenactual" id="imagenactual">
                            <img src="" width="150px" height="120px" id="imagenmuestra">
                            <hr>
                            <div id="preview"></div>
                          </div>







                          <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">

                            <button class="btn btn-primary" type="submit" id="btnGuardar"><i class="fa fa-save"></i>
                              Guardar</button>



                            <button class="btn btn-danger" onclick="cancelarform()" type="button"><i
                                class="fa fa-arrow-circle-left"></i> Cancelar</button>

                          </div>







                        </form>

                      </div>



                      <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">

                        <a href="../files/plantilla/plantilla.zip"> Descargar plantilla <img src="../public/images/excel.png"
                            height="2px"> </a>

                      </div>



                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">

                        <a data-toggle="modal" href="#Modalcargardatos">

                          <i class="fa fa-import"></i> Importar artículos a la base de datos <img
                            src="../public/images/importar.png" height="2px"></a>

                      </div>

                      <!--Fin centro -->

                    </div><!-- /.box -->

                  </div><!-- /.col -->

                </div><!-- /.row -->

              </section><!-- /.content -->



            </div><!-- /.content-wrapper -->

            <!--Fin-Contenido-->









            <!-- Modal -->

            <div class="modal fade" id="Modalcargardatos">

              <div class="modal-dialog">

                <div class="modal-content">

                  <div class="modal-header">

                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">

                      <h4 class="modal-title">Subir plantilla</h4>

                    </div>



                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">

                      <img src="../public/images/importar.png" height="50px">

                    </div>

                  </div>

                  <div class="modal-body">

                    <form action='../modelos/importarArticulo.php' method='post' enctype="multipart/form-data">

                      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                        Importar Archivo : <input class="" type='file' name='sel_file' size='20'>

                      </div>



                      <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">

                        <br>

                      </div>





                      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                        <input type='submit' name='submit' value='Cargar a tabla artículos' class="btn btn-primary">

                      </div>

                    </form>

                  </div>



                  <div class="modal-footer">

                    <button type="button" class="btn btn-default" data-dismiss="modal">

                      Cerrar</button>

                  </div>



                </div>

              </div>

            </div>

            <!-- Fin modal -->







            <!-- Modal -->

            <div class="modal fade" id="ModalNfamilia">

              <div class="modal-dialog">

                <div class="modal-content">

                  <div class="modal-header">

                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                    <h4 class="modal-title">Nueva categoría</h4>

                  </div>

                  <div class="modal-body">

                    <form name="formnewfamilia" id="formnewfamilia" method="POST">





                      <input type="hidden" name="idfamilia" id="idfamilia">





                      <div class="form-group col-lg-8 col-md-4 col-sm-6 col-xs-12">

                        <input type="text" name="nombrec" id="nombrec" placeholder="Nombre de familia" autofocus="true"
                          onkeyup="mayus(this);" size="30" class="">



                        <button class="btn btn-primary" type="submit" id="btnGuardarcliente"><i class="fa fa-save"></i>
                          Guardar</button>

                      </div>



                    </form>

                  </div>



                  <div class="modal-footer">

                    <button type="button" class="btn btn-default" data-dismiss="modal">

                      Cerrar</button>

                  </div>



                </div>

              </div>

            </div>

            <!-- Fin modal -->





            <!-- Modal -->

            <div class="modal fade" id="ModalNalmacen">

              <div class="modal-dialog">

                <div class="modal-content">



                  <div class="modal-header">

                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                    <h4 class="modal-title">Nuevo almacen</h4>

                  </div>

                  <div class="modal-body">

                    <form name="formnewalmacen" id="formnewalmacen" method="POST">





                      <div class="form-group col-lg-6 col-md-4 col-sm-6 col-xs-12">

                        <label>Nombre: </label>

                        <input type="text" name="nombrea" id="nombrea" placeholder="Escribir el nombre" autofocus="true"
                          onkeyup="mayus(this);" size="30" class="">

                        <input type="hidden" name="idempresa2" id="idempresa2" value="<?php echo $_SESSION['idempresa']; ?>">



                      </div>





                      <div class="form-group col-lg-6 col-md-4 col-sm-6 col-xs-12">

                        <label>Dirección: </label>

                        <input type="text" name="direc" id="direc" placeholder="Escribir la dirección" autofocus="true"
                          onkeyup="mayus(this);" size="30" class="">

                      </div>









                      <button class="btn btn-primary" type="submit" id="btnGuardarcliente"><i class="fa fa-save"></i>
                        Guardar</button>



                    </form>

                  </div>



                  <div class="modal-footer">

                    <button type="button" class="btn btn-default" data-dismiss="modal">

                      Cerrar</button>

                  </div>



                </div> <!-- Fin content -->

              </div> <!-- Fin dialog -->

            </div> <!-- Fin modal -->

            <!-- Fin modal -->



            <!-- Modal -->

            <div class="modal fade" id="ModalNumedida">

              <div class="modal-dialog">

                <div class="modal-content">



                  <div class="modal-header">

                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                    <h4 class="modal-title">Nueva unidad medida</h4>

                  </div>

                  <div class="modal-body">

                    <form name="formnewumedida" id="formnewumedida" method="POST">





                      <div class="form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">

                        <label>Nombre: </label>

                        <input type="text" name="nombreu" id="nombreu" placeholder="Escribir el nombre" autofocus="true"
                          onkeyup="mayus(this);" size="30" class="" onchange=" unidadvalor()">

                      </div>





                      <div class="form-group col-lg-2 col-md-4 col-sm-6 col-xs-12">

                        <label>Abreviatura: </label>

                        <input type="text" name="abre" id="abre" placeholder="Escribir la abreviatura" autofocus="true"
                          onkeyup="mayus(this);" size="30" class="">

                      </div>





                      <div class="form-group col-lg-2 col-md-4 col-sm-6 col-xs-12">

                        <label>Equivalencia: </label>

                        <input type="text" name="equivalencia2" id="equivalencia2" placeholder="Equivalencia" autofocus="true"
                          onkeyup="mayus(this);" size="30" class="">

                      </div>









                      <br>

                      <button class="btn btn-primary" type="submit" id="btnGuardarumedida"><i class="fa fa-save"></i>
                        Guardar</button>



                      <a href="../files/plantilla/umedida.pdf" target="_blank"> VER UNIDADES </a>





                    </form>

                  </div>



                  <div class="modal-footer">

                    <button type="button" class="btn btn-default" data-dismiss="modal">

                      Cerrar</button>

                  </div>



                </div> <!-- Fin content -->

              </div> <!-- Fin dialog -->

            </div> <!-- Fin modal -->

            <!-- Fin modal -->

            <?php
  } else {
    require 'noacceso.php';
  }
  require 'footer.php';
  ?>
      <script type="text/javascript" src="../public/js/JsBarcode.all.min.js"></script>
      <script type="text/javascript" src="../public/js/jquery.PrintArea.js"></script>
      <script type="text/javascript" src="scripts/articulo.js"></script>
      <script src="../public/js/html5tooltips.js"></script>
    <?php
}
ob_end_flush();
?>