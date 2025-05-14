var tabla;

//Función que se ejecuta al inicio
function init(){
    //mostrarform(false);
    listarArticulos();
    listar();

    $("#formulario").on("submit",function(e)
    {
        guardaryeditar(e);
    });


    $("#fnuevoprovee").on("submit",function(e)
  {
    guardaryeditarnproveedor(e);
  });


    //Cargamos los items al select proveedor
    $.post("../ajax/compra.php?op=selectProveedor", function(r){
          $("#idproveedor").html(r);
               
    });

    conNO=1;



}

function validarProveedor() {
  // Aquí puedes realizar las validaciones necesarias
  // y ejecutar las acciones correspondientes
  // cuando se produce el evento onblur en el campo de entrada.
  // Por ejemplo:
  var numeroDocumento = document.getElementById('numero_documento').value;
  
  // Validar el número de documento y realizar acciones adicionales
  // según tus necesidades.
  // ...
}


function redirectToPage(){
window.location.href = "compralistas";
}


function redirectToPage2(){
window.location.href = "compra";
}






function guardaryeditarnproveedor(e) {
  e.preventDefault(); //No se activará la acción predeterminada del evento
  $("#btnGuardarNP").prop("disabled", true);
  var formData = new FormData($("#fnuevoprovee")[0]);

  $.ajax({
    url: "../ajax/persona.php?op=guardaryeditarnproveedor",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,

    success: function (datos) {
      Swal.fire({
        title: "¡Éxito!",
        text: datos,
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      }).then(function() {
        
        $.post("../ajax/compra.php?op=selectProveedor", function(r) {
          $("#idproveedor").html(r);
          $("#idproveedor").val(datos); // Establecer el valor seleccionado
          //$('#idproveedor').selectpicker('refresh');
        });
      });
    },    

    error: function (jqXHR, textStatus, errorThrown) {
      Swal.fire({
        title: "¡Error!",
        text: "Hubo un error al procesar la solicitud.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500
      });
    },

    complete: function () {
      limpiar();
      $("#ModalNcategoria").modal("hide");
    },
  });
}




//Función limpiar
function limpiar()
{
    $("#idcompra").val("");
    $("#idproveedor").val("");
    $("#fecha_emision").val("");
    $("#proveedor").val("");
    $("#serie_comprobante").val("");
    $("#num_comprobante").val("");
    $("#guia").val("");

    $("#subtotal").val("");
    $("#igv_").val("");
    $("#total").val("");
    $(".filas").remove();
    $("#subtotal").html("0");
    $("#igv_").html("0");
    $("#total").html("0");
    $("#tcambio").val("");



    //Obtenemos la fecha actual
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $('#fecha_emision').val(today);

    //Marcamos el primer tipo_documento
    $("#tipo_comprobante").val("FACTURA");
    //$("#tipo_comprobante").selectpicker('refresh');

    $("#codigos").val("");
    $("#nombrea").val("");
    $("#stocka").val("");
    $("#codigob").val("");
    $("#umcompra").val("");
    $("#umventa").val("");
    $("#factorc").val("");
    $("#vunitario").val("");
    $("#subarticulo").val("0");



    conNO=1;
}



//Función mostrar formulario
function mostrarform(flag)
{
    limpiar();
    if (flag)
    {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        //$("#btnGuardar").prop("disabled",false);
        $("#btnagregar").hide();
        listarArticulos();

        $("#btnGuardar").hide();
        $("#btnCancelar").show();
        detalles=0;
        $("#btnAgregarArt").show();
    }
    else
    {
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
        $("#tipo_comprobante").val("01");
        $("#btnagregar").show();
    }

}

//Función cancelarform
function cancelarform()
{
    var mensaje=confirm("¿Desea cancelar el ingreso?")
    if (mensaje){

    limpiar();
    mostrarform(false);
 }
}


$idempresa=$("#idempresa").val();
//Función Listar
function listar()
{
    tabla=$('#tbllistado').dataTable(
    {
        "aProcessing": true,//Activamos el procesamiento del datatables
        "aServerSide": true,//Paginación y filtrado realizados por el servidor
        dom: 'Bfrtip',//Definimos los elementos del control de tabla
        buttons: [
              
                ],
        "ajax":
                {
                    url: '../ajax/compra.php?op=listar&idempresa='+$idempresa,
                    type : "get",
                    dataType : "json",
                    error: function(e){
                        console.log(e.responseText);
                    }
                },
        "bDestroy": true,
        "iDisplayLength": 5,//Paginación
        "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
    }).DataTable();
}


