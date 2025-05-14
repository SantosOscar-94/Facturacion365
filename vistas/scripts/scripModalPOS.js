
var baseURL = window.location.protocol + '//' + window.location.host;

// Verificar si pathname contiene '/vistas/' y eliminarlo.
var path = window.location.pathname;
if (path.includes("/vistas/")) {
    path = path.replace("/vistas/", "/");
}

// Asegurarnos de que el path termine en "/ajax/"
if (!path.endsWith("/ajax/")) {
    var lastSlashIndex = path.lastIndexOf("/");
    path = path.substring(0, lastSlashIndex) + "/ajax/";
}

// Construir urlconsumo
var urlconsumo = new URL(path, baseURL);

// var modoDemo = false;
//Función que se ejecuta al inicio
function init() {
    mostrarTotaldeVentas();
    listar();
    // $("#formulario").on("submit", function (e) {
    // 	guardaryeditar(e);
    // })
}

function limpiar() {
    $("#saldo_inicial").val("");
}




function traerSaldiIni(callback) {
    var idusuario = sessionStorage.getItem("idusuario");
    var settings = {
        "url": "../ajax/cajachica.php?action=traeridsaldoini",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "idusuario": idusuario
        }),
    };

    $.ajax(settings).done(function (response) {
        if (callback && typeof callback === "function") {
            callback(response.aaData[0].idsaldoini);
        }
    });
}


