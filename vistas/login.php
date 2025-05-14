<!DOCTYPE html>
<html lang="es">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<!-- SEO meta tags -->
	<title>Demo Sistema de Facturación Electrónica y Gestión de Inventario</title>
	<meta name="description" content="Demo de un sistema robusto de facturación electrónica y gestión de inventario. Mejora la eficiencia de tu negocio con nuestra solución." />
	<meta name="keywords" content="facturación electrónica, gestión de inventario, sistema de facturación, demo">
	<meta name="author" content="WFACX">

	<!-- External CSS -->
	<link type="text/css" rel="stylesheet" href="../custom/login/css/bootstrap.min.css">
	<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">

	<!-- Favicon icon -->
	<link rel="icon" type="image/png" sizes="32x32" href="../custom/login/images/fev.png">

	<!-- Custom Stylesheet -->
	<link type="text/css" rel="stylesheet" href="../custom/login/login-nine.css">
	<link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
	<!-- <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"> -->
    <link rel="manifest" href="../manifest.json">
	<!-- Open Graph (para redes sociales como Facebook) -->
	<meta property="og:title" content="Demo Sistema de Facturación Electrónica y Gestión de Inventario" />
	<meta property="og:description"
		content="Demo de un sistema robusto de facturación electrónica y gestión de inventario. Mejora la eficiencia de tu negocio con nuestra solución." />
	<meta property="og:image" content="https://wfacx.com/seo/Wfacx_Portada.png" />
	<meta property="og:url" content="https://wfacx.com/sistema/vistas/login" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="Demo Sistema de Facturación Electrónica y Gestión de Inventario">
	<meta name="twitter:description"
		content="Demo de un sistema robusto de facturación electrónica y gestión de inventario. Mejora la eficiencia de tu negocio con nuestra solución.">
	<meta name="twitter:image" content="https://wfacx.com/seo/Wfacx_Portada.png">

    


	<!-- JSON-LD para datos estructurados -->
	<script type="application/ld+json">
		{
		  "@context": "http://schema.org",
		  "@type": "SoftwareApplication",
		  "name": "Sistema de Facturación Electrónica y Gestión de Inventario",
		  "description": "Demo de un sistema robusto de facturación electrónica y gestión de inventario.",
		  "applicationCategory": "BusinessApplication",
		  "operatingSystem": "Web",
		  "screenshot": "https://wfacx.com/seo/Wfacx_Portada.png",
		  "offers": {
			"@type": "Offer",
			"price": "450.00",
			"priceCurrency": "PEN",
			"availability": "http://schema.org/InStock",
			"url": "https://wfacx.com/sistema/vistas/login"
		  }
		}
		</script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
		
		  <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('../service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registrado con éxito:', registration);
                })
                .catch((error) => {
                    console.error('Error al registrar el Service Worker:', error);
                });
        }
     </script>
     
     <!-- Agrega el siguiente código en tu archivo PHP -->
<script>
  window.addEventListener('DOMContentLoaded', (event) => {
    // Verifica si el navegador admite la instalación de PWA y si el usuario no ha instalado la aplicación
    if ('standalone' in window.navigator && !window.navigator.standalone && !window.incognito) {
      // Muestra un botón de instalación
      const installButton = document.createElement('button');
      installButton.innerText = 'Instalar App';
      installButton.addEventListener('click', () => {
        // Intenta mostrar el mensaje de instalación
        if ('beforeinstallprompt' in window) {
          window.beforeinstallprompt.prompt();
        }
      });

      // Agrega la alerta y el botón al cuerpo del documento
      const alertText = '¡Instala nuestra aplicación agregándola a tu pantalla de inicio!';
      const alertMessage = `${alertText}\n\n[Botón de Instalación]`;
      const combinedAlert = `${alertMessage}\n\n[Botón de Instalación]`;

      alert(combinedAlert);
    }
  });
</script>

</head>

			<body>

				<div class="loader">
					<div class="loader_div"></div>
				</div>

				<div class="login_wrapper">
					<div class="row no-gutters">

						<div class="col-md-6 mobile-hidden">
							<div class="login_left">
								<div class="login_left_img"><img src="../custom/login/images/login-bg.jpg" alt="login background">
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="login_box">
								<a href="#" class="logo_text">
									<img src="https://wfacx.com/assets/img/logo.png" alt="">
								</a>
								<div class="login_form">
									<div class="login_form_inner">
										<h3>Bienvenido <span>inicia sesión</span></h3>

										<form method="post" id="frmAcceso" name="frmAcceso"
											onload="document.frmAcceso.logina.focus()" action="">
											<div class="form-group">
												<input id="logina" name="logina" value="admin" type="text" class="input-text"
													placeholder="Usuario">
													<i class="fa fa-envelope"></i>
													<span class="focus-border"></span>
											</div>
											<div class="form-group">
												<input type="password" id="clavea" value="chezter31" name="clavea" class="input-text"
													placeholder="Contraseña">
													<i class="fa fa-lock"></i>
													<span class="focus-border"></span>
											</div>
											<div class="checkbox clearfix">
												<div class="form-check checkbox-theme">
													<input class="form-check-input" type="checkbox" value="" id="rememberMe">
														<label class="form-check-label" for="rememberMe">
															Recordar clave
														</label>
												</div>
												<a href="#">Recuperar contraseña</a>
											</div>
											<div class="form-group">
												<button id="submit" type="submit"
													class="btn-md btn-theme btn-block">Ingresar</button>
											</div>
										</form>
									</div>
									<div hidden class="or_options text-center">
										<div class="or_text"><span>Redes Sociales</span></div>
										<ul class="social-list clearfix">
											<li><a class="s_facebook" href="#">Facebook</a></li>
											<li><a class="s_twitter" href="#">Telegram</a></li>
											<li><a class="s_google" href="#">WhatsApp</a></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>




	<script src="../custom/login/js/jquery-3.7.1.min.js"></script>
	<script src="../custom/login/js/popper.min.js"></script>
	<script src="../custom/login/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="scripts/login.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
	<!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script> -->

	<script type="text/javascript">
		$(window).on("load", function () {
			$(".loader").fadeOut("slow");
		});
	</script>




	<script>

			$('#logina').focus();

			// Parpadear automáticamente el campo 'logina' cuando se carga la página
			$('#logina').addClass('blinking');

			var current = null;
			document.querySelector('#logina').addEventListener('focus', function (e) {
			if (current) current.pause();
			current = anime({
				targets: 'path',
			strokeDashoffset: {
				value: 0,
			duration: 700,
			easing: 'easeOutQuart'
				},
			strokeDasharray: {
				value: '240 1386',
			duration: 700,
			easing: 'easeOutQuart'
				}
			});
		});
			document.querySelector('#clavea').addEventListener('focus', function (e) {
			if (current) current.pause();
			current = anime({
				targets: 'path',
			strokeDashoffset: {
				value: -336,
			duration: 700,
			easing: 'easeOutQuart'
				},
			strokeDasharray: {
				value: '240 1386',
			duration: 700,
			easing: 'easeOutQuart'
				}
			});
		});
			document.querySelector('#submit').addEventListener('focus', function (e) {
			if (current) current.pause();
			current = anime({
				targets: 'path',
			strokeDashoffset: {
				value: -730,
			duration: 700,
			easing: 'easeOutQuart'
				},
			strokeDasharray: {
				value: '530 1386',
			duration: 700,
			easing: 'easeOutQuart'
				}
			});
		});


	</script>

		<script>
			sessionStorage.clear();
		</script>


	</body>

</html>