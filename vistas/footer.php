<?php
require_once "../modelos/Factura.php";
$factura = new Factura();

$datos = $factura->datosemp($_SESSION['idempresa']);
$datose = $datos->fetch_object();
?>
</div>
</div>

</div>
<!-- Scroll To Top -->
<!-- <div class="scrollToTop">
  <span class="arrow"><i class="ri-arrow-up-s-fill fs-20"></i></span>
</div> -->
<!-- <style>
  a {
    text-decoration: none;
  }

  .floating_btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  @keyframes pulsing {
    to {
      box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
    }
  }

  .contact_icon {
    background-color: #42db87;
    color: #fff;
    width: 60px;
    height: 60px;
    font-size: 30px;
    border-radius: 50px;
    text-align: center;
    box-shadow: 2px 2px 3px #999;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translatey(0px);
    animation: pulse 1.5s infinite;
    box-shadow: 0 0 0 0 #42db87;
    -webkit-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    -moz-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    -ms-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    font-weight: normal;
    font-family: sans-serif;
    text-decoration: none !important;
    transition: all 300ms ease-in-out;
  }


  .text_icon {
    margin-top: 8px;
    color: #707070;
    font-size: 13px;
  }
</style>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<div class="floating_btn">
  <a target="_blank" href="https://wa.link/f2nzol">
    <div class="contact_icon">
      <i class="fa fa-whatsapp my-float"></i>
    </div>
  </a>
  <p class="text_icon" style="text-align: center;font-weight: bold;">¿Alguna consulta?</p>
</div> -->

<div id="responsive-overlay"></div>

<script src="../custom/modules/jquery/jquery.min.js"></script>
<!-- Popper JS -->
<script src="../assets/libs/@popperjs/core/umd/popper.min.js"></script>
<!-- Bootstrap JS -->
<script src="../assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Defaultmenu JS -->
<script src="../assets/js/defaultmenu.min.js"></script>
<!-- Node Waves JS-->
<script src="../assets/libs/node-waves/waves.min.js"></script>
<!-- Sticky JS -->
<script src="../assets/js/sticky.js"></script>
<!-- Simplebar JS -->
<script src="../assets/libs/simplebar/simplebar.min.js"></script>
<script src="../assets/js/simplebar.js"></script>
<!-- Color Picker JS -->
<script src="../assets/libs/@simonwep/pickr/pickr.es5.min.js"></script>

<!-- Custom JS -->
<script src="../assets/js/custom.js"></script>
<!-- Custom-Switcher JS -->
<script src="../assets/js/custom-switcher.min.js"></script>

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