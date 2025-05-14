///URL CONSUMO GLOBAL
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

// Construir urlconsumo /consumir solo urlconsumo + "archivo.php?action="
var urlconsumo = new URL(path, baseURL);


//INICIALIZAR TODAS LAS FUNCIONES CORRESPONDIENTES

/* ---------------------------------------------------------------- */
//                          VARIABLES GLOBALES    

$idempresa = $("#idempresa").val();
$iva = $("#iva").val();

// Recupera el contenido HTML del Session Storage
var contenidoRecuperado = sessionStorage.getItem('miContenidoHTML');

if (contenidoRecuperado) {

  // Restaura el contenido en un elemento HTML
  $('.items-order').html(contenidoRecuperado);


  var id = document.getElementsByName("idarticulo[]");
  var cant = document.getElementsByName("cantidad_item_12[]");
  var cantiRe = document.getElementsByName("cantidadreal[]");
  for (var i = 0; i < id.length; i++) {
    var cant2 = cant[i];
    var cantiRe2 = cantiRe[i];
    cant2.value = cantiRe2.value;
    //cantiRe[i].value=cantidadreal;
  }

  modificarSubtotales();
}


function almacenarItems() {
  // Obtén el contenido HTML del elemento
  var htmlContent = $('.items-order').html();

  // Almacena el contenido HTML en el Session Storage
  sessionStorage.setItem('miContenidoHTML', htmlContent);
}


/* ---------------------------------------------------------------- */
//                      LISTAR CATEGORIAS

function listarCategorias() {

  $.ajax({
    url: urlconsumo + 'pos.php?action=listarCategorias',
    type: "get",
    dataType: "json",
    success: function (data) {

      const categoriaContainer = document.getElementById('category-content');


      data.ListaCategorias.forEach(categoria => {

        var card = document.createElement('div');
        card.classList.add('swiper-slide');

        card.innerHTML = `
          <div class="rounded-pill slider-item categoryclic" data-idfamilia="${categoria.idfamilia}" onclick="listarPorCategoria(event)">
              <img
                  src="../custom/images/background-posCategoria.png"
                  alt="dd" height="30px" width="30px" class="rounded-circle me-2">
              <span class="fw-600 f-12 category">${categoria.familia}</span>
          </div>
        `;


        categoriaContainer.appendChild(card);

        // Add a click event listener to the category
        card.querySelector('.categoryclic').addEventListener('click', listarPorCategoria);

      });

    },
    error: function (error) {
      console.error(error);
    }
  });

}

listarCategorias();



/* ---------------------------------------------------------------- */
//                   LISTAR PRODUCTOS (BUSQUEDA)

var url_send;
function listarProductos(busqueda) {

  $('#loader_product').show();

  if (busqueda != '') {
    url_send = urlconsumo + 'pos.php?action=listarProducto&busqueda=' + busqueda;
  } else {
    url_send = urlconsumo + 'pos.php?action=listarProducto';
  }

  $.ajax({
    url: url_send,
    type: 'get',
    dataType: 'json',
    success: function (data) {

      listarCardProductos(data);

      $('#loader_product').hide();


    },
    error: function (error) {
      console.error(error);

      $('#loader_product').hide();

    }
  });
}

var busqueda = '';
listarProductos(busqueda);


/* ---------------------------------------------------------------- */
//           ACTUALIZAR PRECIOS DE PRODUCTOS CARD (BUSQUEDA)

$('#s_tipo_precio').change(function () {
  busqueda = '';

  listarProductos(busqueda);

})


/* ---------------------------------------------------------------- */
//                  LISTAR PRODUCTOS CAMPO BUSQUEDA

let searchTimeout;

$('#search_product').on('input', function () {
  const searchTerm = $(this).val();

  // Cancelar la búsqueda anterior
  clearTimeout(searchTimeout);

  // Retraso 1s
  searchTimeout = setTimeout(function () {
    listarProductos(searchTerm);
  }, 1000);
});

/* ---------------------------------------------------------------- */
//                   LISTAR PRODUCTOS POR CATEGORIA

function listarPorCategoria(event) {
  event.preventDefault();

  $('#loader_product').show();

  // Get the idfamilia from the clicked card container
  var idfamilia = $(event.currentTarget).data('idfamilia');

  // Remove the 'select' class from all category elements
  $('.categoryclic').removeClass('select');

  // Add the 'select' class to the clicked card's container
  $(event.currentTarget).addClass('select');

  busqueda = $('#search_product').val();

  if (busqueda != '') {
    url_send = urlconsumo + "pos.php?action=listarProducto&idfamilia=" + idfamilia + "&busqueda=" + busqueda;
  } else {
    url_send = urlconsumo + "pos.php?action=listarProducto&idfamilia=" + idfamilia;
  }

  if (idfamilia) {
    // Fetch products for the selected category
    $.ajax({
      url: url_send,
      type: 'get',
      dataType: 'json',
      success: function (data) {
        listarCardProductos(data);
        $('#loader_product').hide();
      },
      error: function (error) {
        console.error(error);
        $('#loader_product').hide();
      }
    });
  } else {
    $('#product-container').html('<p>Seleccione una categoría.</p>');
    $('#loader_product').hide();
  }
}



/* ---------------------------------------------------------------- */
//                   CARD DE PRODUCTOS

function listarCardProductos(data) {

  var productContainer = $('#product-container');
  productContainer.empty(); // Limpiar productos existentes

  if (data.ListaProductos && data.ListaProductos.length > 0) {
    data.ListaProductos.forEach(product => {

      let productImage = product.imagen;

      // Verifica si la imagen termina con '/files/articulos/'
      if (!productImage || productImage.endsWith('/files/articulos/')) {
        productImage = '../files/articulos/simagen.png';
      }



      var productCard = document.createElement('div');
      productCard.classList.add('col-6', 'col-sm-6', 'col-md-3', 'col-lg-3', 'mb-3');

      var productCardAlert = document.createElement('div');

      var productStock = parseFloat((product.stock).replace(',', ''));

      if (productStock < 5 && productStock > 0) {
        productCardAlert.classList.add('card', 'card-warning', 'product-card', 'cursor-pointer');
      } else if (productStock == 0) {
        productCardAlert.classList.add('card', 'card-danger', 'product-card', 'cursor-pointer');
      } else {
        productCardAlert.classList.add('card', 'product-card', 'cursor-pointer');
      }

      var card = `
        <span class="d-flex align-items-center text-muted mt-auto ms-2" style="font-size: 14px;"> Stock - <input id="p_stock" class="text-muted" readonly value="${productStock}" style="border-radius: 10px;width: 50%;height: 15px;border: none;font-size: 14px;pointer-events: none;user-select: none;"></span>
        <span class="d-flex align-items-center text-muted mt-auto ms-2" style="font-size: 14px;"> Compra - S/ <input id="p_costo_compra" class="text-muted" readonly value="${product.costo_compra}" style="border-radius: 10px;width: 48%;height: 15px;border: none;font-size: 14px;pointer-events: none;user-select: none;"></span>

        <div class="text-center mt-1" style="height: 120px;">
          <img src="${productImage}" alt="${product.nombre}" height="100%" class=" mb-2">
        </div>
        <div class="card-body text-center p-0">
          <label class="fw-bolder fs-12" id="p_nombre">${product.nombre}</label> `;

      var s_tipo_precio = $('#s_tipo_precio').val();

      if (s_tipo_precio == 0) {

        card += `
          <p class="fs-6 fw-600" >S/ <span id="p_precio">${product.precio}</span></p>`;

      } else if (s_tipo_precio == 1) {

        card += `
          <p class="fs-6 fw-600" >S/ <span id="p_precio">${product.precio2}</span></p>`;

      } else if (s_tipo_precio == 2) {

        card += `
          <p class="fs-6 fw-600" >S/ <span id="p_precio">${product.precio3}</span></p>`;

      }

      card += `
        </div>
        <input type="hidden" id="p_idarticulo" value="${product.idarticulo}">
        <input type="hidden" id="p_codigoprod" value="${product.codigo}">
        <input type="hidden" id="p_codigoprov" value="${product.codigo_proveedor}">
        <input type="hidden" id="p_unimed" value="${product.abre}">
        <input type="hidden" id="p_precio_unitario" value="${product.precio_unitario}">
        <input type="hidden" id="p_cicbper" value="${product.cicbper}">
        <input type="hidden" id="p_mticbperu" value="${product.mticbperu}">
        <input type="hidden" id="p_factorc" value="${product.factorc}">
        <input type="hidden" id="p_descrip" value="${product.descrip}">
        <input type="hidden" id="p_tipoitem" value="${product.tipoitem}">
      `;

      productCardAlert.innerHTML = card;

      productCard.append(productCardAlert);

      productContainer.append(productCard);
    });
  } else {
    productContainer.html('<p>No hay productos disponibles para esta búsqueda.</p>');
  }

}

/* ---------------------------------------------------------------- */
//                    LISTAR TODOS LOS PRODUCTOS

// Enlace "Ver Todos"
$('#ver-todos-link').on('click', function (e) {
  e.preventDefault();

  listarTodosProductos();
});

function listarTodosProductos() {
  var allCategories = document.querySelectorAll('.categoryclic');

  allCategories.forEach(category => {
    category.classList.remove('select');
  });

  listarProductos('');
}

/* ---------------------------------------------------------------- */
//                    LIMPIAR FILTRO BUSQUEDA

$('#btn_deletefilter').on('click', function (e) {
  e.preventDefault();

  $('#search_product').val('');
})

/* ---------------------------------------------------------------- */
//                    CHECKBOX FILTRO CODIGO BARRA

$('#search_codigobarra').hide();


// Verificar el localStorage al cargar la página
if (localStorage.getItem('codigobarraEnabled') === 'true') {
  $('#active_codigobarra').prop('checked', true);
  $('#search_codigobarra').show().focus();
}


$('#active_codigobarra').change(function () {

  if (this.checked) {

    $('#search_codigobarra').show().focus();

  } else {

    $('#search_codigobarra').hide().val('');
  }

  localStorage.setItem('codigobarraEnabled', this.checked);
});


/* ---------------------------------------------------------------- */
//                   AGREGAR PRODUCTO AL PEDIDO

var sub_total = 0;
var igv = 0;
var total = 0;

var numeroOrden = 1;

var contadoresPorTipoPrecio = {
  0: 1, // Precio Normal
  1: 1, // Precio por Mayor
  2: 1  // Precio Distribuidor
};

$(document).on('click', '.product-card', function (e) {
  e.preventDefault();
  // console.log('clic');

  sub_total = parseFloat($('#subtotal_boleta').val());
  // console.log('subt',  sub_total);

  var productImage = $(this).find('img').attr('src');
  var productName = $(this).find('#p_nombre').text();
  var productPrice = parseFloat($(this).find('#p_precio').text());

  var productStock = $(this).find('#p_stock').val();
  var productId = $(this).find('#p_idarticulo').val();

  var productCod = $(this).find('#p_codigoprod').val();
  var productCodProv = $(this).find('#p_codigoprov').val();

  var productUM = $(this).find('#p_unimed').val();
  var productFactC = $(this).find('#p_factorc').val();

  var s_tipo_precio = $('#s_tipo_precio').val();

  agregarProductPedido(
    productImage,
    productName,
    productPrice,
    productStock,
    productId,
    productCod,
    productCodProv,
    productUM,
    productFactC,
    s_tipo_precio
  );


});

/* ---------------------------------------------------------------- */
//              FUNCION AGREGAR PROFUCTO POR CODIGO BARRA

