var tabla;
var tablaCLiente;
var tablaArti;
var tablacaja;

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  rtl: false,
  positionClass: "toast-bottom-center",
  preventDuplicates: false,
  onclick: null,
};

$idempr = $("#idempresa").val();
$iva = $("#iva").val();

//Función que se ejecuta al inicio
function init() {
  $("#formulario").on("submit", function (e) {
    guardaryeditarFactura(e);
  });

  $("#formularioncliente").on("submit", function (e) {
    guardaryeditarcliente(e);
  });

  $("#formularionarticulo").on("submit", function (e) {
    guardaryeditararticulo(e);
  });

  $("#formularionnotificacion").on("submit", function (e) {
    guardaryeditarnotificacion(e);
  });

  // Carga de departamentos para clientes =====================
  $.post("../ajax/persona.php?op=selectDepartamento", function (r) {
    $("#iddepartamento").html(r);
    //$('#iddepartamento').selectpicker('refresh');
  });
  // Carga de departamentos para clientes =====================

  // Carga de combo para vendedores =====================
  $.post(
    "../ajax/vendedorsitio.php?op=selectVendedorsitio&idempresa=" + $idempr,
    function (r) {
      $("#vendedorsitio").html(r);
      //$('#vendedorsitio').selectpicker('refresh');
    }
  );

  // Carga de combo para tributo =====================
  $.post("../ajax/factura.php?op=selectAlmacen", function (r) {
    $("#almacenlista").html(r);
    //$('#almacenlista').selectpicker('refresh');
  });

  $.post("../ajax/factura.php?op=selectTributo", function (r) {
    $("#nombre_tributo_4_p").html(r);
    //$('#nombre_tributo_4_p').selectpicker('refresh');
  });

  // Carga tipo de cambio =====================
  $.post("../ajax/factura.php?op=tcambiodia", function (r) {
    $("#tcambio").val(r);
  });

  // Carga de unidades de medida
  $.post("../ajax/factura.php?op=selectunidadmedida", function (r) {
    $("#iddepartamento").html(r);
    //$('#iddepartamento').selectpicker('refresh');

    $("#unidadm").html(r);
    //$('#unidadm').selectpicker('refresh');
  });

  $.post("../ajax/factura.php?op=selectunidadmedidanuevopro", function (r) {
    $("#umedidanp").html(r);
    //$('#umedidanp').selectpicker('refresh');
  });

  cont = 0;
  conNO = 1;
  sw = 0;
  actCli = 0;

  mostrarform(false);
  verificarCargoYMostrarFacturasPorUsuario();

  //Impuesto gloabl
  impuestoglobal();

  //onOff=false;
  //counter=setInterval(timer, 5000);
  //listar();
  //pause();

  $idempresa = $("#idempresa").val();
  $.post(
    "../ajax/articulo.php?op=selectAlmacen&idempresa=" + $idempresa,
    function (r) {
      $("#idalmacennarticulo").html(r);
      //$('#idalmacennarticulo').selectpicker('refresh');
    }
  );

  $.post("../ajax/articulo.php?op=selectFamilia", function (r) {
    $("#idfamilianarticulo").html(r);
    //$('#idfamilianarticulo').selectpicker('refresh');
  });
}

function cambioUm() {
  $("#iumedida").val($("#unidadm").val());
}

let count = 0;
function timer() {
  count++;
  tabla.ajax.reload(null, false);
}

//PARA ACTUALIZAR ESTADO
let onOff = true;
function pause() {
  if (onOff) {
    onOff = false;
    //counter=setInterval(timer, 5000);
    clearInterval(counter);
    //listar();
    verificarCargoYMostrarFacturasPorUsuario();
    //$("#estadofact").load(" #estadofact");
    document.getElementById("chk1").checked = false;
  } else {
    onOff = true;
    verificarCargoYMostrarFacturasPorUsuario();
    counter = setInterval(timer, 5000);
    //document.getElementById("chk1").checked = true;
    //document.getElementById("chk1").disabled = true;
  }
}

function verificarEnvioFactura() {
  const cargo = sessionStorage.getItem('cargo');
  if (cargo === '1') {
    pause();
  } else {
    console.log("El cargo no es 1 en sessionStorage, la función no se ejecutará.");
  }
}

//PARA ACTUALIZAR ESTADO

function init2() {
  listarCaja();
}

//Función Listar
function listar() {
  tabla = $("#tbllistado")
    .DataTable({
      scrollCollapse: true,
      aProcessing: true, //Activamos el procesamiento del datatables
      aServerSide: true, //Paginación y filtrado realizados por el servidor
      dom: "Bfrtip", //Definimos los elementos del control de tabla
      buttons: [],
      ajax: {
        url: "../ajax/factura.php?op=listar",
        type: "get",
        dataType: "json",
        error: function (e) {
          console.log(e.responseText);
        },
      },

      rowCallback: function (row, data) {
        //$(row).addClass('selected');
        //$(row).id(0).addClass('selected');
        console.log("listatabla", row, data);
      },

      bDestroy: true,
      iDisplayLength: 5, //Paginación
      order: [[0, "desc"]], //Ordenar (columna,orden)
    })
    .DataTable();
}

//Función Listar
function listarenvioautomatico() {
  tabla = $("#tbllistado")
    .dataTable({
      aProcessing: true, //Activamos el procesamiento del datatables
      aServerSide: true, //Paginación y filtrado realizados por el servidor
      dom: "Bfrtip", //Definimos los elementos del control de tabla
      buttons: [],
      ajax: {
        url: "../ajax/factura.php?op=envioautomatico&idempresa=" + $idempr + "&idusuario=" + sessionStorage.getItem("idusuario"),
        type: "get",
        dataType: "json",
        error: function (e) {
          console.log(e.responseText);
        },
      },

      rowCallback: function (row, data) {
        //$(row).addClass('selected');
        //$(row).id(0).addClass('selected');
      },

      bDestroy: true,
      iDisplayLength: 15, //Paginación
      order: [[0, "desc"]], //Ordenar (columna,orden)
    })
    .DataTable();
  let refreshTable = setInterval(function () {
    tabla.ajax.reload();
  }, 10000); // Actualiza la tabla cada 30 segundos
}


// Esta función verifica si el cargo en sessionStorage es 0 y luego ejecuta mostrarCajas
function verificarCargoYMostrarFacturasPorUsuario() {
  const cargo = sessionStorage.getItem('cargo');
  if (cargo === '1') {
    listarenvioautomatico();
  } else {
    console.log("El cargo no es 1 en sessionStorage, la función no se ejecutará.");
  }
}

//Función Listar
function listarenvioautomaticoTodo() {
  tabla = $("#tbllistado")
    .dataTable({
      aProcessing: true, //Activamos el procesamiento del datatables
      aServerSide: true, //Paginación y filtrado realizados por el servidor
      dom: "Bfrtip", //Definimos los elementos del control de tabla
      buttons: [],
      ajax: {
        url: "../ajax/factura.php?op=envioautomaticolistartodo&idempresa=" + $idempr,
        type: "get",
        dataType: "json",
        error: function (e) {
          console.log(e.responseText);
        },
      },

      rowCallback: function (row, data) {
        //$(row).addClass('selected');
        //$(row).id(0).addClass('selected');
      },

      bDestroy: true,
      iDisplayLength: 15, //Paginación
      order: [[0, "desc"]], //Ordenar (columna,orden)
    })
    .DataTable();
  let refreshTable = setInterval(function () {
    tabla.ajax.reload();
  }, 10000); // Actualiza la tabla cada 30 segundos
}


// Esta función verifica si el cargo en sessionStorage es 0 y luego ejecuta MostarFacturas
function verificarCargoYMostrarFacturas() {
  const cargo = sessionStorage.getItem('cargo');
  if (cargo === '0') {
    listarenvioautomaticoTodo();
  } else {
    console.log("El cargo no es 0 en sessionStorage, la función no se ejecutará.");
  }
}

// Llamada a la función al cargar la página
verificarCargoYMostrarFacturas();


function stopRKey(evt) {
  var evt = evt ? evt : event ? event : null;
  var node = evt.target ? evt.target : evt.srcElement ? evt.srcElement : null;
  if (evt.keyCode == 13 && node.type == "text") {
    return false;
  }
}

// Carga de Ciudades para clientes =====================
function llenarCiudad() {
  var iddepartamento = $("#iddepartamento option:selected").val();
  $.post(
    "../ajax/persona.php?op=selectCiudad&id=" + iddepartamento,
    function (r) {
      $("#idciudad").html(r);
      //$('#idciudad').selectpicker('refresh');
      $("#idciudad").val("");
    }
  );
}

// Carga de distritos para clientes =====================
function llenarDistrito() {
  var idciudad = $("#idciudad option:selected").val();
  $.post("../ajax/persona.php?op=selectDistrito&id=" + idciudad, function (r) {
    $("#iddistrito").html(r);
    //$('#iddistrito').selectpicker('refresh');
  });
}

function cargaFact() {
  (function (a) {
    a.createModal = function (b) {
      defaults = {
        title: "FACTURA",
        message: "FACTURA",
        closeButton: true,
        scrollable: false,
      };
      var b = a.extend({}, defaults, b);
      var c =
        b.scrollable === true
          ? 'style="max-height: 420px;overflow-y: auto;"'
          : "";
      html = '<div class="modal fade" id="myModal">';
      html += '<div class="modal-dialog">';
      html += '<div class="modal-content">';
      html += '<div class="modal-header">';
      html +=
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
      if (b.title.length > 0) {
        html += '<h4 class="modal-title">' + b.title + "</h4>";
      }
      html += "</div>";
      html += '<div class="modal-body" ' + c + ">";
      html += b.message;
      html += "</div>";
      html += '<div class="modal-footer">';
      if (b.closeButton === true) {
        html +=
          '<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>';
      }
      html += "</div>";
      html += "</div>";
      html += "</div>";
      html += "</div>";
      a("body").prepend(html);
      a("#modalPreview")
        .modal()
        .on("hidden.bs.modal", function () {
          a(this).remove();
        });
    };
  })(jQuery);
  /*
   * Here is how you use it
   */
  $(function () {
    $(".view-pdf").on("load", function () {
      var pdf_link = $(this).attr("href");
      var pdf_link = "../reportes/exFactura.php?id=62";
      var iframe =
        '<div class="iframe-container"><iframe src="' +
        pdf_link +
        '"></iframe></div>';
      var iframe =
        '<object data="' +
        pdf_link +
        '" type="application/pdf"><embed src="' +
        pdf_link +
        '" type="application/pdf" /></object>';
      var iframe =
        '<object type="application/pdf" data="' +
        pdf_link +
        '" width="900" height="720">No Support</object>';
      $.createModal({
        title: "FACTURA ELECTRÓNICA",
        message: iframe,
        closeButton: true,
        scrollable: false,
      });
      return false;
    });
  });
}

function mayus(e) {
  e.value = e.value.toUpperCase();
}

function incrementarNum() {
  var serie = $("#serie option:selected").val();
  $.post(
    "../ajax/factura.php?op=autonumeracion&ser=" +
    serie +
    "&idempresa=" +
    $idempr,
    function (r) {
      var n2 = pad(r, 0);
      //var n2=r;
      $("#numero_factura").val(n2);

      var SerieReal = $("#serie option:selected").text();
      $("#SerieReal").val(SerieReal);
    }
  );
  document.getElementById("numero_documento2").focus();
}

function incrementarinicio() {
  $.post("../ajax/factura.php?op=selectSerie", function (r) {
    $("#serie").html(r);
    //$("#serie").selectpicker('refresh');
    var serieL = document.getElementById("serie");
    var opt = serieL.value;
    $.post(
      "../ajax/factura.php?op=autonumeracion&ser=" +
      opt +
      "&idempresa=" +
      $idempr,
      function (r) {
        var n2 = pad(r, 0);
        $("#numero_factura").val(n2);
        var SerieReal = $("#serie option:selected").text();
        $("#SerieReal").val(SerieReal);
      }
    );
  });
}

//Función para poner ceros antes del numero siguiente de la factura
function pad(n, length) {
  var n = n.toString();
  while (n.length < length) n = "0" + n;
  return n;
}
//Fin de Función

