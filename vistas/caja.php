<?php
session_start();
//Activamos el almacenamiento del Buffer
ob_start();


if (!isset($_SESSION["nombre"])) {
  header("Location: ../vistas/login");
} else {
  require 'header.php';

  if ($_SESSION['almacen'] == 1) {

    ?>

                <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"> -->
                <!--Contenido-->
                <!-- Content Wrapper. Contains page content -->

                <div class="content-start transition">
                  <div class="container-fluid dashboard">
                    <div class="content-header">
                      <h1>Caja <button class="btn btn-primary btn-sm"> Aperturar caja</button></h1>
                    </div>

                    <div class="row">

                      <div class="col-md-12">
                        <h1>Proximamente</h1>
                        <!-- <div class="card">
              <div class="card-body">

                <div class="table-responsive">
                  <table id="tbllistado" class="table table-striped" style="width: 100% !important;">
                    <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Opciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>

                      </tr>
                    </tbody>
                  </table>

                </div>

              </div>
            </div> -->
                      </div>



                    </div><!-- /.row -->


                  </div><!-- End Container-->
                </div><!-- End Content-->


                <div class="modal fade text-left" id="agregarsucursal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-scrollable" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="myModalLabel1">Añade nueva sucursal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form name="formulario" id="formulario" method="POST">
                          <div class="row">
                            <div class="mb-3 col-lg-6">
                              <label for="recipient-name" class="col-form-label">Nombre:</label>
                              <input type="hidden" name="idalmacen" id="idalmacen">
                              <input type="text" class="form-control" name="nombrea" id="nombrea" placeholder="Nombre" required onkeyup="mayus(this);">
                            </div>
                            <div class="mb-3 col-lg-6">
                              <label for="message-text" class="col-form-label">Dirección:</label>
                              <input type="text" class="form-control" name="direccion" id="direccion" placeholder="Dirección" required onkeyup="mayus(this);">
                            </div>
                          </div>

                      </div>
                      <div class="modal-footer">
                        <button onclick="cancelarform()" type="button" class="btn btn-danger" data-bs-dismiss="modal">
                          <i class="bx bx-x d-block d-sm-none"></i>
                          <span class="d-none d-sm-block">Cancelar</span>
                        </button>
                        <button id="btnGuardar" type="submit" class="btn btn-primary ml-1" data-bs-dismiss="modal">
                          <i class="bx bx-check d-block d-sm-none"></i>
                          <span class="d-none d-sm-block">Agregar</span>
                        </button>
                      </div>
                      </form>
                    </div>
                  </div>
                </div>


              <?php
  } else {
    require 'noacceso.php';
  }

  require 'footer.php';
  ?>
        <script type="text/javascript" src="scripts/almacen.js"></script>  
      <?php
}
ob_end_flush();
?>