function eventoProductoxCodigo(e) {

  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
    var busqueda = $('#search_codigobarra').val();

    $.ajax({
      url: '../ajax/boleta.php?op=listarArticulosboletaxcodigo&codigob=' + busqueda + '&idempresa=' +
        $idempresa,
      type: 'get',
      dataType: 'json',
      success: function (data) {

        // var data = data.ListaProductos[0];
        console.log('data', data);
        sub_total = parseFloat($('#subtotal_boleta').val());

        if (data != null) {

          var productImage = '../files/articulos/' + data.imagen;

          if (!productImage || productImage === '../files/articulos/') {

            productImage = 'https://www.phswarnerhoward.co.uk/assets/images/no_img_avaliable.jpg';

          }

          var productName = data.nombre;
          var productPrice = parseFloat(data.precio_venta);

          var productStock = data.stock;
          var productId = data.idarticulo;

          var productCod = data.codigo;
          var productCodProv = data.codigo_proveedor;

          var productUM = data.abre;

          var productFactC = data.factorc;


          agregarProductPedido(
            productImage,
            productName,
            productPrice,
            productStock,
            productId,
            productCod,
            productCodProv,
            productUM,
            productFactC
          );


        } else {

          swal.fire({
            title: "Error",
            text: 'Este producto no exite.',
            icon: "error",
            timer: 2000,
            showConfirmButton: false
          });
        }

        $('#search_codigobarra').val('');

      },
      error: function (error) {
        console.error(error);


      }
    });
  }
}


function agregarProductPedido(
  productImage,
  productName,
  productPrice,
  productStock,
  productId,
  productCod,
  productCodProv,
  productUM,
  productFactC,
  s_tipo_precio) {

  var tipocomprobante = $('#d_tipocomprobante').val();


  if (tipocomprobante == 0) {

    var productValUni = (productPrice / ($iva / 100 + 1)).toFixed(5);
    var productSubTotal = (productPrice / ($iva / 100 + 1)).toFixed(2);
    var igv = productPrice - productPrice / ($iva / 100 + 1);
    var productIgv = (igv).toFixed(4);
    var total = (productPrice).toFixed(2);
    var pvu = productPrice / ($iva / 100 + 1);
    var productPvu = (pvu).toFixed(5);
    var productVvu = (pvu).toFixed(5);
    var productIgvBD2 = ((productPvu * $iva) / 100).toFixed(4);
    var mticbperuCalculado = (0.0).toFixed(2);
    var productIgvBD = (igv).toFixed(2);
    var productPvt = '';

  } else if (tipocomprobante == 1) {

    var pvu = productPrice / ($iva / 100 + 1);
    var productPvu = redondeo(pvu, 5);
    var productVvu = (0).toFixed(5);
    var productPvt = (pvu).toFixed(5);
    var productValUni = (pvu).toFixed(5);
    var subtotal = productValUni - (productValUni * 0) / 100;
    var igv = subtotal * ($iva / 100);
    var inpIitem = pvu * ($iva / 100);
    var mticbperuCalculado = 0.0;
    sumtotal = subtotal + igv;
    var total = redondeo(sumtotal, 2);
    var productSubTotal = redondeo(subtotal, 2);
    var productIgv = redondeo(igv, 2);
    var productIgvBD = redondeo(inpIitem, 2);
    var productIgvBD2 = redondeo(igv, 2);

  } else if (tipocomprobante == 2) {

    var productValUni = (productPrice).toFixed(5);
    var productSubTotal = (productPrice).toFixed(2);
    var productIgv = (0).toFixed(4);
    var total = (productPrice).toFixed(2);
    var productPvu = (0).toFixed(5);
    var productVvu = (productPrice).toFixed(5);
    var productIgvBD2 = (productPrice).toFixed(4);
    var mticbperuCalculado = (0.0).toFixed(2);
    var productIgvBD = (productPrice).toFixed(2);
    var productPvt = '';

  } else if (tipocomprobante == 3) {

    var pvu = productPrice / ($iva / 100 + 1);
    var productPvu = redondeo(pvu, 5);
    var productVvu = (0).toFixed(5);
    var productPvt = (pvu).toFixed(5);
    var productValUni = (pvu).toFixed(5);
    var subtotal = productValUni - (productValUni * 0) / 100;
    var igv = subtotal * ($iva / 100);
    var inpIitem = pvu * ($iva / 100);
    var mticbperuCalculado = 0.0;
    sumtotal = subtotal + igv;
    var total = redondeo(sumtotal, 2);
    var productSubTotal = redondeo(subtotal, 2);
    var productIgv = redondeo(igv, 2);
    var productIgvBD = redondeo(inpIitem, 2);
    var productIgvBD2 = redondeo(igv, 2);

  }

  if (productStock == 0) {

    swal.fire({
      title: "Error",
      text: 'Este producto no se puede agregar porque no tiene stock.',
      icon: "error",
      timer: 2000,
      showConfirmButton: false
    });

    return;
  }

  // Verificar si el producto ya existe en la lista de pedidos para el tipo de precio actual
  var existingItem = $('.items-order .card[data-product-code="' + productId + '"][data-tipo-precio="' + s_tipo_precio + '"]');

  if (existingItem.length > 0) {
    // aumentar la cantidad en 1
    var inputBox = existingItem.closest('.card').find('.input-box');
    var currentQuantity = parseInt(inputBox.val());
    // console.log( 'Final stock', productStock - (currentQuantity));

    var finalStock = productStock - (currentQuantity);
    if (finalStock == 0) {
      swal.fire({
        title: "Error",
        text: 'Este producto no se puede agregar porque se alcanzó el limite de stock.',
        icon: "error",
        timer: 2000,
        showConfirmButton: false
      });

      return;
    }
    if (!isNaN(currentQuantity)) {
      var cantidad = currentQuantity + 1;
      inputBox.val(cantidad);
      var inputcant = existingItem.closest('.card').find('input[name="cantidadreal[]"]');
      inputcant.val(cantidad);
      modificarSubtotales();
    }
  } else {
    if ($('.items-order .card').length < 1) {
      numeroOrden = 1;
    }
    // Producto no existe, crear uno nuevo
    var newItem = `
    <div class="card mb-3 p-2" data-product-price data-product-code="${productId}" data-tipo-precio="${s_tipo_precio}" style="background: #F2F7FB !important; border-radius: .8rem !important; box-shadow: none;">
        <div class="d-flex align-items-center">
          <img src="${productImage}" alt="${productName}" height="40px" width="40px" class="d-none d-sm-inline d-md-inline d-lg-none d-xl-inline me-2">
          <div class="w-100">
            <div class="d-flex justify-content-between align-items-center">
              <label class="fw-700 fs-7" id="ped_name">${productName}</label>
              <div class="quantity rounded-pill d-flex justify-content-center align-items-center">
                <button class="btn btn-sm btn-warning rounded-circle minus" id="ped_disminuir" aria-label="Decrease">&minus;</button>
                <input type="number" class="input-box" name="cantidad_item_12[]" id="ped_cantidad" value="1" min="1" max="${productStock}">
                <button class="btn btn-sm btn-warning rounded-circle plus" id="ped_aumentar" aria-label="Increase">&plus;</button>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-baseline">

              <span>S/  <input type="number" class="border-0" name="precio_unitario[]" id="precio_unitario[]" value="${productPrice}" onBlur="modificarSubtotales(1)" style="background: transparent;"></span>

              <a href="#" class="text-danger text-decoration-none remove-item" style="font-size: 12px;">Eliminar</a>
            </div>
          </div>
        </div>

        <input type="hidden" name="numero_orden_item_29[]" id="numero_orden_item_29[]" value="${numeroOrden}"  >
        <select name="afectacionigv[]" class="" style="display:none;"> <option value="10">10-GOO</option><option value="20">20-EOO</option><option value="30">30-FRE</option></select>
        <input type="hidden" name="idarticulo[]" value="${productId}">
        <input type="hidden" name="codigotributo[]" value="1000">
        <input type="hidden" name="afectacionigv[]" value="10">
        
        <span name="SumDCTO" id="SumDCTO" style="display:none">0</span>
        <input type="hidden" name="descuento[]" id="descuento[]" >
        <input type="hidden" name="sumadcto[]" id="sumadcto[]" value="0" required="true">
        <input type="hidden" name="codigo_proveedor[]" id="codigo_proveedor[]" value="${productCodProv}">
        <input type="hidden" name="codigo[]" id="codigo[]" value="${productCod}">
        <input type="hidden" name="unidad_medida[]" id="unidad_medida[]" value="${productUM}">
        
        <input type="hidden" name="valor_unitario[]" id="valor_unitario[]" value="${productValUni}" >

        <input type="hidden" name="subtotal" id="subtotal" value="${productSubTotal}">
        <input type="hidden" name="subtotalBD[]" id="subtotalBD[${productId}]" value="${productSubTotal}">
        <span name="igvG" id="igvG" style="display:none;">${productIgv}</span>
        <input type="hidden" name="igvBD[]" id="igvBD[${productId}]" value="${productIgvBD}">
        <input type="hidden" name="igvBD2[]" id="igvBD2[${productId}]" value="${productIgvBD2}">
        <span name="total" id="total" style="display:none;" >${total}</span>
        <input type="hidden" name="vvu[]" id="vvu[${productId}]" value="${productVvu}">
        <input type="hidden" name="pvu_[]" id="pvu_[]" value="${productPvu}">
        <input type="hidden" name="cicbper[]" id="cicbper[${productId}]" value="">
        <input type="hidden" name="mticbperu[]" id="mticbperu[${productId}]" value="0.00">
        <input type="hidden" name="factorc[]" id="factorc[]" value="${productFactC}" required="true">
        <input type="hidden" name="cantidadreal[]" id="cantidadreal[]" value="1" required="true">

        <input type="hidden" id="igvprod" value="${productIgvBD}">

        <span name="mticbperuCalculado" id="mticbperuCalculado" style="display:none;">${mticbperuCalculado}</span>

        <input type="hidden" name="pvt[]" id="pvt[]" value="${productPvt}">
      </div>
    `;
    $('.items-order').append(newItem);
    // Incrementar el número de orden solo para el tipo de precio actual
    contadoresPorTipoPrecio[s_tipo_precio]++;
    // Incrementar el número de orden
    numeroOrden++;
    tributocodnon();
  }

  updateTotals();
  almacenarItems();

}

/* ---------------------------------------------------------------- */
//                  INICIALIZAR BOTONES CANTIDAD


$(document).on('click', '.quantity .minus', function (e) {
  e.preventDefault();
  var input = $(this);
  var inputBox = $(this).siblings('.input-box');
  var inputcant = $(this).closest('.card').find('input[name="cantidadreal[]"]');

  decreaseValue(input, inputBox, inputcant);


});

$(document).on('click', '.quantity .plus', function (e) {
  e.preventDefault();

  var input = $(this);
  var inputBox = $(this).siblings('.input-box');
  var inputcant = $(this).closest('.card').find('input[name="cantidadreal[]"]');

  increaseValue(input, inputBox, inputcant);
  // updateTotals();
});

$(document).on('input', '.quantity .input-box', function (e) {
  e.preventDefault();
  var inputcant = $(this).closest('.card').find('input[name="cantidadreal[]"]');
  handleQuantityChange($(this), $(this), inputcant);
});


/* ---------------------------------------------------------------- */
//                   FUNCION DISMINUIR CANTIDAD