//Función limpiar
function limpiar() {
  $("#idpersona").val("");
  //$("#numero_documento").val("");
  $("#razon_social").val("");
  $("#razon_social2").val("");
  $("#domicilio_fiscal").val("");
  $("#domicilio_fiscal2").val("");
  $("#numero_guia").val("");

  $("#cliente").val("");
  $("#numero_documento").val("");
  $("#numero_documento2").val("");
  //$("#serie").val("");
  $("#numero_factura").val("");
  $("#impuesto").val("0");
  $(".filas").remove();
  $("#tcambio").val("0");

  $("#subtotal").html("0");
  $("#subtotal_factura").val("");
  $("#igv_").html("0");
  $("#total_igv").val("");
  $("#total").html("0");
  $("#total_final").val("");
  $("#pre_v_u").val("");
  $("#guia_remision_29_2").val("");
  $("#tdescuentoL").val("");

  $("#correocli").val("");
  $("#nroreferencia").val("");
  $("#numero_documento2").focus();

  $("tipopago").val("contado");

  $("#ipagado").html("0");
  $("#saldo").html("0");

  $("#ipagado_final").val("");
  $("#saldo_saldo").val("");

  $("#montocuota").val("");
  $("#tipopago").val("Contado");
  $("#ccuotas").val("0");
  $("#otroscargos").val("0");

  //Obtenemos la fecha actual
  $("#fecha_emision_01").prop("disabled", false);

  const inputFechaVenc = document.getElementById("fechavenc");

  // Establecer el valor máximo permitido para la fecha de vencimiento en 4 días a partir de la fecha actual
  const fechaMax = new Date();
  fechaMax.setDate(fechaMax.getDate() + 2);

  inputFechaVenc.addEventListener("change", function () {
    const fechaSeleccionada = new Date(this.value);
    const fechaActual = new Date();
    const diasDiferencia = Math.round(
      (fechaSeleccionada - fechaActual) / (1000 * 60 * 60 * 24)
    );

    // Verificar si se ha seleccionado una fecha anterior a la actual
    if (
      fechaSeleccionada < fechaActual &&
      fechaSeleccionada.toDateString() !== fechaActual.toDateString()
    ) {
      Swal.fire({
        title: "Error",
        text: "La fecha de vencimiento no puede ser posterior a 3 días a partir de la fecha actual normado por sunat",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.value = fechaActual.toISOString().slice(0, 10);
    }
    // Verificar si se ha seleccionado una fecha posterior a 4 días a partir de la fecha actual
    else if (diasDiferencia > 2) {
      Swal.fire({
        title: "Error",
        text: "La fecha de vencimiento no puede ser posterior a 3 días a partir de la fecha actual",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.value = fechaActual.toISOString().slice(0, 10);
    }
  });

  document.getElementById("tarjetadc").checked = false;
  document.getElementById("transferencia").checked = false;
  $("#tadc").val("0");
  $("#trans").val("0");

  document.getElementById("continuo").checked = false;
  document.getElementById("estadonoti").checked = false;

  document.getElementById("fechavenc").readOnly = false;
  document.getElementById("divmontocuotas").innerHTML = "";
  document.getElementById("divfechaspago").innerHTML = "";
  document.getElementById("ccuotas").readOnly = false;

  var xv = document.getElementById("tipopagodiv");
  xv.style.display = "none";

  // Carga de combo para tributo =====================
  $.post("../ajax/factura.php?op=selectTributo", function (r) {
    $("#nombre_tributo_4_p").html(r);
    //$('#nombre_tributo_4_p').selectpicker('refresh');
  });

  $("#codigo_tributo_h").val($("#nombre_tributo_4_p option:selected").val());
  //$("#tipofactura").val("productos");

  //Obtenemos la fecha actual
  $("#fecha_emision").prop("disabled", false);

  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);

  var f = new Date();
  cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();

  //Para hora y minutos
  //&var today = now.getFullYear()+"-"+(month)+"-"+(day)+" "+(cad) ;
  var today = now.getFullYear() + "-" + month + "-" + day;
  $("#fecha_emision").val(today);
  $("#fechavenc").val(today);
  $("#fechavecredito").val(today);

  document.getElementById("btnAgregarArt").style.backgroundColor = "#35770c";

  cont = 0;
  conNO = 1;

  // NUEVO 290920
  var checkBox = document.getElementById("vuniigv");
  checkBox.checked = false;
  // NUEVO 290920
}

jQuery(document).ready(function () {
  jQuery("#AvanzaModal").on("hidden.bs.modal", function (e) {
    jQuery(this).removeData("bs.modal");
    jQuery(this).find(".modal-content").empty();
  });
});

function capturarhora() {
  var f = new Date();
  cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
  $("#hora").val(cad);
}

function limpiarItem() {
  $("#nombrearti").val("");
  $("#stoc").val("");

  $("#icantidad").val("");
  $("#iumedida").val("");
  $("#ipunitario").val("");
  $("#ivunitario").val("");
  $("#icodigo").val("");
  $("#idescripcion").val("");
  $("#iicbper2").val("");
  $("#iimpicbper").val("");
  $("#iigvresu").val("");
  $("#iimportetotalitem").val("");
  $("#idescuento").val("");
}

//Función mostrar formulario
function mostrarform(flag, sesion) {
  limpiar();
  if (flag) {
    incrementarinicio();
    //listarServicios();
    listarArticulos();
    //listarArticulos_();
    $("#listadoregistros").hide();
    $("#formularioregistros").show();
    $("#btnagregar").hide();
    $("#btnGuardar").hide();
    $("#refrescartabla").hide();
    $("#btnCancelar").show();
    $("#btnAgregarArt").show();
    $("#numero_documento2").focus();
    document.getElementById("numero_documento2").focus();
    //$("#tipofactura").val("productos");
    //alert("SELECCIONE SU USUARIO");
  } else {
    $("#listadoregistros").show();
    $("#formularioregistros").hide();
    $("#btnagregar").show();
    $("#refrescartabla").show();
  }
}

//Función cancelarform
function cancelarform() {
  var mensaje = confirm("¿Desea cancelar el comprobante?");

  if (mensaje) {
    limpiar();
    evaluar2();
    detalles = 0;
    mostrarform(false);
  }
}

function agregarCliente(
  idpersona,
  razon_social,
  numero_documento,
  domicilio_fiscal,
  tipo_documento
) {
  if (idpersona != "") {
    $("#idpersona").val(idpersona);
    $("#numero_documento2").val(numero_documento);
    $("#razon_social2").val(razon_social);
    $("#domicilio_fiscal2").val(domicilio_fiscal);
    $("#tipo_documento_cliente").val(tipo_documento);
    $("#myModalCli").modal("hide");
  } else {
    alert("Error al ingresar el detalle, revisar los datos del cliente");
  }
}

//Función ListarClientes
function listarClientes() {
  tablaCLiente = $("#tblaclientes")
    .dataTable({
      aProcessing: false, //Activamos el procesamiento del datatables
      "bRetrieve ": false, //Paginación y filtrado realizados por el servidor
      dom: "Bfrtip", //Definimos los elementos del control de tabla
      buttons: [],
      ajax: {
        url: "../ajax/factura.php?op=listarClientesfactura",
        type: "get",
        dataType: "json",
        error: function (e) {
          console.log(e.responseText);
        },
      },
      bDestroy: true,
      iDisplayLength: 8, //Paginación
      order: [[0, "desc"]], //Ordenar (columna,orden)
    })
    .DataTable();

  $("#tblaclientes").DataTable().ajax.reload();
}

function listarArticulos() {
  tpf = $("#tipofactura").val();
  tipoprecio = $("#tipoprecio").val();
  almacen = $("#almacenlista").val();

  $iteno = $("#itemno").val();

  tablaArti = $("#tblarticulos")
    .dataTable({
      // retrieve: true,
      aProcessing: true, //Activamos el procesamiento del datatables
      aServerSide: true, //Paginación y filtrado realizados por el servidor
      dom: "Bfrtip", //Definimos los elementos del control de tabla
      buttons: [],
      ajax: {
        url:
          "../ajax/factura.php?op=listarArticulosfactura&tipoprecioaa=" +
          tipoprecio +
          "&tipof=" +
          tpf +
          "&itm=" +
          $iteno +
          "&alm=" +
          almacen,
        type: "get",
        dataType: "json",
        error: function (e) {
          console.log(e.responseText);
        },
      },

      //Para cambiar el color del stock cuando es 0
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Agregar el input y el botón en la columna correspondiente (índice 5)
        $(nRow)
          .find("td:eq(5)")
          .html(
            '<div class="row">' +
            '<div class="col-8">' +
            '<input type="number" class="form-control" style="width: 100px;" id="product_stock" value="' +
            aData[5] +
            '" />' +
            "</div>" +
            '<div class="col-2 p-0">' +
            '<button class="btn btn-secondary m-0" id="btn_editarstock"><i class="fas fa-save"></i></button>' +
            "</div>" +
            "</div>"
          );

        if (aData[5] == "0.00") {
          $("td", nRow).css("background-color", "#fd96a9");

          // Agregar evento de clic al botón de guardar
          $(nRow)
            .find("#btn_editarstock")
            .click(function () {
              var newStock = $(nRow).find("#product_stock").val();

              var idarticulo = aData[8];

              var formData = new FormData();
              formData.append("idarticuloproduct", idarticulo);
              formData.append("stockproduct", newStock);

              console.log("Nuevo data:", formData);
              $.ajax({
                url: "../ajax/articulo.php?op=editarstockarticulo",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                  Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    showConfirmButton: false,
                    timer: 1500,
                    text: response,
                  });
                  $("#tblarticulos").DataTable().ajax.reload();
                },
                error: function () {
                  Swal.fire({
                    icon: "error",
                    title: "Error al guardar",
                    text: "Ha ocurrido un error al actualizar los datos",
                  });
                },
              });
            });
        } else {
          $("td", nRow).css("background-color", "");

          // Agregar evento de clic al botón de guardar
          $(nRow)
            .find("#btn_editarstock")
            .click(function () {
              var newStock = $(nRow).find("#product_stock").val();

              var idarticulo = aData[8];

              var formData = new FormData();
              formData.append("idarticuloproduct", idarticulo);
              formData.append("stockproduct", newStock);

              Swal.fire({
                title: "Aún tienes suficiente stock",
                text: "¿Deseas agregar más?",
                showDenyButton: true,
                confirmButtonText: "Sí",
                denyButtonText: "No",
              }).then((result) => {
                if (result.isConfirmed) {
                  $.ajax({
                    url: "../ajax/articulo.php?op=editarstockarticulo",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                      Swal.fire({
                        icon: "success",
                        title: "¡Éxito!",
                        showConfirmButton: false,
                        timer: 1500,
                        text: response,
                      });
                      $("#tblarticulos").DataTable().ajax.reload();
                    },
                    error: function () {
                      Swal.fire({
                        icon: "error",
                        title: "Error al guardar",
                        text: "Ha ocurrido un error al actualizar los datos",
                      });
                    },
                  });
                } else if (result.isDenied) {
                  Swal.fire("Los cambios no se guardaron", "", "info");
                  $("#tblarticulos").DataTable().ajax.reload();
                }
              });
            });
        }

        // Agregar evento de clic a la imagen
        $(nRow)
          .find("td:eq(6) img")
          .css("cursor", "pointer") // Cambiar el cursor a una mano
          .click(function () {
            mostrarModal(aData); // Llamada a la función para mostrar el modal con los datos
          });
      },

      bDestroy: true,
      iDisplayLength: 5, //Paginación
      order: [[5, "desc"]], //Ordenar (columna,orden)
    })
    .DataTable();

  $("#tblarticulos").DataTable().ajax.reload();

  //controlastock();
}

/* ---------------------------------------------------- */
//                 VISUALIZAR IMG PRODUCT

function mostrarModal(data) {
  // Aquí puedes acceder a los datos de la fila utilizando el índice correspondiente
  var nombre = data[1];
  var img_product = data[7];
  // console.log(data);

  Swal.fire({
    title: "Detalles del Artículo",
    html:
      '<img class="mb-3" style="width:80%;" src="' +
      img_product +
      '" />' +
      '<p class="text-center">' +
      nombre +
      "</p>",

    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: "Cerrar",
  });
}

/* ---------------------------------------------------- */
//                   CALCULAR VUELTO

function cleanNumber(value) {
  return parseFloat(value.replace(/,/g, ''));
}

$("#ipagado").on("input", function () {
  var importe_pagado = cleanNumber($(this).val());
  var total_pagar = cleanNumber($("#total").text());

  var vuelto;

  if (isNaN(importe_pagado)) {
    $("#vuelto_text").html("Vuelto : ");
    $("#saldo").text("0.00");
    return;
  }

  if (importe_pagado >= total_pagar) {
    vuelto = (importe_pagado - total_pagar).toFixed(2);
    $("#vuelto_text").html("Vuelto : ");
    $("#saldo").text(vuelto).css("color", "green");
  } else {
    $("#vuelto_text").html(
      'Vuelto :  <span style="color: red; font-weight: bold">Falta</span>'
    );
    vuelto = (total_pagar - importe_pagado).toFixed(2);
    $("#saldo").text(vuelto).css("color", "red");
  }
});


//Función ListarArticulos
// function listarArticulos_()
// {
//     tipoprecioa="";
//     tipoprecioa=$('#preciotipo option:selected').val();
//     //alert(tipoprecioa);
//     //$tipoprecioa='3';
//     tablaArti=$('#tblarticulos_').dataTable(
//     {

//         retrieve: true,
//         "aProcessing": true,//Activamos el procesamiento del datatables
//         "aServerSide": true,//Paginación y filtrado realizados por el servidor
//         dom: 'Bfrtip',//Definimos los elementos del control de tabla
//         buttons: [

//                 ],
//         "ajax":
//                 {
//                     url: '../ajax/factura.php?op=listarArticulosfactura&tipoprecioaa='+tipoprecioa,
//                     type : "get",
//                     dataType : "json",
//                     error: function(e){
//                     console.log(e.responseText);
//                     }
//                 },

//                 //Para cambiar el color del stock cuando es 0
//                 "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
//                     if ( aData[5] == "0.00" )
//                     {
//                         $('td', nRow).css('background-color', '#fd96a9');
//                     }
//                     else
//                     {
//                         $('td', nRow).css('background-color', '');
//                     }
//                 },

//         "bDestroy": true,
//         "iDisplayLength": 5,//Paginación
//         "order": [[ 0, "desc" ]]//Ordenar (columna,orden)

//     }
//     ).DataTable();

// $('#tblarticulos_').DataTable().ajax.reload();

// //controlastock();
// }

function controlastock() {
  $(document).ready(function () {
    $("#tblarticulos").dataTable({
      retrieve: true,
      rowCallback: function (row, data) {
        if (data[5] == "0") {
          $($(row).find("td")[2]).css("background-color", "red");
        }
      },
    });
  });
}

//Función para guardar o editar

