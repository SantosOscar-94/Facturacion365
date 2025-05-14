var tabla;
var modoDemo = false;
//Función que se ejecuta al inicio
function init() {
	mostrarform(false);
	listar();

	$("#formulario").on("submit", function (e) {
		guardaryeditar(e);
	})

	
}

//Función limpiar
function limpiar() {
	$("#nombrea").val("");
	$("#direccion").val("");
	$("#idalmacen").val("");
	document.getElementById("btnGuardar").innerHTML = "Agregar";
}

//Función mostrar formulario
function mostrarform(flag) {
	limpiar();
	if (flag) {
		$("#listadoregistros").hide();
		$("#formularioregistros").show();
		$("#btnGuardar").prop("disabled", false);
		$("#btnagregar").hide();
	}
	else {
		$("#listadoregistros").show();
		$("#formularioregistros").hide();
		$("#btnagregar").show();
	}
}

//Función cancelarform
function cancelarform() {
	limpiar();
	mostrarform(false);
}

//Función Listar
function listar() {
	var $idempresa = $("#idempresa").val();
	tabla = $('#tbllistado').dataTable(
		{
			"aProcessing": true,//Activamos el procesamiento del datatables
			"aServerSide": true,//Paginación y filtrado realizados por el servidor
			dom: 'Bfrtip',//Definimos los elementos del control de tabla
			buttons: [

			],
			"ajax":
			{
				url: '../ajax/almacen.php?op=listar&idempresa=' + $idempresa,
				type: "get",
				dataType: "json",
				error: function (e) {
					console.log(e.responseText);
				}
			},
			"bDestroy": true,
			"iDisplayLength": 15,//Paginación
			"order": [[0, "desc"]]//Ordenar (columna,orden)
		}).DataTable();
}
//Función para guardar o editar

function guardaryeditar(e) {
	e.preventDefault(); //No se activará la acción predeterminada del evento
	//$("#btnGuardar").prop("disabled", true);
	var $idempresa = $("#idempresa").val();
	var formData = new FormData($("#formulario")[0]);

	//var sucursalesDemoAgregadas = 0;

	//if (sucursalesDemoAgregadas >= 2) { // verifica si se han agregado menos de 2 sucursales en modo demo
	$.ajax({
		url: "../ajax/almacen.php?op=guardaryeditar&idempresa=" + $idempresa,
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,

		success: function (datos) {
			if (datos == "Almacen ya registrado") {
				iziToast.error({
					title: 'Error',
					position: 'topRight',
					color: '#eef3f8',
					titleColor: '#000',
					messageColor: '#000',
					progressBarColor: '#181c41',
					iconText: '.',
					message: datos,
				});
				// swal.fire({
				// 	title: "Error",
				// 	text: datos,
				// 	icon: "error",
				// 	timer: 2000,
				// 	showConfirmButton: false
				// });
			} else {
				//sucursalesDemoAgregadas++; / / incrementa el contador de sucursales agregadas en modo demo
				iziToast.success({
					title: '¡Éxito!',
					position: 'topCenter',
					color: '#181c41',
					titleColor: '#fff',
					messageColor: '#fff',
					progressBarColor: '#eef3f8',
					icon: '.',
					iconColor: '#fff',
					message: datos,
				});
				$('#agregarsucursal').modal('hide');
				// swal.fire({
				// 	title: "Mensaje",
				// 	text: datos,
				// 	icon: "success",
				// 	timer: 2000,
				// 	showConfirmButton: false
				// });
				mostrarform(false);
				tabla.ajax.reload();
				//sucursalesDemoAgregadas++;
			}
		}
	});
	limpiar();
	//} else {
	// muestra el mensaje indicando que ya se agregaron suficientes sucursales en modo demo
	//swal.fire({
	// 		title: "Error",
	// 		text: "Ya se agregaron suficientes sucursales en modo demo, no puedes agregar más.",
	// 		icon: "error",
	// 		timer: 3000,
	// 		showConfirmButton: false
	// 	});
	// 	return false;
	// }
}


function mostrar(idalmacen) {
	$.post("../ajax/almacen.php?op=mostrar", { idalmacen: idalmacen }, function (data, status) {
		data = JSON.parse(data);
		mostrarform(true);

		$("#nombrea").val(data.nombre);
		$("#direccion").val(data.direccion);
		$("#idalmacen").val(data.idalmacen);
		$('#agregarsucursal').modal('show');
		document.getElementById("btnGuardar").innerHTML = "Actualizar";

	})
}

//Función para desactivar registros
function desactivar(idalmacen) {
	if (modoDemo) {
		Swal.fire({
			icon: 'warning',
			title: 'Modo demo',
			text: 'No puedes editar o guardar en modo demo',
		});
		return;
	}
	swal.fire({
		title: "¿Estás seguro de desactivar el almacén?",
		text: "",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Sí, desactivar",
		cancelButtonText: "Cancelar"
	}).then((result) => {
		if (result.value) {
			$.post("../ajax/almacen.php?op=desactivar", { idalmacen: idalmacen }, function (e) {
				swal.fire({
					title: "Mensaje",
					text: e,
					icon: "success",
					timer: 2000,
					showConfirmButton: false
				});
				tabla.ajax.reload();
			});
		}
	});


}

//Función para activar registros
function activar(idalmacen) {
	swal.fire({
		title: "¿Estás seguro de activar la almacén?",
		text: "",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Sí, activar",
		cancelButtonText: "Cancelar"
	}).then((result) => {
		if (result.value) {
			$.post("../ajax/almacen.php?op=activar", { idalmacen: idalmacen }, function (e) {
				swal.fire({
					title: "Mensaje",
					text: e,
					icon: "success",
					timer: 2000,
					showConfirmButton: false
				});
				tabla.ajax.reload();
			});
		}
	});
}



function mayus(e) {
	e.value = e.value.toUpperCase();
}

init();