//Función ListarArticulos
function listarArticulos()
{

    subarticulo=$("#subarticulo")
    console.log("Hola", subarticulo);
    tabla=$('#tblarticulos').dataTable(
    {
        "aProcessing": true,//Activamos el procesamiento del datatables
        "aServerSide": true,//Paginación y filtrado realizados por el servidor
        dom: 'Bfrtip',//Definimos los elementos del control de tabla
        buttons: [

                ],
        "ajax":
                {
                    url: '../ajax/compra.php?op=listarArticulos&subarti='+subarticulo,
                    type : "get",
                    dataType : "json",
                    error: function(e){
                        console.log(e.responseText);
                    }
                },
        "bDestroy": true,
        "iDisplayLength": 15,//Paginación
        "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
    }).DataTable();

}
//Función para guardar o editar
//F



function guardaryeditar(e) {
    e.preventDefault();
    var cant = document.getElementsByName("cantidad[]");
    var prec = document.getElementsByName("valor_unitario[]");

    var sw=0;
    for (var i = 0; i <cant.length; i++) {
        var inpC=cant[i];
        var inpP=prec[i];

        if (inpC.value==0 || inpC.value=="" ){
           sw=sw+1;
        }
    }

    if(sw!=0){
        Swal.fire({
            icon: 'error',
            title: 'Revisar cantidad!',
            text: 'Por favor revise la cantidad de los productos.'
        });
        inpP.focus();
    } else {
        Swal.fire({
            title: '¿Desea guardar la compra?',
            text: "Esta acción no se puede deshacer.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, guardar!'
        }).then((result) => {
            if (result.value) {
                capturarhora();
                var formData = new FormData($("#formulario")[0]);

                $.ajax({
                    url: "../ajax/compra.php?op=guardaryeditar",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(datos) {
                      Swal.fire({
                          icon: 'success',
                          title: 'Excelente',
                          text: 'Los compra han sido guardados correctamente.'
                      });
                      mostrarform(false);
                      listar();
                    }
                });
                limpiar();
                sw=0;
            }
        });
    }
}



function mostrar(idcompra)
{
    $.post("../ajax/compra.php?op=mostrar",{idcompra : idcompra}, function(data, status)
    {
        data = JSON.parse(data);
        mostrarform(true);

        $("#idproveedor").val(data.idproveedor);
        //$("#idproveedor").selectpicker('refresh');
        $("#tipo_comprobante").val(data.tipo_documento);
        //$("#tipo_comprobante").selectpicker('refresh');
        $("#serie_comprobante").val(data.serie);
        $("#num_comprobante").val(data.numero);
        $("#fecha_hora").val(data.fecha);
        $("#impuesto").val(data.igv);
        $("#idcompra").val(data.idcompra);

        //Ocultar y mostrar los botones
        $("#btnGuardar").hide();
        $("#btnCancelar").show();
        $("#btnAgregarArt").hide();
    });

    $.post("../ajax/compra.php?op=listarDetalle&id="+idcompra,function(r){
            $("#detalles").html(r);
    });
}


// Función para eliminar la compra
function eliminarcompra(idcompra) {
  Swal.fire({
    title: "¿Está seguro de anular la compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, anular la compra",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.post("../ajax/compra.php?op=eliminarcompra", { idcompra: idcompra }, function (e) {
        Swal.fire({
          title: "Eliminado",
          text: e,
          icon: "success",
           showConfirmButton: false,
             timer: 1500
        }).then(() => {
          tabla.ajax.reload();
        });
      }).fail(function () {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la compra",
          icon: "error",
           showConfirmButton: false,
            timer: 1500
        });
      });
    }
  });
}

// Función para anular un registro
function anular(idingreso) {
  Swal.fire({
    title: "¿Está seguro de anular el ingreso?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, anular el ingreso",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.post("../ajax/ingreso.php?op=anular", { idingreso: idingreso }, function (e) {
        Swal.fire({
          title: "Anulado",
          text: e,
          icon: "success",
           showConfirmButton: false,
             timer: 1500
        }).then(() => {
          tabla.ajax.reload();
        });
      }).fail(function () {
        Swal.fire({
          title: "Error",
          text: "No se pudo anular el ingreso",
          icon: "error",
           showConfirmButton: false,
             timer: 1500
        });
      });
    }
  });
}


