function init() {
  document.getElementById('nruc').focus(); 
  var fecha = new Date();
  var ano = fecha.getFullYear();
  var mes = fecha.getMonth() + 1;  // Ajuste para obtener el mes en formato 1-12

  if (mes < 10) {
      mes = '0' + mes;
  }

  $("#anor").val(ano);
  $("#mesr").val(mes);

  $.post("../ajax/persona.php?op=combocliente", function(r) {
      $("#nruc").html(r);
      $("#nruc").selectpicker('refresh');
  });

  listarventasxruc();  // Se agrega esta línea para cargar la tabla al inicializar la página.
}



function enviar() {
document.formEnviar.action = "../reportes/ventasxcliente.php";
document.formEnviar.target = "_blank";
document.formEnviar.submit();
document.formEnviar.action = "../reportes/PDF_MC_Table2.php";
document.formEnviar.target = "_self";
document.formEnviar.submit(); 
return true;

}

function llenarCampo()
{

var numero=$("#nruc").val();

if(numero==""){
alert ("Llenar número de documento");
document.getElementById("nruc").focus();

}

}

function limpiarFac()
{


document.getElementById("nruc").focus();

}

function limpiarBol()
{


document.getElementById("nruc").focus();


}




  //Función para aceptar solo numeros con dos decimales
  function NumCheck(e, field) {
  // Backspace = 8, Enter = 13, ’0′ = 48, ’9′ = 57, ‘.’ = 46
  key = e.keyCode ? e.keyCode : e.which
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

init();

function listarventasxruc()
{
   var $nruc= $("#nruc").val(); 
   var $anor= $("#anor option:selected").val();
   var $mesr= $("#mesr option:selected").val();

    tablaArti=$('#tablar').dataTable(
    {
        
        
        "aProcessing": true,
        "aServerSide": true,//Paginación y filtrado realizados por el servidor
        dom: 'Bfrtip',//Definimos los elementos del control de tabla
        buttons: [ 
       
                     
                ],
        "ajax":
                {
                    url: '../ajax/ventas.php?op=listarventasxruc&nruc='+$nruc+'&anor='+$anor+'&mesr='+$mesr,
                    type : "post",
                    dataType : "json",                      
                    error: function(e){
                    console.log(e.responseText);    
                    }
                },

        "bDestroy": true,
        "iDisplayLength": 10,//Paginación
        "order": [[ 1, "desc" ]]//Ordenar (columna,orden)

    }).DataTable();

$('#tablar').DataTable().ajax.reload();
}

// Función para establecer valores iniciales al cargar la página
function setInitialValuesForRuc() {
  var today = new Date();
  
  // Establecer el año actual
  var currentYear = today.getFullYear();
  $("#anor").val(currentYear);

  // Establecer el mes actual
  var currentMonth = ('0' + (today.getMonth() + 1)).slice(-2); // Se agrega un '0' adelante y se toma los dos últimos caracteres para asegurarse de que siempre tenga dos dígitos
  $("#mesr").val(currentMonth);

  // Después de establecer estos valores, puedes llamar a tu función para cargar la data:
  listarventasxruc();
}

// Llamar la función al cargar la página
$(document).ready(function() {
  setInitialValuesForRuc();
  listarventasxruc();
});