function guardaryeditarFactura(e) {
  e.preventDefault(); //No se activará la acción predeterminada del evento

  var rowCount = $("#detalles tbody tr").length;
  if (rowCount == 0) {
    swal.fire({
      title: "La tabla está vacía, por favor agregue al menos un producto.",
      icon: "error",
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  // Validar si el campo numero_documento2 está vacío
  if ($("#numero_documento2").val().trim() === "") {
    swal.fire({
      title: "Por favor, ingresa el RUC.",
      icon: "warning",
      showCancelButton: false,
      showConfirmButton: true,
    });
    return;
  }

  // Validar si el campo numero_documento2 tiene caracteres no numéricos
  if (!/^\d+$/.test($("#numero_documento2").val())) {
    swal.fire({
      title: "Por favor, llena el RUC correctamente. Solo se aceptan números.",
      icon: "warning",
      showCancelButton: false,
      showConfirmButton: true,
    });
    return;
  }

  var cant = document.getElementsByName("cantidad[]");
  var prec = document.getElementsByName("valor_unitario[]");
  var stk = document.getElementsByName("stock[]");
  var idcliente = $("#idpersona").val();

  sw = 0;
  for (var i = 0; i < cant.length; i++) {
    var inpC = cant[i];
    var inpP = prec[i];
    var inStk = stk[i];
    if (
      inpC.value == 0 ||
      inStk.value == 0 ||
      inpP.value == 0.0 ||
      inpP.value == 0 ||
      inpP.value == ""
    ) {
      sw = 1;
    } else if ($("#numero_factura").val() == "") {
      sw = 2;
    } else if (idcliente == "") {
      sw = 3;
    }
  }
  if (sw == 1) {
    swal.fire({
      title: "Revizar el précio, cantidad o Stock en el detalle",
      icon: "warning",
      showCancelButton: false,
      showConfirmButton: true,
    });
    inpP.focus();
  } else if (sw == 2) {
    swal.fire({
      title: "No hay número cargado de factura, vuelva a cargar el sistema",
      icon: "warning",
      showCancelButton: false,
      showConfirmButton: true,
    });

  } else if (sw == 3) {
    swal.fire({
      title: "No existe cliente, digite el ruc y ENTER",
      icon: "warning",
      showCancelButton: false,
      showConfirmButton: true,
    });
  } else {
    Swal.fire({
      title: "¿Desea emitir la factura?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, emitir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        capturarhora();
        var formData = new FormData($("#formulario")[0]);
        $.ajax({
          url: "../ajax/factura.php?op=guardaryeditarFactura",
          type: "POST",
          data: formData,
          contentType: false,
          processData: false,

          success: function (datos) {
            tipoimpresion();
            mostrarform(false);
            refrescartabla();
          },
        });
        limpiar();
        sw = 0;
      }
    });
  }

  setTimeout(function () {
    $("#modalPreview2").modal("hide");
  }, 6000);
}

function tipoimpresion() {
  $.post(
    "../ajax/factura.php?op=mostrarultimocomprobanteId",
    function (data, status) {
      data = JSON.parse(data);
      if (data != null) {
        $("#idultimocom").val(data.idfactura);
      } else {
        $("#idultimocom").val("");
      }

      if (data.tipoimpresion == "00") {
        var rutacarpeta =
          "../reportes/exTicketFactura.php?id=" + data.idfactura;
        $("#modalCom").attr("src", rutacarpeta);
        $("#modalPreview2").modal("show");
      } else if (data.tipoimpresion == "01") {
        var rutacarpeta = "../reportes/exFactura.php?id=" + data.idfactura;
        $("#modalCom").attr("src", rutacarpeta);
        $("#modalPreview2").modal("show");
      } else {
        var rutacarpeta =
          "../reportes/exFacturaCompleto.php?id=" + data.idfactura;
        $("#modalCom").attr("src", rutacarpeta);
        $("#modalPreview2").modal("show");
      }
    }
  );
}

function mostrarultimocomprobante() {
  $.post(
    "../ajax/factura.php?op=mostrarultimocomprobante",
    function (data, status) {
      data = JSON.parse(data);
      if (data != null) {
        $("#idultimocom").val(data.numeracion_08);
      } else {
        $("#idultimocom").val("");
      }
      //var rutacarpeta="../facturasPDF/";
      //var nombrearchivopdf=$("#idultimocom").val();
      //var extension=".pdf";
      //var fileName = rutacarpeta.concat(nombrearchivopdf, extension);
      //$("#modalCom").attr('src',fileName);
      $("#modalPreview").modal("show");
      //$("#ultimocomprobante").val(data.numeracion_08);
      document.getElementById("ultimocomprobante").innerHTML =
        data.numeracion_08;
      document.getElementById("ultimocomprobantecorreo").innerHTML = data.email;
      document.getElementById("estadofact").style.background = "white";
      document.getElementById("estadofact").style.color = "black";
      document.getElementById("estadofact").innerHTML = "Documento Emitido";
    }
  ); // codigo igual hasta aqui.
}

function preticket() {
  $.post(
    "../ajax/factura.php?op=mostrarultimocomprobanteId",
    function (data, status) {
      data = JSON.parse(data);
      if (data != null) {
        $("#idultimocom").val(data.idfactura);
      } else {
        $("#idultimocom").val("");
      }
      var rutacarpeta = "../reportes/exTicketFactura.php?id=" + data.idfactura;
      $("#modalCom").attr("src", rutacarpeta);
      $("#modalPreview2").modal("show");
    }
  ); // codigo igual hasta aqui.
}

function preticket2(idfactura) {
  var rutacarpeta = "../reportes/exTicketFactura.php?id=" + idfactura;
  $("#modalComticket").attr("src", rutacarpeta);
  $("#modalPreviewticket").modal("show");
}

function prea42copias() {
  $.post(
    "../ajax/factura.php?op=mostrarultimocomprobanteId",
    function (data, status) {
      data = JSON.parse(data);
      if (data != null) {
        $("#idultimocom").val(data.idfactura);
      } else {
        $("#idultimocom").val("");
      }
      var rutacarpeta = "../reportes/exFactura.php?id=" + data.idfactura;
      $("#modalCom").attr("src", rutacarpeta);

      $("#modalPreview2").modal("show");
    }
  ); // codigo igual hasta aqui.
}

function prea42copias2(idfactura) {
  var rutacarpeta = "../reportes/exFactura.php?id=" + idfactura;
  $("#modalCom").attr("src", rutacarpeta);
  $("#modalPreview2").modal("show");
}

function prea4completo() {
  $.post(
    "../ajax/factura.php?op=mostrarultimocomprobanteId",
    function (data, status) {
      data = JSON.parse(data);
      if (data != null) {
        $("#idultimocom").val(data.idfactura);
      } else {
        $("#idultimocom").val("");
      }
      var rutacarpeta =
        "../reportes/exFacturaCompleto.php?id=" + data.idfactura;
      $("#modalCom").attr("src", rutacarpeta);
      $("#modalPreview2").modal("show");
    }
  ); // codigo igual hasta aqui.
}

function prea4completo2(idfactura) {
  var rutacarpeta = "../reportes/exFacturaCompleto.php?id=" + idfactura;
  $("#modalCom").attr("src", rutacarpeta);
  $("#modalPreview2").modal("show");
}

function enviarcorreoprew() {
  bootbox.confirm(
    "¿Está Seguro de enviar correo al cliente?",
    function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=enviarcorreoultimocomprobante",
          function (data, status) {
            bootbox.alert(e);
            //document.getElementById("estadofact").innerHTML = e;
            tabla.ajax.reload();
          }
        );
      }
    }
  );
}

function actualizar() {
  location.reload(true);
}

function guardaryeditarcliente(e) {
  e.preventDefault(); //No se activará la acción predeterminada del evento
  //$("#btnGuardarcliente").prop("disabled",true);
  var formData = new FormData($("#formularioncliente")[0]);

  $.ajax({
    url: "../ajax/persona.php?op=guardaryeditarNcliente",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,

    success: function (datos) {
      //bootbox.alert(datos);
      if (datos) {
        toastr.success("Cliente nuevo registrado");
      } else {
        toastr.danger("Problema al registrar");
      }

      tabla.ajax.reload();
      limpiarcliente();
      agregarClientexRucNuevo();
    },
  });

  $("#ModalNcliente").modal("hide");
  $("#myModalCli").modal("hide");
}

function guardaryeditararticulo(e) {
  e.preventDefault(); //No se activará la acción predeterminada del evento

  var formData = new FormData($("#formularionarticulo")[0]);

  $.ajax({
    url: "../ajax/articulo.php?op=guardarnuevoarticulo",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,

    success: function (datos) {
      bootbox.alert(datos);
      tabla.ajax.reload();
      refrescartabla();
      limpiarnuevoarticulo();
      //agregarClientexRucNuevo();
    },
  });

  $("#modalnuevoarticulo").modal("hide");

  //$("#myModalCli").modal('hide');
}

function limpiarnuevoarticulo() {
  $("#nombrenarticulo").val("");
  $("#stocknarticulo").val("");
  $("#precioventanarticulo").val("");
  $("#codigonarticulonarticulo").val("");
  $("#descripcionnarticulo").val("");
}

function agregarClientexRucNuevo() {
  $.post(
    "../ajax/factura.php?op=listarClientesfacturaxDocNuevos",
    function (data, status) {
      data = JSON.parse(data);

      if (data != null) {
        $("#numero_documento2").val(data.numero_documento);
        $("#idpersona").val(data.idpersona);
        $("#razon_social2").val(data.razon_social);
        $("#domicilio_fiscal2").val(data.domicilio_fiscal);
        $("#correocli").val(data.email);
        $("#tipo_documento_cliente").val(data.tipo_documento);
        document.getElementById("btnAgregarArt").style.backgroundColor =
          "#367fa9";
        document.getElementById("btnAgregarArt").focus();
      } else {
        $("#idpersona").val("");
        $("#razon_social2").val("No existe");
        $("#domicilio_fiscal2").val("No existe");
        $("#tipo_documento_cliente").val("");
        document.getElementById("btnAgregarArt").style.backgroundColor =
          "#35770c";
        document.getElementById("btnAgregarCli").focus();
      }
    }
  );
}

function limpiarcliente() {
  //NUEVO CLIENTE

  $("#numero_documento").val("");
  $("#razon_social").val("");
  $("#domicilio_fiscal").val("");
  $("#iddepartamento").val("");
  $("#idciudad").val("");
  $("#iddistrito").val("");
  $("#telefono1").val("");
  $("#email").val("");
  $("#nruc").val("");
  $("#numero_documento3").val("");
  //=========================
}

function mostrar(idfactura) {
  $.post(
    "../ajax/factura.php?op=mostrar",
    { idfactura: idfactura },
    function (data, status) {
      data = JSON.parse(data);
      mostrarform(true);

      $("#idfactura").val(data.idfactura);
      $("#numero_factura").val(data.numeracion_08);
      $("#numero_documento").val(data.numero_documento);
      $("#razon_social").val(data.cliente);
      $("#domicilio_fiscal").val(data.domicilio_fiscal);

      $("#fecha_emision").prop("disabled", true);
      //$("#fechavenc").prop("disabled",true);
      $("#fecha_emision").val(data.fecha);
      $("#fechavenc").val(data.fecha);
      $("#subtotal").html(data.total_operaciones_gravadas_monto_18_2);
      $("#igv_").html(data.sumatoria_igv_22_1);
      $("#total").html(data.importe_total_venta_27);

      //Ocultar y mostrar los botones
      $("#btnGuardar").hide();
      $("#btnCancelar").show();
      $("#btnAgregarArt").hide();
    }
  );

  $.post("../ajax/factura.php?op=listarDetalle&id=" + idfactura, function (r) {
    $("#detalles").html(r);
  });
}

//Función para anular registros
function anular(idfactura) {
  bootbox.confirm("¿Está Seguro de anular la factura?", function (result) {
    if (result) {
      $.post(
        "../ajax/factura.php?op=anular",
        { idfactura: idfactura },
        function (e) {
          bootbox.alert(e);
          tabla.ajax.reload();
        }
      );
    }
  });
}

//Función para enviar respuestas por correo
function enviarcorreo(idfactura) {
  var mmcliente = "";
  $.post(
    "../ajax/factura.php?op=traercorreocliente&iddff=" + idfactura,
    function (data, status) {
      data = JSON.parse(data);
      $("#correo").val(data.email);
    }
  );
  mmcliente = $("#correo").val();

  Swal.fire({
    title: "Ingresar el correo correcto.",
    input: "email",
    inputValue: mmcliente,
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      $.post(
        "../ajax/factura.php?op=enviarcorreo&idfact=" +
        idfactura +
        "&ema=" +
        result.value,
        function (e) {
          Swal.fire({
            title: "¡Proceso completado!",
            text: e,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          tabla.ajax.reload();
        }
      );
    }
  });
}

//Funcion para enviararchivo xml a SUNAT
function mostrarxml(idfactura) {
  $.post(
    "../ajax/factura.php?op=mostrarxml",
    { idfactura: idfactura },
    function (e) {
      data = JSON.parse(e);

      if (data.rutafirma) {
        var rutacarpeta = data.rutafirma;

        // Obtener el nombre del archivo desde la ruta del XML
        var nombreArchivo = rutacarpeta.split("/").pop();

        // Descargar el archivo directamente
        const link = document.createElement("a");
        link.href = rutacarpeta;
        link.download = nombreArchivo;
        document.body.appendChild(link);

        // Simular el clic en el enlace para iniciar la descarga
        link.click();

        // Eliminar el elemento <a> después de la descarga
        document.body.removeChild(link);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.cabextxml
        });
      }
    }
  );
}



//Funcion para enviararchivo xml a SUNAT
function mostrarrpta(idfactura) {
  $.post(
    "../ajax/factura.php?op=mostrarrpta",
    { idfactura: idfactura },
    function (e) {
      data = JSON.parse(e);
      var rptaS = data.rutaxmlr;

      // Obtener el nombre del archivo desde la ruta del XML
      var nombreArchivo = rptaS.split("/").pop();

      // Descargar el archivo directamente
      const link = document.createElement("a");
      link.href = rptaS;
      link.download = nombreArchivo;
      document.body.appendChild(link);

      // Simular el clic en el enlace para iniciar la descarga
      link.click();

      // Eliminar el elemento <a> después de la descarga
      document.body.removeChild(link);
    }
  );
}



//Funcion para enviararchivo xml a SUNAT

function generarxml(idfactura) {
  Swal.fire({
    title: "¿Está seguro de generar el archivo XML?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, generar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      $.post(
        "../ajax/factura.php?op=generarxml",
        { idfactura: idfactura },
        function (e) {
          data = JSON.parse(e);
          Swal.fire({
            title: "¡Archivo generado!",
            html:
              'Se ha generardo el archivo XML: <a href="' +
              data.cabextxml +
              '" download="' +
              data.cabxml +
              '">' +
              data.cabxml +
              "</a>, haga clic en el nombre para descargarlo.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          tabla.ajax.reload();
        }
      );
      refrescartabla();
    }
  });
}

//Función para enviar respuestas por correo
function enviarxmlSUNAT(idfactura) {
  Swal.fire({
    title: "¿Está seguro de enviar archivo firmado a SUNAT?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, enviar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      $.post(
        "../ajax/factura.php?op=enviarxmlSUNAT",
        { idfactura: idfactura },
        function (e) {
          Swal.fire({
            title: "¡Archivo enviado!",
            text: e,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          tabla.ajax.reload();
          refrescartabla();
        }
      );
    }
  });
}

//Función para enviar respuestas por correo
function consultarcdr(idfactura) {
  bootbox.confirm(
    "Se consultará si existe el comprobante en SUNAT.",
    function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=consultarcdr",
          { idfactura: idfactura },
          function (e) {
            //data2=JSON.parse(e);
            bootbox.alert(e);
            tabla.ajax.reload();
          }
        );
        refrescartabla();
      }
    }
  );
  tabla.ajax.reload();
  refrescartabla();
}

//Función para dar de baja registros
function downFtp(idfactura) {
  bootbox.confirm(
    "¿Está Seguro de descargar el comprobante?",
    function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=downFtp",
          { idfactura: idfactura },
          function (e) {
            data = JSON.parse(e);
            //bootbox.alert('<a href="'+data.cabext+'" download=" '+data.cab+'">" ARCHIVO CABECERA: '+data.cab+'"</a> <br/><br/> <a href="'+data.detext+'" download="'+data.det+'">" ARCHIVO DETALLE: '+data.det+'"</a> <br/><br/> <a href="'+data.leyext+'" download="'+data.ley+'">" ARCHIVO LEYENDA: '+data.ley+'"</a> <br/><br/> <a href="'+data.triext+'" download="'+data.tri+'">" ARCHIVO TRIBUTO: '+data.tri+'"</a> ');
            bootbox.alert(
              '<a href="' +
              data.cabext +
              '" download=" ' +
              data.cab +
              '">" CLIC AQUÍ PARA DESCARGAR ARCHIVO JSON:   ' +
              data.cab +
              '"</a>    <i class="fa fa-download" style="color:#2acc70; font-size:18px;"  data-toggle="tooltip" title="Descargar JSON"</i>'
            );
            refrescartabla();
          }
        );
      }
    }
  );
}

