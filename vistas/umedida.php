<?php
//Activamos el almacenamiento del Buffer
ob_start();
session_start();

if (!isset($_SESSION["nombre"])) {
  header("Location: ../vistas/login");
} else {
  require 'header.php';

  if ($_SESSION['Logistica'] == 1) {

    ?>
                <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"> -->
                <!--Contenido-->

                    <div class="content-header">
                      <h1>Unidad de medida <button class="btn btn-primary btn-sm" onclick="mostrarform(true)" data-bs-toggle="modal"
                          data-bs-target="#agregarunidademedida"> Agregar</button></h1>
                    </div>
                    <input type="hidden" name="idempresa" id="idempresa" value="<?php echo $_SESSION['idempresa']; ?>">
                    <div class="row">

                      <div class="col-md-12">
                        <div class="card">
                          <div class="card-body">
                            <div class="table-responsive">
                              <table id="tbllistado" class="table table-striped" style="width: 100% !important;">
                                <thead>
                                  <tr>
                                    <th scope="col">Opciones</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Abreviatura</th>
                                    <th scope="col">Equivalencia</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Eliminar</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>

                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>



                    </div><!-- /.row -->



                <div class="modal fade text-left" id="agregarunidademedida" tabindex="-1" role="dialog" aria-labelledby="myModalLabel1"
                  aria-hidden="true">
                  <div class="modal-dialog modal-dialog-scrollable" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="myModalLabel1">Añade nueva unidad de medida</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form name="formulario" id="formulario" method="POST">
                          <input type="hidden" name="idunidadm" id="idunidadm">
                          <div class="row">
                            <div class="mb-3 col-lg-6">
                              <label for="recipient-name" class="col-form-label">Nombre:</label>
                              <input type="hidden" name="idalmacen" id="idalmacen">
                              <input type="text" class="form-control" name="nombre" id="nombre" required onkeyup="mayus(this);">
                            </div>
                            <div class="mb-3 col-lg-6">
                              <label for="message-text" class="col-form-label">Abreviatura:</label>
                              <input type="text" class="form-control" name="abre" id="abre" required onkeyup="mayus(this);">
                            </div>
                            <div class="mb-3 col-lg-12">
                              <label for="message-text" class="col-form-label">Equivalencia:</label>
                              <input type="number" class="form-control" name="equivalencia" id="equivalencia" value="" required>
                            </div>
                          </div>

                      </div>
                      <div class="modal-footer">
                        <button onclick="cancelarform()" type="button" class="btn btn-danger" data-bs-dismiss="modal">
                          <i class="bx bx-x d-block d-sm-none"></i>
                          <span class="d-none d-sm-block">Cancelar</span>
                        </button>
                        <button id="btnGuardar" type="submit" class="btn btn-primary ml-1">
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
        <script type="text/javascript" src="scripts/umedida.js"></script>
      <?php
}
ob_end_flush();
?>