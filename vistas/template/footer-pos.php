<?php
require_once "../modelos/Factura.php";
$factura = new Factura();

$datos = $factura->datosemp($_SESSION['idempresa']);
$datose = $datos->fetch_object();
?>
</div>

</div>

</div>

<div id="responsive-overlay"></div>

<script src="../custom/modules/jquery/jquery.min.js"></script>
<!-- Popper JS -->
<script src="../assets/libs/@popperjs/core/umd/popper.min.js"></script>
<!-- Bootstrap JS -->
<script src="../assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Node Waves JS-->
<script src="../assets/libs/node-waves/waves.min.js"></script>
<!-- Color Picker JS -->
<script src="../assets/libs/@simonwep/pickr/pickr.es5.min.js"></script>

<script src="../public/js/jquery.PrintArea.js"></script>
<script src="../public/js/toastr.js"></script>
<script src="../public/js/simpleXML.js"></script>

<!-- DATATABLES -->
<script src="../public/datatables/jquery.dataTables.min.js"></script>
<script src="../public/datatables/dataTables.buttons.min.js"></script>
<script src="../public/datatables/buttons.html5.min.js"></script>
<script src="../public/datatables/buttons.colVis.min.js"></script>
<script src="../public/datatables/jszip.min.js"></script>
<script src="../public/datatables/pdfmake.min.js"></script>
<script src="../public/datatables/vfs_fonts.js"></script>

<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>



</body>

</html>