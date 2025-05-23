var tabla;

//Función que se ejecuta al inicio
function init() {

	$("#formulario").on("submit", function (e) {
		guardaryeditar(e);
	})

	$("#formnewcate").on("submit", function (e) {
		guardaryeditarCategoria(e);
	})

	$("#formularioutilidad").on("submit", function (e) {
		guardarutilidad(e);
	})



	//$("#fecharegistro").prop("disabled",false);
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear() + "-" + (month) + "-" + (day);
	$('#fecharegistro').val(today);

	$('#fecha1').val(today);
	$('#fecha2').val(today);
	$('#fechagasto').val(today);
	$('#fechaingreso').val(today);


	$.post("../ajax/insumos.php?op=selectcate", function (r) {
		$("#categoriai").html(r);
		//$('#categoriai').selectpicker('refresh');
	});


	limpiar();
	listar();
	listarutilidad();


}

//Función limpiar
function limpiar() {
	$("#descripcion").val("");
	$("#monto").val("");
	setTimeout(function () {
		document.addEventListener('DOMContentLoaded', function () {
			document.getElementById('descripcion').focus();
		});
	}, 100);
}


function focusTest(el) {
	el.select();
}


function foco0() {

	document.getElementById('descripcion').focus();

}


function foco1(e) {
	if (e.keyCode === 13 && !e.shiftKey) {
		document.getElementById('monto').focus();
	}
}

function foco2(e) {
	if (e.keyCode === 13 && !e.shiftKey) {
		document.getElementById('btnGuardar').focus();
	}
}




//Función cancelarform
function cancelarform() {
	limpiar();


}

//Función Listar
function listar() {

	fechahoy = $('#fecharegistro').val();
	tabla = $('#tbllistado').dataTable(
		{
			"aProcessing": true,//Activamos el procesamiento del datatables
			"aServerSide": true,//Paginación y filtrado realizados por el servidor
			dom: 'Bfrtip',//Definimos los elementos del control de tabla
			buttons: [

				// 'excelHtml5',

				// 'pdf'
			],
			"ajax":
			{
				url: '../ajax/insumos.php?op=listar&hh=' + fechahoy + "&idusuario=" + sessionStorage.getItem("idusuario"),
				type: "get",
				dataType: "json",
				error: function (e) {
					console.log(e.responseText);
				}
			},
			"bDestroy": true,
			"iDisplayLength": 5,//Paginación
			"order": [[0, "desc"]]//Ordenar (columna,orden)
		}).DataTable();
}
//Función para guardar o editar




function calcularutilidad() {
	fecha1 = $("#fecha1").val();
	fecha2 = $("#fecha2").val();
	tabla = $('#tbllistadouti').dataTable(
		{
			"aProcessing": true,//Activamos el procesamiento del datatables
			"aServerSide": true,//Paginación y filtrado realizados por el servidor
			dom: 'Bfrtip',//Definimos los elementos del control de tabla
			buttons: [


			],
			"ajax":
			{
				url: '../ajax/insumos.php?op=calcularutilidad&f1=' + fecha1 + '&f2=' + fecha2,
				type: "get",
				dataType: "json",
				error: function (e) {
					//console.log(e.responseText);

				}
			},
			"bDestroy": true,
			"iDisplayLength": 5,//Paginación
			"order": [[0, "desc"]]//Ordenar (columna,orden)
		}).DataTable();
	setTimeout(function () {
		listarutilidad();
	}, 500);
}


function recalcularutilidad(idutilidad) {

	tabla = $('#tbllistadouti').dataTable(
		{
			"aProcessing": true,//Activamos el procesamiento del datatables
			"aServerSide": true,//Paginación y filtrado realizados por el servidor
			dom: 'Bfrtip',//Definimos los elementos del control de tabla
			buttons: [


			],
			"ajax":
			{
				url: '../ajax/insumos.php?op=recalcularutilidad&iduti=' + idutilidad,
				type: "get",
				dataType: "json",
				error: function (e) {
					//console.log(e.responseText);
				}
			},
			"bDestroy": true,
			"iDisplayLength": 5,//Paginación
			"order": [[0, "desc"]]//Ordenar (columna,orden)
		}).DataTable();

	setTimeout(function () {
		listarutilidad();
	}, 500);

}


