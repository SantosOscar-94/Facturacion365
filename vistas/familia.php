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
                  <!-- Content Wrapper. Contains page content -->
                  <!--Content Start-->
   
                  <div class="content-header">
                    <h1>Categoria <button class="btn btn-primary btn-sm" onclick="mostrarform(true)" data-bs-toggle="modal"
                    data-bs-target="#agregarCategoria">Agregar</button></h1>
                  </div>
                  <input type="hidden" name="idempresa" id="idempresa" value="<?php echo $_SESSION['idempresa']; ?>">
                  <div class="row">

                    <div class="col-md-12">
                      <div class="card">
                        <div class="card-body">
                        <div class="table-responsive">
                          <table id="tbllistado" class="table table-striped" style="width: 100% !important;">
                            <thead>
                              <th>Opciones</th>
                              <th>Nombre</th>
                              <th>Estado</th>
                            </thead>
                            <tbody>
                            </tbody>

                          </table>
                          </div>
                        </div>
                      </div>
                    </div>



                </div><!-- /.row -->



            <div class="modal fade text-left" id="agregarCategoria" tabindex="-1" role="dialog"
                          aria-labelledby="myModalLabel1" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-scrollable" role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="myModalLabel1">Añade nueva categoria</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">
                                <form name="formulario" id="formulario" method="POST">
                                    <div class="row">
                                        <div class="mb-3 col-lg-12">
                                            <label for="recipient-name" class="col-form-label">Nombre:</label>
                                            <input type="hidden" name="idfamilia" id="idfamilia">
                                            <input type="text" class="form-control" name="nombrec" id="nombrec" maxlength="50" required onkeyup="mayus(this);">
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
                                  <span class="d-none d-sm-block">Guardar</span>
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
      <script type="text/javascript" src="scripts/familia.js"></script>
      <?php
}
ob_end_flush();
?>