//Declaración de variables necesarias para trabajar con las compras y
//sus detalles
var impuesto=18;
var cont=0;
var detalles=0;
//$("#guardar").hide();
$("#btnGuardar").hide();
$("#tipo_comprobante").change(marcarImpuesto);

function marcarImpuesto()
  {
    var tipo_comprobante=$("#tipo_comprobante option:selected").text();
    if (tipo_comprobante=='Factura')
    {
        $("#impuesto").val(impuesto);
    }
    else
    {
        $("#impuesto").val("0");
    }
  }



  //Función para aceptar solo numeros con dos decimales
  function NumCheck(e, field) {
  // Backspace = 8, Enter = 13, ’0′ = 48, ’9′ = 57, ‘.’ = 46
  key = e.keyCode ? e.keyCode : e.which
  // backspace
          if (key == 8) return true;
          if (key == 9) return true;
        if (key > 47 && key < 58) {
          if (field.value === "") return true;
          var existePto = (/[.]/).test(field.val());
          if (existePto === false){
              regexp = /.[0-9]{10}$/;
          }
          else {
            regexp = /.[0-9]{2}$/;
          }
          return !(regexp.test(field.value()));
        }

        if (key == 46) {
          if (field.value === "") return false;
          regexp = /^[0-9]+$/;
          return regexp.test(field.value());
        }
        return false;
}


function agregarDetalle(idarticulo,familia,codigo_proveedor,codigo,nombre,
    precio_factura,stock,umedidacompra, precio_unitario, valor_unitario, factorc, nombreum)
  {


    var subarticulooption = $("#subarticulo").val();

    if (subarticulooption=='0') {

    var cantidad=1;
    if (idarticulo!="")
    {
        var subtotal=cantidad*precio_factura;
        var igv= subtotal * 0.18;
        var total_fin;
        var contador=1;
        var precio_venta_unitario=0;

        var fila='<tr class="filas" id="fila'+cont+'">'+
        '<td><button type="button" class="btn btn-danger btn-sm" onclick="eliminarDetalle('+cont+')">x</button></td>'+

        '<td><input type="hidden" name="idarticulo[]" id="idarticulo[]" value="'+idarticulo+'">'+nombre+'</td>'+

        '<td><input type="hidden" name="codigo_proveedor[]" id="codigo_proveedor[]">'+
        '<input type="text" class="" name="codigo[]" id="codigo[]" value="'+codigo+'" style="display:none;">'+
        '<input type="text" class="" name="unidad_medida[]" id="unidad_medida[]" value="'+umedidacompra+'" readonly></td>'+

        '<td><input type="text" required="true" class="" name="cantidad[]" id="cantidad[]" onBlur="modificarSubototales()" size="5" onkeypress="return NumCheck(event, this)" style="background-color: #D5FFC9; font-weight:bold; " value="1"></td>'+

        '<td><input type="text" required="true" class="" name="valor_unitario[]" id="valor_unitario[]" onBlur="modificarSubototales()" size="5" onkeypress="return NumCheck(event, this)" style="background-color: #D5FFC9;font-weight:bold; "></td>'+

        '<td><span name="subtotal" id="subtotal'+cont+'" >'+ subtotal.toFixed(2)+'</span>'+
        '<input type="hidden" name="subtotalBD[]" id="subtotalBD[]" value="'+subtotal.toFixed(2)+'">'+
        '<span name="igvG" id="igvG'+cont+'" style="display:none">'+igv.toFixed(2)+'</span>'+
        '<input type="hidden" name="igvBD[]" id="igvBD[]" value="'+igv+'">'+
        '<span name="total" id="total'+cont+'" style="display:none"></span>'+

        '<span name="totalcanti" id="totalcanti'+cont+'" style="display:none"></span>'+
        '<span name="totalcostouni" id="totalcostouni'+cont+'" style="display:none"></span>'+

        '<input  style="display:none" type="text" name="precio_venta_unitario" id="precio_venta_unitario'+cont+'" size="5" value="'+precio_venta_unitario+'"></td>'+

        '</tr>';
var conNO;
 var id = document.getElementsByName("idarticulo[]");
        var can = document.getElementsByName("cantidad[]");

        for (var i = 0; i < id.length; i++) {
             var idA=id[i];
             var cantiS=can[i];
         if (idA.value==idarticulo) {
        cantiS.value=parseFloat(cantiS.value) + 1;
         fila="";
         cont=cont - 1;
         conNO=conNO -1;
         }else{
         detalles=detalles;
         }
        }//Fin while

        cont++;
        detalles=detalles+1;
        conNO++;

        $('#detalles').append(fila);
        modificarSubototales();
        $('#myModal').modal('hide');


    }
    else
    {
        alert("Error al ingresar el detalle, revisar los datos del artículo");
        cont=0;
    }


}else{


    $(".filas").remove();
    conNO=1;

    $("#idarticulonarti").val(idarticulo);

    iddarti=$("#idarticulonarti").val();
    $.post("../ajax/compra.php?op=mostrarumventa&idarti="+iddarti, function(data, status)
    {
            data=JSON.parse(data);
            $("#umventa").val(data.nombreum2);
            $("#idumventa").val(data.abre2);
    });


    $("#codigos").val(codigo);
    $("#nombrea").val(nombre);
    $("#stocka").val(stock);
    $("#umcompra").val(nombreum+" | "+umedidacompra);
    $("#factorc").val(factorc);
    $('#myModal').modal('hide');

    setTimeout(function(){
        document.getElementById("codigob").focus();
        },500);
}



  }


