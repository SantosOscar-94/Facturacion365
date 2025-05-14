<title>POS | WFACX</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <!-- <link rel="stylesheet" href="../public/css/bootstrap.css"> -->
    <link rel="stylesheet" type="text/css" href="../public/datatables/jquery.dataTables.min.css">
    <link rel="stylesheet" href="../custom/modules/fontawesome6.1.1/css/all.css">
    <link rel="stylesheet" href="../custom/css/pos_style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />

    <link rel="icon" type="image/png" sizes="32x32" href="../custom/login/images/fev.png">

    <link rel="stylesheet" href="../public/css/autobusqueda.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
    <!-- <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"> -->

    <script>
// Declara una variable global para almacenar la respuesta
let resultadoGlobal = null;
// Función para realizar la solicitud fetch
async function obtenerIdsaldoini(idusuario) {
    try {
        const response = await fetch(`../ajax/cajachica.php?action=traeridsaldoini`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idusuario,
            }),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud fetch');
        }

        // Parsea la respuesta como JSON
        const data = await response.json();

        // Almacena la respuesta en la variable global
        resultadoGlobal = data;

        // Puedes realizar otras acciones con la respuesta si es necesario
        console.log('Resultado obtenido:', resultadoGlobal);
    } catch (error) {
        console.error('Error al realizar la solicitud fetch:', error.message);
    }
}
// Ejemplo de uso
const idusuario = sessionStorage.getItem("idusuario");
obtenerIdsaldoini(idusuario);

</script>