function listarutilidad() {
    var idusuario = sessionStorage.getItem("idusuario"); // o donde guardes el id del usuario
    tabla = $('#tbllistadouti').dataTable(
        {
            "aProcessing": true,
            "aServerSide": true,
            dom: 'Bfrtip',
            buttons: [],
            "ajax":
            {
                url: '../ajax/insumos.php?op=listarutilidad&idusuario=' + idusuario,
                type: "get",
                dataType: "json",
                error: function (e) {
                    console.log(e.responseText);
                }
            },
            "bDestroy": true,
            "iDisplayLength": 5,
            "order": [[0, "desc"]]
        }).DataTable();
}


function guardaryeditar(e) {
	e.preventDefault(); // No se activará la acción predeterminada del evento

	// Obtener idusuario de sessionStorage
	var idusuario = sessionStorage.getItem("idusuario");

	var formData = new FormData($("#formulario")[0]);

	// Agregar idusuario a formData
	formData.append("idusuario", idusuario);

	$.ajax({
		url: "../ajax/insumos.php?op=guardaryeditar",
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,

		success: function (datos) {
			Swal.fire({
				title: "Guardado",
				text: datos,
				icon: "success",
				showConfirmButton: false,
				timer: 1500
			}).then((result) => {
				document.getElementById("mensaje").style.visibility = "hidden";
				listar();
				limpiar();
				$("#agregarmaspagos").modal('hide');
			});
		}
	});

}





function guardaryeditarCategoria(e) {
	e.preventDefault(); //No se activará la acción predeterminada del evento
	var formData = new FormData($("#formnewcate")[0]);
	$.ajax({
		url: "../ajax/insumos.php?op=guardaryeditarcate",
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,
		success: function (datos) {
			Swal.fire({
				title: 'Éxito',
				text: datos,
				icon: 'success',
				showConfirmButton: false,
				timer: 1500
			}).then((result) => {
				if (result.isConfirmed) {
					// Cargar los datos en el primer modal
					var categoria = $("#descripcioncate").val();
					$("#categoriai").append(new Option(categoria, categoria));

					// Mostrar el primer modal
					$("#agregarmaspagos").modal('show');
				}
			});

			actcategoria();
		},

		error: function (datos) {
			Swal.fire({
				title: 'Error',
				text: 'Ha ocurrido un error al guardar o editar la categoría.',
				icon: 'error',
				showConfirmButton: false,
				timer: 1500
			});
		}
	});
	$("#agregarmaspagos").modal('show');
	$("#ModalNcategoria").modal('hide');
}



function actcategoria() {
	$.post("../ajax/insumos.php?op=selectcate", function (r) {
		$("#categoriai").html(r);
		//$('#categoriai').selectpicker('refresh');
	});

}



function stopRKey(evt) {
	var evt = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type == "text")) { return false; }
}


var field = $('#monto');

//Función para aceptar solo números con dos decimales
function NumCheck(e, field) {
	// Backspace = 8, Enter = 13, ’0′ = 48, ’9′ = 57, ‘.’ = 46
	key = e.keyCode ? e.keyCode : e.which

	if (e.keyCode === 13 && !e.shiftKey) {
		document.getElementById('btnGuardar').focus();
	}

	// backspace
	if (key == 8) return true;
	if (key == 9) return true;
	if (key > 44 && key < 58) {
		if (field.val() === "") return true;
		var existePto = (/[.]/).test(field.val());
		if (existePto === false) {
			regexp = /.[0-9]{10}$/;
		} else {
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

// Ejemplo de cómo usar la función NumCheck en un campo de entrada
$('#monto').keypress(function (e) {
	if (!NumCheck(e, field)) {
		e.preventDefault();
	}
});




//BLOQUEA ENTER 
document.onkeypress = stopRKey;

function mostrar(idunidadm) {
	$.post("../ajax/umedida.php?op=mostrar", { idunidadm: idunidadm }, function (data, status) {
		data = JSON.parse(data);
		mostrarform(true);

		$("#idunidadm").val(data.idunidad);
		$("#nombre").val(data.nombreum);
		$("#abre").val(data.abre);
		$("#equivalencia").val(data.equivalencia);

	})
}




function mayus(e) {
	e.value = e.value.toUpperCase();
}


//Función para desactivar registros
function eliminar(idinsumo) {
	Swal.fire({
		title: '¿Está seguro de eliminar el insumo?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí',
		cancelButtonText: 'Cancelar'
	}).then((result) => {
		if (result.isConfirmed) {
			$.post("../ajax/insumos.php?op=eliminar", { idinsumo: idinsumo }, function (e) {
				Swal.fire({
					title: e,
					icon: 'success',
					showConfirmButton: false,
					timer: 1500
				});
				tabla.ajax.reload();
			});
		}
	});
	listar();
}


function eliminarutilidad(idutilidad) {
	Swal.fire({
		title: '¿Está Seguro de eliminar?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			$.post("../ajax/insumos.php?op=eliminarutilidad", { idutilidad: idutilidad }, function (e) {
				Swal.fire(
					'Eliminado!',
					e,
					'success'
				)
				tabla.ajax.reload();
			});
		}
	})
	listarutilidad();
}