function redondeo(numero, decimales)
{
var flotante = parseFloat(numero);
var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
return resultado;
}






function agregarDetalleBarra(e)
  {

    var cantidad=1;
    var codigob=$("#codigob").val();


    if(e.keyCode===13  && !e.shiftKey)

    {
  //     $.post("../ajax/compra.php?op=listarArticuloscompraxcodigo&codigob="+codigob, function(data,status)
  //   {
  //       data=JSON.parse(data);

  //       var subtotal=0;
  //       var igv= subtotal * 0.18;
  //       var total_fin;
  //       var contador=1;
  //       var precio_unitario=0;

  //       if (data != null)
  //       {

  //       var contador=1;

  //       var fila='<tr class="filas" id="fila'+cont+'">'+
  //       '<td><button type="button" class="btn btn-danger btn-sm" onclick="eliminarDetalle('+cont+')">X</button></td>'+
  //       '<td><input type="hidden" name="idarticulo[]" id="idarticulo[]" value="'+data.idarticulo+'">'+data.nombre+'</td>'+
  //       '<td><input type="hidden" name="codigo_proveedor[]" id="codigo_proveedor[]" >'+data.codigo_proveedor+'</td>'+
  //       '<td><input type="text" class="" name="codigo[]" id="codigo[]" value="'+data.codigo+'" style="display:none;"  ></td>'+
  //       '<td><input type="text" class="" name="unidad_medida[]" id="unidad_medida[]" value="'+data.abre+'" ></td>'+

  //       '<td><input type="text" required="true" class="" name="cantidad[]" id="cantidad[]" onBlur="modificarSubototales()" size="5" onkeypress="return NumCheck(event, this)" style="background-color: #D5FFC9; font-weight:bold; " value="1"></td>'+
  //       '<td><input type="text" required="true" class="" name="valor_unitario[]" id="valor_unitario[]" onBlur="modificarSubototales()" size="5" onkeypress="return NumCheck(event, this)" style="background-color: #D5FFC9;font-weight:bold; "></td>'+
  //       //'<td><input type="text"  class="" name="valor_venta[]" id="valor_venta[]" size="5" onkeypress="return NumCheck(event, this)" value="'+precio_unitario+'" style="background-color: #FF94A0; font-weight:bold; display:none;"></td>'+

  //       '<td><span name="subtotal" id="subtotal'+cont+'" >'+ subtotal.toFixed(2)+'</span>'+
  //       '<input type="hidden" name="subtotalBD[]" id="subtotalBD[]" value="'+subtotal.toFixed(2)+'">'+

  //       '<span name="igvG" id="igvG'+cont+'" style="display:none">'+igv.toFixed(2)+'</span>'+
  //       '<input type="hidden" name="igvBD[]" id="igvBD[]" value="'+igv+'">'+

  //       '<span name="total" id="total'+cont+'" style="display:none">'+
  //       '<input  style="display:none" type="text" name="precio_venta_unitario" id="precio_venta_unitario'+cont+'" size="5" value="'+precio_unitario+'"></td>'+
  //       //'<td><button type="button" onclick="modificarSubototales()" class="btn btn-info"><i class="fa fa-refresh"></i></button></td>'+
  //       '</tr>';


  //       var id = document.getElementsByName("idarticulo[]");
  //       var can = document.getElementsByName("cantidad[]");

  //       for (var i = 0; i < id.length; i++) {
  //            var idA=id[i];
  //            var cantiS=can[i];
  //        if (idA.value==data.idarticulo) {
  //       cantiS.value=parseFloat(cantiS.value) + 1;
  //        fila="";
  //        cont=cont - 1;
  //        conNO=conNO -1;
  //        }else{
  //        detalles=detalles;
  //        }
  //       }//Fin while

  //       cont++;
  //       detalles=detalles+1;
  //       conNO++;

  //       $('#detalles').append(fila);
  //       modificarSubototales();
  //       $("#codigob").val("");
  //       document.getElementById("codigob").focus();

  //       }
  //       else
  //       {
  //      alert("Artículo no esta registrado en el sistema");
  //      $('#codigob').val("");
  //      document.getElementById("codigob").focus();

  //   }



  // });

  var idarti=$("#idarticulonarti").val();
  var codbar=$("#codigob").val();
  var umedida=$("#umventa").val();
  var iduni=$("#idumventa").val();
  var nunmventa=$("#umventa").val();

        var subtotal=0;
        var igv= subtotal * 0.18;
        var total_fin;
        var contador=1;
        var precio_unitario=0;

        if (codigob != null)
        {


        var contador=1;

        var fila='<tr class="filas" id="fila'+cont+'">'+
        '<td><button type="button" class="btn btn-danger btn-sm" onclick="eliminarDetalle('+cont+')">X</button></td>'+

        '<td><input type="hidden" name="idarticulo[]" id="idarticulo[]" value="'+idarti+'">'+
        '<input type="hidden" name="codigobarra[]" id="codigobarra[]"  value="'+codbar+'"><span>'+codbar+'</span></td>'+

        '<td><input type="text" class="" name="codigo[]" id="codigo[]" value="'+codbar+'" style="display:none;">'+
        '<input type="hidden" class="" name="unidad_medida[]" id="unidad_medida[]" value="'+iduni+'" > <span>'+nunmventa+'</span>'+
        '</td>'+

        '<td><input type="text" required="true" class="" name="cantidad[]" id="cantidad[]" onBlur="modificarSubototales()"   value="1">'+

        '</td>'+

        '<td><input type="text" required="true" class="" name="valor_unitario[]" id="valor_unitario[]" onBlur="modificarSubototales()" size="5" onkeypress="return NumCheck(event, this)" style="background-color: #D5FFC9;font-weight:bold;">'+
        '</td>'+

        '<td><span name="subtotal" id="subtotal'+cont+'" >'+ subtotal.toFixed(2)+'</span>'+
        '<input type="hidden" name="subtotalBD[]" id="subtotalBD[]" value="'+subtotal.toFixed(2)+'">'+
        '<span name="igvG" id="igvG'+cont+'" style="display:none">'+igv.toFixed(2)+'</span>'+
        '<input type="hidden" name="igvBD[]" id="igvBD[]" value="'+igv+'">'+
        '<span name="total" id="total'+cont+'" style="display:none"></span>'+

        '<span name="totalcanti" id="totalcanti'+cont+'" style="display:none"></span>'+
        '<span name="totalcostouni" id="totalcostouni'+cont+'" style="display:none"></span>'+

        '<input style="display:none" type="text" name="precio_venta_unitario" id="precio_venta_unitario'+cont+'" size="5" value="'+precio_unitario+'"></td>'+
        '</tr>';


        var id = document.getElementsByName("idarticulo[]");
        var can = document.getElementsByName("cantidad[]");

        for (var i = 0; i < id.length; i++) {
             var idA=id[i];
             var cantiS=can[i];

        }//Fin while

        cont++;
        detalles=detalles+1;
        conNO++;

        $('#detalles').append(fila);
        modificarSubototales();
        $("#codigob").val("");
        document.getElementById("codigob").focus();

        }
        else
        {
       alert("Artículo no esta registrado en el sistema");
       $('#codigob').val("");
       document.getElementById("codigob").focus();

    }




}



}