function decreaseValue(input, inputBox, inputcant) {
  var value = parseInt(inputBox.val());
  value = isNaN(value) ? 1 : Math.max(value - 1, 1);
  inputBox.val(value);
  inputcant.val(value);

  handleQuantityChange(input, inputBox, inputcant);


}

/* ---------------------------------------------------------------- */
//                   FUNCION AUMENTAR CANTIDAD

function increaseValue(input, inputBox, inputcant) {
  var value = parseInt(inputBox.val());
  if (isNaN(value)) {
    value = 1;
  } else {
    var max = parseInt(inputBox.attr('max'));
    if (!isNaN(max)) {
      value = Math.min(value + 1, max);
    } else {
      value += 1;
    }
  }
  inputBox.val(value);
  inputcant.val(value);
  handleQuantityChange(input, inputBox, inputcant);
  // calcularBoleta( value, inputprecio, inputsubtotalBD, inputsubtotal, inputtotal, inputigvG, inputigvBD);
}

/* ---------------------------------------------------------------- */
//                FUNCION CAMBIO DE CANTIDAD AL INPUT

function handleQuantityChange(input, inputBox, inputcant) {
  var value = parseInt(inputBox.val());
  value = isNaN(value) ? 1 : value;


  // Realiza cualquier lógica adicional aquí, si es necesario.

  // var tipocomprobante = $('#d_tipocomprobante').val();

  // console.log('tipocomprobante', tipocomprobante);

  // if (tipocomprobante == 0) {
  //   calcularBoleta(input, value);

  // } else if (tipocomprobante == 1) {

  //   calcularFactura(input, value);

  // } else if (tipocomprobante == 2) {
  //   calcularNotaPedido(input, value)

  // }


  // Obtén el stock máximo permitido desde el atributo "max" del input
  var maxStock = parseInt(inputBox.attr('max'));

  if (value > maxStock) {
    // Muestra una alerta con SweetAlert
    swal.fire({
      title: "Error",
      text: "El valor de stock máximo permitido es de " + maxStock + ".",
      icon: "error",
      timer: 2000,
      showConfirmButton: false
    });

    // Establece la cantidad máxima permitida como el valor actual del input
    inputBox.val(maxStock);
    inputcant.val(value);

  }
  modificarSubtotales();

  almacenarItems();

  // updateTotals();

}


/* ---------------------------------------------------------------- */
//                  EVENTO ELIMINAR ITEM DE PEDIDO

$(document).on('click', '.remove-item', function (e) {
  e.preventDefault();
  $(this).closest('.card').remove();

  numeroOrden--;

  actualizarNumerosDeOrden();

  updateTotals();

  almacenarItems();
});

function actualizarNumerosDeOrden() {
  $('.items-order .card').each(function (index) {
    $(this).attr('data-orden', index + 1);
    $(this).find('input[name^="numero_orden_item_29"]').val(index + 1);
  });
}

/* ---------------------------------------------------------------- */
//                    CALCULAR TOTALES PEDIDO

function updateTotals() {
  sub_total = 0;
  total_igv = 0;
  total_mticbperu = 0;
  total = 0;
  pvu = 0;

  $('.items-order .card').each(function (i) {

    sub_total += parseFloat($(this).find('#subtotal').val());
    total_igv += parseFloat($(this).find('#igvG').text());
    total_mticbperu += parseFloat($(this).find('#mticbperuCalculado').text());
    total += parseFloat($(this).find('#total').text());
    pvu += parseFloat($(this).find('#pvu_\\[\\]').val());

    console.log('total_igv', total_igv);

  });


  $("#subtotal_boleta").val(redondeo(sub_total, 2));
  // $("#subtotalflotante").val(redondeo(sub_total, 2));
  $("#total_igv").val(redondeo(total_igv, 2));
  // $("#igvflotante").val(redondeo(total_igv, 2));
  // $("#icbper").val(redondeo(parseFloat(total_mticbperu), 2));
  $("#total_icbper").val(redondeo(total_mticbperu, 4));
  $("#totalpagar").val(formatNumber(total));
  // $("#totalflotante").val(number_format(redondeo(total, 2), 2));
  $("#total_final").val(redondeo(total, 2));
  $("#pre_v_u").val(redondeo(pvu, 2));

}



/* ---------------------------------------------------------------- */
//                    ACTUALIZAR TOTALES CARD