function ftp() {
  $.post("../ajax/factura.php?op=ftp", function (r) {
    bootbox.alert(r);
  });
}

//Función para dar de baja registros
function baja(idfactura) {
  var f = new Date();
  var cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
  Swal.fire({
    title: "Escriba el motivo de baja de la factura.",
    input: "textarea",
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      $.post(
        "../ajax/factura.php?op=baja&comentario=" +
        result.value +
        "&hora=" +
        cad,
        { idfactura: idfactura },
        function (e) {
          Swal.fire({
            title: "¡Proceso completado!",
            text: e,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          tabla.ajax.reload();
        }
      );
    }
  });
}

function uploadFtp(idfactura) {
  bootbox.confirm("Subir archivos de respuesta", function (result) {
    if (result) {
      $.post(
        "../ajax/factura.php?op=uploadFtp",
        { idfactura: idfactura },
        function (e) {
          bootbox.alert(e);
          tabla.ajax.reload();
        }
      );
    }
  });
}

//Declaración de variables necesarias para trabajar con las compras y
//sus detalles
var impuesto = 18;
var cont = 0;
var detalles = 0;
//$("#guardar").hide();
$("#btnGuardar").hide();
$("#tipo_comprobante").change(marcarImpuesto);

function marcarImpuesto() {
  var tipo_comprobante = $("#tipo_comprobante option:selected").text();
  if (tipo_comprobante == "FACTURA") {
    $("#impuesto").val(impuesto);
  } else {
    $("#impuesto").val("0");
  }
}

//Función para aceptar solo numeros con dos decimales
function NumCheck(e, field) {
  // Backspace = 8, Enter = 13, ’0′ = 48, ’9′ = 57, ‘.’ = 46
  var key = e.keyCode ? e.keyCode : e.which;

  if (key === 13 && !e.shiftKey) {
    document.getElementById("valor_unitario[]").focus();
  }

  // backspace
  if (key == 8) return true;
  if (key == 9) return true;
  if (key > 47 && key < 58) {
    if ($(field).val() === "") return true;
    var existePto = /[.]/.test($(field).val());
    if (existePto === false) {
      regexp = /.[0-9]{10}$/;
    } else {
      regexp = /.[0-9]{2}$/;
    }
    return !regexp.test($(field).val());
  }

  if (key == 46) {
    if ($(field).val() === "") return false;
    regexp = /^[0-9]+$/;
    return regexp.test($(field).val());
  }
  return false;
}

function NumCheck2(e, field) {
  // Backspace = 8, Enter = 13, ’0′ = 48, ’9′ = 57, ‘.’ = 46
  var key = e.keyCode ? e.keyCode : e.which;

  if (key === 13 && !e.shiftKey) {
    document.getElementById("codigob").focus();
  }

  // backspace
  if (key == 8) return true;
  if (key == 9) return true;

  if (key > 47 && key < 58) {
    if (field.value === "") return true;
    var existePto = /[.]/.test(field.value);
    if (existePto === false) {
      regexp = /.[0-9]{10}$/;
    } else {
      regexp = /.[0-9]{2}$/;
    }
    return !regexp.test(field.value);
  }

  if (key == 46) {
    if (field.value === "") return false;
    var regexp = /^[0-9]+$/;
    return regexp.test(field.value);
  }
  return false;
}

function agregarDetalle(
  tipoagregacion,
  idarticulo,
  familia,
  codigo_proveedor,
  codigo,
  nombre,
  precio_factura,
  stock,
  abre,
  precio_unitario,
  cicbper,
  mticbperuSunat,
  factorconversion,
  factorc,
  nombreum,
  descrip,
  tipoitem
) {
  var cantidad = 0;
  if (idarticulo != "") {
    var subtotal = cantidad * precio_factura;
    var igv = subtotal * ($iva / 100);
    var total_fin;
    var contador = 1;
    var exo = "";
    var op = "";
    var rd = "";

    if (parseFloat(stock) == "0") {
      Swal.fire({
        title: "Advertencia",
        text: "El stock es 0, actualizar stock!",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        $("#codigob").val("");
        quitasuge3();
      });
    } else {
      if ($("#nombre_tributo_4_p").val() == "9997") {
        exo = "";
        op = "";
        precioOculto = precio_factura;
        precio_factura = precio_factura;
        rd = "readonly";
      } else {
        op = "";
        exo = "";
        rd = "";
        precioOculto = precio_factura;
      }

      // TIPO CAMBIO

      if ($("#tipo_moneda").val() === "USD") {
        var tipoCambio = parseFloat($("#tcambio").val());

        precio_factura /= tipoCambio;
        precioOculto /= tipoCambio;

        precio_factura = precio_factura.toFixed(2);
        precioOculto = precioOculto.toFixed(2);
      }

      var fila =
        '<tr class="filas" id="fila' +
        cont +
        '">' +
        '<td><i class="fa fa-close" onclick="eliminarDetalle(' +
        cont +
        ')" style="color:red;"  data-toggle="tooltip" title="Eliminar item"></i></td>' +
        '<td><span name="numero_orden" id="numero_orden' +
        cont +
        '"></span>' +
        '<input type="hidden" name="numero_orden_item[]" id="numero_orden_item[]" value="' +
        conNO +
        '" size="1" ></td>' +
        '<td><input type="hidden" name="idarticulo[]" value="' +
        idarticulo +
        '"> <input type="text" class="form-control" style="display:none;" name="descdet_[]" id="descdet_[]" onkeyup="mayus(this)" onkeypress="return focusDescdet(event, this)">' +
        nombre +
        "</td>" +
        '<td hidden><textarea class="" name="descdet[]" id="descdet[]" rows="1" cols="30" onkeyup="mayus(this)" onkeypress="return focusDescdet(event, this)">' +
        descrip +
        "</textarea>" +
        '<select name="codigotributo[]"  class="form-control" style="display:none;"> <option value="1000">IGV</option>   <option value="9997">EXO</option><option value="9998">INA</option></select>' +
        '<select name="afectacionigv[]" id="afectacionigv[]"   class="form-control" style="display:none;"> <option value="10">10-GOO</option>' +
        '<option value="20">20-EOO</option><option value="30">30-FREE</option></select></td>' +
        '<td><input type="text"  required="true" class="form-control" name="cantidad[]" id="cantidad[]"  onBlur="modificarSubototales(1)" size="2" onkeypress="return NumCheck(event, this)"  font-weight:bold;" value="1"></td>' +
        '<td><input type="text"  class="form-control" name="descuento[]" id="descuento[]"  onBlur="modificarSubototales(1)" size="2" onkeypress="return NumCheck(event, this)" >' +
        '<span name="SumDCTO" id="SumDCTO' +
        cont +
        '" style="display:none"></span> <input type="hidden"  required="true" class="form-control" name="sumadcto[]" id="sumadcto[]" >  </td>' +
        '<td><input type="hidden" name="codigo[]" id="codigo[]" value="' +
        codigo +
        '">' +
        codigo +
        '</td> <input type="text" name="codigo[]" id="codigo[]" value="' +
        codigo +
        '" class="form-control" size="4" style="display:none;">' +
        '<td><input type="hidden" name="unidad_medida[]" id="unidad_medida[]" value="' +
        abre +
        '">' +
        nombreum +
        "</td>" +
        '<td><input type="text" class="form-control" name="valor_unitario[]" id="valor_unitario[]" value="' +
        precio_factura +
        '"   onBlur="modificarSubototales(1)" size="5" onkeypress="return NumCheck2(event, this)"  OnFocus="focusTest(this);" ></td>' +
        '<td><input type="text" class="form-control" name="valor_unitario2[]" id="valor_unitario2[]" size="5"  value="' +
        precioOculto +
        '"    ' +
        exo +
        ' onBlur="modificarSubototales(1)" OnFocus="focusTest(this);"></td>' +
        '<td><input type="text" class="form-control" name="stock[]" id="stock[]" value="' +
        factorconversion +
        '" disabled="true" size="4" ></td>' +
        '<td><span name="subtotal" id="subtotal' +
        cont +
        '"></span>' +
        '<input type="hidden" name="subtotalBD[]" id="subtotalBD["' +
        cont +
        '"]">' +
        '<span name="igvG" id="igvG' +
        cont +
        '" style="background-color:#9fde90bf;display:none;"></span>' +
        '<input type="hidden" name="igvBD[]" id="igvBD["' +
        cont +
        '"]"><input type="hidden" name="igvBD2[]" id="igvBD2["' +
        cont +
        '"]"></span>' +
        '<span name="total" id="total' +
        cont +
        '" style="background-color:#9fde90bf; display:none;" ></span>' +
        '<span name="pvu_" id="pvu_' +
        cont +
        '"  style="display:none"  ></span>' +
        '<input  type="hidden" name="pvt[]" id="pvt["' +
        cont +
        '"] size="2">' +
        '<input  type="hidden" name="cicbper[]" id="cicbper["' +
        cont +
        '"] value="' +
        cicbper +
        '" >' +
        '<input  type="hidden" name="mticbperu[]" id="mticbperu["' +
        cont +
        '"]" value="' +
        mticbperuSunat +
        '">' +
        '<input type="hidden"  class="" required="true" name="factorc[]" id="factorc[]"   value="' +
        factorc +
        '">' +
        '<input type="hidden"  class="" required="true" name="cantidadreal[]" id="cantidadreal[]">' +
        '<span name="mticbperuCalculado" id="mticbperuCalculado' +
        cont +
        '" style="background-color:#9fde90bf;display:none;"></span>' +
        "</td>" +
        "</tr>";

      var id = document.getElementsByName("idarticulo[]");
      var ntrib = document.getElementsByName("nombre_tributo_4[]");
      var can = document.getElementsByName("cantidad[]");
      var cantiS = 0;

      // if (conNO>45)
      // {

      //    toastr.warning('Solo 45 registros para el formato completo. Ingrese cantidades en los casilleros');

      // }else{
      for (var i = 0; i < id.length; i++) {
        //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM
        var idA = id[i];
        var cantiS = can[i];

        if (tipoagregacion == "0") {
          if (tipoitem != "servicios") {
            if (idA.value == idarticulo) {
              cantiS.value = parseFloat(cantiS.value) + 1; //Agrega a la cantidad en 1
              fila = "";
              cont = cont - 1;
              conNO = conNO - 1;
            } else {
              detalles = detalles;
            }
          }
          //detalles=detalles;
        } else {
          detalles = detalles;
          $("#myModalArt").modal("hide");
        }
      } //Fin for

      toastr.success("Agregado al detalle " + nombre);
      detalles = detalles + 1;
      cont++;
      conNO++;
      $("#detalles").append(fila);
      // }

      tributocodnon();
      modificarSubototales();
      setTimeout(function () {
        document.getElementById("cantidad[]").focus();
      }, 500);
    } //IF si tiene menos d e 20
  } else {
    alert("Error al ingresar el detalle, revisar los datos del artículo");
    cont = 0;
  }

  //del stock si es 0
}

function agregarArticuloxCodigo(e) {
  var exo = "";
  var op = "";
  var rd = "";
  var codigob = $("#codigob").val();
  var tipopre = $("#tipopreciocod").val();
  //var documento="20602501168";
  if (e.keyCode === 13 && !e.shiftKey) {
    $.post(
      "../ajax/factura.php?op=listarArticulosfacturaxcodigo&codigob=" +
      codigob +
      "&idempresa=" +
      $idempr +
      "&tipp=" +
      tipopre,
      function (data, status) {
        data = JSON.parse(data);

        if (data != null) {
          if (parseFloat(data.stock) == "0") {
            Swal.fire({
              icon: "warning",
              title: "El stock es 0 de este producto, actualizar stock!",
              showConfirmButton: false,
              timer: 1500,
            });
            $("#codigob").val("");
            quitasuge3();
          } else {
            var contador = 1;

            if ($("#nombre_tributo_4_p").val() == "9997") {
              exo = "";
              op = "";
              precioOculto = data.precio_venta;
              precio_factura = data.precio_venta;
              rd = "readonly";
            } else {
              op = "";
              exo = "";
              rd = "";
              precioOculto = data.precio_venta;
            }

            var fila =
              '<tr class="filas" id="fila' +
              cont +
              '">' +
              '<td><i class="fa fa-close" onclick="eliminarDetalle(' +
              cont +
              ')" style="color:red;"  data-toggle="tooltip" title="Eliminar item"></i></td>' +
              '<td><span name="numero_orden" id="numero_orden' +
              cont +
              '"></span>' +
              '<input type="hidden" name="numero_orden_item[]" id="numero_orden_item[]" value="' +
              conNO +
              '" size="1" ></td>' +
              '<td><input type="hidden" name="idarticulo[]" style="font-family: times, serif; font-size:10pt; font-style:italic" value="' +
              data.idarticulo +
              '"> <input type="text" class="form-control" style="display:none;" name="descdet_[]" id="descdet_[]" onkeyup="mayus(this)" onkeypress="return focusDescdet(event, this)">' +
              data.nombre +
              "</td>" +
              '<td hidden><textarea hidden class="" name="descdet[]" id="descdet[]" rows="1" cols="70" onkeyup="mayus(this)"' +
              'onkeypress="return focusDescdet(event, this)"></textarea>' +
              '<select name="codigotributo[]" style="display:none;" class="form-control"> <option value="1000">IGV</option>' +
              '<option value="9997">EXO</option><option value="9998">INA</option></select> <select name="afectacionigv[]"  style="display:none;" class="form-control">' +
              '<option value="10">10-GOO</option><option value="20">20-EOO</option><option value="30">30-FREE</option></select></td>' +
              '<td><input type="text"  required="true" class="form-control" name="cantidad[]" id="cantidad[]"  onBlur="modificarSubototales(1)" size="2" onkeypress="return NumCheck(event, this)"  font-weight:bold; " value="1"></td>' +
              '<td><input type="text"  class="form-control" name="descuento[]" id="descuento[]"  onBlur="modificarSubototales(1)" size="2" onkeypress="return NumCheck(event, this)" >' +
              '<span name="SumDCTO" id="SumDCTO' +
              cont +
              '" style="display:none"></span> <input type="hidden"  required="true" class="form-control" name="sumadcto[]" id="sumadcto[]" >  </td>' +
              '<td><input type="hidden" name="codigo[]" id="codigo[]" value="' +
              data.codigo +
              '">' +
              data.codigo +
              '</td> <input type="text" name="codigo[]" id="codigo[]" value="' +
              data.codigo +
              '" class="form-control" size="4" style="display:none;">' +
              '<td><input type="hidden" name="umedidacompra[]" id="umedidacompra[]" value="' +
              data.abre +
              '">' +
              data.abre +
              "</td>" +
              '<td><input type="text" class="form-control" name="valor_unitario[]" id="valor_unitario[]" value="' +
              data.precio_venta +
              '"   ' +
              rd +
              ' onBlur="modificarSubototales(1)" size="5" onkeypress="return NumCheck2(event, this)" font-weight:bold;" OnFocus="focusTest(this);"></td>' +
              '<td><input type="text" class="form-control" name="valor_unitario2[]" id="valor_unitario2[]" size="5"  value="' +
              precioOculto +
              '"    ' +
              exo +
              ' onBlur="modificarSubototales(1)" OnFocus="focusTest(this);"></td>' +
              '<td><input type="text" class="form-control" name="stock[]" id="stock[]" value="' +
              data.factorconversion +
              '" disabled="true" size="4" ></td>' +
              '<td><span name="subtotal" id="subtotal' +
              cont +
              '"></span>' +
              '<input type="hidden" name="subtotalBD[]" id="subtotalBD["' +
              cont +
              '"]">' +
              '<span name="igvG" id="igvG' +
              cont +
              '" style="background-color:#9fde90bf;display:none;"></span>' +
              '<input type="hidden" name="igvBD[]" id="igvBD["' +
              cont +
              '"]"><input type="hidden" name="igvBD2[]" id="igvBD2["' +
              cont +
              '"]">' +
              '<span name="total" id="total' +
              cont +
              '" style="background-color:#9fde90bf; display:none;" ></span>' +
              '<span name="pvu_" id="pvu_' +
              cont +
              '"  style="display:none" ></span>' +
              '<input  type="hidden" name="pvt[]" id="pvt["' +
              cont +
              '"] size="2">' +
              '<input  type="hidden" name="cicbper[]" id="cicbper["' +
              cont +
              '"] value="' +
              data.cicbper +
              '" >' +
              '<input  type="hidden" name="mticbperu[]" id="mticbperu["' +
              cont +
              '"]" value="' +
              data.mticbperu +
              '">' +
              '<input type="hidden"  class="" required="true" name="factorc[]" id="factorc[]"   value="' +
              data.factorc +
              '">' +
              '<input type="hidden"  class="" required="true" name="cantidadreal[]" id="cantidadreal[]" >' +
              '<span name="mticbperuCalculado" id="mticbperuCalculado' +
              cont +
              '" style="background-color:#9fde90bf;display:none;"></span>' +
              "</td>" +
              "</tr>";

            var id = document.getElementsByName("idarticulo[]");
            var ntrib = document.getElementsByName("nombre_tributo_4[]");
            var can = document.getElementsByName("cantidad[]");
            var cantiS = 0;

            if (conNO > 45) {
              toastr.warning(
                "Solo 45 registros para el formato completo. Ingrese cantidades en los casilleros"
              );
            } else {
              for (var i = 0; i < id.length; i++) {
                var idA = id[i];
                var cantiS = can[i];

                if (data.tipoitem != "servicios") {
                  if (idA.value == data.idarticulo) {
                    //alert("Ya esta ingresado el articulo!");
                    cantiS.value = parseFloat(cantiS.value) + 1;
                    fila = "";
                    cont = cont - 1;
                    conNO = conNO - 1;
                  } else {
                    detalles = detalles;
                  }
                }
                detalles = detalles;
                //}
              } //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM
              detalles = detalles + 1;
              cont++;
              conNO++;

              $("#detalles").append(fila);
            }
            tributocodnon();
            modificarSubototales(1);
            $("#codigob").val("");
            document.getElementById("codigob").focus();
          }
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "No existe este codigo en esta empresa",
            showConfirmButton: false,
            timer: 1500,
          });
          $("#codigob").val("");
          document.getElementById("btnAgregarArt").style.backgroundColor =
            "#35770c";
          document.getElementById("codigob").focus();
        }
        //if (data.stock<=8) { alert("El stock esta al limite, verificar!");}
      }
    );
  }
}