function redondeo(numero, decimales)
{
var flotante = parseFloat(numero);
var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
return resultado;
}





  function modificarSubototales()
  {
    var cant = document.getElementsByName("cantidad[]");
    var cot = document.getElementsByName("valor_unitario[]");
    var sub = document.getElementsByName("subtotal");
    var igv = document.getElementsByName("igvG");
    var tot = document.getElementsByName("total");

    var totalcanti = document.getElementsByName("totalcanti");
    var totalcostouni = document.getElementsByName("totalcostouni");

    var tipoca=$("#tcambio").val();
    for (var i = 0; i < cant.length; i++) {
        var inpC=cant[i];
        var inpP=cot[i];
        var inpS=sub[i];
        var inpI=igv[i];
        var inpT=tot[i];

        var inpCsuma=totalcanti[i];
        var inpCsumacostouni=totalcostouni[i];

         document.getElementsByName("valor_unitario[]")[i].value= inpP.value ;

            if ($("#moneda").val()=='USD') {
            var tipoca=$("#tcambio").val();

                }else{
            var tipoca=1;
                }

        //inpI.value=inpI.value;
        //inpS.value=inpC.value * inpP.value * tipoca;
        //inpI.value=inpS.value * 0.18 ;
        //inpT.value=inpS.value + inpI.value;

        inpT.value=(inpC.value * inpP.value) * tipoca;
        inpS.value=(inpT.value / 1.18) * tipoca;

        inpI.value=(inpT.value - inpS.value) * tipoca;

        inpCsuma.value = parseFloat(inpC.value);
        inpCsumacostouni.value = inpP.value;


        document.getElementsByName("subtotal")[i].innerHTML = redondeo(inpT.value,2);
        document.getElementsByName("igvG")[i].innerHTML = redondeo(inpI.value,2);
        document.getElementsByName("total")[i].innerHTML = redondeo(inpT.value,2);

        document.getElementsByName("totalcanti")[i].innerHTML = inpCsuma.value;
        document.getElementsByName("totalcostouni")[i].innerHTML = inpCsumacostouni.value;
    }

    calcularTotales();
}









  function calcularTotales(){
    var sub = document.getElementsByName("subtotal");
    var igv = document.getElementsByName("igvG");
    var tot = document.getElementsByName("total");


    var subtotal = 0.0;
    var total_igv=0.0;
    var total = 0.0;

    var totalcanti = 0;
    var totalcostouni = 0;

    for (var i = 0; i <sub.length; i++) {
        subtotal += document.getElementsByName("subtotal")[i].value;
        total_igv+=document.getElementsByName("igvG")[i].value;
        total+=document.getElementsByName("total")[i].value;

        totalcanti+=document.getElementsByName("totalcanti")[i].value;
        totalcostouni+=document.getElementsByName("totalcostouni")[i].value;
    }





   $("#subtotal").html(number_format(redondeo(subtotal,2),2));
    $("#subtotal_compra").val(redondeo(subtotal,2));
    $("#igv_").html(number_format(redondeo(total_igv,4),2));
    $("#total_igv").val(redondeo(total_igv,4));
    $("#total").html(number_format(redondeo(total,2),2));
    $("#total_final").val(redondeo(total,2));

    $("#totalcantidad").val(totalcanti);
    $("#totalcostounitario").val(redondeo(totalcostouni,2));


    evaluar();
  }

  function evaluar(){
    if (detalles>0)
    {
      $("#btnGuardar").show();
    }
    else
    {
      $("#btnGuardar").hide();
      cont=0;
    }
  }

  function eliminarDetalle(indice){
    $("#fila" + indice).remove();
    calcularTotales();
    detalles=detalles-1;
    conNO=conNO - 1;
    evaluar();
  }


  function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);
  value = +value;
  exp  = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;
  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}