function modificarSubtotales(modificar) {

  if (modificar == 1) {
    var prec = document.getElementsByName("precio_unitario[]");
    var cant = document.getElementsByName("cantidad_item_12[]");

    for (var i = 0; i < cant.length; i++) {
      var inpP = prec[i];

      if (inpP.value == '') {

        document.getElementsByName("precio_unitario[]")[i].value = 0;

      } else if (isNaN(inpP.value) || inpP.value < 0) {
        // Si el valor no es un número válido o está vacío, muestra una alerta
        swal.fire({
          title: "Ops..!",
          text: "El valor insertado no es válido",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false
        });

        document.getElementsByName("precio_unitario[]")[i].focus();
      }
    }

  }

  var tipocomprobante = $('#d_tipocomprobante').val();

  if (tipocomprobante == 0) {

    var noi = document.getElementsByName("numero_orden_item_29[]");
    var cant = document.getElementsByName("cantidad_item_12[]");
    var prec = document.getElementsByName("precio_unitario[]");
    var vuni = document.getElementsByName("valor_unitario[]");
    // var st = document.getElementsByName("stock[]");
    var igv = document.getElementsByName("igvG");
    var sub = document.getElementsByName("subtotal");
    var tot = document.getElementsByName("total");
    var pvu = document.getElementsByName("pvu_[]");
    var mti = document.getElementsByName("mticbperuCalculado");
    var cicbper = document.getElementsByName("cicbper[]");
    var mticbperu = document.getElementsByName("mticbperu[]");
    var dcto = document.getElementsByName("descuento[]");
    var sumadcto = document.getElementsByName("sumadcto[]");
    var dcto2 = document.getElementsByName("SumDCTO");
    var factorc = document.getElementsByName("factorc[]");
    var cantiRe = document.getElementsByName("cantidadreal[]");

    for (var i = 0; i < cant.length; i++) {
      var inpNOI = noi[i];
      var inpC = cant[i];
      var inpP = prec[i];
      var inpS = sub[i];
      var inpI = igv[i];
      var inpT = tot[i];
      var inpPVU = pvu[i];
      // var inStk = st[i];
      var inpVuni = vuni[i];
      var inD2 = dcto2[i];
      var dctO = dcto[i];
      var sumaDcto = sumadcto[i];
      var codIcbper = cicbper[i];
      var mticbperuNN = mticbperu[i];
      var mtiMonto = mti[i];
      var factorcc = factorc[i];
      var inpCantiR = cantiRe[i];

      // inStk.value = inStk.value;
      // mticbperuNN.value = mticbperuNN.value;

      if ($("#codigo_tributo_h").val() == "1000") {
        // +IGV
        //inpPVU.value=inpP.value / 1.18; //Obtener el valor unitario
        inpPVU.value = inpP.value / ($iva / 100 + 1); //Obtener el valor unitario
        document.getElementsByName("valor_unitario[]")[i].value = redondeo(
          inpPVU.value,
          5
        ); // Se asigan el valor al campo
        dctO.value = dctO.value;
        sumaDcto.value = sumaDcto.value;
        inpNOI.value = inpNOI.value;
        inpI.value = inpI.value;
        inpS.value = inpC.value * (inpP.value / ($iva / 100 + 1)); //Calculo de subtotal excluyendo el igv
        inD2.value = (inpC.value * inpP.value * dctO.value) / 100; //Calculo acumulado del descuento
        //FOMULA IGV
        inpI.value =
          inpC.value * inpP.value -
          (inpC.value * inpP.value) / ($iva / 100 + 1); //Calculo de IGV
        inpT.value =
          inpC.value * inpP.value -
          (inpC.value * inpP.value * dctO.value) / 100; //Calculo del total
        inpIitem = (inpPVU.value * $iva) / 100; // Calculo de igv del valor unitario
        mtiMonto.value = 0.0; // Calculo de ICbper * cantidad (0.10 * 20)

        // if (tipoumm == "1") {
        //   inpCantiR.value =
        //     inStk.value / factorcc.value -
        //     (inStk.value - inpC.value) / factorcc.value;
        // } else {
        //   inpCantiR.value = inpC.value;
        // }
        //alert(inpCantiR.value);
      } else {

        // EXONERADA

        //document.getElementsByName("precio_unitario[]")[i].value = redondeo(inpVuni.value,5);
        document.getElementsByName("precio_unitario[]")[i].value = redondeo(
          inpP.value,
          5
        );
        inpNOI.value = inpNOI.value;
        inpI.value = inpI.value;
        dctO.value = dctO.value;
        sumaDcto.value = sumaDcto.value;
        inpS.value = inpC.value * inpP.value;
        inD2.value = (inpC.value * inpVuni.value * dctO.value) / 100; //Calculo acumulado del descuento
        //FOMULA IGV
        inpI.value = 0.0;
        inpT.value =
          inpC.value * inpP.value -
          (inpC.value * inpVuni.value * dctO.value) / 100; //Calculo del total;
        inpPVU.value =
          document.getElementsByName("precio_unitario[]")[i].value;
        //inpIitem = 0.00;
        inpIitem = inpP.value;
        mtiMonto.value = mticbperuNN.value * inpC.value; // Calculo de ICbper * cantidad (0.10 * 20)
        document.getElementsByName("valor_unitario[]")[i].value = redondeo(
          inpP.value,
          5
        ); // Se asigan el valor al campo
      }



      document.getElementsByName("subtotal")[i].innerHTML = redondeo(
        inpS.value,
        2
      );
      document.getElementsByName("igvG")[i].innerHTML = redondeo(inpI.value, 4);
      document.getElementsByName("mticbperuCalculado")[i].innerHTML = redondeo(
        mtiMonto.value,
        2
      );
      document.getElementsByName("total")[i].innerHTML = redondeo(
        inpT.value,
        2
      );
      document.getElementsByName("pvu_[]")[i].innerHTML = redondeo(
        inpPVU.value,
        5
      );

      // document.getElementsByName("numero_orden")[i].innerHTML = inpNOI.value;

      //Lineas abajo son para enviar el arreglo de inputs con los valor de IGV, Subtotal, y precio de venta

      //a la tala detalle_fact_art.

      document.getElementsByName("subtotalBD[]")[i].value = redondeo(
        inpS.value,
        2
      );
      document.getElementsByName("igvBD[]")[i].value = redondeo(inpI.value, 4);
      document.getElementsByName("igvBD2[]")[i].value = redondeo(inpIitem, 4);
      document.getElementsByName("vvu[]")[i].value = redondeo(inpPVU.value, 5);
      document.getElementsByName("SumDCTO")[i].innerHTML = redondeo(
        inD2.value,
        2
      );
      document.getElementsByName("sumadcto[]")[i].value = redondeo(
        inD2.value,
        2
      );

      // updateTotals();
    }

  } else if (tipocomprobante == 1) {

    var noi = document.getElementsByName("numero_orden_item_29[]");
    var cant = document.getElementsByName("cantidad_item_12[]");

    var prec = document.getElementsByName("precio_unitario[]"); //Precio unitario
    var vuni = document.getElementsByName("valor_unitario[]");
    // var st = document.getElementsByName("stock[]");
    var igv = document.getElementsByName("igvG");
    var sub = document.getElementsByName("subtotal");
    var tot = document.getElementsByName("total");
    var pvu = document.getElementsByName("pvu_[]");

    var dcto = document.getElementsByName("descuento[]");
    var sumadcto = document.getElementsByName("SumDCTO");
    // var dcto2 = document.getElementsByName("SumDCTO");

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
      // var inStk = st[i];

      // var inD2 = dcto2[i];
      var dctO = dcto[i];
      var sumaDcto = sumadcto[i];

      var codIcbper = cicbper[i];
      var mticbperuNN = mticbperu[i];
      var mtiMonto = mti[i];

      var factorcc = factorc[i];
      var inpCantiR = cantiRe[i];

      // EXONERADO CALCULOS

      if ($("#codigo_tributo_h").val() == "1000") {

        // inStk.value = inStk.value;
        inpC.value = inpC.value;
        dctO.value = dctO.value;

        mticbperuNN.value = mticbperuNN.value;
        inpPVU.value = inpP.value / 1.18; //Obtener valor unitario
        inpPVU.value = inpP.value / ($iva / 100 + 1); //Obtener valor unitario
        document.getElementsByName("valor_unitario[]")[i].value = redondeo(
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
        // inD2.value = (inpC.value * inpVuni.value * dctO.value) / 100;
        //inpI.value= inpS.value * 0.18;
        inpI.value = inpS.value * ($iva / 100);
        // console.log('inpS.value', inpS.value);
        // console.log('inpI.value', inpI.value);
        // console.log('Sum.value', parseFloat(inpS.value) + parseFloat(inpI.value));

        //inpIitem = inpPVU.value * 0.18;
        inpIitem = inpPVU.value * ($iva / 100);
        mtiMonto.value = 0.0;
        inpT.value = parseFloat(inpS.value) + parseFloat(inpI.value);
        //ORIGINAL

        // if (tipoumm == "1") {
        //   inpCantiR.value =
        //     inStk.value / factorcc.value -
        //     (inStk.value - inpC.value) / factorcc.value;
        // } else {
        //   inpCantiR.value = inpC.value;
        // }
      } else {

        document.getElementsByName("valor_unitario[]")[i].value = redondeo(
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
        sumaDcto.value = (inpC.value * inpVuni.value * dctO.value) / 100;
        inpI.value = 0.0;
        inpPVU.value =
          document.getElementsByName("precio_unitario[]")[i].value;
        //inpIitem = inpPVU.value;
        inpIitem = inpP.value;
        inpT.value = parseFloat(inpS.value) + parseFloat(inpI.value);
        mtiMonto.value = mticbperuNN.value * inpC.value; // Calculo de ICbper * cantidad (0.10 * 20)
        //document.getElementsByName("valor_unitario[]")[i].value = redondeo(inpVuni.value,5);
        document.getElementsByName("precio_unitario[]")[i].value = redondeo(
          inpP.value,
          5
        );

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
      document.getElementsByName("pvu_[]")[i].innerHTML = redondeo(
        inpPVU.value,
        5
      );

      // document.getElementsByName("numero_orden")[i].innerHTML = inpNOI.value;

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

      // document.getElementsByName("SumDCTO")[i].innerHTML = redondeo(
      //   inD2.value,
      //   2
      // );
      // document.getElementsByName("sumadcto[]")[i].value = redondeo(
      //   inD2.value,
      //   2
      // );
    }

  } else if (tipocomprobante == 2) {


    var noi = document.getElementsByName("numero_orden_item_29[]");
    var cant = document.getElementsByName("cantidad_item_12[]");
    var prec = document.getElementsByName("precio_unitario[]");
    // var st = document.getElementsByName("stock[]");
    var stbd = document.getElementsByName("subtotalBD[]");
    var igv = document.getElementsByName("igvG");
    var sub = document.getElementsByName("subtotal");
    var tot = document.getElementsByName("total");
    var fecha = document.getElementsByName("fecha[]");
    var totaldeuda = document.getElementsByName("totaldeuda");
    var tcomp = document.getElementsByName("totalcomp[]");
    var pvu = document.getElementsByName("pvu_[]");

    var factorc = document.getElementsByName("factorc[]");
    var cantiRe = document.getElementsByName("cantidadreal[]");
    // console.log('st', st);

    // var adelanto = $("#adelanto");
    // var faltante = $("#faltante");

    for (var i = 0; i < cant.length; i++) {
      var inpNOI = noi[i];
      var inpC = cant[i];
      var inpP = prec[i];
      var inpS = sub[i];
      var inpI = igv[i];

      var inpT = tot[i];
      var inpPVU = pvu[i];
      // var inStk = st[i];
      var inSTbd = stbd[i];

      var factorcc = factorc[i];
      var inpCantiR = cantiRe[i];

      // console.log('inStk', inStk);

      // inStk.value = inStk.value;
      inSTbd.value = inSTbd.value;
      inpS.value = inpS.value;

      //Validar cantidad no sobrepase stock actual
      // if (parseFloat(inpC.value) > parseFloat(inStk.value)) {
      //   bootbox.alert("Mensaje, La cantidad supera al stock.");
      // } else {
      inpNOI.value = inpNOI.value;
      inpI.value = inpI.value;
      inpS.value = parseFloat(inpP.value) * inpC.value;
      inpI.value = 0.0;
      inpT.value = inpS.value; // + parseFloat(inpT2.value);
      inpPVU.value = 0.0;
      inpIitem = 0.0;
      // inpCantiR.value =
      //   inStk.value / factorcc.value -
      //   (inStk.value - inpC.value) / factorcc.value;

      document.getElementsByName("subtotalBD[]")[i].value = redondeo(
        inpS.value,
        2
      );
      document.getElementsByName("subtotal")[i].innerHTML = redondeo(
        inpS.value,
        2
      );
      document.getElementsByName("igvG")[i].innerHTML = redondeo(inpI.value, 4);
      document.getElementsByName("total")[i].innerHTML = redondeo(
        inpT.value,
        2
      );
      document.getElementsByName("pvu_[]")[i].innerHTML = redondeo(
        inpPVU.value,
        5
      );

      // document.getElementsByName("numero_orden")[i].innerHTML = inpNOI.value;

      //Lineas abajo son para enviar el arreglo de inputs con los valor de IGV, Subtotal, y precio de venta
      //a la tala detalle_fact_art.
      //document.getElementsByName("subtotalBD[]")[i].value = redondeo(inpS.value,2);
      document.getElementsByName("igvBD[]")[i].value = redondeo(inpT.value, 4);
      document.getElementsByName("igvBD2[]")[i].value = redondeo(inpT.value, 4);
      document.getElementsByName("vvu[]")[i].value = redondeo(inpT.value, 5);
      //Fin de comentario
      // } //Final de if

    } //Final de for

  } else if (tipocomprobante == 3) {

    var noi = document.getElementsByName("numero_orden_item[]");
    var cant = document.getElementsByName("cantidad[]");
    var prec = document.getElementsByName("precio_unitario[]");
    var vuni = document.getElementsByName("valor_unitario2[]");
    var igv = document.getElementsByName("igvG");
    var sub = document.getElementsByName("subtotal");
    var tot = document.getElementsByName("total");
    var pvu = document.getElementsByName("pvu_");


    for (var i = 0; i < cant.length; i++) {
      var inpNOI = noi[i];
      var inpC = cant[i];
      var inpP = prec[i];
      var inpS = sub[i];
      var inpVuni = vuni[i];
      var inpI = igv[i];

      var inpT = tot[i];
      var inpPVU = pvu[i];
      inpC.value = inpC.value;
      inpPVU.value = inpP.value / ($iva / 100 + 1); //Obtener valor unitario 
      document.getElementsByName("valor_unitario2[]")[i].value = redondeo(inpPVU.value, 5); //Asignar valor unitario 
      inpNOI.value = inpNOI.value;
      inpI.value = inpI.value;
      inpS.value = (inpC.value * inpVuni.value);
      inpI.value = inpS.value * $iva / 100;
      inpIitem = inpPVU.value * $iva / 100;
      inpT.value = inpS.value + inpI.value;

      document.getElementsByName("subtotal")[i].innerHTML = redondeo(inpS.value, 2);
      document.getElementsByName("igvG")[i].innerHTML = redondeo(inpI.value, 2);
      document.getElementsByName("total")[i].innerHTML = redondeo(inpT.value, 2);
      document.getElementsByName("pvu_")[i].innerHTML = redondeo(inpPVU.value, 5);
      document.getElementsByName("numero_orden")[i].innerHTML = inpNOI.value;
      //Lineas abajo son para enviar el arreglo de inputs ocultos con los valor de IGV, Subtotal, y precio de venta
      //a la tala detalle_fact_art.
      document.getElementsByName("subtotalBD[]")[i].value = redondeo(inpS.value, 2);
      document.getElementsByName("igvBD[]")[i].value = redondeo(inpIitem, 2);
      document.getElementsByName("igvBD2[]")[i].value = redondeo(inpI.value, 2);
      document.getElementsByName("pvt[]")[i].value = redondeo(inpPVU.value, 5);
      document.getElementsByName("vuniitem[]")[i].value = redondeo(inpPVU.value, 5);
      document.getElementsByName("valorventa[]")[i].value = redondeo(inpS.value, 2);
      //Fin de comentario

    }
  }

  updateTotals();

}


/* ---------------------------------------------------------------- */
//                    EVENTO MOSTRAR DATOS

$('#container_datos').hide();

$('#btn_datos').on('click', function (e) {
  e.preventDefault();

  $('#container_datos').slideToggle();

});

/* ---------------------------------------------------------------- */
//                    FUNCION FORMATO NUMEROS

function formatNumber(number) {
  var parts = number.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/* ---------------------------------------------------------------- */
//                   FUNCIONES INPUT METODO PAGO

let currentInput = null;

// Al hacer clic en un boton de la calculadora, se enfoca en el input correspondiente.
$(".calculator-button").click(function () {
  // Encuentra el input relacionado al botón clickeado.
  const inputId = $(this).siblings(".calculator-input").attr("id");
  currentInput = $("#" + inputId);

  // Coloca el foco en el input.
  currentInput.focus();
});

$(".calculator-input").click(function () {
  currentInput = $(this);
});

/* ---------------------------------------------------------------- */
//                       FUNCIONES TECLADO

$(".design").click(function () {
  // console.log('this', $(this).text());

  // console.log('cuurr', currentInput.val());
  if (currentInput) {
    const buttonText = $(this).text();
    const inputValue = currentInput.val();

    if (inputValue == 0) {
      currentInput.val(buttonText);

    } else if (buttonText === "." && inputValue.includes(".")) {
      // Evitar agregar más de un punto decimal.
      currentInput.val(inputValue);

    } else {
      // currentInput.val(inputValue + buttonText);
      // Controlar la cantidad de decimales permitidos.
      const decimalIndex = inputValue.indexOf(".");
      if (decimalIndex !== -1 && inputValue.length - decimalIndex > 2) {
        // Si ya hay dos decimales, no permitir más.
        currentInput.val(inputValue);
      } else {
        currentInput.val(inputValue + buttonText);
      }
    }

    calcularPago();
  }

});

//Backspace
$('#backspace').click(function () {

  if (currentInput) {
    var value = currentInput.val();
    if (!(parseInt(parseFloat(value)) == 0 && value.length == 1)) {
      currentInput.val(value.slice(0, value.length - 1));
    }
    if (value.length == 1 || value.length == 0) {
      currentInput.val("0");
    }
    calcularPago();
  }

});

// All Clear
$("#allClear").click(function () {
  // $("#expression").val("0");
  // $("#result").val("0");
  if (currentInput) {
    currentInput.val("0");

    calcularPago();
  }
});

/* ---------------------------------------------------------------- */
//                    MOSTRAR MODAL METODO DE PAGO
// const myCartIcon = document.querySelector('.my-cart-icon');

$('#btn_metodopago').click(function () {

  if ($('.items-order .card').length === 0) {
    iziToast.warning({
      title: 'Precaución',
      position: 'topRight',
      color: '#eef3f8',
      titleColor: '#000',
      messageColor: '#000',
      progressBarColor: '#181c41',
      iconText: '.',
      message: 'Carrito vacio',
    });
    return;
  }

  var totalpedido = $('#totalpagar').val().replace(',', '');

  $('#p_pedido').val(totalpedido);
  $('#efectivo').val(parseFloat(totalpedido).toFixed(2));

  // Verificar que completaron datos

  //HERE

  var d_tipocomprobante = $('#d_tipocomprobante').val();

  if ($('#d_tipocomprobante').val() == null) {
    iziToast.warning({
      title: 'Precaución',
      position: 'topRight',
      color: '#eef3f8',
      titleColor: '#000',
      messageColor: '#000',
      progressBarColor: '#181c41',
      iconText: '.',
      message: 'Completa los datos antes de continuar',
    });


    $('#btn_datos').focus();

    return;

  } else if (d_tipocomprobante == 0 || d_tipocomprobante == 2) {

    if ($('#tipo_doc_ide').val() == '') {

      iziToast.warning({
        title: 'Precaución',
        position: 'topRight',
        color: '#eef3f8',
        titleColor: '#000',
        messageColor: '#000',
        progressBarColor: '#181c41',
        iconText: '.',
        message: 'Completa el tipo de documento',
      });

      $('#btn_datos').focus();
      return;

    } else if ($('#numero_documento').val() == '' || $('#numero_documento').val() == '-') {

      iziToast.warning({
        title: 'Precaución',
        position: 'topRight',
        color: '#eef3f8',
        titleColor: '#000',
        messageColor: '#000',
        progressBarColor: '#181c41',
        iconText: '.',
        message: 'Completa el número de documento',
      });

      $('#btn_datos').focus();
      return;

    } else if ($('#razon_social').val() == '' || $('#razon_social').val() == '-') {

      iziToast.warning({
        title: 'Precaución',
        position: 'topRight',
        color: '#eef3f8',
        titleColor: '#000',
        messageColor: '#000',
        progressBarColor: '#181c41',
        iconText: '.',
        message: 'Completa los nombres y apellidos',
      });

      $('#btn_datos').focus();
      return;

    }

  } else if (d_tipocomprobante == 1) {

    if ($('#tipo_doc_ide').val() == '') {

      iziToast.warning({
        title: 'Precaución',
        position: 'topRight',
        color: '#eef3f8',
        titleColor: '#000',
        messageColor: '#000',
        progressBarColor: '#181c41',
        iconText: '.',
        message: 'Completa los nombres y apellidos',
      });

      $('#btn_datos').focus();
      return;

    } else if ($('#numero_documento2').val() == '' || $('#numero_documento2').val() == '-') {

      iziToast.warning({
        title: 'Precaución',
        position: 'topRight',
        color: '#eef3f8',
        titleColor: '#000',
        messageColor: '#000',
        progressBarColor: '#181c41',
        iconText: '.',
        message: 'Completa el número de documento',
      });

      $('#btn_datos').focus();
      return;

    } else if ($('#razon_social2').val() == '' || $('#razon_social2').val() == '-') {

      iziToast.warning({
        title: 'Precaución',
        position: 'topRight',
        color: '#eef3f8',
        titleColor: '#000',
        messageColor: '#000',
        progressBarColor: '#181c41',
        iconText: '.',
        message: 'Completa la razón social',
      });

      $('#btn_datos').focus();
      return;

    }

  }


  $('#modal_metodopago').modal('show');

  setTimeout(function () {
    $('#efectivo').focus();
  }, 500);

  currentInput = $('#efectivo');
  calcularPago();


})


/* ---------------------------------------------------------------- */
//                     CERRAR MODAL METODO DE PAGO

$('#modal_metodopago').on('hidden.bs.modal', function () {

  limpiarMetodoPago();
});

/* ---------------------------------------------------------------- */
//                      FUNCION CALCULAR PAGO

function calcularPago() {

  var p_pedido = parseFloat($('#p_pedido').val());

  var efectivo = parseFloat($('#efectivo').val());
  // var p_credito = parseFloat( $('#p_credito').val() || 0 );
  var visa = parseFloat($('#visa').val() || 0);
  var yape = parseFloat($('#yape').val() || 0);
  var plin = parseFloat($('#plin').val() || 0);
  var mastercard = parseFloat($('#mastercard').val() || 0);
  var deposito = parseFloat($('#deposito').val() || 0);

  var totalpagado = efectivo + visa + yape + plin + mastercard + deposito;

  $('#ipagado_final').val(formatNumber(totalpagado));

  var totalvuelto = 0;

  totalvuelto = totalpagado - p_pedido

  if (totalpagado > p_pedido) {

    $('#text_vuelto').html('Vuelto <span>S/.</span>');
    $('#text_vuelto').css('color', 'green');
    $('#saldo_final').css('color', 'green');

  } else if (totalpagado == p_pedido) {

    $('#text_vuelto').html('Completo <span>S/.</span>');
    $('#text_vuelto').css('color', 'blue');
    $('#saldo_final').css('color', 'blue');

  } else {

    totalvuelto = p_pedido - totalpagado

    $('#text_vuelto').html('Falta <span>S/.</span>');
    $('#text_vuelto').css('color', 'red');
    $('#saldo_final').css('color', 'red');
  }

  // console.log('vuelto1', totalvuelto);
  $('#saldo_final').val(formatNumber(totalvuelto));


}

/* ---------------------------------------------------------------- */
//                   EVENTO INPUT CALCULAR PAGO

$('.calculator-input').on('input', calcularPago);

/* ---------------------------------------------------------------- */
//                  LIMPIAR MODAL METODO DE PAGO

function limpiarMetodoPago() {

  $('#p_pedido').val(0);

  $('#efectivo').val(0);
  $('#visa').val(0);
  $('#yape').val(0);
  $('#plin').val(0);
  $('#mastercard').val(0);
  $('#deposito').val(0);

  $('#ipagado_final').val(0);

  $('#text_vuelto').html('Vuelto <span>S/.</span>');
  $('#saldo_final').val(0);

}


/********************************************************************************/
/*                                LISTAR SELECT                                 */
/********************************************************************************/

$('#d_tipocomprobante').val(0);
$('.doc_dni').show();
$('.doc_ruc').hide();
obtenerSerie();

/* ---------------------------------------------------------------- */
//                    EVENTO CHANGE (d_tipocomprobante)   

// $("#d_tipocomprobante").change(function () {
//   // Verifica si se seleccionó "Factura"
//   if ($(this).val() === "1") {
//     // Selecciona la opción con valor "4" en tipo_doc_ide

//     $("#tipo_doc_ide").val("6");
//     focusI();

//   }
// });

$("#d_tipocomprobante").change(function () {
  // // Obtiene el valor seleccionado
  var selectedValue = $(this).val();

  var tipoDocSelect = $("#tipo_doc_ide");

  limpiarDatos();

  // // Llama a la función correspondiente según el valor seleccionado
  if (selectedValue === '0') {

    $("#tipo_doc_ide").val("0");

    // Desactiva las opciones
    tipoDocSelect.find("option[value='4']").prop('disabled', true);
    tipoDocSelect.find("option[value='6']").prop('disabled', true);

    tipoDocSelect.find("option[value='0']").prop('disabled', false);
    tipoDocSelect.find("option[value='1']").prop('disabled', false);
    tipoDocSelect.find("option[value='7']").prop('disabled', false);

  } else if (selectedValue === '1') {

    $("#tipo_doc_ide").val("6");

    // Desactiva las opciones
    tipoDocSelect.find("option[value='0']").prop('disabled', true);
    tipoDocSelect.find("option[value='1']").prop('disabled', true);
    tipoDocSelect.find("option[value='7']").prop('disabled', true);

    tipoDocSelect.find("option[value='4']").prop('disabled', false);
    tipoDocSelect.find("option[value='6']").prop('disabled', false);

  } else if (selectedValue === '2') {

    // Desactiva las opciones
    tipoDocSelect.find("option[value='4']").prop('disabled', true);
    tipoDocSelect.find("option[value='7']").prop('disabled', true);

    tipoDocSelect.find("option[value='0']").prop('disabled', false);
    tipoDocSelect.find("option[value='1']").prop('disabled', false);
    tipoDocSelect.find("option[value='6']").prop('disabled', false);


    $("#tipo_doc_ide").val("0");

  } else if (selectedValue === '3') {

    // Desactiva las opciones
    tipoDocSelect.find("option[value='0']").prop('disabled', true);
    tipoDocSelect.find("option[value='7']").prop('disabled', true);

    tipoDocSelect.find("option[value='4']").prop('disabled', false);
    tipoDocSelect.find("option[value='6']").prop('disabled', false);

    $("#tipo_doc_ide").val("1");


  }

  focusI();


  modificarSubtotales();


  $('#serie').prop('disabled', true);

  obtenerSerie();

});

/* ---------------------------------------------------------------- */
//              FUNCION limpiar datos de clientes   

function limpiarDatos() {

  $('#idcliente').val('');
  $('#idpersona').val('');
  $('#numero_documento').val('');
  $('#numero_documento2').val('');
  $('#razon_social').val('');
  $('#razon_social2').val('');
  $('#domicilio_fiscal').val('');
  $('#domicilio_fiscal2').val('');

}


/* ---------------------------------------------------------------- */
//                 OBTENER IMPUESTO (codigo_tributo_18_3)        

$.post("../ajax/factura.php?op=selectTributo", function (r) {
  $("#codigo_tributo_18_3").html(r);
});



/* ---------------------------------------------------------------- */
//                   OBTENER VENDEDOR (vendedorsitio)  

$.post(
  "../ajax/vendedorsitio.php?op=selectVendedorsitio&idempresa=" + $idempresa,
  function (r) {
    // Verifica si el contenido obtenido no está vacío
    if (r.trim() !== "") {
      // Parsea la respuesta JSON
      console.log(r);
      //var data = JSON.parse(r);

      // Accede al nombre y al cargo desde el sessionStorage
      var nombre = sessionStorage.getItem("nombre");
      var cargo = sessionStorage.getItem("cargo");

      // Verifica si el cargo es igual a 1 antes de agregar el nombre al select
      if (cargo === "1") {
        // Si hay contenido y el cargo es 1, muestra el select con el nombre
        $("#ContenedorVendedor").html(`
          <select class="form-select w-auto" autofocus name="vendedorsitio" id="vendedorsitio"
            data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Vendedor">
            <option value="${nombre}">${nombre}</option>
          </select>
        `);
      } else {
        // En caso contrario, el cargo no es 1, puedes manejarlo de acuerdo a tus necesidades
        // Puedes mostrar un mensaje o realizar alguna otra acción
        console.log("El cargo no es 1");
      }
    }
  }
);


/* ---------------------------------------------------------------- */
//                   OBTENER TIPO DOCUMENTO (tipo_doc_ide)  

//llenar documentos
function cargarTiposDocIde() {
  $.ajax({
    url: urlconsumo + "catalogo6.php?action=listar2",
    type: "GET",
    dataType: "json",
    success: function (data) {
      llenarSelect(data.aaData);
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar los tipos de documento de identidad");
      console.error(error);
    },
  });
}

function llenarSelect(data) {
  var select = $("#tipo_doc_ide");
  select.empty();
  select.append(
    $("<option>", {
      value: "",
      text: "Seleccionar Tipo documento",
    })
  );
  $.each(data, function (index, value) {
    if (value.estado === "1") {

      var optionText = value.codigo === "0" ? "SIN DOCUMENTO" : value.documento;

      select.append(
        $("<option>", {
          value: value.codigo,
          text: optionText,
        })
      );
    }
  });

  var tipoDocSelect = $("#tipo_doc_ide");

  tipoDocSelect.val(0);

  tipoDocSelect.find("option[value='1']").prop('disabled', false);
  tipoDocSelect.find("option[value='7']").prop('disabled', false);

  tipoDocSelect.find("option[value='4']").prop('disabled', true);
  tipoDocSelect.find("option[value='6']").prop('disabled', true);

  focusI();
}

cargarTiposDocIde();

/* ---------------------------------------------------------------- */
//                       OBTENER SERIE (serie)  


function obtenerSerie() {

  select_tipocomp = $('#d_tipocomprobante').val();

  // Si es boleta
  if (select_tipocomp == 0) {

    $.post("../ajax/boleta.php?op=selectSerie", function (r) {
      $("#serie").html(r);
      //$("#serie").selectpicker('refresh');
      var serieL = document.getElementById("serie");
      var opt = serieL.value;
      $.post(
        "../ajax/boleta.php?op=autonumeracion&ser=" +
        opt +
        "&idempresa=" +
        $idempresa,
        function (r) {
          var n2 = pad(r, 0);
          $("#numero_boleta").val(n2);
          var SerieReal = $("#serie option:selected").text();
          $("#SerieReal").val(SerieReal);

          $('#serie').prop('disabled', false);
        }
      );
    });

  } else if (select_tipocomp == 1) {

    // Si es factura

    $.post("../ajax/factura.php?op=selectSerie", function (r) {
      $("#serie").html(r);
      //$("#serie").selectpicker('refresh');
      var serieL = document.getElementById("serie");
      var opt = serieL.value;
      $.post(
        "../ajax/factura.php?op=autonumeracion&ser=" +
        opt +
        "&idempresa=" +
        $idempresa,
        function (r) {
          var n2 = pad(r, 0);
          $("#numero_boleta").val(n2);
          var SerieReal = $("#serie option:selected").text();
          $("#SerieReal").val(SerieReal);

          $('#serie').prop('disabled', false);
        }
      );
    });



  } else if (select_tipocomp == 2) {

    // Si es Nota de Pedido

    $.post("../ajax/notapedido.php?op=selectSerie", function (r) {
      $("#serie").html(r);
      //$("#serie").selectpicker('refresh');

      var serieL = document.getElementById("serie");
      var opt = serieL.value;
      $.post(
        "../ajax/notapedido.php?op=autonumeracion&ser=" + opt,
        function (r) {
          var n2 = pad(r, 0);
          $("#numero_boleta").val(n2);

          var SerieReal = $("#serie option:selected").text();
          $("#SerieReal").val(SerieReal);

          $('#serie').prop('disabled', false);
        }
      );
    });

  } else if (select_tipocomp == 3) {

    // Si es cotización
    $.post("../ajax/cotizacion.php?op=selectSerie", function (r) {
      $("#serie").html(r);
      //$("#serie").selectpicker('refresh');
      var serieL = document.getElementById("serie");
      var opt = serieL.value;
      $.post(
        "../ajax/cotizacion.php?op=autonumeracion&ser=" +
        opt +
        "&idempresa=" +
        $idempresa,
        function (r) {
          var n2 = pad(r, 0);
          $("#numero_boleta").val(n2);
          var SerieReal = $("#serie option:selected").text();
          $("#SerieReal").val(SerieReal);

          $('#serie').prop('disabled', false);
        }
      );
    });

  } else {

    $("#serie").html('');
    $("#numero_boleta").val('');
    $("#SerieReal").val('');
  }

  focusI();
}


/* ---------------------------------------------------------------- */
//                   FUNCION INCREMENTAR NUM  

function incremetarNum() {
  var serie = $("#serie option:selected").val();
  $.post(
    "../ajax/boleta.php?op=autonumeracion&ser=" +
    serie +
    "&idempresa=" +
    $idempresa,
    function (r) {
      var n2 = pad(r, 0);
      $("#numero_boleta").val(n2);
      var SerieReal = $("#serie option:selected").text();
      $("#SerieReal").val(SerieReal);
    }
  );
  document.getElementById("tipo_doc_ide").focus();
}

/* ---------------------------------------------------------------- */
//                 Funcion para poner ceros antes del numero   

function pad(n, length) {
  var n = n.toString();
  while (n.length < length) n = "0" + n;
  return n;
}

/* ---------------------------------------------------------------- */
//                 Obtener la fecha actual  

$("#fecha_emision_01").prop("disabled", false);

var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear() + "-" + month + "-" + day;
$("#fecha_emision_01").val(today);
$("#fechavenc").val(today);

// Lista ventas
$('#fechaDesde').val(today);
$('#fechaHasta').val(today);

/* ---------------------------------------------------------------- */
//                   FUNCION FOCUS (tipo_doc_ide)

function focusTdoc() {
  document.getElementById("tipo_doc_ide").focus();
}

/* ---------------------------------------------------------------- */
//                   FUNCION FOCUS (tipo_doc_ide)

function focusI() {
  var tipo = $("#tipo_doc_ide option:selected").val();

  limpiarDatos();

  if (tipo == "0") {
    $.post(
      "../ajax/persona.php?op=mostrarClienteVarios",
      function (data, status) {
        data = JSON.parse(data);
        $("#idcliente").val(data.idpersona);
        $("#numero_documento").val(data.numero_documento);
        $("#razon_social").val(data.razon_social);
        $("#domicilio_fiscal").val(data.domicilio_fiscal);

        $("#numero_documento").prop('readonly', true);
        $("#razon_social").prop('readonly', true);
        $("#domicilio_fiscal").prop('readonly', true);
      }
    );

    //document.getElementById('numero_documento').focus();

    $('.doc_dni').show();
    $('.doc_ruc').hide();

  }

  if (tipo == "1") {
    //$('#idcliente').val("");
    $("#numero_documento").val("");
    $("#razon_social").val("");
    $("#domicilio_fiscal").val("");
    document.getElementById("numero_documento").focus();
    document.getElementById("numero_documento").maxLength = 20;


    enabledTipoDoc();

    $('.doc_dni').show();
    $('.doc_ruc').hide();
  }

  if (tipo == "3") {
    //$('#idcliente').val("");
    $("#numero_documento").val(data.numero_documento);
    $("#razon_social").val(data.razon_social);
    $("#domicilio_fiscal").val(data.domicilio_fiscal);

    $("#numero_documento").prop('readonly', true);
    $("#razon_social").prop('readonly', true);
    $("#domicilio_fiscal").prop('readonly', true);
    document.getElementById("numero_documento").focus();
    document.getElementById("numero_documento").maxLength = 20;


    enabledTipoDoc();

    $('.doc_dni').show();
    $('.doc_ruc').hide();
  }

  if (tipo == "4") {
    $("#numero_documento").val("");
    $("#razon_social").val("");
    $("#domicilio_fiscal").val("");
    document.getElementById("numero_documento").focus();
    document.getElementById("numero_documento").maxLength = 15;

    enabledTipoDoc();
    $('.doc_dni').show();
    $('.doc_ruc').hide();
  }

  if (tipo == "7") {
    $("#numero_documento").val("");
    $("#razon_social").val("");
    $("#domicilio_fiscal").val("");
    document.getElementById("numero_documento").focus();
    document.getElementById("numero_documento").maxLength = 15;

    enabledTipoDoc();
    $('.doc_dni').show();
    $('.doc_ruc').hide();
  }

  if (tipo == "A") {
    $("#numero_documento").val("");

    $("#razon_social").val("");

    $("#domicilio_fiscal").val("");

    document.getElementById("numero_documento").focus();

    document.getElementById("numero_documento").maxLength = 15;


    enabledTipoDoc();
    $('.doc_dni').show();
    $('.doc_ruc').hide();
  }

  if (tipo == "6") {
    $("#numero_documento").val("");

    $("#razon_social").val("");

    $("#domicilio_fiscal").val("");

    document.getElementById("numero_documento").focus();

    document.getElementById("numero_documento").maxLength = 11;

    $('.doc_dni').hide();
    $('.doc_ruc').show();

    enabledTipoDoc();

  }
}

/* ---------------------------------------------------------------- */
//               Funcion habilitar campos de tipo doc

function enabledTipoDoc() {
  $("#numero_documento").prop('readonly', false);
  $("#razon_social").prop('readonly', false);
  $("#domicilio_fiscal").prop('readonly', false);

}

/* ---------------------------------------------------------------- */
//             FUNCION agregarClientexDoc (numero_documento)

function agregarClientexDoc(e) {
  var dni = $("#numero_documento").val();

  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();

    $("#razon_social").val("");
    $("#domicilio_fiscal").val("");

    $.post(
      "../ajax/boleta.php?op=listarClientesboletaxDoc&doc=" + dni,
      function (data, status) {
        data = JSON.parse(data);
        if (data != null) {
          $("#idcliente").val(data.idpersona);
          $("#razon_social").val(data.nombres);
          $("#domicilio_fiscal").val(data.domicilio_fiscal);
          $("#suggestions").fadeOut();
          $("#suggestions2").fadeOut();
          $("#suggestions3").fadeOut();
        } else if ($("#tipo_doc_ide").val() == "1") {
          // SI ES DNI
          $("#razon_social").val("");
          $("#domicilio_fiscal").val("");
          var dni = $("#numero_documento").val();
          $.post(
            "../ajax/boleta.php?op=consultaDniSunat&nrodni=" + dni,
            function (data, status) {
              data = JSON.parse(data);
              if (data != null) {
                $("#idcliente").val("N");
                $("#razon_social").val(data.nombre);
              } else {
                alert(data);
                document.getElementById("razon_social").focus();
                $("#idcliente").val("N");
              }
            }
          );
          $("#suggestions").fadeOut();
          $("#suggestions2").fadeOut();
          $("#suggestions3").fadeOut();
        } else if ($("#tipo_doc_ide").val() == "6") {
          // SI ES RUC
          $("#razon_social").val("");
          $("#domicilio_fiscal").val("");
          var dni = $("#numero_documento").val();
          $.post(
            "../ajax/factura.php?op=listarClientesfacturaxDoc&doc=" + dni,
            function (data, status) {
              data = JSON.parse(data);
              if (data != null) {
                $("#idcliente").val(data.idpersona);
                $("#razon_social").val(data.razon_social);
                $("#domicilio_fiscal").val(data.domicilio_fiscal);
              } else {
                $("#idcliente").val("");
                $("#razon_social").val("No registrado");
                $("#domicilio_fiscal").val("No registrado");
                Swal.fire({
                  title: "Cliente no registrado",
                  icon: "warning",
                });

                $("#ModalNcliente").modal("show");
                $("#nruc").val($("#numero_documento").val());
              }
            }
          );
          $("#suggestions").fadeOut();
          $("#suggestions2").fadeOut();
          $("#suggestions3").fadeOut();
        } else {
          $("#idcliente").val("N");
          $("#razon_social").val("");
          document.getElementById("razon_social").placeholder = "No Registrado";
          $("#domicilio_fiscal").val("");
          document.getElementById("domicilio_fiscal").placeholder =
            "No Registrado";
          // document.getElementById("btnAgregarArt").style.backgroundColor ="#35770c";
          document.getElementById("razon_social").style.Color = "#35770c";
          document.getElementById("razon_social").focus();
        }
      }
    );
  }
}


$(document).ready(function () {
  $('#numero_documento').on('input', function () {
    if ($(this).val().length == 11 && $('#tipo_doc_ide').val() == "6") {
      buscarRUCcliente();
    }
  });
});

function buscarRUCcliente() {
  var ruc = $("#numero_documento").val();

  $.ajax({
    url: "https://dniruc.apisperu.com/api/v1/ruc/" + ruc + "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFsbGluZXJwc29mdHdhcmVzYWNAZ21haWwuY29tIn0.CqzKsBSzn3-lV-AAnRjurJuGrR_ebBOIvnsEiuj7PMk",
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Suponiendo que la respuesta tiene la estructura que diste,
      // asignas los valores a tus inputs:
      $("#razon_social").val(data.razonSocial);
      $("#domicilio_fiscal").val(data.direccion);

      // Luego aquí puedes hacer tu consulta a tu propio backend, 
      // por ejemplo verificar si ese RUC ya está registrado en tu sistema, etc.
    },
    error: function (error) {
      console.log("Error al consultar RUC", error);
    }
  });

}

/* ---------------------------------------------------------------- */
//             FUNCION quitasuge2 (numero_documento)

function quitasuge2() {
  if ($("#razon_social").val() == "") {
    $("#suggestions2").fadeOut();
  }

  $("#suggestions2").fadeOut();
}

function quitasuge22() {
  if ($("#razon_social").val() == "") {
    $("#suggestions22").fadeOut();
  }

  $("#suggestions22").fadeOut();
}


/********************************************************************************/
/*                              FACTURA CLIENTE                                 */
/********************************************************************************/

/* ---------------------------------------------------------------- */
//                      FUNCION (numero_documento2)

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


$("#numero_documento").on("keyup", function () {
  var key = $(this).val();
  $("#suggestions22").fadeOut();
  $("#suggestions35").fadeOut();
  var dataString = "key=" + key;
  $.ajax({
    type: "POST",
    url: "../ajax/persona.php?op=buscarclienteRuc",
    data: dataString,

    success: function (data) {
      //Escribimos las sugerencias que nos manda la consulta
      $("#suggestions33").fadeIn().html(data);

      //Al hacer click en algua de las sugerencias
      $(".suggest-element").on("click", function () {
        //Obtenemos la id unica de la sugerencia pulsada
        var id = $(this).attr("id");
        //Editamos el valor del input con data de la sugerencia pulsada
        $("#numero_documento").val($("#" + id).attr("ndocumento"));
        $("#razon_social").val($("#" + id).attr("nombres"));
        $("#domicilio_fiscal").val("-");
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

function quitasuge1() {
  if ($("#numero_documento2").val() == "") {
    $("#suggestions").fadeOut();
  }

  $("#suggestions").fadeOut();
}

function quitasuge33() {
  if ($("#numero_documento").val() == "") {
    $("#suggestions33").fadeOut();
  }

  $("#suggestions33").fadeOut();
}

/* ---------------------------------------------------------------- */
//             FUNCION TIPO CAMBIO SUNAT (tipo_moneda_24)

// $("#tcambio").val("0");

function tipodecambiosunat() {
  if ($("#tipo_moneda_24").val() == "USD") {
    fechatcf = $("#fecha_emision_01").val();
    $.post(
      "../ajax/boleta.php?op=tcambiog&feccf=" + fechatcf,
      function (data, status) {
        data = JSON.parse(data);
        $("#tcambio").val(data.venta);
      }
    );
  } else {
    $("#tcambio").val("0");
  }
}

/* ---------------------------------------------------------------- */
//             FUNCION TRIBUTOCODNON (codigo_tributo_18_3)


function tributocodnon() {
  $("#codigo_tributo_h").val($("#codigo_tributo_18_3 option:selected").val());
  $("#nombre_tributo_h").val($("#codigo_tributo_18_3").text());

  tribD = $("#codigo_tributo_h").val();
  var id = document.getElementsByName("idarticulo[]");
  var codtrib = document.getElementsByName("codigotributo[]");
  var nombretrib = document.getElementsByName("afectacionigv[]");
  var cantiRe = document.getElementsByName("cantidadreal[]");

  if (tribD == "1000") {
    for (var i = 0; i < id.length; i++) {
      var codtrib2 = codtrib[i];
      var nombretrib2 = nombretrib[i];
      codtrib2.value = "1000";
      nombretrib2.value = "10";
      //cantiRe[i].value=cantidadreal;
    } //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM
  } else if (tribD == "9997") {
    for (var i = 0; i < id.length; i++) {
      var codtrib2 = codtrib[i];
      var nombretrib2 = nombretrib[i];
      codtrib2.value = "9997";
      nombretrib2.value = "20";
    } //PARA VALIDACION SI YA ESTA INGRESADO EL ITEM
  }

  console.log('here');
  modificarSubtotales();
}

/* ---------------------------------------------------------------- */
//                     FUNCION CAPTURAR HORA (hora)

function capturarhora() {
  var f = new Date();

  cad = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();

  $("#hora").val(cad);
}

/* ---------------------------------------------------------------- */
//                       FUNCION MAYUSCULA

function mayus(e) {
  e.value = e.value.toUpperCase();
}

/* ---------------------------------------------------------------- */
//                   FUNCION FOCUS (domicilio_fiscal)

function focusDir(e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("domicilio_fiscal").focus();
  }
}

/* ---------------------------------------------------------------- */
//                   FUNCION FOCUS (btnAgregarArt)

function agregarArt(e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    document.getElementById("btnAgregarArt").focus();
  }
}

/* ---------------------------------------------------------------- */
//                     FUNCION REALIZAR PAGO
var url_pago;

$('#btn_realizarpago').click(function () {

  $("#ccuotas").val("0");
  $("#tadc").val("0");
  $("#trans").val("0");
  $("#itemno").val("0");

  select_tipocomp = $('#d_tipocomprobante').val();

  if (select_tipocomp == 0) {
    $("#idcliente").val("N");
    $("#tipo_documento_06").val('03');

    // Si es boleta
    url_pago = "../ajax/boleta.php?op=guardaryeditarBoleta";

  } else if (select_tipocomp == 1) {

    // console.log('tipo_doc_ide', $('#tipo_doc_ide').val());

    var fecha_emision_01 = $("#fecha_emision_01").val();
    $("#fecha_emision").val(fecha_emision_01);
    //estyo en pos tmb  no va yas a presioanr ocntrol z

    var numero_boleta = $("#numero_boleta").val();
    $("#numero_factura").val(numero_boleta);

    var guia_remision_25 = $("#guia_remision_25").val();
    $("#guia_remision_29_2").val(guia_remision_25);

    var codigo_tributo_18_3 = $("#codigo_tributo_18_3").val();
    $("#nombre_trixbuto_4_p").val(codigo_tributo_18_3);

    var descripcion_leyenda_26_2 = $("#descripcion_leyenda_26_2").val();
    $("#descripcion_leyenda_2").val(descripcion_leyenda_26_2);

    var subtotal_boleta = $("#subtotal_boleta").val();
    $("#subtotal_factura").val(subtotal_boleta);

    // Si es Factura
    url_pago = "../ajax/factura.php?op=guardaryeditarFactura2";

  } else if (select_tipocomp == 2) {
    $("#idcliente").val("N");
    $("#tipo_documento_06").val(50);
    // Si es Nota de Pedido
    url_pago = "../ajax/notapedido.php?op=guardaryeditarBoleta";

  }
  // Swal.fire({
  //   title: "¿Desea realizar el pedido?",
  //   icon: "question",
  //   showCancelButton: true,
  //   confirmButtonColor: "#3085d6",
  //   cancelButtonColor: "#d33",
  //   confirmButtonText: "Sí, realizar pedido",
  //   cancelButtonText: "Cancelar",

  // }).then((result) => {
  //if (result.value) {
  capturarhora();

  //// SE ENVIO COMO TEXTO LOS MEDIOS DE PAGO !!!

  if (select_tipocomp == 1) {
    // var formData = new FormData();
    var formData = new FormData($("#formulario")[0]);

  } else {
    var formData = new FormData($("#formulario")[0]);

  }

  console.log('formdata', formData);
  for (var pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  Swal.fire({
    title: 'Enviando',
    html: 'Espere un momento.',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  $.ajax({
    url: url_pago,
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {

      Swal.close();

      iziToast.success({
        title: 'OK',
        icon: 'icon-person',
        position: 'topLeft',
        message: response,
      });

      // iziToast.success({
      //   title: 'Excelente',
      //   position: 'topRight',
      //   color: '#eef3f8',
      //   titleColor: '#000',
      //   messageColor: '#000',
      //   progressBarColor: '#181c41',
      //   iconText: '.',
      //   message: response,
      // });

      // swal.fire({
      //   title: "¡Éxito!",
      //   text: response,
      //   icon: "success",
      //   timer: 2000,
      //   showConfirmButton: false
      // });

      $('#modal_metodopago').modal('hide');

      limpiarFormulario();

      tipoimpresion();

      busqueda = '';

      listarProductos(busqueda);

    },
  });
  // }
  //});
})


/* ---------------------------------------------------------------- */
//                       FUNCION TIPO IMPRESION

function tipoimpresion() {

  if (select_tipocomp == 0) {

    // Si es boleta
    $.post(
      "../ajax/boleta.php?op=mostrarultimocomprobanteId",
      function (data, status) {
        data = JSON.parse(data);
        if (data != null) {
          $("#idultimocom").val(data.idboleta);
        } else {
          $("#idultimocom").val("");
        }

        if (data.tipoimpresion == "00") {
          var rutacarpeta = "../reportes/exTicketBoleta.php?id=" + data.idboleta;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreview2").modal("show");
          // Ocultar el modal después de 2 segundos
          setTimeout(function () {
            $("#modalPreview2").modal("hide");
          }, 2000);
        } else if (data.tipoimpresion == "01") {
          var rutacarpeta = "../reportes/exBoleta.php?id=" + data.idboleta;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreview2").modal("show");
          // Ocultar el modal después de 2 segundos
          setTimeout(function () {
            $("#modalPreview2").modal("hide");
          }, 2000);
        } else {
          var rutacarpeta =
            "../reportes/exBoletaCompleto.php?id=" + data.idboleta;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreview2").modal("show");
          // Ocultar el modal después de 2 segundos
          setTimeout(function () {
            $("#modalPreview2").modal("hide");
          }, 2000);
        }
      }
    );

  } else if (select_tipocomp == 1) {

    // Si es Factura
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
          // Ocultar el modal después de 2 segundos
          setTimeout(function () {
            $("#modalPreview2").modal("hide");
          }, 2000);
        } else if (data.tipoimpresion == "01") {
          var rutacarpeta = "../reportes/exFactura.php?id=" + data.idfactura;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreview2").modal("show");
          // Ocultar el modal después de 2 segundos
          setTimeout(function () {
            $("#modalPreview2").modal("hide");
          }, 2000);
        } else {
          var rutacarpeta =
            "../reportes/exFacturaCompleto.php?id=" + data.idfactura;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreview2").modal("show");
          // Ocultar el modal después de 2 segundos
          setTimeout(function () {
            $("#modalPreview2").modal("hide");
          }, 2000);
        }
      }
    );

  } else if (select_tipocomp == 2) {

    // Si es Nota de Pedido
    $.post(
      "../ajax/notapedido.php?op=mostrarultimocomprobanteId",
      function (data, status) {
        data = JSON.parse(data);
        if (data != null) {
          $("#idultimocom").val(data.idboleta);
        } else {
          $("#idultimocom").val("");
        }

        if (data.tipoimpresion == "00") {
          var rutacarpeta =
            "../reportes/exNotapedidoTicket.php?id=" + data.idboleta;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreviewXml").modal("show");
        } else if (data.tipoimpresion == "01") {
          var rutacarpeta = "../reportes/exNotapedido.php?id=" + data.idboleta;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreviewXml").modal("show");
        } else {
          var rutacarpeta =
            "../reportes/exNotapedidocompleto.php?id=" + data.idboleta;
          $("#modalCom").attr("src", rutacarpeta);
          $("#modalPreview2").modal("show");
          // Ocultar el modal después de 2 segundos
          setTimeout(function () {
            $("#modalPreview2").modal("hide");
          }, 2000);
        }
      }
    );

  }


}


/* ---------------------------------------------------------------- */
//                    FUNCION LIMPIAR FORMULARIO

function limpiarFormulario() {
  // $('#d_tipocomprobante').val(0);
  listarTodosProductos();
  $('#search_product').val('');

  $('.items-order').html('');

  $("#idcliente").val("N");
  $("#idpersona").val("");

  // $("#tipo_doc_ide").val(0);
  // focusI()
  $("#numero_documento").val('');
  $("#numero_documento2").val('');

  $("#razon_social").val('');
  $("#razon_social2").val('');
  $("#domicilio_fiscal").val('');
  $("#domicilio_fiscal2").val('');

  $('#descripcion_leyenda_26_2').val('');
  $('#descripcion_leyenda_2').val('');
  obtenerSerie();

  modificarSubtotales();

  numeroOrden = 1;

  $('#efectivo').val();
  $('#visa').val();
  $('#yape').val();
  $('#plin').val();
  $('#mastercard').val();
  $('#deposito').val();

  sessionStorage.removeItem('miContenidoHTML');
}

/********************************************************************************/
/*                                  PRODUCTOS                                   */
/********************************************************************************/

$('#btn_modalproducto').click(function (e) {
  e.preventDefault();

  obtenerAlmacenProd();
  obtenerCategoriaProd();
  obtenerUnidMedidaProd();

  $('#modal_agregarproducto').modal('show');
})

/* ---------------------------------------------------------------- */
//               OBTENER ALMACEN (idalmacennarticulo)

function obtenerAlmacenProd() {

  $.post(
    "../ajax/articulo.php?op=selectAlmacen&idempresa=" + $idempresa,
    function (r) {
      $("#idalmacennarticulo").html(r);
      //$('#idalmacennarticulo').selectpicker('refresh');
    }
  );
}

/* ---------------------------------------------------------------- */
//               OBTENER CATEGORIA (idfamilianarticulo)
function obtenerCategoriaProd() {

  $.post("../ajax/articulo.php?op=selectFamilia", function (r) {
    $("#idfamilianarticulo").html(r);
    //$('#idfamilianarticulo').selectpicker('refresh');
  });

}

/* ---------------------------------------------------------------- */
//               OBTENER UNIDAD MEDIDA (umedidanp)

function obtenerUnidMedidaProd() {

  $.post("../ajax/factura.php?op=selectunidadmedidanuevopro", function (r) {
    $("#umedidanp").html(r);
    //$('#umedidanp').selectpicker('refresh');
  });

}

/* ---------------------------------------------------------------- */
//     FUNCION GENERAR CODIGO INTERNO (codigonarticulonarticulo)

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



/* ---------------------------------------------------------------- */
//            FUNCION ACEPTAR NUM CON DOS DECIMALES

function NumCheck(e, field) {
  // Backspace = 8, Enter = 13, ’0′ = 48, ’9′ = 57, ‘.’ = 46

  key = e.keyCode ? e.keyCode : e.which;

  // if (e.keyCode === 13 && !e.shiftKey) {
  //   document.getElementById("precio_unitario[]").focus();
  // }

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
    if (field.val() === "") return false;

    regexp = /^[0-9]+$/;

    return regexp.test(field.val());
  }

  return false;
}

/* ---------------------------------------------------------------- */
//                EVENTO CLICK GUARDAR ARTICULO

$('#btn_savearticulo').click(function (e) {
  e.preventDefault();

  var formData = new FormData($("#formularionarticulo")[0]);

  $.ajax({
    url: "../ajax/articulo.php?op=guardarnuevoarticulo",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (datos) {
      Swal.fire({
        title: "Resultado",
        text: datos,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      $('#modal_agregarproducto').modal('hide');
      limpiarArticulo();
    },
  });
})

/* ---------------------------------------------------------------- */
//                  FUNCION LIMPIAR ARTICULO MODAL

function limpiarArticulo() {

  $("#nombrenarticulo").val("");
  $("#stocknarticulo").val("");
  $("#precioventanarticulo").val("");
  $("#codigonarticulonarticulo").val("");
  $("#descripcionnarticulo").val("");

}

$('#btn_preview').click(function () {
  // $('#modalPreview').modal('show');
  // PRUEBAS
})



/* ---------------------------------------------------------------- */
//                        Funcion redondeo

function redondeo(numero, decimales) {
  var flotante = parseFloat(numero);

  var resultado =
    Math.round(flotante * Math.pow(10, decimales)) / Math.pow(10, decimales);

  return resultado;
}


/********************************************************************************/
/*                            VENTAS COMPROBANTES                               */
/********************************************************************************/


function listarComprobante() {

  var tipocomprobante = $('#tipoComprobante').val();

  var tipo;

  if (tipocomprobante == 'recibo') {
    tipo = 'Boleta';
  } else if (tipocomprobante == 'factura') {
    tipo = 'Factura';
  } else if (tipocomprobante == 'nota') {
    tipo = 'NotaPedido';
  } else {
    tipo = 'Todos';

  }

  var table = $('#tbllistado').DataTable({
    bDestroy: true,
    iDisplayLength: 10, //Paginación
    order: [[0, "desc"]], //Ordenar (columna,orden)
    dom: 'Bfrtip', // Agregar el contenedor de botones
    buttons: [
      {
        extend: 'excelHtml5',
        text: 'Reporte Excel',
        className: 'btn-excel'
      },
      {
        extend: 'pdfHtml5',
        text: 'Reporte PDF',
        className: 'btn-pdf',
        customize: function (doc) {
          // Configurar el contenido del PDF antes de la exportación
          doc.content.splice(1, 0, {
            margin: [0, 0, 0, 12], // Márgenes para el nuevo contenido
            alignment: 'center',
            text: 'Reporte de Comprobantes'
          });

          // Configurar las columnas a exportar (excluyendo la columna 'id')
          var colCount = table.columns().header().length;
          var colIndices = Array.from({ length: colCount }, (_, i) => i).filter(i => i !== 0); // Excluir la primera columna ('id')

          doc.content[2].table.widths = colIndices.map(() => '*');
          doc.content[2].table.body.forEach(row => {
            row.splice(0, 1); // Eliminar la primera celda de cada fila (correspondiente a la columna 'id')
          });

          // Centrar la cabecera
          doc.content[2].table.headerRows = 1;
          doc.content[2].table.body[0].forEach(cell => {
            cell.alignment = 'center';
            cell.bold = true;
          });

          // Centrar las filas
          doc.content[2].table.body.slice(1).forEach(row => {
            row.forEach(cell => {
              cell.alignment = 'center';
            });
          });


        }
      }
    ],
    "ajax": {
      "url": urlconsumo + "pos.php?action=listarcomprobantesvarios",
      "type": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "data": function (d) {
        return JSON.stringify({
          "idempresa": $idempresa,
          "fechainicio": $('#fechaDesde').val(),
          "fechafinal": $('#fechaHasta').val(),
          "tipocomprobante": tipo,
          idusuario: sessionStorage.getItem("idusuario"),
          cargo: sessionStorage.getItem("cargo")
        });
      },
      "dataSrc": "ListaComprobantes"
    },
    "columns": [
      { "data": "id", "visible": false },
      { "data": "fecha" },
      {
        "data": "cliente",
        "render": function (data, type, row) {
          var displayText = '';

          if (data && type === 'display') {
            var maxLength = 15; // Definir la longitud máxima deseada
            displayText = data.length > maxLength ? data.substr(0, maxLength) + '...' : data;
          }

          return '<span title="' + data + '">' + displayText + '</span>';
        }
      },
      {
        "data": "productos",
        "render": function (data, type, row) {
          var displayText = '';

          if (data && type === 'display') {
            var maxLength = 20; // Definir la longitud máxima deseada
            displayText = data.length > maxLength ? data.substr(0, maxLength) + '...' : data;
          }

          return '<span title="' + data + '">' + displayText + '</span>';
        }
      },
      { "data": "unidades_vendidas" },
      {
        "data": "respuestaComprobante",
        "render": function (data, type, row) {
          if (type === 'display') {
            var displayText = '';
            var color = '';
            data = parseInt(data); // Convertimos data a número

            switch (data) {
              case 5:
                displayText = 'Aceptado';
                color = 'green';
                break;
              case 4:
                displayText = 'Enviando a sunat';
                color = 'orange';
                break;
              case 3:
                displayText = 'Anulado';
                color = 'red';
                break;
              case 0:
                displayText = 'Error Anular y Volverlo hacer';
                color = 'red';
                break;
              default:
                displayText = 'Otro Estado';
                break;
            }

            return '<span style="color:' + color + '">' + displayText + '</span>';
          } else {
            return data;  // En caso de ordenación, filtrado, etc., regresamos el dato original
          }
        }

      },
      { "data": "total" }

    ]

  });

}







// $.ajax(settings).done(function (response) {
//   console.log(response);
// });

$('#btn_modalventas').click(function (e) {
  e.preventDefault();

  $('#tipoComprobante').val('todos');
  $('#fechaDesde').val(today);
  $('#fechaHasta').val(today);

  listarComprobante();

})


$('#fechaDesde').change(function () {
  listarComprobante();
})
$('#fechaHasta').change(function () {
  listarComprobante();
})
$('#tipoComprobante').change(function () {
  listarComprobante();
})


/********************************************************************************/
/*                                 CLIENTES                                     */
/********************************************************************************/

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

$.post("../ajax/persona.php?op=selectDepartamento", function (r) {
  $("#iddepartamento").html(r);
  //$('#iddepartamento').selectpicker('refresh');
});

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

function llenarDistrito() {
  var idciudad = $("#idciudad option:selected").val();
  $.post("../ajax/persona.php?op=selectDistrito&id=" + idciudad, function (r) {
    $("#iddistrito").html(r);
    //$('#iddistrito').selectpicker('refresh');
  });
}

$("#formularioncliente").on("submit", function (e) {
  guardaryeditarcliente(e);
});

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

      limpiarcliente();
      agregarClientexRucNuevo();
    },
  });

  $('#container_datos').slideToggle();
  $("#ModalNcliente").modal("hide");
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

  $("#numero_documento2").val("");
  $("#razon_social3").val("");
  $("#domicilio_fiscal3").val("");
  $("#iddepartamento").val("");
  $("#idciudad").val("");
  $("#iddistrito").val("");
  $("#telefono1").val("");
  $("#email").val("");
  $("#nruc").val("");
  $("#numero_documento3").val("");
  //=========================
}