function cambiartributo() {
  tribD = $("#codigo_tributo_h").val();

  switch (tribD) {
    case "1000":
      $("#afectacionigv[]").val("10");
      break;
    case "9997":
      $("#afectacionigv[]").val("20");
      break;
    case "9998":
      $("#afectacionigv[]").val("30");
      break;
    default:
  }
}

function modificarSubototales(tipoumm) {
  var noi = document.getElementsByName("numero_orden_item[]");
  var cant = document.getElementsByName("cantidad[]");

  var prec = document.getElementsByName("valor_unitario[]"); //Precio unitario
  var vuni = document.getElementsByName("valor_unitario2[]");
  var st = document.getElementsByName("stock[]");
  var igv = document.getElementsByName("igvG");
  var sub = document.getElementsByName("subtotal");
  var tot = document.getElementsByName("total");
  var pvu = document.getElementsByName("pvu_");

  var dcto = document.getElementsByName("descuento[]");
  var sumadcto = document.getElementsByName("sumadcto[]");
  var dcto2 = document.getElementsByName("SumDCTO");

  var cicbper = document.getElementsByName("cicbper[]");
  var mticbperu = document.getElementsByName("mticbperu[]");
  var mti = document.getElementsByName("mticbperuCalculado");

  var factorc = document.getElementsByName("factorc[]");
  var cantiRe = document.getElementsByName("cantidadreal[]");

  for (var i = 0; i < cant.length; i++) {
    var inpNOI = noi[i];
    var inpC = cant[i];
    var inpP = prec[i];
    var inpS = sub[i];
    var inpVuni = vuni[i];
    var inpI = igv[i];

    var inpT = tot[i];
    var inpPVU = pvu[i];
    var inStk = st[i];

    var inD2 = dcto2[i];
    var dctO = dcto[i];
    var sumaDcto = sumadcto[i];

    var codIcbper = cicbper[i];
    var mticbperuNN = mticbperu[i];
    var mtiMonto = mti[i];

    var factorcc = factorc[i];
    var inpCantiR = cantiRe[i];

    inStk.value = inStk.value;
    inpC.value = inpC.value;
    dctO.value = dctO.value;

    mticbperuNN.value = mticbperuNN.value;

    //Validar cantidad no sobrepase stock actual
    if (parseFloat(inpC.value) > parseFloat(inStk.value)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La cantidad supera al stock.",
      });
    } else {
      if (codIcbper.value == "7152") {
        // SI ES BOLSA

        if ($("#codigo_tributo_h").val() == "1000") {
          inpPVU.value = inpP.value / ($iva / 100 + 1); //Obtener valor unitario
          document.getElementsByName("valor_unitario2[]")[i].value = redondeo(
            inpPVU.value,
            5
          ); //Asignar valor unitario
          dctO.value = dctO.value;
          inpNOI.value = inpNOI.value;
          inpI.value = inpI.value;
          sumaDcto.value = sumaDcto.value;
          //inpS.value=(inpC.value * inpP.value);
          inpS.value =
            inpC.value * inpVuni.value -
            (inpC.value * inpVuni.value * dctO.value) / 100;
          inD2.value = (inpC.value * inpVuni.value * dctO.value) / 100;
          //inpI.value= inpS.value * 0.18;
          inpI.value = (inpS.value * $iva) / 100;
          //inpIitem = inpPVU.value * 0.18;
          inpIitem = (inpPVU.value * $iva) / 100;
          mtiMonto.value = mticbperuNN.value * inpC.value; // Calculo de ICbper * cantidad (0.10 * 20)
          inpT.value = inpS.value + inpI.value + mtiMonto.value; //calcula total Icbper subtotal + igv + Icbper
        } else {
          inpPVU.value = inpP.value; // / ($iva/100+1); //Obtener valor unitario
          document.getElementsByName("valor_unitario2[]")[i].value =
            inpPVU.value; //Asignar valor unitario
          dctO.value = dctO.value;
          inpNOI.value = inpNOI.value;
          inpI.value = inpI.value;
          sumaDcto.value = sumaDcto.value;
          inpS.value =
            inpC.value * inpVuni.value -
            (inpC.value * inpVuni.value * dctO.value) / 100;
          inD2.value = (inpC.value * inpVuni.value * dctO.value) / 100;
          inpI.value = 0.0; //; * $iva/100;
          inpIitem = inpPVU.value; // * $iva/100;
          mtiMonto.value = mticbperuNN.value * inpC.value; // Calculo de ICbper * cantidad (0.10 * 20)
          inpT.value = inpS.value + inpI.value + mtiMonto.value; //calcula total Icbper subtotal + igv + Icbper
        }
      } else {
        // SI NO ES BOLSA

        if ($("#codigo_tributo_h").val() == "1000") {
          // + IGV

          // NUEVO 29092020
          var checkBox = document.getElementById("vuniigv");
          if (checkBox.checked == true) {
            inpP.style.color = "red";

            inpPVU.value = inpVuni.value; // / 1.18; //Obtener valor unitario
            inpPVU.value = (inpVuni.value * $iva) / 100 + inpVuni.value * 1; //Obtener PRECIO unitario
            document.getElementsByName("valor_unitario[]")[i].value = redondeo(
              inpPVU.value,
              5
            ); //Asignar PRECIO unitario
            dctO.value = dctO.value;
            inpNOI.value = inpNOI.value;
            inpI.value = inpI.value;
            sumaDcto.value = sumaDcto.value;
            inpS.value =
              inpC.value * inpVuni.value -
              (inpC.value * inpVuni.value * dctO.value) / 100;
            inD2.value = (inpC.value * inpVuni.value * dctO.value) / 100;
            //inpI.value= inpS.value * 0.18;
            inpI.value = inpS.value * ($iva / 100);
            //inpIitem = inpPVU.value * 0.18;
            inpIitem = inpPVU.value * ($iva / 100);
            mtiMonto.value = 0.0;
            inpT.value = inpS.value + inpI.value;

            if (tipoumm == "1") {
              inpCantiR.value =
                inStk.value / factorcc.value -
                (inStk.value - inpC.value) / factorcc.value;
            } else {
              inpCantiR.value = inpC.value;
            }
          } else {
            // SI NO ES VALOR + IGV
            inpP.style.color = "black";

            //ORIGINAL
            inpPVU.value = inpP.value / 1.18; //Obtener valor unitario
            inpPVU.value = inpP.value / ($iva / 100 + 1); //Obtener valor unitario
            document.getElementsByName("valor_unitario2[]")[i].value = redondeo(
              inpPVU.value,
              5
            ); //Asignar valor unitario
            dctO.value = dctO.value;
            inpNOI.value = inpNOI.value;
            inpI.value = inpI.value;
            sumaDcto.value = sumaDcto.value;
            inpS.value =
              inpC.value * inpVuni.value -
              (inpC.value * inpVuni.value * dctO.value) / 100;
            inD2.value = (inpC.value * inpVuni.value * dctO.value) / 100;
            //inpI.value= inpS.value * 0.18;
            inpI.value = inpS.value * ($iva / 100);
            //inpIitem = inpPVU.value * 0.18;
            inpIitem = inpPVU.value * ($iva / 100);
            mtiMonto.value = 0.0;
            inpT.value = inpS.value + inpI.value;
            //ORIGINAL

            if (tipoumm == "1") {
              inpCantiR.value =
                inStk.value / factorcc.value -
                (inStk.value - inpC.value) / factorcc.value;
            } else {
              inpCantiR.value = inpC.value;
            }
          }
          // NUEVO 29092020
        } else {
          // EXONERADA

          document.getElementsByName("valor_unitario2[]")[i].value = redondeo(
            inpP.value,
            5
          ); //Asignar valor unitario
          dctO.value = dctO.value;
          inpNOI.value = inpNOI.value;
          inpI.value = inpI.value;
          sumaDcto.value = sumaDcto.value;
          //inpS.value=(inpC.value * inpVuni.value)  - (inpC.value * inpVuni.value *  dctO.value)/100 ;
          inpS.value =
            inpC.value * inpP.value -
            (inpC.value * inpP.value * dctO.value) / 100;
          inD2.value = (inpC.value * inpVuni.value * dctO.value) / 100;
          inpI.value = 0.0;
          inpPVU.value =
            document.getElementsByName("valor_unitario[]")[i].value;
          //inpIitem = inpPVU.value;
          inpIitem = inpP.value;
          inpT.value = inpS.value + inpI.value;
          mtiMonto.value = mticbperuNN.value * inpC.value; // Calculo de ICbper * cantidad (0.10 * 20)
          //document.getElementsByName("valor_unitario[]")[i].value = redondeo(inpVuni.value,5);
          document.getElementsByName("valor_unitario[]")[i].value = redondeo(
            inpP.value,
            5
          );
        }
      }

      document.getElementsByName("subtotal")[i].innerHTML = redondeo(
        inpS.value,
        2
      );
      document.getElementsByName("igvG")[i].innerHTML = redondeo(inpI.value, 2);
      document.getElementsByName("mticbperuCalculado")[i].innerHTML = redondeo(
        mtiMonto.value,
        2
      );
      document.getElementsByName("total")[i].innerHTML = redondeo(
        inpT.value,
        2
      );
      document.getElementsByName("pvu_")[i].innerHTML = redondeo(
        inpPVU.value,
        5
      );

      document.getElementsByName("numero_orden")[i].innerHTML = inpNOI.value;

      //Lineas abajo son para enviar el arreglo de inputs ocultos con los valor de IGV, Subtotal, y precio de venta
      //a la tala detalle_fact_art.
      document.getElementsByName("subtotalBD[]")[i].value = redondeo(
        inpS.value,
        2
      );
      document.getElementsByName("igvBD[]")[i].value = redondeo(inpIitem, 2);
      document.getElementsByName("igvBD2[]")[i].value = redondeo(inpI.value, 2);
      document.getElementsByName("pvt[]")[i].value = redondeo(inpPVU.value, 5);
      //Fin de comentario

      document.getElementsByName("SumDCTO")[i].innerHTML = redondeo(
        inD2.value,
        2
      );
      document.getElementsByName("sumadcto[]")[i].value = redondeo(
        inD2.value,
        2
      );
    }

    if ($("#nombre_tributo_4_p").val() == "1000") {
      if (inpP.value == 0) {
        inpP.style.backgroundColor = "#ffa69e";
      } else {
        inpP.style.backgroundColor = "#fffbfe";
      }
    } else {
      if (inpVuni.value == 0) {
        inpVuni.style.backgroundColor = "#ffa69e";
      } else {
        inpVuni.style.backgroundColor = "#fffbfe";
      }
    }

    if (inpC.value == 0) {
      inpC.style.backgroundColor = "#ffa69e";
    } else {
      inpC.style.backgroundColor = "#fffbfe";
    }

    if (inStk.value == 0) {
      inStk.style.backgroundColor = "#ffa69e";
    } else {
      inStk.style.backgroundColor = "#fffbfe";
    }
  }

  calcularTotales();
}