//Función para el formato de los montos
function number_format(amount, decimals) {

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0)
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    return amount_parts.join('.');
}


function cambioproveedor()
{
    document.getElementById("fecha_emision").focus();
}

function handler(e)
{
    document.getElementById("tipo_comprobante").focus();
}

function cambiotcomprobante()
{
    ///document.getElementById("serie_comprobante").focus();
}

function cambiotcambio()
{

  if ($("#moneda").val()=="USD") {
    //$("#modalTcambio").modal("show");
    $("#tcambio").prop("disabled",false);
    $("#tcambio").css("background-color","#FAE5D3");
    document.getElementById("tcambio").focus();
    modificarSubototales();
  }else{
    $("#tcambio").val("");
    $("#tcambio").prop("disabled",true);
    $("#tcambio").css("background-color","#FDFEFE");
    document.getElementById("btnAgregarArt").focus();
    modificarSubototales();
  }
}

function mayus(e) {
    e.value = e.value.toUpperCase();
}


function EnterSerie(e)
{
    if(e.keyCode===13  && !e.shiftKey){
       document.getElementById('num_comprobante').focus();

    }
}


function EnterNumero(e, field) {
    if(e.keyCode === 13 && !e.shiftKey) {
        document.getElementById('codigob').focus();
    }

    key = e.keyCode ? e.keyCode : e.which;

    if (key === 8 || key === 9) return true; // backspace and tab

    if (key >= 48 && key <= 57) { // numbers
        return true;
    }

    return false;
}