function aprobarutilidad(idutilidad) {
	$.post("../ajax/insumos.php?op=aprobarutilidad", { idutilidad: idutilidad }, function (e) {
		tabla.ajax.reload();
	});
	listarutilidad();
}


// function aprobarutilidad(idutilidad) {
// 	Swal.fire({
// 	  title: '¿Está seguro de aprobar?',
// 	  showCancelButton: true,
// 	  confirmButtonText: `Sí`,
// 	  cancelButtonText: `No`,
// 	}).then((result) => {
// 	  if (result.isConfirmed) {
// 		$.post("../ajax/insumos.php?op=aprobarutilidad", { idutilidad: idutilidad }, function (e) {
// 		  Swal.fire('¡Aprobado!', e, 'success');
// 		  tabla.ajax.reload();
// 		});
// 	  }
// 	});
// 	listarutilidad();
//   }




function reporteutilidad(idutilidad) {
	var rutacarpeta = '../reportes/reportegastosvsingresossemanal.php?id=' + idutilidad;
	$("#modalCom").attr('src', rutacarpeta);
	$("#modalPreview").modal("show");
}



function cargarEmpleados() {

	var baseURL = window.location.protocol + '//' + window.location.host;

	// Verificar si pathname contiene '/vistas/' y eliminarlo.
	var path = window.location.pathname;
	if (path.includes("/vistas/")) {
		path = path.replace("/vistas/", "/");
	}

	var ajaxURL = new URL("ajax/sueldoBoleta.php?action=listar2", baseURL + path);

	$.ajax({
		url: ajaxURL.href,
		type: 'GET',
		dataType: 'json',
		success: function (data) {
			llenarSelect(data.aaData);
		},
		error: function (xhr, status, error) {
			console.error('Error al cargar los tipos de documento de identidad');
			console.error(error);
		}
	});
}

function llenarSelect(data) {
	var select = $('#acredor');
	select.empty();
	select.append($('<option>', {
		value: '',
		text: 'Seleccionar Empleado'
	}));
	$.each(data, function (index, value) {
		var nombreCompleto = value.nombresE;
		if (value.apellidosE) {
			nombreCompleto += ' ' + value.apellidosE;
		}
		select.append($('<option>', {
			value: value.nombreCompleto,
			text: nombreCompleto
		}));
	});
}



$(document).ready(function () {
	cargarEmpleados();
});



// Capturar el evento de presionar Enter en el campo "Número"
$('#numDOCIDE').keydown(function (event) {
	if (event.which === 13) {
		BusquedaDatos();
	}
});

function BusquedaDatos() {
	const tipoDocumento = $('#documnIDE').val();
	const numeroDocumento = $('#numDOCIDE').val();

	// Verificar que se haya ingresado un número de documento
	if (!numeroDocumento) {
		alert('Por favor, ingrese un número de documento');
		return;
	}

	// Definir la URL del endpoint según el tipo de documento
	let urlEndpoint = '';
	if (tipoDocumento === 'DNI') {
		urlEndpoint = `../ajax/boleta.php?op=consultaDniSunat&nrodni=${numeroDocumento}`;
	} else if (tipoDocumento === 'RUC') {
		urlEndpoint = `../ajax/factura.php?op=consultaRucSunat&nroucc=${numeroDocumento}`;
	}

	// Realizar la petición AJAX
	$.ajax({
		url: urlEndpoint,
		type: 'GET',
		dataType: 'json',
		success: function (data) {
			// Llenar el campo "Acredor" con el resultado de la búsqueda
			$('#acredor').val(data.nombre);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log('Error:', textStatus, errorThrown);
			alert('Hubo un error al realizar la búsqueda. Por favor, inténtelo nuevamente.');
		}
	});
}




init();