function calcularTotales() {
  //var noi = document.getElementsByName("numero_orden_item");
  var sub = document.getElementsByName("subtotal");
  var igv = document.getElementsByName("igvG");
  var mticbperuCalculado = document.getElementsByName("mticbperuCalculado");
  var tot = document.getElementsByName("total");
  var pvu = document.getElementsByName("pvu_");

  var tdcto = document.getElementsByName("SumDCTO");
  var otros = $("#otroscargos").val();

  var subtotal = 0.0;
  var total_igv = 0.0;
  var total_mticbperu = 0.0;
  var total = 0.0;
  var noi = 0.0;
  var pvu = 0.0;

  var tdcto = 0.0;

  for (var i = 0; i < sub.length; i++) {
    //noi+=document.getElementsByName("numero_orden_item")[i].value;
    subtotal += document.getElementsByName("subtotal")[i].value;
    total_igv += document.getElementsByName("igvG")[i].value;
    total_mticbperu +=
      document.getElementsByName("mticbperuCalculado")[i].value;
    total += document.getElementsByName("total")[i].value + parseFloat(otros);
    pvu += document.getElementsByName("pvu_")[i].value;

    tdcto += document.getElementsByName("SumDCTO")[i].value;
  }

  $("#tdescuentoL").html(redondeo(tdcto, 2));
  $("#total_dcto").val(redondeo(tdcto, 2)); // a base de datos

  $("#subtotal").html(redondeo(subtotal, 2));
  $("#subtotalflotante").html(redondeo(subtotal, 2));
  $("#subtotal_factura").val(redondeo(subtotal, 2)); // a base de datos

  $("#igv_").html(redondeo(total_igv, 2));
  $("#igvflotante").html(redondeo(total_igv, 2));
  $("#icbper").html(redondeo(total_mticbperu, 2));
  $("#total_icbper").val(redondeo(total_mticbperu, 2)); // a base de datos
  $("#total_igv").val(redondeo(total_igv, 4)); // a base de datos

  //$("#total").html(number_format(redondeo(total + parseFloat(otros) ,2),2));
  //$("#totalflotante").html(number_format(redondeo(total + parseFloat(otros),2),2));

  $("#total").html(number_format(redondeo(total, 2), 2));
  $("#totalflotante").html(number_format(redondeo(total, 2), 2));
  //$("#ipagado").html(number_format(redondeo(total,2),2));
  $("#total_final").val(redondeo(total, 2));
  $("#pre_v_u").val(redondeo(pvu, 2));

  ipag = $("#ipagado").html();
  itot = $("#total").html();
  if (parseFloat(itot) > parseFloat(ipag)) {
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }

  evaluar();
}

// function agregarMontoPer() {
//   // Reemplazar el h6 con un input
//   $("#ipagado").replaceWith('<input style="text-align: right;" type="text" step="0.01" min="0" id="ipagado_input" placeholder="0.00">');

//   // Obtener el input y el total
//   var ipag_input = $("#ipagado_input");
//   var itot=$("#total").html();

//   // Al cambiar el valor del input, actualizar el saldo
//   ipag_input.on("input", function() {
//       var ipag = parseFloat(ipag_input.val());
//       var saldo = ipag - parseFloat(itot);
//       $("#saldo").html(number_format(redondeo(saldo, 2), 2));
//       $("#ipagado_final").val(number_format(redondeo(ipag, 2), 2));
//       $("#saldo_final").val(number_format(redondeo(saldo, 2), 2));
//   });

//   // Enfocar el input para que sea más fácil ingresar el monto
//   ipag_input.focus();

//   $(window).on("beforeunload", function() {
//     $("#ipagado_input").replaceWith('<h6 id="ipagado" class="d-inline">0.00</h6>');
//   });
// }

function botonrapido1() {
  $("#ipagado").html(number_format(redondeo("1", 2), 2));

  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
    $("#saldo_final").val(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }

  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function botonrapido2() {
  $("#ipagado").html(number_format(redondeo("2", 2), 2));
  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }
  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function botonrapido5() {
  $("#ipagado").html(number_format(redondeo("5", 2), 2));
  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }
  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function botonrapido10() {
  $("#ipagado").html(number_format(redondeo("10", 2), 2));
  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }
  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function botonrapido20() {
  $("#ipagado").html(number_format(redondeo("20", 2), 2));
  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }
  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function botonrapido50() {
  $("#ipagado").html(number_format(redondeo("50", 2), 2));
  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }
  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function botonrapido100() {
  $("#ipagado").html(number_format(redondeo("100", 2), 2));
  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }
  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function botonrapido200() {
  $("#ipagado").html(number_format(redondeo("200", 2), 2));
  ipag = $("#ipagado").html();
  itot = $("#total").html();

  if (parseFloat(itot) > parseFloat(ipag)) {
    alert("Monto inferior al total");
    $("#ipagado").html("0.00");
    $("#saldo").html("0.00");
  } else {
    $("#saldo").html(
      number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
    );
  }
  $("#ipagado_final").val(ipag);
  $("#saldo_final").val(
    number_format(redondeo(parseFloat(ipag) - parseFloat(itot), 2), 2)
  );
}

function evaluar() {
  if (detalles > 0) {
    $("#btnGuardar").show();
  } else {
    $("#btnGuardar").hide();
    cont = 0;
  }
}

function evaluar2() {
  if (detalles > 0) {
    $("#btnGuardar").hide();
    cont = 0;
  }
}

function eliminarDetalle(indice) {
  $("#fila" + indice).remove();
  calcularTotales();
  detalles = detalles - 1;
  conNO = conNO - 1;
  actualizanorden();
  evaluar();
}

function redondeo(numero, decimales) {
  var flotante = parseFloat(numero);
  var resultado =
    Math.round(flotante * Math.pow(10, decimales)) / Math.pow(10, decimales);
  return resultado;
}

function decimalAdjust(type, value, exp) {
  // Si el exp no está definido o es cero...
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // Si el valor no es un número o el exp no es un entero...
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function (value, exp) {
      return decimalAdjust("round", value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function (value, exp) {
      return decimalAdjust("floor", value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function (value, exp) {
      return decimalAdjust("ceil", value, exp);
    };
  }
}

function round(value, exp) {
  if (typeof exp === "undefined" || +exp === 0) return Math.round(value);
  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) return NaN;
  // Shift
  value = value.toString().split("e");
  value = Math.round(+(value[0] + "e" + (value[1] ? +value[1] + exp : exp)));
  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] - exp : -exp));
}

//Función para el formato de los montos
function number_format(amount, decimals) {
  amount += ""; // por si pasan un numero en vez de un string
  amount = parseFloat(amount.replace(/[^0-9\.]/g, "")); // elimino cualquier cosa que no sea numero o punto

  decimals = decimals || 0; // por si la variable no fue fue pasada

  // si no es un numero o es igual a cero retorno el mismo cero
  if (isNaN(amount) || amount === 0) return parseFloat(0).toFixed(decimals);

  // si es mayor o menor que cero retorno el valor formateado como numero
  amount = "" + amount.toFixed(decimals);

  var amount_parts = amount.split("."),
    regexp = /(\d+)(\d{3})/;

  while (regexp.test(amount_parts[0]))
    amount_parts[0] = amount_parts[0].replace(regexp, "$1" + "," + "$2");

  return amount_parts.join(".");
}

function agregarClientexRuc(e) {
  var documento = $("#numero_documento2").val();
  if (e.keyCode === 13 && !e.shiftKey) {
    $.post(
      "../ajax/factura.php?op=listarClientesfacturaxDoc&doc=" + documento,
      function (data, status) {
        data = JSON.parse(data);
        if (data != null && data.idpersona != null) {
          // Agregamos verificación adicional para la entrada nula
          $("#idpersona").val(data.idpersona);
          $("#razon_social2").val(data.razon_social);
          $("#domicilio_fiscal2").val(data.domicilio_fiscal);
          $("#correocli").val(data.email);

          document.getElementById("correocli").focus();
          $("#suggestions").fadeOut();
        } else {
          $("#idpersona").val("");
          $("#razon_social2").val("No existe");
          $("#domicilio_fiscal2").val("No existe");
          swal
            .fire({
              title: "Cliente no registrado",
              text: "Vamos agregar uno nuevo",
              icon: "warning",
              timer: 1500,
              showConfirmButton: false,
            })
            .then(function () {
              $("#ModalNcliente").modal("show");
              $("#nruc").val($("#numero_documento2").val());
              $("#suggestions").fadeOut();
            });
        }
      }
    );
  } else if (e.keyCode === 11 && !e.shiftKey) {
    $.post(
      "../ajax/factura.php?op=listarClientesfacturaxDoc&doc=" + documento,
      function (data, status) {
        data = JSON.parse(data);
        if (data != null && data.idpersona != null) {
          // Agregamos verificación adicional para la entrada nula
          $("#idpersona").val(data.idpersona);
          $("#razon_social2").val(data.razon_social);
          $("#domicilio_fiscal2").val(data.domicilio_fiscal);

          if (data.email == "") {
            $("#correocli").css("background-color", "#FBC6AA");
            document.getElementById("correocli").focus();
          } else {
            document.getElementById("btnAgregarArt").style.backgroundColor =
              "#367fa9";
            document.getElementById("btnAgregarArt").focus();
          }
        }
      }
    );
  }
}

function agregarClientexRucChange() {
  var documento = $("#numero_documento2").val();

  $.post(
    "../ajax/factura.php?op=listarClientesfacturaxDoc&doc=" + documento,
    function (data, status) {
      data = JSON.parse(data);
      if (data != null) {
        $("#idpersona").val(data.idpersona);
        $("#razon_social2").val(data.razon_social);
        $("#domicilio_fiscal2").val(data.domicilio_fiscal);
        $("#correocli").val(data.email);

        document.getElementById("correocli").focus();
      } else {
        $("#idpersona").val("");
        $("#razon_social2").val("No existe");
        $("#domicilio_fiscal2").val("No existe");
        alert("Cliente no registrado");

        $("#ModalNcliente").modal("show");
        $("#nruc").val($("#numero_documento2").val());
      }
    }
  );

  if (data.email == "") {
    $("#correocli").css("background-color", "#FBC6AA");
    document.getElementById("correocli").focus();
  } else {
    document.getElementById("btnAgregarArt").style.backgroundColor = "#367fa9";
    document.getElementById("btnAgregarArt").focus();
  }
}

function actualizanorden() {
  var total = document.getElementsByName("numero_orden_item[]");
  var contNO = 0;
  for (var i = 0; i < total.length; i++) {
    var contNO = total[i];
    contNO.value = i + 1;

    //Lineas abajo son para enviar el arreglo de inputs con los valor de IGV, Subtotal, y precio de venta
    document.getElementsByName("numero_orden")[i].innerHTML = contNO.value;
    document.getElementsByName("numero_orden_item[]")[i].value = contNO.value;
    //Fin de comentario
  } //Final de for
}

function focusTest(el) {
  //el.select();
}

//BLOQUEA ENTER
document.onkeypress = stopRKey;

function focusTest(el) {
  //el.select();
}

$(document).ready(function () {
  var table = $("#tbllistado").DataTable();

  $("#tbllistado tbody").on("click", "tr", function () {
    if ($(this).hasClass("selected")) {
      $(this).removeClass("selected");
    } else {
      table.$("tr.selected").removeClass("selected");
      table.$("tr").removeClass("selected");
      $(this).addClass("selected");
    }
  });

  $("#tbllistado").parents("tr").css("background-color", "green");
  $("#button").click(function () {
    table.row(".selected").remove().draw(false);
  });
});

function focusRsocial(e, field) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("razon_social").focus();
  }
}

function focusDomi(e, field) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("domicilio_fiscal").focus();
  }
}

function focustel(e, field) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("telefono1").focus();
  }
}

function cerrarModal() {
  $("#myModalArt").modal("hide");
  // var modal = document.getElementById("myModalArt");
  // modal.style.display = "none";
  $(".modal-backdrop").remove();
}

//Foco para el input cantidad
function focusDescdet(e, field) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("cantidad[]").focus();
  }
}

function focusemail(e, field) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("email").focus();
  }
}

function focusguardar(e, field) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("btnguardarncliente").focus();
  }
}

function focusbotonarticulo(e, field) {
  if (e.keyCode === 13 && !e.shiftKey) {
    if ($("#correocli").val() == "") {
      $("#correocli").css("background-color", "#FBC6AA");
    } else {
      $("#correocli").css("background-color", "#FFFFFF");
      document.getElementById("btnAgregarArt").style.backgroundColor =
        "#367fa9";
      document.getElementById("codigob").focus();
    }
  }
}

function focusruccliente() {
  document.getElementById("numero_documento2").focus();
}

function redirecionescritorio() {
  window.location.replace("escritorio");
}

function refrescartabla() {
  tabla.ajax.reload();
  //tablaArti.ajax.reload();
}

// $("#modalcuotas").on("hidden.bs.modal", function () {
//     $("#modalcuotas").reload();
// });

// jQuery(document).ready(function(){
//    jQuery('#modalcuotas').on('hidden.bs.modal', function (e) {
//        jQuery(this).removeData('bs.modal');
//        jQuery(this).find('.modal-content').empty();
//    })

//    })

function focusnroreferencia() {
  countmes = 30;
  ncuota = $("#ccuotas").val();
  totalcompCu = $("#total_final").val();
  document.getElementById("totalcomp").innerHTML =
    "TOTAL COMPROBANTE " + totalcompCu;
  $("#modalcuotas").modal("show");
  toFi = $("#total_final").val();
  for (var i = 1; i <= ncuota; i++) {
    countmes = countmes + 30;
    fechahoy = new Date();
    dia = fechahoy.getDate();
    mes = ("0" + fechahoy.getMonth() + 1).slice(-2); // +1 porque los meses empiezan en 0
    anio = fechahoy.getFullYear();
    fechahoy.setDate(fechahoy.getDate() + countmes);
    today =
      fechahoy.getFullYear() +
      "-" +
      ("0" + fechahoy.getMonth()).slice(-2) +
      "-" +
      ("0" + fechahoy.getDate()).slice(-2);

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "montocuotacre[]");
    input.setAttribute("name", "montocuotacre[]");
    input.setAttribute("size", "4");
    input.setAttribute("value", (toFi / ncuota).toFixed(2));
    var parent = document.getElementById("divmontocuotas");
    parent.appendChild(input);

    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("id", "ncuotahiden[]");
    input.setAttribute("name", "ncuotahiden[]");
    input.setAttribute("value", i);
    var parent = document.getElementById("divmontocuotas");
    parent.appendChild(input);

    var date = document.createElement("input");
    date.setAttribute("type", "date");
    date.setAttribute("id", "fechapago[]");
    date.setAttribute("name", "fechapago[]");
    input.setAttribute("size", "4");
    date.setAttribute("value", today);
    var parent = document.getElementById("divfechaspago");
    parent.appendChild(date);

    document.getElementById("ccuotas").readOnly = true;
  }
}