function Entertcambio2(){

  if ($("#moneda").val()=="USD" && $("#tcambio").val()=="") {
    document.getElementById("tcambio").focus();

   }else{
       document.getElementById('btnAgregarArt').focus();
     }
}

function Entertcambio(e,field)
{
    if(e.keyCode===13  && !e.shiftKey){
      if ($("#moneda").val()=="USD" && $("#tcambio").val()=="" ) {
      alert("Ingrese el tipo de cambio o cambie el tipo de moneda");
      document.getElementById("tcambio").focus();
   }else{
       document.getElementById('btnAgregarArt').focus();
     }
   }
        key = e.keyCode ? e.keyCode : e.which
  // backspace
          if (key == 8) return true;
          if (key == 9) return true;
          //if (key == 13) return true;
        if (key > 47 && key < 58) {
          if (field.value() === "") return true;
          var existePto = (/[.]/).test(field.val());
          if (existePto === false){
              regexp = /.[0-9]{10}$/;
          }
          else {
            regexp = /.[0-9]{2}$/;
          }
          return !(regexp.test(field.val()));
        }

        if (key == 46) {
          if (field.val() === "") return false;
          regexp = /^[0-9]+$/;
          return regexp.test(field.val());
        }
        return false;
}


function EnterVuni(e,field) {
    if(e.keyCode === 13 && !e.shiftKey) {
        llenarvu();
        document.getElementById('btnllenarvu').focus();
    }

    key = e.keyCode ? e.keyCode : e.which;

    // Backspace = 8, Tab = 9, ’0′ = 48, ’9′ = 57, ‘.’ = 46
    if (key == 8) return true;
    if (key == 9) return true;

    // Permitir ingresar números y punto decimal
    if ((key >= 48 && key <= 57) || key == 46) {
        // Si no hay ningún caracter en el campo, permitir ingresar cualquier cosa
        if (field.value.length === 0) return true;

        // Verificar si ya existe un punto decimal en el campo
        var existePto = field.value.indexOf(".") !== -1;

        // Si ya existe un punto decimal, permitir ingresar solo dos números después del punto
        if (existePto && key != 46) {
            var decimales = field.value.substring(field.value.indexOf(".")+1);
            if (decimales.length >= 2) return false;
        }

        return true;
    }
    return false;
}





function stopRKey(evt) {
var evt = (evt) ? evt : ((event) ? event : null);
var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
if ((evt.keyCode == 13) && (node.type=="text")) {return false;}
}

function llenarvu(){

 var vuni0=$("#vunitario").val();
 var vuni = document.getElementsByName("valor_unitario[]");
 var vunitario=0;

    for (var i = 0; i <= vuni.length; i++) {
        var vunitario=vuni[i];
        vunitario.value=vuni0;


}

}


function NumCheck(e, field) {
    var key = e.keyCode ? e.keyCode : e.which;
    var value = field.value;
    var regexp;

    // backspace
    if (key === 8) return true;
    if (key === 9) return true;

    // números
    if (key > 47 && key < 58) {
        if (!value) return true;
        var existePto = value.indexOf(".") !== -1;
        if (!existePto) {
            regexp = /^\d{0,10}(\.\d{0,2})?$/;
        } else {
            regexp = /^\d{0,10}\.\d{0,2}$/;
        }
        return regexp.test(value);
    }

    // punto
    if (key === 46) {
        if (!value) return false;
        regexp = /^\d+$/;
        return regexp.test(value);
    }

    return false;
}


document.onkeypress = stopRKey;

function capturarhora(){
var f=new Date();
cad=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
$("#hora").val(cad);
}




init();
