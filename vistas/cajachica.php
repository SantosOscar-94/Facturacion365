<?php
session_start();
//Activamos el almacenamiento del Buffer
ob_start();
if (!isset($_SESSION["nombre"])) {
  header("Location: ../vistas/login");
} else {
  require 'header.php';
  if ($_SESSION['Ventas'] == 1) {
    ?>
        <div class="content-header">
          <h1>Caja chica del sistema <button class="btn btn-success btn-sm" data-bs-toggle="modal"
              data-bs-target="#agregarsaldoInicial">Aperturar caja</button>
            <button type="button" class="btn btn-danger" id="cerrarCajaBtn" onclick="cerrarCaja()">Cerrar Caja</button>
            <button style="float: right;" type="button" class="btn btn-info" id="listarCajaBtn" onclick="mostrarCajas()">Mostrar cajas</button>
          </h1>
        </div>

        <div class="row mt-3">
          <div class="col-xl-9">
            <div class="card custom-card">
              <div class="card-body p-0">
                <div class="row g-0">
                  <div class="col-xl-3 border-end border-inline-end-dashed">
                    <div class="d-flex flex-wrap align-items-top p-4">
                      <div class="me-3 lh-1"> <span class="avatar avatar-md avatar-rounded bg-primary shadow-sm"> <i
                            class="ti ti-package fs-18"></i> </span> </div>
                      <div class="flex-fill">
                        <h5 class="fw-semibold mb-1">S/ 0</h5>
                        <p class="text-muted mb-0 fs-12">Efectivo</p>
                      </div>
                      <div hidden> <span class="badge bg-success-transparent"><i
                            class="ri-arrow-up-s-line align-middle me-1 d-inline-block"></i>1.31%</span> </div>
                    </div>
                  </div>
                  <div class="col-xl-3 border-end border-inline-end-dashed">
                    <div class="d-flex flex-wrap align-items-top p-4">
                      <div class="me-3 lh-1"> <span class="avatar avatar-md avatar-rounded bg-secondary shadow-sm"> <i
                            class="ti ti-rocket fs-18"></i> </span> </div>
                      <div class="flex-fill">
                        <h5 class="fw-semibold mb-1" id="total_ingreso">S/ 0</h5>
                        <p class=" text-muted mb-0 fs-12">Ingresos</p>
                      </div>
                      <div hidden> <span class="badge bg-danger-transparent"><i
                            class="ri-arrow-down-s-line align-middle me-1"></i>1.14%</span> </div>
                    </div>
                  </div>
                  <div class="col-xl-3 border-end border-inline-end-dashed">
                    <div class="d-flex flex-wrap align-items-top p-4">
                      <div class="me-3 lh-1"> <span class="avatar avatar-md avatar-rounded bg-success shadow-sm"> <i
                            class="ti ti-wallet fs-18"></i> </span> </div>
                      <div class="flex-fill">
                        <h5 class="fw-semibold mb-1" id="total_gasto">S/ 0</h5>
                        <p class="text-muted mb-0 fs-12">Egresos</p>
                      </div>
                      <div hidden> <span class="badge bg-success-transparent"><i
                            class="ri-arrow-up-s-line align-middle me-1 d-inline-block"></i>2.58%</span> </div>
                    </div>
                  </div>
                  <div class="col-xl-3">
                    <div class="d-flex flex-wrap align-items-top p-4">
                      <div class="me-3 lh-1"> <span class="avatar avatar-md avatar-rounded bg-warning shadow-sm"> <i
                            class="ti ti-packge-import fs-18"></i> </span> </div>
                      <div class="flex-fill">
                        <h5 class="fw-semibold mb-1" id="total_saldoini">S/ 0</h5>
                        <p class="text-muted mb-0 fs-12">Saldo Inicial</p>
                      </div>
                      <div hidden> <span class="badge bg-success-transparent"><i
                            class="ri-arrow-up-s-line align-middle me-1 d-inline-block"></i>12.05%</span> </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3">
            <div class="card custom-card card-bg-primary text-fixed-white">
              <div class="card-body p-0">
                <div class="d-flex align-items-top p-4 flex-wrap">
                  <div class="me-3 lh-1"> <span class="avatar avatar-md avatar-rounded bg-white text-primary shadow-sm"> <i
                        class="ti ti-coin fs-18"></i> </span> </div>
                  <div class="flex-fill">
                    <h5 class="fw-semibold mb-1 text-fixed-white" id="total-ventas">S/ 0</h5>
                    <p class="op-7 mb-0 fs-12">Total en caja</p>
                  </div>
                  <div hidden> <span class="badge bg-success"><i
                        class="ri-arrow-up-s-line align-middle me-1 d-inline-block"></i>14.69%</span> </div>
                </div>
              </div>
            </div>
          </div>
        </div>     

          <div class="col-md-12">
            <div class="card">
              <div class="card-body">

                <div class="table-responsive">
                  <table id="tblistadototalcaja" class="table table-striped" style="width: 100% !important;">
                    <thead>
                      <tr>
                        <th hidden scope="col">idsaldoini</th>
                        <th hidden scope="col">idusuario</th>

                        <th scope="col">Fecha Apertura</th>
                        <th scope="col">Saldo Inicial</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Turno de Caja</th>
                        <th scope="col">Fecha de Cierre</th>
                        <th scope="col">Total Ingreso</th>
                        <th scope="col">Total Egreso</th>
                        <th scope="col">Total Caja</th>
                        <th hidden scope="col">Saldo Faltante</th>
                        <th hidden scope="col">Saldo Sobrante</th>
                        <th scope="col">Estado</th>
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


        <div class="modal fade text-left" id="agregarsaldoInicial" role="dialog" aria-labelledby="myModalLabel1"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-scrollable" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="myModalLabel1">Apertura tu caja</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form name="formulario" id="formulario" method="POST">
                  <div class="row">
                    
                    <div class="mb-3 col-lg-6">
                      <label for="message-text" class="col-form-label">Vendedor/Cajero:</label>
                      <input type="text" class="form-control" name="nombrevendedorcaja" id="nombrevendedorcaja" required>
                    </div>

                    <div hidden class="mb-3 col-lg-6">
                      <label for="message-text" class="col-form-label">cargo:</label>
                      <input type="text" class="form-control" name="cargovendedor" id="cargovendedor" required>
                    </div>

                    <div class="mb-3 col-lg-6">
                      <label for="message-text" class="col-form-label">Turno de caja:</label>
                      <select class="form-control" name="turnocaja" id="turnocaja" required>
                          <option value="DIA">Dia</option>
                          <option value="TARDE">Tarde</option>
                          <option value="NOCHE">Noche</option>
                       
                      </select>
                  </div>


                    <div class="mb-3 col-lg-12">
                      <label for="message-text" class="col-form-label">Monto Inicial:</label>
                      <input type="text" class="form-control" name="saldo_inicial" id="saldo_inicial" required>
                    </div>

                  </div>

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                  <i class="bx bx-x d-block d-sm-none"></i>
                  <span class="d-none d-sm-block">Cancelar</span>
                </button>
                <button id="btnGuardarSaldoInicial" type="submit" class="btn btn-primary ml-1">
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
    <script type="text/javascript" src="scripts/cajachica.js"></script>

    <script>
    document.addEventListener("DOMContentLoaded", function () {
        // Obtener datos del sessionStorage
        var cargo = sessionStorage.getItem("cargo");

        // Obtener elementos HTML
        var vendedorInput = document.getElementById("nombrevendedorcaja");
        var cargoInput = document.getElementById("cargovendedor");
        var btnGuardarSaldoInicial = document.getElementById("btnGuardarSaldoInicial");

        // Verificar el cargo y actualizar los inputs y el botón en consecuencia
        if (cargo && cargo === "1") {
            var nombre = sessionStorage.getItem("nombre");
            vendedorInput.value = nombre;
            vendedorInput.disabled = true;
            
            cargoInput.value = "Vendedor";
            cargoInput.disabled = true;

            btnGuardarSaldoInicial.disabled = false;
        } else {
            vendedorInput.value = "No eres un vendedor";
            vendedorInput.disabled = true;
            
            cargoInput.value = "No asignado";
            cargoInput.disabled = true;

            btnGuardarSaldoInicial.disabled = true;
        }

        // Verifica si el valor en sessionStorage es 0
        var cargo = sessionStorage.getItem("cargo");
        
        if (cargo !== null && parseInt(cargo) === 0) {
            // Si el cargo es 0, muestra el botón
            document.getElementById("listarCajaBtn").style.display = "block";
        } else {
            // Si el cargo no es 0, oculta el botón
            document.getElementById("listarCajaBtn").style.display = "none";
        }
        
    });

  

</script>




    <?php
}
ob_end_flush();
?>