function borrarcuotas() {
  // Solo resaltamos el contenido del input y lo ponemos en foco.
  //$("#ccuotas").focus().select();
  $("#ccuotas").val("");
  document.getElementById("divmontocuotas").innerHTML = "";
  document.getElementById("divfechaspago").innerHTML = "";
  document.getElementById("ccuotas").readOnly = false;
}

init();

$(document).ready(function () {
  $("#numero_documento2").on("keyup", function () {
    var key = $(this).val();
    $("#suggestions2").fadeOut();
    $("#suggestions3").fadeOut();
    var dataString = "key=" + key;
    $.ajax({
      type: "POST",
      url: "../ajax/persona.php?op=buscarclienteRuc",
      data: dataString,

      success: function (data) {
        //Escribimos las sugerencias que nos manda la consulta
        $("#suggestions").fadeIn().html(data);

        //Al hacer click en algua de las sugerencias
        $(".suggest-element").on("click", function () {
          //Obtenemos la id unica de la sugerencia pulsada
          var id = $(this).attr("id");
          //Editamos el valor del input con data de la sugerencia pulsada
          $("#numero_documento2").val($("#" + id).attr("ndocumento"));
          $("#razon_social2").val($("#" + id).attr("ncomercial"));
          $("#domicilio_fiscal2").val($("#" + id).attr("domicilio"));
          $("#correocli").val($("#" + id).attr("email"));
          $("#idpersona").val(id);
          //$("#resultado").html("<p align='center'><img src='../public/images/spinner.gif' /></p>");
          //Hacemos desaparecer el resto de sugerencias

          $("#suggestions").fadeOut();
          //alert('Has seleccionado el '+id+' '+$('#'+id).attr('data'));
          return false;
        });
      },
    });
  });
});

$(document).ready(function () {
  $("#razon_social2").on("keyup", function () {
    $("#suggestions").fadeOut();
    $("#suggestions3").fadeOut();
    var key = $(this).val();
    var dataString = "key=" + key;
    $.ajax({
      type: "POST",
      url: "../ajax/persona.php?op=buscarclienteDomicilio",
      data: dataString,
      success: function (data) {
        //Escribimos las sugerencias que nos manda la consulta
        $("#suggestions2").fadeIn().html(data);
        // autocomplete(document.getElementById(".suggest-element"),  data);
        //Al hacer click en algua de las sugerencias
        $(".suggest-element").on("click", function () {
          //Obtenemos la id unica de la sugerencia pulsada

          var id = $(this).attr("id");

          //Editamos el valor del input con data de la sugerencia pulsada
          $("#numero_documento2").val($("#" + id).attr("ndocumento"));
          $("#razon_social2").val($("#" + id).attr("ncomercial"));
          $("#domicilio_fiscal2").val($("#" + id).attr("domicilio"));
          $("#correocli").val($("#" + id).attr("email"));
          $("#idpersona").val(id);

          //$("#resultado").html("<p align='center'><img src='../public/images/spinner.gif' /></p>");
          //Hacemos desaparecer el resto de sugerencias
          $("#suggestions2").fadeOut();
          //alert('Has seleccionado el '+id+' '+$('#'+id).attr('data'));
          return false;
        });
      },
    });
  });
}); // Ready function

// $(document).ready(function() {
//     $('#codigob').on('keyup', function() {
//         $('#suggestions').fadeOut();
//         $('#suggestions2').fadeOut();
//         var key = $(this).val();
//         var dataString = 'key='+key;
//     $.ajax({
//             type: "POST",
//             url: "../ajax/articulo.php?op=buscararticulo",
//             data: dataString,
//             success: function(data) {
//                 //Escribimos las sugerencias que nos manda la consulta
//                 $('#suggestions3').fadeIn().html(data);
//                 //Al hacer click en algua de las sugerencias
//                 $('.suggest-element').on('click', function(){
//                         //Obtenemos la id unica de la sugerencia pulsada

//                         var id = $(this).attr('id');
//                         //Editamos el valor del input con data de la sugerencia pulsada
// agregarDetalle(id,
//     '',
//     '',
//     $('#'+id).attr('codigo'),
//     $('#'+id).attr('nombre'),
//     $('#'+id).attr('precio_venta'),
//     $('#'+id).attr('stock'),
//     $('#'+id).attr('unidad_medida'),
//     $('#'+id).attr('precio_unitario'),
//     $('#'+id).attr('cicbper'),
//     $('#'+id).attr('mticbperu'));
//                         $('#codigob').val('');
//                         $('#codigob').focus();
//                         //$("#resultado").html("<p align='center'><img src='../public/images/spinner.gif' /></p>");
//                         //Hacemos desaparecer el resto de sugerencias
//                         $('#suggestions3').fadeOut();
//                         //alert('Has seleccionado el '+id+' '+$('#'+id).attr('data'));
//                         return false;
//                 });
//             }
//         });
//     });
// }); // Ready function

function estadoenvio() {
  $.post(
    "../ajax/factura.php?op=mostrarultimocomprobante",
    function (data, status) {
      data = JSON.parse(data);
      if (data.estado == "1") {
        strm = "Documento emitido";
        document.getElementById("estadofact").style.background = "white";
        document.getElementById("estadofact").style.color = "black";
        document.getElementById("estadofact").innerHTML = strm;
      } else if (data.estado == "4") {
        strm = "Documento firmado";
        document.getElementById("estadofact").style.background = "#CCCCCC";
        document.getElementById("estadofact").style.color = "green";
        document.getElementById("estadofact").innerHTML = strm;
      } else {
        strm = "Documento enviado a SUNAT";
        document.getElementById("estadofact").style.background = "#CCCCCC";
        document.getElementById("estadofact").style.color = "green";
        document.getElementById("estadofact").innerHTML = strm;
      }
    }
  ); // codigo igual hasta aqui.
}

function quitasuge3() {
  if ($("#codigob").val() == "") {
    $("#suggestions3").fadeOut();
  }
  $("#suggestions3").fadeOut();
}

function quitasuge2() {
  if ($("#razon_social2").val() == "") {
    $("#suggestions2").fadeOut();
  }
  $("#suggestions2").fadeOut();
}

function quitasuge1() {
  if ($("#numero_documento2").val() == "") {
    $("#suggestions").fadeOut();
  }

  $("#suggestions").fadeOut();
}

// function cargarbien()
// {
//  $("#myModalArt").modal('show');
// }

function cargarservicio() {
  $("#myModalserv").modal("show");
}

//Función listarServicios
function listarServicios() {
  tablaArti = $("#tblaservicios")
    .dataTable({
      aProcessing: true, //Activamos el procesamiento del datatables
      aServerSide: true, //Paginación y filtrado realizados por el servidor
      dom: "Bfrtip", //Definimos los elementos del control de tabla
      buttons: [],
      ajax: {
        url: "../ajax/factura.php?op=listarArticulosservicio",
        type: "get",
        dataType: "json",
        error: function (e) {
          console.log(e.responseText);
        },
      },
      bDestroy: true,
      iDisplayLength: 8, //Paginación
      order: [[0, "desc"]], //Ordenar (columna,orden)
    })
    .DataTable();

  $("#tblaservicios").DataTable().ajax.reload();
}

function tributocodnon() {
  $("#codigo_tributo_h").val($("#nombre_tributo_4_p").val());
  $("#nombre_tributo_h").val($("#nombre_tributo_4_p option:selected").text());
  // $(".filas").remove();
  //  conNO=1;
  //  $("#subtotal").html("0");
  //     $("#subtotal_factura").val("");
  //     $("#igv_").html("0");
  //     $("#total_igv").val("");
  //     //$("#icbper").html("0");
  //     //$("#total_icbper").val("");
  //     $("#total").html("0");
  //     $("#total_final").val("");
  //alert($("#nombre_tributo_4_p").val());

  tribD = $("#codigo_tributo_h").val();

  var id = document.getElementsByName("idarticulo[]");
  var codtrib = document.getElementsByName("codigotributo[]");
  var nombretrib = document.getElementsByName("afectacionigv[]");

  if (tribD == "1000") {
    for (var i = 0; i < id.length; i++) {
      var codtrib2 = codtrib[i];
      var nombretrib2 = nombretrib[i];
      codtrib2.value = "1000";
      nombretrib2.value = "10";
    } //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM
  } else if (tribD == "9997") {
    for (var i = 0; i < id.length; i++) {
      var codtrib2 = codtrib[i];
      var nombretrib2 = nombretrib[i];
      codtrib2.value = "9997";
      nombretrib2.value = "20";
    } //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM
  } else {
    for (var i = 0; i < id.length; i++) {
      var codtrib2 = codtrib[i];
      var nombretrib2 = nombretrib[i];
      codtrib2.value = "9998";
      nombretrib2.value = "30";
    } //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM
  }

  $("#subtotal").html("0");
  $("#subtotal_factura").val("");
  $("#igv_").html("0");
  $("#total_igv").val("");
  $("#total").html("0");
  $("#total_final").val("");
  $("#pre_v_u").val("");
  $("#ipagado").html("0");
  $("#saldo").html("0");
  $("#ipagado_final").val("");
  $("#saldo_saldo").val("");

  modificarSubototales();
}

function agregarItemdetalle() {
  $idarticulo = $("#iiditem").val();
  $familia = $("#familia").val();
  $codigo_proveedor = $("#codigo_proveedor").val();
  $codigo = $("#icodigo").val();
  $nombre = $("#nombre").val();
  $detalleItem = $("#idescripcion").val();
  $precio_factura = $("#ipunitario").val();
  $stock = $("#stoc").val();
  $unidad_medida = $("#iumedida").val();
  $precio_unitario = $("#idescripcion").val();
  $cicbper = $("#cicbper").val();
  $mticbperuSunat = $("#iicbper2").val();
  $cantidad = $("#icantidad").val();

  $cantiRea = $("#cantidadrealitem").val();
  $factorCi = $("#factorcitem").val();

  if ($unidad_medida != $("#umedidaoculto").val()) {
    $cantidadreal = $cantidad;
    //alert($cantidadreal);
    $unidad_medida = $("#unidadm").val();
  }

  var cantidad = 0;
  if ($idarticulo != "") {
    if (parseFloat(stock) == "0") {
      Swal.fire({
        icon: "error",
        title: "El stock es 0, actualizar stock!",
      }).then(function () {
        quitasuge3();
      });
    } else {
      if ($("#nombre_tributo_4_p").val() == "9997") {
        exo = "";
        op = "";
        precioOculto = $precio_factura;
        $precio_factura = "0";
        rd = "readonly";
      } else {
        exo = "";
        op = "";
        rd = "";
        precioOculto = $precio_factura;
      }

      var fila =
        '<tr class="filas" id="fila' +
        cont +
        '">' +
        '<td><i class="fa fa-close" onclick="eliminarDetalle(' +
        cont +
        ')" style="color:red;"  data-toggle="tooltip" title="Eliminar item"></i></td>' +
        '<td><span name="numero_orden" id="numero_orden' +
        cont +
        '"></span>' +
        '<input type="hidden" name="numero_orden_item[]" id="numero_orden_item[]" value="' +
        conNO +
        '" size="1" ></td>' +
        '<td><input type="hidden" name="idarticulo[]" style="font-family: times, serif; font-size:10pt; font-style:italic" value="' +
        $idarticulo +
        '"> <input type="text" class="form-control" style="display:none;" name="descdet_[]" id="descdet_[]" onkeyup="mayus(this)" onkeypress="return focusDescdet(event, this)">' +
        $nombre +
        "</td>" +
        '<td><textarea class="" name="descdet[]" id="descdet[]" rows="1" cols="70" onkeyup="mayus(this)" onkeypress="return focusDescdet(event, this)" >' +
        $detalleItem +
        "</textarea>" +
        '<select name="codigotributo[]"  id="codigotributo[]"  class="form-control" style="display:none;">' +
        '<option value="1000">IGV</option><option value="9997">EXO</option></select>' +
        '<select name="afectacionigv[]"  id="afectacionigv[]"   style="display:none;" class="form-control"><option value="10">10-GOO</option>' +
        '<option value="20">20-EOO</option></select></td>' +
        '<td><input type="text"  required="true" class="form-control" name="cantidad[]" id="cantidad[]"   size="2" onkeypress="return NumCheck(event, this)" value="' +
        $cantidad +
        '"></td>' +
        '<td><input type="text"  class="form-control" name="descuento[]" id="descuento[]"   size="2" onkeypress="return NumCheck(event, this)" >' +
        '<span name="SumDCTO" id="SumDCTO' +
        cont +
        '" style="display:none"></span> <input type="hidden"  required="true" class="form-control" name="sumadcto[]" id="sumadcto[]" >  </td>' +
        '<td><input type="hidden" name="codigo[]" id="codigo[]" value="' +
        $codigo +
        '">' +
        $codigo +
        '</td> <input type="text" name="codigo[]" id="codigo[]" value="' +
        $codigo +
        '" class="form-control" size="4" style="display:none;">' +
        '<td><input type="hidden" name="unidad_medida[]" id="unidad_medida[]" value="' +
        $unidad_medida +
        '">' +
        $unidad_medida +
        "</td>" +
        '<td><input type="text" class="form-control" name="valor_unitario[]" id="valor_unitario[]" value="' +
        $precio_factura +
        '"   ' +
        rd +
        '  size="5" onkeypress="return NumCheck2(event, this)"  OnFocus="focusTest(this);"  style="font-size:12px;"></td>' +
        '<td><input type="text" class="form-control" name="valor_unitario2[]" id="valor_unitario2[]" size="5"  value="' +
        precioOculto +
        '"    ' +
        exo +
        " ></td>" +
        '<td><input type="text" class="form-control" name="stock[]" id="stock[]" value="' +
        $stock +
        '" disabled="true" size="4"  ></td>' +
        '<td><span name="subtotal" id="subtotal' +
        cont +
        '"></span>' + //CAMPOS OCULTOS
        '<input type="hidden" name="subtotalBD[]" id="subtotalBD["' +
        cont +
        '"]">' +
        '<span name="igvG" id="igvG' +
        cont +
        '" style="background-color:#9fde90bf;display:none;"></span>' +
        '<input type="hidden" name="igvBD[]" id="igvBD["' +
        cont +
        '"]"><input type="hidden" name="igvBD2[]" id="igvBD2["' +
        cont +
        '"]">' +
        '<span name="total" id="total' +
        cont +
        '" style="background-color:#9fde90bf; display:none;" ></span>' +
        '<span name="pvu_" id="pvu_' +
        cont +
        '"  style="display:none"  ></span>' +
        '<input  type="hidden" name="pvt[]" id="pvt["' +
        cont +
        '"] size="2">' +
        '<input  type="hidden" name="cicbper[]" id="cicbper["' +
        cont +
        '"] value="' +
        $cicbper +
        '" >' +
        '<input  type="hidden" name="mticbperu[]" id="mticbperu["' +
        cont +
        '"]" value="' +
        $mticbperuSunat +
        '">' +
        '<input type="hidden"  class="" required="true" name="factorc[]" id="factorc[]" >' +
        '<input type="hidden"  class="" required="true" name="cantidadreal[]" id="cantidadreal[]" >' +
        '<span name="mticbperuCalculado" id="mticbperuCalculado' +
        cont +
        '" style="background-color:#9fde90bf;display:none;"></span>' +
        "</td>" +
        "</tr>";

      var id = document.getElementsByName("idarticulo[]");
      var ntrib = document.getElementsByName("nombre_tributo_4[]");
      var can = document.getElementsByName("cantidad[]");
      var cantiS = 0;

      for (var i = 0; i < id.length; i++) {
        var idA = id[i];
        var cantiS = can[i];
        if (idA.value == $idarticulo) {
          //alert("Ya esta ingresado el articulo!");
          cantiS.value = parseFloat(cantiS.value) + 1; //Agrega a la cantidad en 1
          fila = "";
          cont = cont - 1;
          conNO = conNO - 1;
        } else {
          detalles = detalles;
        }
      } //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM

      detalles = detalles + 1;
      cont++;
      conNO++;

      $("#detalles").append(fila);
      $("#myModalnuevoitem").modal("hide");

      modificarSubototales(0);
      limpiarItem();
    } //IF si tiene menos d e 20
  } else {
    alert("Error al ingresar el detalle, revisar los datos del artículo");
    cont = 0;
  }

  //del stock si es 0
}

