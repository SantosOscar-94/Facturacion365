function init() {

    $("#formulario").on("submit", function (e) {
        regcompras(e);
    });

    var fecha = new Date();
    var anoActual = fecha.getFullYear();

    $(document).ready(function () {
        // Llenar las opciones del año si no están ya definidas
        var selectAno = $("#ano");
        if (selectAno.children().length === 0) {
            for (var ano = 2018; ano <= anoActual; ano++) {
                selectAno.append("<option value='" + ano + "'>" + ano + "</option>");
            }
        }

        // Establecer el año actual como valor predeterminado
        $("#ano").val(anoActual);
    });



    regcompras();
}

function regcompras() {

    var $ano = $("#ano option:selected").text();
    var $mes = $("#mes option:selected").val();
    var $moneda = $("#moneda option:selected").val();

    tabla = $('#tbllistado').dataTable(
        {
            "aProcessing": true,//Activamos el procesamiento del datatables
            "aServerSide": true,//Paginación y filtrado realizados por el servidor
            dom: 'Bfrtip',//Definimos los elementos del control de tabla



            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdf'
            ],
            "ajax":
            {
                url: '../ajax/inventarios.php?op=regcompras&ano=' + $ano + '&mes=' + $mes + '&moneda=' + $moneda,
                type: "post",
                dataType: "json",
                error: function (e) {
                    console.log(e.responseText);
                }
            },

            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Calculando subtotal
                var subtotal = api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Calculando igv
                var igv = api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Calculando total
                var total = api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);


                var subtotal2 = subtotal;
                var igv2 = igv;
                var total2 = total;


                // Update footer by showing the total with the reference of the column index 
                //$( api.column( 0 ).footer() ).html('Total');
                $(api.column(6).footer()).html(subtotal2);
                $(api.column(7).footer()).html(igv2);
                $(api.column(8).footer()).html(total2);
            },

            "bDestroy": true,
            "iDisplayLength": 10,//Paginación
            "order": [[0, "asc"]]//Ordenar (columna,orden)

        }).DataTable();
}





//Funcioón para registro de ventas en menu VENTAS
function regventas() {

    var $ano = $("#ano option:selected").text();
    var $mes = $("#mes option:selected").val();
    var $dia = $("#dia option:selected").val();

    tabla = $('#tbllistado').dataTable(
        {
            "aProcessing": true,//Activamos el procesamiento del datatables
            "aServerSide": true,//Paginación y filtrado realizados por el servidor
            dom: 'Bfrtip',//Definimos los elementos del control de tabla



            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdf'
            ],
            "ajax":
            {
                url: '../ajax/inventarios.php?op=regventas&ano=' + $ano + '&mes=' + $mes + '&dia=' + $dia,
                type: "post",
                dataType: "json",
                error: function (e) {
                    console.log(e.responseText);
                }
            },

            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Calculando subtotal
                var subtotal = api
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Calculando igv
                var igv = api
                    .column(4)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Calculando total
                var total = api
                    .column(5)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                var subtotal2 = currencyFormat(subtotal);
                var igv2 = currencyFormat(igv);
                var total2 = currencyFormat(total);

                // Update footer by showing the total with the reference of the column index 
                //$( api.column( 0 ).footer() ).html('Total');
                $(api.column(3).footer()).html(subtotal2);
                $(api.column(4).footer()).html(igv2);
                $(api.column(5).footer()).html(total2);
            },

            "bDestroy": true,
            "iDisplayLength": 10,//Paginación
            "order": [[0, "asc"]]//Ordenar (columna,orden)

        }).DataTable();
}



function regvenagruxdia() {

    var $ano = $("#ano option:selected").text();
    var $mes = $("#mes option:selected").val();
    var $dia = $("#dia option:selected").val();

    tabla = $('#tbllistado').dataTable(
        {
            "aProcessing": true,//Activamos el procesamiento del datatables
            "aServerSide": true,//Paginación y filtrado realizados por el servidor
            dom: 'Bfrtip',//Definimos los elementos del control de tabla



            buttons: [
                // 'copyHtml5',
                // 'excelHtml5',
                // 'csvHtml5',
                // 'pdf'
            ],
            "ajax":
            {
                url: '../ajax/inventarios.php?op=regvenagruxdia&ano=' + $ano + '&mes=' + $mes + '&dia=' + $dia,
                type: "post",
                dataType: "json",
                error: function (e) {
                    console.log(e.responseText);
                }
            },

            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Calculando subtotal
                var subtotal = api
                    .column(1)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Calculando igv
                var igv = api
                    .column(2)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Calculando total
                var total = api
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                var subtotal2 = currencyFormat(subtotal);
                var igv2 = currencyFormat(igv);
                var total2 = currencyFormat(total);

                // Update footer by showing the total with the reference of the column index 
                //$( api.column( 0 ).footer() ).html('Total');
                $(api.column(1).footer()).html(subtotal2);
                $(api.column(2).footer()).html(igv2);
                $(api.column(3).footer()).html(total2);
            },

            "bDestroy": true,
            "iDisplayLength": 10,//Paginación
            "order": [[0, "asc"]]//Ordenar (columna,orden)

        }).DataTable();
}




function currencyFormat(num) {
    return "S/." + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}


function regcompra(e) {
    e.preventDefault(); //No se activará la acción predeterminada del evento
    //$("#btnGuardar").prop("disabled",true);

    var formData = new FormData($("#formulario")[0]);

    $.ajax({
        url: "../ajax/inventarios.php?op=regcompras",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,

        success: function (datos) {

            listar();

        }

    });

}

function comprimir() {
    var rutaple = $("#rutaple").val();
    var rutadescargas = $("#rutadescargas").val();
    var destino = $("#destino").val();

    if (destino == "02") {
        $.ajax({
            url: "comprimir.php",
            type: "POST",
            data: { rutaple: rutaple, rutadescargas: rutadescargas },
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Proceso Finalizado!!',
                        html: 'Descargar: <a href="' + data.download_link + '">' + data.download_file + '</a><br> Volver: <a href="javascript:history.back(-1);" title="Ir la página anterior">Volver</a>',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error: ' + errorThrown
                });
            }
        });
    }
}


init();