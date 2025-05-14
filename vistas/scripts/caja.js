var fecha = new Date();
var ano = fecha.getFullYear();
$("#ano").val(ano);

//listar();
//validartcdia();

$("#formulariocaja").on("submit",function(e)
   {
       guardaryeditarCaja(e);

   });


$("#formulariotcambio").on("submit",function(e)
   {
       guardaryeditarTcambio(e);

   });


$("#formulariotcambio2").on("submit",function(e)
   {
       guardaryeditarTcambio2(e);

   });


$("#formularioicaja").on("submit",function(e)
   {
       guardaryeditaringresocaja(e);

   });


$("#formularioscaja").on("submit",function(e)
   {
       guardaryeditarsalidacaja(e);

   });

function guardaryeditarCaja(e)
{
   e.preventDefault(); //No se activará la acción predeterminada del evento
   //$("#btnGuardarcliente").prop("disabled",true);
   var formData = new FormData($("#formulariocaja")[0]);
   var estado = $("#estado").val();
       $.ajax({
       url: "../ajax/factura.php?op=guardaryeditarCaja&estado="+estado,
       type: "POST",
       data: formData,
       contentType: false,
       processData: false,
       success: function(datos)
       {
             bootbox.alert(datos);
             tablacaja.ajax.reload();
            setInterval("actualizar()",1000);        }
   });
    $("#idcaja").load(" #idcaja");
    $("#idcajaingreso").load(" #idcajaingreso");
    $("#idcajasalida").load(" #idcajasalida");
    $("#montoscajamodal").load(" #montoscajamodal");
    $("#montoscaja").load(" #montoscaja");
    $("#modalcaja").hide();

}


function actualizar(){location.reload(true);}



function guardaryeditaringresocaja(e)
{
   e.preventDefault(); //No se activará la acción predeterminada del evento
   //$("#btnGuardarcliente").prop("disabled",true);
   var formData = new FormData($("#formularioicaja")[0]);
   var estado = $("#estado").val();

       $.ajax({
       url: "../ajax/factura.php?op=guardaringreso",
       type: "POST",
       data: formData,
       contentType: false,
       processData: false,
       success: function(datos)
       {
             bootbox.alert(datos);
              tablacaja.ajax.reload();
       }
   });
     $("#ingresocaja").modal('hide');
     $("#idcajaingreso").load(" #idcajaingreso");
     $("#montoscajamodal").load(" #montoscajamodal");
     $("#montoscaja").load(" #montoscaja");


}

function guardaryeditarsalidacaja(e)
{
   e.preventDefault(); //No se activará la acción predeterminada del evento
   //$("#btnGuardarcliente").prop("disabled",true);
   var formData = new FormData($("#formularioscaja")[0]);
   var estado = $("#estado").val();

       $.ajax({
       url: "../ajax/factura.php?op=guardarsalida",
       type: "POST",
       data: formData,
       contentType: false,
       processData: false,
       success: function(datos)
       {
             bootbox.alert(datos);
             tablacaja.ajax.reload();
       }

   });
    $("#salidacaja").modal('hide');
    $("#idcajasalida").load(" #idcajasalida");
    $("#montoscajamodal").load(" #montoscajamodal");
     $("#montoscaja").load(" #montoscaja");
}

var tablacaja = { ajax: { reload: function() {} } };
function guardaryeditarTcambio(e) {
   e.preventDefault(); //No se activará la acción predeterminada del evento
   //$("#btnGuardarcliente").prop("disabled",true);
   var formData = new FormData($("#formulariotcambio")[0]);
   tablacaja.ajax.reload();
 
   $.ajax({
     url: "../ajax/factura.php?op=guardaryeditarTcambio",
     type: "POST",
     data: formData,
     contentType: false,
     processData: false,
 
     success: function(datos) {
       Swal.fire({
         icon: 'success',
         title: 'Guardado correctamente',
         showConfirmButton: false,
         timer:1000,
         text: datos
         
       });
     }
   });
 
   $("#modalTcambio").modal('hide');
   $("#divtcambio").load(" #divtcambio");
 }
 



$(document).ready(function(){
   consultartcambio();
 });


function consultartcambio()
{
ftcc=$("#fechatc").val();
//ftcc="2021-06-25";

$.post("../ajax/ventas.php?op=consultatcambio&fechatc="+ftcc, function(data, status)
{
console.log(data);
data=JSON.parse(data);
//bootbox.alert(data);
$("#venta").val(data.venta);
$("#compra").val(data.compra);

});

}


