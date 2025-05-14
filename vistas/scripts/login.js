

// $.post("../config/Conexion.php?op=empresa", function (r) {
//   data = JSON.parse(r);
//   var lista = document.getElementById("empresaConsulta");
//   for (var i = 0; i < data.length; i++) {
//     var opt = document.createElement("option");
//     opt.setAttribute("value", data[i]);
//     opt.setAttribute("label", data[i]);
//     //lista.appendChild(opt);
//   }
// });

 //Carga de combo para empresa =====================
// $.post("../config/Conexion.php?op=empresa", function (r) {
//   data = JSON.parse(r);
//   var lista = document.getElementById("empresa");
//   for (var i = 0; i < data.length; i++) {
//     var opt = document.createElement("option");
//     opt.setAttribute("value", data[i]);
//     opt.setAttribute("label", data[i]);
//     //lista.appendChild(opt);
//   }
// });

function idempresaF() {

  var idempresa = $('#empresaConsulta').val();
  $('#idempresa').val(idempresa);
}


$(function () {
  $("#frmAcceso").on("submit", function (e) {
    e.preventDefault();

    var btnIngresar = $("#submit");
    var logina = $("#logina").val();
    var clavea = $("#clavea").val();
    var st = '1';
    // var st = $("#estadot").val(); // Comentado

    btnIngresar.prop("disabled", true).html("Validando datos...");

    $.post(
      "../ajax/usuario.php?op=verificar",
      { "logina": logina, "clavea": clavea , "st": st},
      function (data) {
        if (data != "null") {
         
          // Guardar datos en sessionStorage
          var usuarioData = JSON.parse(data);
          sessionStorage.setItem("idusuario", usuarioData.idusuario);
          sessionStorage.setItem("nombre", usuarioData.nombre);
          sessionStorage.setItem("tipo_documento", usuarioData.tipo_documento);
          sessionStorage.setItem("num_documento", usuarioData.num_documento);
          sessionStorage.setItem("telefono", usuarioData.telefono);
          sessionStorage.setItem("email", usuarioData.email);
          sessionStorage.setItem("cargo", usuarioData.cargo);
          sessionStorage.setItem("imagen", usuarioData.imagen);
          sessionStorage.setItem("login", usuarioData.login);
          sessionStorage.setItem("nombre_razon_social", usuarioData.nombre_razon_social);
          sessionStorage.setItem("idempresa", usuarioData.idempresa);
          sessionStorage.setItem("igv", usuarioData.igv);
          sessionStorage.setItem("nombre_comercial", usuarioData.nombre_comercial);
          sessionStorage.setItem("numero_ruc", usuarioData.numero_ruc);
          sessionStorage.setItem("domicilio_fiscal", usuarioData.domicilio_fiscal);
                               

          // Redirigir al usuario a la página de escritorio
          $(location).attr("href", "escritorio");
        } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: 'Credenciales incorrectas',
          });
          btnIngresar.prop("disabled", false).html("Ingresar");
          $("#logina").focus();
          $('#logina').addClass('blinking');
        }
      }
    );
  });
});











function stopRKey(evt) {
  var evt = (evt) ? evt : ((event) ? event : null);
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  if ((evt.keyCode == 13) && (node.type == "text")) { return false; }
}


function focusAgrArt(e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById('clavea').focus();
  }
}

document.onkeypress = stopRKey;

function focusTest(el) {
  el.select();
}

function enter(e, field) {
  // Backspace = 8, Enter = 13, ’0′ = 48, ’9′ = 57, ‘.’ = 46
  key = e.keyCode ? e.keyCode : e.which

  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById('serienumero').focus();
  }

}

onOff = false;
counter = setInterval(timer, 5000);
count = 0;


function timer() {
  count++;
  //tabla.ajax.reload(null,false);
}


//PARA ACTUALIZAR ESTADO
onOff = true;
function pause() {
  if (!onOff) {

    onOff = true;
    clearInterval(counter);
    //listar();
    alert("Temporizador desactivado");
    desactivarTempo();
    mostrarEstado();
    $st = 0;
  } else {
    onOff = false;
    alert("Temporizador activado");
    //counter=setInterval(timer, 5000);
    activarTempo();
    mostrarEstado();

  }
}
//PARA ACTUALIZAR ESTADO


function mostrarEstado() {
  $.post("../ajax/factura.php?op=datostemporizadopr", function (data) {
    data = JSON.parse(data);
    if (data != null) {
      $('#idtemporizador').val(data.idtempo);
      $('#estado').val(data.estado);
      $("#tiempo").val(data.tiempo);
      $("#tiempoN").val(data.tiempo);
    }

  });
}


function activarTempo() {
  $.post("../ajax/factura.php?op=activartempo&st=1&tiempo=" + $("#tiempoN").val(), function (data) {
  });
}


function desactivarTempo() {
  $.post("../ajax/factura.php?op=activartempo&st=0&tiempo=" + $("#tiempoN").val(), function (data) {
  });
}





// function empresa() {
//   empresa = $("#empresaConsulta").val();
//   $.post("../config/Conexion.php?op=verificarempresa", { "dbase": empresa });
// }


