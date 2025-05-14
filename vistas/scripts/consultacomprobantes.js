var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var f = new Date();
cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
var today = now.getFullYear() + "-" + (month) + "-" + (day);

$('#fecha1').val(today);
$('#fecha2').val(today);



function listarcomprobantes() {
    //tabla.ajax.reload();
    var $fecha1 = $("#fecha1").val();
    var $fecha2 = $("#fecha2").val();
    var $tcp = $("#tipocomprobante").val();
    var $staCom = $("#sttcompro").val();

    tabla = $('#tbllistado').dataTable(
        {
            "aProcessing": true,//Activamos el procesamiento del datatables
            "aServerSide": true,//Paginación y filtrado realizados por el servidor
            dom: 'Bfrtip',//Definimos los elementos del control de tabla
            "processing": true,
            "language": {
                'loadingRecords': '&nbsp;',
                'processing': '<i class="fa fa-spinner fa-spin"></i> Procesando datos'
            },

            buttons: [
                // 'copyHtml5',
                // 'excelHtml5',
                // 'csvHtml5',
                // 'pdf'
            ],

            "ajax":
            {
                url: '../ajax/ventas.php?op=listarcomprobantes&fc1=' + $fecha1 + '&fc2=' + $fecha2 + '&tcomp=' + $tcp + '&estad=' + $staCom + "&idusuario=" + sessionStorage.getItem("idusuario"),
                type: "get",
                dataType: "json",
                error: function (e) {
                    console.log(e.responseText);
                }
            },

            "rowCallback":
                function (row, data) {

                },

            "bDestroy": true,
            "iDisplayLength": 100,//Paginación
            "order": [[0, "desc"]]//Ordenar (columna,orden)
        }).DataTable();
}



function prea42copias2(idcomprobante, tipocomp) {

    if (tipocomp == '01') {
        var rutacarpeta = '../reportes/exFactura.php?id=' + idcomprobante;
        $("#modalCom").attr('src', rutacarpeta);
        $("#modalPreview2").modal("show");
    } else {
        var rutacarpeta = '../reportes/exBoleta.php?id=' + idcomprobante;
        $("#modalCom").attr('src', rutacarpeta);
        $("#modalPreview2").modal("show");
    }


}


// function prea4completo2(idcomprobantem, tipocomp)
// {
//               var rutacarpeta='../reportes/exFacturaCompleto.php?id='+idfactura;
//               $("#modalCom").attr('src',rutacarpeta);
//               $("#modalPreview2").modal("show");

// }



function mostrarxml(idcomprobante, tipocomp) {
    var url = "";
    var fileName = "";

    if (tipocomp == '01') {
        url = "../ajax/ventas.php?op=mostrarxmlfactura";
    } else {
        url = "../ajax/ventas.php?op=mostrarxmlboleta";
    }

    // Crear un elemento <a> temporal para simular la descarga
    var link = document.createElement("a");

    // Configurar la solicitud POST
    $.post(url, { idcomprobante: idcomprobante }, function (e) {
        data = JSON.parse(e);
        if (data.rutafirma) {
            // Obtener el nombre del archivo desde la ruta de la firma
            var nombreArchivo = data.rutafirma.split('/').pop();
            link.href = data.rutafirma;
            link.download = nombreArchivo;
            document.body.appendChild(link);

            // Simular el clic en el enlace para iniciar la descarga
            link.click();

            // Eliminar el elemento <a> después de la descarga
            document.body.removeChild(link);
        } else {
            // Reemplazar bootbox.alert con swal.fire
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.cabextxml
            });
        }
    });
}








//Funcion para enviararchivo xml a SUNAT
function mostrarrpta(idcomprobante, tipocomp) {
    var url = "";
    var fileName = "";

    if (tipocomp == '01') {
        url = "../ajax/ventas.php?op=mostrarrptafactura";
    } else {
        url = "../ajax/ventas.php?op=mostrarrptaboleta";
    }

    // Crear un elemento <a> temporal para simular la descarga
    var link = document.createElement("a");

    // Configurar la solicitud POST
    $.post(url, { idcomprobante: idcomprobante }, function (e) {
        data = JSON.parse(e);
        var rptaS = data.rutaxmlr;

        // Obtener el nombre del archivo desde la ruta del XML
        var nombreArchivo = rptaS.split('/').pop();
        link.href = rptaS;
        link.download = nombreArchivo;
        document.body.appendChild(link);

        // Simular el clic en el enlace para iniciar la descarga
        link.click();

        // Eliminar el elemento <a> después de la descarga
        document.body.removeChild(link);
    });
}






//  $(function () {
//        $('#datetimepicker6').datetimepicker();
//        $('#datetimepicker7').datetimepicker({
//    useCurrent: false //Important! See issue #1075
//    });
//        $("#datetimepicker6").on("dp.change", function (e) {
//            $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
//        });
//        $("#datetimepicker7").on("dp.change", function (e) {
//            $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
//        });
//    });