<?php
ob_start();
session_start();

if (!isset($_SESSION["nombre"])) {
  header("Location: ../vistas/login");
} else {
  require 'header.php';

  if ($_SESSION['Ventas'] == 1) {

    ?>
            <!DOCTYPE html>  
             <html>  
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">    
            <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"> -->

            </head>  
                  <body>  
                       <br /><br />  
            <!--Contenido-->
                  <!-- Content Wrapper. Contains page content -->
                  <div class="content-start transition">        
                    <!-- Main content -->
                    <section class="container-fluid dashboard">
                          <div class="content-header">
                              <h1>Resumen diario de bajas de facturas</h1>
                          </div>
                        <div class="row" style="background: white;">
                          <div class="col-md-12">
                              <div class="">

                    



              <!-- centro -->
                <div class="panel-body" id="listadoregistros">

                    <div class="row">

                                <div class="col-md-12">

                                    <div class="card">

                                        <div class="card-body">

                                            <div class="row">
                                            <div class="mt-3 col-lg-2">
                                            <button class="btn btn-danger" name="generarbajaxml" onclick="generarbajaxml()" style="top: 72px;">Generar Xml y Anulación de comprobantes</button>
            </div>
                                            <form name="exportaDbaja" id="exportaDbaja"  action="../modelos2/Dbaja.php" method="post" >
              <div class="row justify-content-center text-center">

              <div class="mb-3 col-lg-1">
            <label> Año: </label>
            <select class="form-control" name="ano" id="ano" onchange="regbajas()">

            <option value="2017">2017</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            </select>
            <input type="hidden" name="ano_1" id="ano_1">
            </div>

            <div class="mb-3 col-lg-1">
            <label> Mes: </label>
            <select class="form-control" name="mes" id="mes" onchange="regbajas()">

            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
            </select>
            <input type="hidden" name="mes_1" id="mes_1">
            </div> 

            <div class="mb-3 col-lg-1">
            <label> Día: </label>
            <select class="form-control" name="dia" id="dia" onchange="regbajas()">
            <option value=" ">Ninguno</option>
            <option value="1">01</option>
            <option value="2">02</option>
            <option value="3">03</option>
            <option value="4">04</option>
            <option value="5">05</option>
            <option value="6">06</option>
            <option value="7">07</option>
            <option value="8">08</option>
            <option value="9">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
            </select>
            <input type="hidden" name="mes_1" id="mes_1">
            </div> 

            <div class="mb-3 col-lg-1">
            <label> Origen: </label>
            <select class="form-control" name="destino" id="destino">
            <option value="01">LOCAL</option>
            <option value="02">REMOTO</option>
            </select>
            <input type="hidden" name="mes_1" id="mes_1">
            </div> 




                      <div class="table-responsive" id="listadoregistros">
                                          <table id="tbllistado" class="table table-striped" style="font-size: 14px; max-width: 100%; !important;">
                                              <thead style="text-align:center;">
                                                <th>FECHA DE BAJA</th>
                                                <th>COMENTARIO</th>
                                                <th>COMPROBANTE</th>
                                                <th>...</th>
                                                <th>VALOR AFECTO</th>
                                                <th>IGV</th>
                                                <th>TOTAL</th>
                                                <th>TIPO</th>
                                              </thead>
                                              <tbody style="text-align:center;">
                                              </tbody>
                                                <tfoot>
                                                  <th></th>
                                                  <th></th>
                                                  <th>TOTALES</th>
                                                  <th></th>
                                                  <th></th>
                                                  <th></th>
                                                  <th></th>
                                                  <th></th>
                                                </tfoot> 
                                          </table>
                                      </div>

         

              </div>
  


            <!-- <div class="form-group col-lg-2 col-md-4 col-sm-6 col-xs-12">
<button type="submit" class="btn btn-success btn-ver" name="boton" name="boton" value="btnrpta"  ><span  class="fa fa-download "> Descargar plano</span></button>
</div> -->

            </form>


            <!-- <div class="form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
<a href="https://bit.ly/2JDIPCm" target="_blank"><img src="../public/images/sunat.png"> Consultar estado en SUNAT</a>
</div> -->






                      </div>
            </div>


              <!-- <div class="">
<h9 class="box-title" style="color: blue"> * Se descargaran un archivo plano con todos los comprobantes que hayan sido de baja en la carpeta DATA  de extension *.CBA </h9>


</div>     -->

                                            </div>
                                        </div>
                                    </div>
                                </div>
                      </div>

          
                      <div class="row">

            <div class="col-md-12">

                <div class="card">

                    <div class="card-body">
          
                    <div class="content-header">
            <h4>Resultados de anulación de comprobantes</h4>
            </div>
            <div class="table-responsive" id="listadoregistros">
                <table id="tbllistadoxml" class="table table-striped" style="font-size: 14px; max-width: 100%; !important;">
                <thead style="text-align:center;">
                    <th>FECHA ENVIO</th>
                    <th>NOMBRE DE ARCHIVO</th>
                    <th>NRO TICKET</th>
                    <th>DETALLE</th>
                </thead>
                <tbody style="text-align:center;">
                </tbody>

            </table>
            </div>

            <div class="table-responsive" id="listadoregistros">
                <table id="tbllistadocomprobante" class="table table-striped" style="font-size: 14px; max-width: 100%; !important;">
                <thead style="text-align:center;">
                    <th>NUMERO COMPROBANTE</th>
                    <th>FECHA EMISIÓN</th>
                    <th>TOTAL</th>
                </thead>
                <tbody style="text-align:center;">
                </tbody>

            </table>
            </div>
            </div>
            </div>
            </div>
            </div>
                    </div>
        

                  </section>
      
                </div>
  

    


            <!-- <div class="box-header with-border">
<h1 class="box-title"><button class="btn btn-success" id="btnagregar" onclick="regventas()"><i class="fa fa-plus-circle"></i> DESACARGAR</button></h1>
</div> -->
               

                </div>
            </body>
            </html>

            <?php
  } else {
    require 'noacceso.php';
  }
  require 'footer.php';
  ?>

      <script type="text/javascript" src="scripts/cbaja.js"></script> 

      <?php
}
ob_end_flush();
?>