function mostrarTotaldeVentas() {

    traerSaldiIni(function (idsaldoini) {
        // Obtener idusuario de sessionStorage
        const idusuario = sessionStorage.getItem("idusuario");

        console.log(idsaldoini);
        if (!idusuario) {
            console.error('No se encontró idusuario en sessionStorage');
            return;
        }
        const requestData = {
            "idusuario": idusuario,
            "idsaldoini": idsaldoini
        };
        $.ajax({
            url: urlconsumo + "cajachica.php?action=TotalVentas",
            type: 'POST',  // Cambiado a POST
            contentType: 'application/json',  // Establecer tipo de contenido
            data: JSON.stringify(requestData),  // Convertir objeto a JSON
            dataType: 'json',
            success: function (data) {
                const totalVentas = data.aaData[0].total_venta;
                const totalIngreso = data.aaData[0].ingreso;
                const totalEgreso = data.aaData[0].egreso;
                const saldoInicial = data.aaData[0].saldo_inicial;

                // Actualizar elementos HTML
                const totalVentasElement = $('#total-ventas');
                const totalIngresoElement = $('#total_ingreso');
                const totalEgresoElement = $('#total_gasto');
                const saldoInicialElement = $('#total_saldoini');

                if (totalVentas !== null && totalVentas !== "") {
                    const valorAbsolutoVentas = Math.abs(parseFloat(totalVentas));
                    totalVentasElement.html('S/ ' + valorAbsolutoVentas.toFixed(2));
                } else {
                    totalVentasElement.html('S/ 0');
                }

                if (totalIngreso !== null && totalIngreso !== "") {
                    totalIngresoElement.html('S/ ' + parseFloat(totalIngreso).toFixed(2));
                } else {
                    totalIngresoElement.html('S/ 0');
                }

                if (totalEgreso !== null && totalEgreso !== "") {
                    totalEgresoElement.html('S/ ' + parseFloat(totalEgreso).toFixed(2));
                } else {
                    totalEgresoElement.html('S/ 0');
                }

                if (saldoInicial !== null && saldoInicial !== "") {
                    saldoInicialElement.html('S/ ' + parseFloat(saldoInicial).toFixed(2));
                } else {
                    saldoInicialElement.html('S/ 0');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error:', textStatus, errorThrown);
            }
        });
    });
}





function guardaryeditar(e) {
    e.preventDefault();

    $("#btnGuardarSaldoInicial").prop("disabled", true);
    // Obtener idusuario de sessionStorage
    var idusuario = sessionStorage.getItem("idusuario");
    var nombre = sessionStorage.getItem("nombre");
    var cargoven = sessionStorage.getItem("cargo");
    var turno = $("#turnocaja").val();
    var saldoini = $("#saldo_inicial").val();

    var data = {
        "saldo_inicial": saldoini,
        "idusuario": idusuario,
        "turno": turno,
        "cargo_vendedor": cargoven,
        "nombre_vendedor": nombre
    };
    $.ajax({
        url: "../ajax/cajachica.php?op=guardaryeditar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
            $("#btnGuardarSaldoInicial").prop("disabled", false);

            console.log("Data a enviar:", data);
            if (response === "Saldo registrado") {
                Swal.fire({
                    icon: 'success',
                    title: 'Guardado exitoso',
                    text: response,
                    showConfirmButton: false,
                    timer: 1500
                });
                listar();
                //limpiar();
                $('#agregarsaldoInicial').modal('hide'); // Ocultar el modal
                console.log("Respuesta del servidor:", response);
                // Obtener valor del saldo inicial guardado
                var saldoInicial = $('#saldo_inicial').val();

                // Actualizar contenido del h5 con el saldo inicial
                $('#total_saldoini').html('S/ ' + saldoInicial);
                //window.location.reload();
                //	mostrarSaldoINI(); // Ejecutar la función mostrarSaldoINI para actualizar el saldo inicial

                // Recargar la página principal
                window.parent.location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error:', textStatus, errorThrown);
        }
    });

}


// Asociar la función al evento submit del formulario
$("#formulario").submit(guardaryeditar);


function listar() {
    var idusuario = sessionStorage.getItem("idusuario");

    var data = {
        "idusuario": idusuario
    };

    $.ajax({
        url: '../ajax/cajachica.php?action=listar',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (response) {
            traerSaldiIni();
            // Verifica si aaData está presente y tiene datos
            if (response.aaData && response.aaData.length > 0) {
                // Ejemplo: Asignar los datos a tu tabla DataTable
                tabla = $('#tblistadototalcaja').dataTable({
                    "aProcessing": true,
                    "aServerSide": true,
                    "dom": 'Bfrtip',
                    "buttons": [],
                    "data": response.aaData, // Utiliza response.aaData como datos
                    "bDestroy": true,
                    "iDisplayLength": 15,
                    "order": [[0, ""]],
                    "columns": [
                        { "data": "idsaldoini", "visible": false },
                        { "data": "idusuario", "visible": false },
                        { "data": "fecha_creacion" },
                        { "data": "saldo_inicial" },
                        { "data": "nombre_vendedor" },
                        { "data": "turno" },
                        { "data": "fechadecierre" },
                        { "data": "totalingreso" },
                        { "data": "totalegreso" },
                        { "data": "totalcaja" },
                        { "data": "saldo_faltante", "visible": false },
                        { "data": "saldo_sobrante", "visible": false },
                        {
                            "data": "caja_abierta",
                            "render": function (data, type, row) {
                                return data === "0" ?
                                    '<span class="badge bg-success-transparent"><i class="ri-check-fill align-middle me-1"></i>Abierto</span>' :
                                    '<span class="badge bg-danger-transparent"><i class="ri-close-fill align-middle me-1"></i>Cerrado</span>';
                            }
                        }
                    ]
                }).DataTable();
            } else {
                // Manejar el caso en que no hay datos
                console.log("No existen datos");
            }
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}


function mostrarCajas() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("../ajax/cajachica.php?action=mostrartodo", requestOptions)
        .then((response) => response.json()) // Parsea la respuesta como JSON
        .then((data) => {
            const cargo = sessionStorage.getItem('cargo');

            if (cargo === '0') {
                // Mostrar resultados solo si cargo es 0
                const table = $('#tblistadototalcaja').DataTable({
                    data: data.aaData,
                    columns: [
                        { data: 'idsaldoini', visible: false },
                        { data: 'idusuario', visible: false },
                        { data: 'fecha_creacion' },
                        { data: 'saldo_inicial' },
                        { data: 'nombre_vendedor' },
                        { data: 'turno' },
                        { data: 'fechadecierre' },
                        { data: 'totalingreso' },
                        { data: 'totalegreso' },
                        { data: 'totalcaja' },
                        { data: 'saldo_faltante', visible: false },
                        { data: 'saldo_sobrante', visible: false },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return row.caja_abierta === '0' ? 'Abierta' : 'Cerrada';
                            }
                        }
                    ]
                });
            } else {
                console.log("No se muestra debido a que cargo no es 0 en sessionStorage.");
            }
        })
        .catch((error) => console.error(error));

}


function cerrarCaja() {
    traerSaldiIni(function (idsaldoini) {
        // Obtener idusuario de sessionStorage
        var idusuario = sessionStorage.getItem("idusuario");
        //const idsaldoini = resultadoGlobal.aaData[0].idsaldoini;
        // Datos a enviar en el cuerpo de la solicitud
        var data = {
            idusuario: idusuario,
            idsaldoini: idsaldoini
        };

        $.ajax({
            url: "../ajax/cajachica.php?action=CerrarCaja",
            type: "POST",
            contentType: "application/json", // Especificar el tipo de contenido como JSON
            data: JSON.stringify(data), // Convertir el objeto a una cadena JSON
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Caja cerrada',
                        text: 'Se ha cerrado la caja con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    listar();
                    resetearTotales(); // Restablecer los valores de los totales
                    //limpiar();
                    //window.location.reload();
                    // Volver a iniciar el proceso de apertura de caja
                    //$('#agregarsaldoInicial').modal('show');

                    // Recargar la página principal
                    window.parent.location.reload();
                    // Esperar un breve periodo antes de abrir el modal en el iframe
                    setTimeout(function () {
                        var iframe = document.getElementById('tuIframe'); // Reemplaza 'tuIframe' con el ID de tu iframe
                        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                        // Abre el modal dentro del iframe
                        iframeDocument.getElementById('modal_agregarproducto').modal('show');
                    }, 1000); // Puedes ajustar el tiempo de espera según sea necesario
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al cerrar la caja',
                        text: 'No se pudo cerrar la caja',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cerrar la caja',
                    text: 'No se pudo cerrar la caja',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });

    });

}




function resetearTotales() {
    $('#total_ingreso').text('0');
    $('#total_gasto').text('0');
    $('#total_saldoini').text('0');
    $('#total-ventas').text('0');
}



// function verificarSaldoInicial() {
// 	var saldoInicial = document.getElementById("total_saldoini").innerText;
// 	if (saldoInicial === "S/") {
// 		document.getElementById("cerrarCajaBtn").disabled = true;
// 	} else {
// 		document.getElementById("cerrarCajaBtn").disabled = false;
// 	}
// }








init();