function agregarDetalleItem(
  idarticulo,
  familia,
  codigo_proveedor,
  codigo,
  nombre,
  precio_venta,
  stock,
  abre,
  precio_unitario,
  cicbper,
  mticbperu,
  factorconversion,
  factorc
) {
  $.post(
    "../ajax/boleta.php?op=selectunidadmedida&idar=" + idarticulo,
    function (r) {
      $("#unidadm").html(r);
      // $('#unidadm').selectpicker('refresh');
    }
  );

  var cantidad = 0;

  if (idarticulo != "") {
    if (familia == "SERVICIO") {
      $("#icantidad").val("1");
      document.getElementById("iicbper2").disabled = true;
      document.getElementById("cicbper").disabled = true;
      document.getElementById("iimpicbper").disabled = true;
    }

    $("#nombrearti").val(nombre);
    $("#iiditem").val(idarticulo);
    $("#icodigo").val(codigo);
    $("#nombre").val(nombre);
    $("#familia").val(familia);
    $("#codigo_proveedor").val(codigo_proveedor);
    $("#stoc").val(stock);
    $("#factorcitem").val(factorc);

    $("#iumedida").val(abre);
    //$("#unidadm").val(abre);
    $("#ipunitario").val(precio_venta);
    $cantiitem = $("#icantidad").val();
    $valoruni = precio_venta / 1.18;

    $("#ivunitario").val($valoruni);
    $("#iicbper2").val(mticbperu);
    $("#cicbper").val(cicbper);
    $("#iimpicbper").val($cantiitem * $("#iicbper2").val());
    $("#myModalArt").modal("hide");
    //$("#myModalserv").modal('hide');
    $("#icantidad").val("1");

    $("#cantidadrealitem").val(factorconversion);

    $("#icantidad").focus();
    calculartotalitem();
  }

  $("#itemno").val("0");
  iit = $("#itemno").val();
  listarArticulos();
}

function cargarbien() {
  $("#myModalArt").modal("show");
  $("#itemno").val("1");
  iit = $("#itemno").val();
  listarArticulos();
}

function cambioUm() {
  //$("#iumedida").val( $("#unidadm").val());
  $("#umedidaoculto").val($("#unidadm").val());
}

function calcuigv() {
  $seligv = $("input[name='iigv']:checked").val();
  $valoru = $("#ivunitario").val();
  $cvigv = 0;
  $cantiitem = 0;
  $precioitem = 0;

  $cantiitem = $("#icantidad").val();
  //$precioitem=$("#ipunitario").val();
  //$totaluni=$precioitem * $cantiitem;

  if ($seligv == "grav") {
    $cvigv = $valoru * $cantiitem * ($iva / 100);
    $("#iigvresu").val($cvigv);
  } else if ($seltipo == "exo") {
    $cvigv = 0;
    $("#iigvresu").val($cvigv);
  } else {
    $cvigv = 0;
    $("#iigvresu").val($cvigv);
  }
  $ImpoTotalItem =
    parseFloat($valoru) * parseFloat($cantiitem) + parseFloat($cvigv);
  $("#iimportetotalitem").val($ImpoTotalItem.toFixed(2));
}

function calculartotalitem() {
  calcuigv();
  $cantiitem = $("#icantidad").val();
  $precioitem = $("#ipunitario").val();
  $valoru = $("#ivunitario").val();
  $igvitem = $("#iigvresu").val();

  $mtoicbper = $("#iicbper2").val();

  $impicbper = $cantiitem * $mtoicbper; //Impuesto ICBPER

  $ImpoTotalItem =
    parseFloat($valoru) * parseFloat($cantiitem) + parseFloat($igvitem);

  $("#iimportetotalitem").val($ImpoTotalItem.toFixed(2));
  $("#iimpicbper").val($impicbper.toFixed(2)); //Impuesto ICBPER
}

function calvaloruniitem() {
  $precioitem = $("#ipunitario").val();
  $valoruItem = parseFloat($precioitem / 1.18);
  $("#ivunitario").val($valoruItem);
  $valoru = $("#ivunitario").val();
  calcuigv();
  $igvitem = $("#iigvresu").val();
  $ImpoTotalItem =
    parseFloat($valoru) * parseFloat($cantiitem) + parseFloat($igvitem);
  $("#iimportetotalitem").val($ImpoTotalItem.toFixed(2));
}

//IVA O IGV GLOABL DEL SISTEMA

function impuestoglobal() {
  $.post("../ajax/ventas.php?op=impuestoglobal", function (data, status) {
    data = JSON.parse(data);

    if (data != null) {
      $("#iglobal").val(data.igv);
    }
  });
}

$.post("../ajax/factura.php?op=datostemporizadopr", function (data) {
  data = JSON.parse(data);
  if (data != null) {
    $("#estado").val(data.estado);
  }
});

if ($("#estado").val() == "1") {
  $(document).ready(function () {
    setInterval(function () {
      $.ajax({
        type: "POST",
        url: "../ajax/ventas.php?op=listarValidarComprobantesSiempre",
      });
    }, 10000);
    tabla.ajax.reload();
  });
}

function tipodecambiosunat() {
  if ($("#tipo_moneda").val() == "USD") {
    fechatcf = $("#fecha_emision").val();
    $.post(
      "../ajax/factura.php?op=tcambiog&feccf=" + fechatcf,
      function (data, status) {
        data = JSON.parse(data);
        $("#tcambio").val(data.venta);
      }
    );
  } else {
    $("#tcambio").val("0");
  }
}

function cambiarlistado() {
  listarArticulos();
}

function cambiarlistadoum() {
  $("#itemno").val("1");
  listarArticulos();
}

function cambiarlistadoum2() {
  $("#itemno").val("0");
  listarArticulos();
}

function nuevoarticulo() {
  $("#modalnuevoarticulo").modal("show");
}

//Funcion para focos de filter
$(function () {
  $("#modalnuevoarticulo").on("shown.bs.modal", function (e) {
    $(".focus").focus();
  });
});

$(function () {
  $("#myModalArt").on("shown.bs.modal", function (e) {
    $("div.dataTables_filter input").focus();
  });
});

//Funcion para focos de filter

function generarcodigonarti() {
  //alert("asdasdas");
  var caracteres1 = $("#nombrenarticulo").val();
  var codale = "";
  codale = caracteres1.substring(-3, 3);
  var caracteres2 = "ABCDEFGHJKMNPQRTUVWXYZ012346789";
  codale2 = "";
  for (i = 0; i < 3; i++) {
    var autocodigo = "";
    codale2 += caracteres2.charAt(
      Math.floor(Math.random() * caracteres2.length)
    );
  }
  $("#codigonarticulonarticulo").val(codale + codale2);
}

function contadocredito() {
  opttp = $("#tipopago").val();
  var x = document.getElementById("tipopagodiv");

  if (opttp == "Credito") {
    x.style.display = "block";
    var total = parseFloat($("#montototal").val());
    var cuotas = parseInt($("#ccuotas").val());

    if (cuotas > 0) {
      var montoCuota = total / cuotas;
      montoCuota = Math.round(montoCuota * 100) / 100; // Redondear a dos decimales

      $("#montocuota").val(montoCuota.toFixed(2));
      document.getElementById("fechavenc").readOnly = false;
      focusnroreferencia();
    } else {
      // Manejar el caso donde el número de cuotas es cero o negativo
      alert("El número de cuotas debe ser mayor que cero.");
    }
  } else {
    x.style.display = "none";
    $("#montocuota").val("0");
    $("#ccuotas").val("0");
    //focusnroreferencia();
    document.getElementById("divmontocuotas").innerHTML = "";
    document.getElementById("divfechaspago").innerHTML = "";
    document.getElementById("ccuotas").readOnly = false;

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    $("#fechavenc").val(today);
    document.getElementById("fechavenc").readOnly = true;
  }
}


// comentario 08/01/2023
// $(document).ready(function(){
// $( "#sDate , #eDate" ).datepicker({
// dateFormat: "yy-mm-dd",
// showOn: "button",
// buttonImage: "images/calendar.gif",
// buttonImageOnly: true,
// minDate: new Date(2015, 6, 29)
// });
// });

$("body").on("keydown", function (e) {
  if (e.ctrlKey && e.shiftKey && e.which === 83) {
    alert("You pressed Ctrl + Shift + s");
    e.preventDefault();
  } else if (e.which === 112) {
    $("#myModalArt").modal("show");
  } else if (e.which === 113) {
    guardaryeditarFactura(e);
  } else if (e.ctrlKey && e.which === 70) {
    mostrarform(true);
  }
});

function activartarjetadc() {
  var tarjadc = document.getElementById("tarjetadc").checked;
  if (tarjadc == true) {
    $("#tadc").val("1");
  } else {
    $("#tadc").val("0");
  }
}

function activartransferencia() {
  var tran_f = document.getElementById("transferencia").checked;
  if (tran_f == true) {
    $("#trans").val("1");
  } else {
    $("#trans").val("0");
  }
}

function cambiartarjetadc(idfactura) {
  bootbox.prompt({
    title: "Desea modificar pago con tarjeta",
    inputType: "select",
    value: ["1"],
    inputOptions: [
      {
        text: "SI",
        value: "1",
      },
      {
        text: "NO",
        value: "0",
      },
    ],

    callback: function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=cambiartarjetadc_&opcion=" + result,
          { idfactura: idfactura },
          function (e) {
            bootbox.alert(e);
            tabla.ajax.reload();
          }
        );
      }
    },
  });
}

function montotarjetadc(idfactura) {
  bootbox.prompt({
    title: "Desea modificar monto de pago con tarjeta",
    inputType: "number",
    value: ["0"],
    callback: function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=montotarjetadc_&monto=" + result,
          { idfactura: idfactura },
          function (e) {
            bootbox.alert(e);
            tabla.ajax.reload();
          }
        );
      }
    },
  });
}

function cambiartransferencia(idfactura) {
  bootbox.prompt({
    title: "Desea modificar pago con transferencia",
    inputType: "select",
    value: ["1"],
    inputOptions: [
      {
        text: "SI",
        value: "1",
      },
      {
        text: "NO",
        value: "0",
      },
    ],

    callback: function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=cambiartransferencia&opcion=" + result,
          { idfactura: idfactura },
          function (e) {
            bootbox.alert(e);
            tabla.ajax.reload();
          }
        );
      }
    },
  });
}

function montotransferencia(idfactura) {
  bootbox.prompt({
    title: "Desea modificar monto de transferencia",
    inputType: "number",
    value: ["0"],
    callback: function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=montotransferencia&monto=" + result,
          { idfactura: idfactura },
          function (e) {
            bootbox.alert(e);
            tabla.ajax.reload();
          }
        );
      }
    },
  });
}

function duplicarf(idfactura) {
  var f = new Date();
  cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();

  bootbox.confirm({
    message: "Desea suplicar la factura. !La fecha será la actual",
    buttons: {
      confirm: {
        label: "SI",
        className: "btn-success",
      },
      cancel: {
        label: "NO",
        className: "btn-danger",
      },
    },
    callback: function (result) {
      if (result) {
        $.post(
          "../ajax/factura.php?op=duplicar",
          { idfactura: idfactura },
          function (e) {
            bootbox.alert(e);
            tabla.ajax.reload();
          }
        );
      }
    },
  });
}

function crearnoti(idfactura) {
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 2)).slice(-2);
  var month2 = ("0" + (now.getMonth() + 1)).slice(-2);
  var f = new Date();
  cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
  var todaypro = now.getFullYear() + "-" + month + "-" + day;
  var today = now.getFullYear() + "-" + month2 + "-" + day;
  $("#fechaaviso").val(todaypro);
  $("#fechacreacion").val(today);

  $("#ModalNnotificacion").modal("show");

  $.post(
    "../ajax/factura.php?op=traerclinoti",
    { idfactura: idfactura },
    function (data, status) {
      data = JSON.parse(data);
      document.getElementById("clinoti").innerHTML = data.nombre_comercial;
      $("#idclientenoti").val(data.idpersona);
    }
  );
}

function continuoNoti() {
  var conti = document.getElementById("continuo").checked;
  if (conti == true) {
    $("#selconti").val("1");
  } else {
    $("#selconti").val("0");
  }
}

function estadoNoti() {
  var estanoti = document.getElementById("estadonoti").checked;
  if (estanoti == true) {
    $("#selestado").val("1");
  } else {
    $("#selestado").val("0");
  }
}

function guardaryeditarnotificacion(e) {
  e.preventDefault(); //
  var formData = new FormData($("#formularionnotificacion")[0]);

  $.ajax({
    url: "../ajax/ventas.php?op=guardaryeditarnotificacion",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,

    success: function (datos) {
      bootbox.alert(datos);
      if (datos) {
        toastr.success("Notificación registrada");
      } else {
        toastr.danger("Problemas al registrar");
      }
      tabla.ajax.reload();
      limpiarnotifi();
    },
  });

  $("#ModalNnotificacion").modal("hide");
}

function limpiarnotifi() {
  $("#fechaaviso").val("");
  $("#nombrenotificacion").val("");
  document.getElementById("nombrenotificacion").focus();
  $("#codigonotificacion").val("");
  $("#fechacreacion").val("");
  $("#idclientenoti").val("");
  document.getElementById("continuo").checked = false;
  document.getElementById("estado").checked = false;
}