function validartcdia()
{
 inpcompra=$("#compra").val();
 inpventa=$("#venta").val();

 if(inpcompra=="  " && inpventa=="  " ){
     $("#modalTcambio").modal("show");
 }else{
     $("#modalTcambio").modal("hide");
 }

}






function guardaryeditarTcambio2(e)
{
   e.preventDefault(); //No se activará la acción predeterminada del evento
   //$("#btnGuardarcliente").prop("disabled",true);
   var formData = new FormData($("#formulariotcambio2")[0]);

   $.ajax({
       url: "../ajax/factura.php?op=guardaryeditarTcambio",
       type: "POST",
       data: formData,
       contentType: false,
       processData: false,

       success: function(datos)
       {
             bootbox.alert(datos);
             tablacaja.ajax.reload();

       }

   });

   // $("#modalTcambio").modal('hide');
}






function listar()
{
 tablacaja=$('#tbllistadocaja').dataTable(
   {
       "aProcessing": true,//Activamos el procesamiento del datatables
       "aServerSide": true,//Paginación y filtrado realizados por el servidor
       dom: 'Bfrtip',//Definimos los elementos del control de tabla
       buttons: [

               ],
       "ajax":
               {
                   url: '../ajax/factura.php?op=listarcaja',
                   type : "get",
                   dataType : "json",
                   error: function(e){
                   console.log(e.responseText);
                   }
               },

        "rowCallback":
        function( row, data ) {

       },

       "bDestroy": true,
       "iDisplayLength": 5,//Paginación
       "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
   }).DataTable();
}








//$("#fechacaja").prop("disabled",false);
   var now = new Date();
   var day = ("0" + now.getDate()).slice(-2);
   var month = ("0" + (now.getMonth() + 1)).slice(-2);

   var f=new Date();
   cad=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();

   //Para hora y minutos
   //&var today = now.getFullYear()+"-"+(month)+"-"+(day)+" "+(cad) ;
   var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
   $('#fechacaja').val(today);

   $('#fechatc').val(today);


   function stopRKey(evt) {
     // código de la función
   }

   // resto del código
   document.onkeypress = stopRKey;


function focusTest(el)
{
  el.select();
}




function listarValidar()
{
   var $ano = $("#ano option:selected").text();
   var $mes = $("#mes option:selected").val();
   var $dia = $("#dia option:selected").val();

   tabla=$('#tbllistadocajavalidar').dataTable(
   {
       "aProcessing": true,//Activamos el procesamiento del datatables
       "aServerSide": true,//Paginación y filtrado realizados por el servidor
       dom: 'Bfrtip',//Definimos los elementos del control de tabla
       buttons: [
                    {
               extend:    'copyHtml5',
               text:      '<i class="fa fa-files-o"></i>',
               titleAttr: 'Copy'
           },
           {
               extend:    'excelHtml5',
               text:      '<i class="fa fa-file-excel-o"></i>',
               titleAttr: 'Excel'
           },
           {
               extend:    'csvHtml5',
               text:      '<i class="fa fa-file-text-o"></i>',
               titleAttr: 'CSV'
           },
           {
               extend:    'pdfHtml5',
               text:      '<i class="fa fa-file-pdf-o"></i>',
               titleAttr: 'PDF'
           }
               ],
       "ajax":
               {
                   url: '../ajax/factura.php?op=listarvalidarcaja&ano='+$ano+'&mes='+$mes+'&dia='+$dia,
                   type : "get",
                   dataType : "json",
                   error: function(e){
                   console.log(e.responseText);
                   }
               },
        "rowCallback":
        function( row, data ) {
       },

       "bDestroy": true,
       "iDisplayLength": 5,//Paginación
       "order": [[ 0, "desc" ]]//Ordenar (columna,orden)
   }).DataTable();

}





function NumCheck(e, field) {
 key = e.keyCode ? e.keyCode : e.which
 if(e.keyCode===13  && !e.shiftKey)
   {
      document.getElementById('valor_unitario[]').focus();
   }
 // backspace
         if (key == 8) return true;
         if (key == 9) return true;
       if (key > 47 && key < 58) {
         if (field.val() === "") return true;
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



function mayus(e) {
    e.value = e.value.toUpperCase();
}
