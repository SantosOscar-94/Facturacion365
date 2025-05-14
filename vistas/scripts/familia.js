var tabla;

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
	$("#nombrec").val("");
	$("#idfamilia").val("");
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
				url: '../ajax/familia.php?op=listar&idempresa=' + $idempresa,
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
	var $idempresa = $("#idempresa").val();
	$("#btnGuardar").prop("disabled", true);
	var formData = new FormData($("#formulario")[0]);

	$.ajax({
		url: "../ajax/familia.php?op=guardaryeditar&idempresa=" + $idempresa,
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,

		success: function (datos) {
			if (datos == "Categoría ya registrada") {
				swal.fire({
					title: "Error",
					text: datos,
					icon: "error",
					timer: 2000,
					showConfirmButton: false
				});
			} else {
				Swal.fire({
					title: "Excelente",
					text: datos,
					icon: "success",
					timer: 1500,
					showConfirmButton: false
				})
				mostrarform(false);
				tabla.ajax.reload();
			}
		}

	});

	limpiar();
}


function mostrar(idfamilia) {
	$.post("../ajax/familia.php?op=mostrar", { idfamilia: idfamilia }, function (data, status) {
		data = JSON.parse(data);
		mostrarform(true);

		$("#nombrec").val(data.descripcion);
		$("#idfamilia").val(data.idfamilia);
		$('#agregarCategoria').modal('show');
		document.getElementById("btnGuardar").innerHTML = "Actualizar";

	})
}

//Función para desactivar registros
function desactivar(idfamilia) {
	Swal.fire({
		title: '¿Está seguro de desactivar esta categoria?',
		icon: 'question',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, desactivar!',
		cancelButtonText: 'Cancelar'
	}).then((result) => {
		if (result.isConfirmed) {
			$.post("../ajax/familia.php?op=desactivar", { idfamilia: idfamilia }, function (e) {
				Swal.fire({
					title: 'Categoria Desactivada',
					text: e,
					icon: 'success',
					showConfirmButton: false,
					timer: 1500
				});
				tabla.ajax.reload();
			});
		}
	})
}


//Función para activar registros
function activar(idfamilia) {
	Swal.fire({
		title: '¿Está Seguro de activar esta categoria?',
		icon: 'question',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, activar!',
		cancelButtonText: 'Cancelar'
	}).then((result) => {
		if (result.isConfirmed) {
			$.post("../ajax/familia.php?op=activar", { idfamilia: idfamilia }, function (e) {
				Swal.fire({
					title: 'Categoria Activada',
					text: e,
					icon: 'success',
					showConfirmButton: false,
					timer: 1500
				});
				tabla.ajax.reload();
			});
		}
	})
}


function mayus(e) {
	e.value = e.value.toUpperCase();
}

init();
