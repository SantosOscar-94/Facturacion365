<?php
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";

class Persona
{
	//Implementamos nuestro constructor
	public function __construct()
	{

	}

	//Implementamos un método para insertar registros
	public function insertar($tipo_persona, $nombres, $apellidos, $tipo_documento, $numero_documento, $razon_social, $nombre_comercial, $domicilio_fiscal, $departamento, $ciudad, $distrito, $telefono1, $telefono2, $email)
	{
		$sql = "insert into persona (tipo_persona, nombres,apellidos, tipo_documento, numero_documento,razon_social,nombre_comercial, domicilio_fiscal,departamento,ciudad,distrito, telefono1,telefono2, email)
		values ('$tipo_persona','$nombres','$apellidos', '$tipo_documento', '$numero_documento','$razon_social','$nombre_comercial','$domicilio_fiscal','$departamento','$ciudad','$distrito', '$telefono1','$telefono2','$email')";
		return ejecutarConsulta($sql);
	}



	public function insertarnproveedor($tipo_persona, $numero_documento, $razon_social)
	{
		$sql = "insert into persona (
		tipo_persona,
		tipo_documento, 
		numero_documento, 
		razon_social)
		values (
		'$tipo_persona', 
		'6',
		'$numero_documento',
		'$razon_social')";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para insertar registros
	public function insertardeFactura($nombres, $tipo_documento, $numero_documento, $domicilio_fiscal)
	{
		$sql = "insert into persona 
		(tipo_persona, 
			nombres, 
			apellidos, 
			tipo_documento, 
			numero_documento,
			razon_social,
			nombre_comercial, 
			domicilio_fiscal,
			departamento,
			ciudad,
			distrito, 
			telefono1,
			telefono2, 
			email)
		values ('cliente','','','$tipo_documento', '$numero_documento','$nombres','$nombres','$domicilio_fiscal','','','', '-','-','')";
		return ejecutarConsulta($sql);
	}

	public function insertardeBoleta($nombres, $tipo_documento, $numero_documento, $domicilio_fiscal)
	{
		$sql = "insert into persona 
		(tipo_persona, 
			nombres, 
			apellidos, 
			tipo_documento, 
			numero_documento,
			razon_social,
			nombre_comercial, 
			domicilio_fiscal,
			departamento,
			ciudad,
			distrito, 
			telefono1,
			telefono2, 
			email)
		values ('CLIENTE','$nombres','$nombres','$tipo_documento', '$numero_documento','$nombres','$nombres','$domicilio_fiscal','','','', '-','-','')";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para editar registros
	public function editar($idpersona, $tipo_persona, $nombres, $apellidos, $tipo_documento, $numero_documento, $razon_social, $nombre_comercial, $domicilio_fiscal, $departamento, $ciudad, $distrito, $telefono1, $telefono2, $email)
	{
		$sql = "update persona SET tipo_persona='$tipo_persona',nombres='$nombres',apellidos='$apellidos', tipo_documento='$tipo_documento', numero_documento='$numero_documento',razon_social='$razon_social',nombre_comercial='$nombre_comercial', domicilio_fiscal='$domicilio_fiscal', departamento='$departamento', ciudad='$ciudad', distrito='$distrito', telefono1='$telefono1', telefono2='$telefono2', email='$email' where idpersona='$idpersona'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para eliminar persnoa
	public function eliminar($idpersona)
	{
		$sql = "delete from persona where idpersona='$idpersona'";
		return ejecutarConsulta($sql);
	}


	//Implementar un método para mostrar los datos de un registro a modificar
	public function mostrar($idpersona)
	{

		$sql = "select idpersona, nombres, apellidos, tipo_documento, numero_documento, razon_social, nombre_comercial, domicilio_fiscal, departamento, ciudad, distrito , telefono1, telefono2, email from persona where idpersona='$idpersona' and estado='1'";
		return ejecutarConsultaSimpleFila($sql);
	}

	public function mostrarId()
	{
		$sql = "select 
		idpersona 
		from 
		persona 
		where 
		tipo_persona='CLIENTE' and tipo_documento not in(6)
		order by 
		idpersona 
		desc  
		limit 0,1";
		return ejecutarConsulta($sql);
	}

	public function mostrarIdFactura()
	{
		$sql = "select 
		idpersona 
		from 
		persona 
		where 
		tipo_persona='cliente' and tipo_documento not in(0, 1, 6, 7)
		order by 
		idpersona 
		desc  
		limit 0,1";
		return ejecutarConsulta($sql);
	}


	public function mostrarIdVarios()
	{
		$sql = "select 
		* 
		from 
		persona 
		where
		 tipo_persona='CLIENTE' and idpersona='1'";
		return ejecutarConsultaSimpleFila($sql);
	}

	//Implementar un método para listar los registros
	public function listarp()
	{
		$sql = "select * from 
		persona 
		p inner join catalogo6 ct6 on p.tipo_documento=ct6.codigo 
		where 
		p.tipo_persona='PROVEEDOR' order by idpersona desc";
		return ejecutarConsulta($sql);
	}

	public function listarc()
	{
		$sql = "select * from persona p
            inner join catalogo6 ct6 on p.tipo_documento = ct6.codigo
            where p.tipo_persona = 'cliente'
            group by p.numero_documento";
		return ejecutarConsulta($sql);
	}

	public function listarclienteFact($nombre)
	{
		$sql = "select * from 
		persona p inner join catalogo6 ct6 on p.tipo_documento=ct6.codigo 
		where 
		p.tipo_persona='CLIENTE' and p.estado='1' and p.razon_social like '$nombre%'";
		return ejecutarConsulta($sql);
	}

	//Busca por numero de cliente el nombre
	public function listarcnumdocu($numdocumento)
	{
		$sql = "select * from persona where tipo_persona='CLIENTE' and num_documento='$numdocumento' and estado='2'";
		return ejecutarConsulta($sql);
	}

	//Busca por nombre de cliente el numero de documento
	public function listarcnom($nombre)
	{
		$sql = "select * from persona where tipo_persona='Cliente' and nombre='$nombre' and estado='1'";
		return ejecutarConsulta($sql);
	}


	//Implementamos un método para desactivar registros
	public function desactivar($idpersona)
	{
		$sql = "update persona SET estado='0' where idpersona='$idpersona'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para activar registros
	public function activar($idpersona)
	{
		$sql = "update persona SET estado='1' where idpersona='$idpersona'";
		return ejecutarConsulta($sql);
	}


	public function listarCliVenta()
	{
		$sql = "select 
        idpersona, 
        razon_social, 
        numero_documento, 
        domicilio_fiscal, 
        tipo_documento 
        from 
        persona where tipo_persona='cliente'
        and tipo_documento='6'";
		return ejecutarConsulta($sql);
	}


	//Busca por numero de cliente el documento 
	public function validarCliente($numdocumento)
	{
		$sql = "select numero_documento from persona where tipo_persona='CLIENTE' and numero_documento='$numdocumento' and estado='1'";
		return ejecutarConsultaSimpleFila($sql);
	}

	//Busca por numero de cliente el documento 
	public function validarProveedor($numdocumento)
	{
		$sql = "select numero_documento from persona where tipo_persona='PROVEEDOR' and numero_documento='$numdocumento'";
		return ejecutarConsultaSimpleFila($sql);
	}

	public function buscarClientexDocFactura($doc)
	{
		$sql = "select 
		* 
		from persona p inner join catalogo6 ct6 on p.tipo_documento=ct6.codigo 
		where 
		p.tipo_persona='CLIENTE' and p.numero_documento='$doc' and tipo_documento='6' and  p.estado='1' ";
		return ejecutarConsultaSimpleFila($sql);
	}



	public function buscarClientexDocFacturaNuevos()
	{
		$sql = "select * from persona p inner join catalogo6 ct6 on p.tipo_documento=ct6.codigo where 
		p.tipo_persona='CLIENTE' and  tipo_documento='6' and p.estado='1' order by idpersona desc limit 1";
		return ejecutarConsultaSimpleFila($sql);
	}

	public function buscarClientexDocBoleta($doc)
	{
		$sql = "select * from persona p inner join catalogo6 ct6 on p.tipo_documento=ct6.codigo where p.tipo_persona='CLIENTE' and p.numero_documento='$doc' and  tipo_documento in('1','4','7','A')  and  p.estado='1'";
		return ejecutarConsultaSimpleFila($sql);
	}


	public function buscarCliente($key)
{
    $connect = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
    $html = '';
    $cc = 1;

    $result = $connect->query(
        'SELECT tipo_documento, ' .
        '(CASE WHEN tipo_documento = "6" THEN razon_social ELSE nombres END) AS dniOrRuc, ' .
        'numero_documento, domicilio_fiscal, nombres, idpersona, email ' .
        'FROM persona ' .
        'WHERE tipo_persona = "cliente" AND ' .
        '(tipo_documento = "6" OR tipo_documento = "1") AND ' .
        'numero_documento != "-" AND ' . // Excluye registros con "-"
        '(numero_documento LIKE "%' . strip_tags($key) . '%" OR ' .
        'nombres LIKE "%' . strip_tags($key) . '%" OR ' .
        'apellidos LIKE "%' . strip_tags($key) . '%") ' .
        'AND NOT idpersona = 1 ' .
        'GROUP BY numero_documento, tipo_documento ' . // Agrupa por número de documento y tipo de documento
        'LIMIT 8'
    );

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $html .= '<div ><a class="suggest-element" ndocumento="' . utf8_encode($row['numero_documento']) . '" ' .
                'ncomercial="' . utf8_encode($row['dniOrRuc']) . '" ' .
                'domicilio="' . utf8_encode($row['domicilio_fiscal']) . '" ' .
                'nombres="' . utf8_encode($row['nombres']) . '" ' .
                'id="' . $row['idpersona'] . '" ' .
                'email="' . $row['email'] . '">' . utf8_encode($row['dniOrRuc']) . '</a></div>';
            $cc = $cc + 1;
        }
    }
    echo $html;
}





	public function buscarclientenombre($key)
	{

		define('DB_SERVER', 'localhost');
		define('DB_SERVER_USERNAME', 'YOUR DATA BASE USERNAME');
		define('DB_SERVER_PASSWORD', 'YOUR DATA BASE PASSWORD');
		define('DB_DATABASE', 'YOUR DATA BASE NAME');

		$connexion = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

		$html = '';

		$result = $connexion->query(
			'select * from persona where tipo_persona="cliente" and tipo_documento="6" and razon_social like "%' . strip_tags($key) . '%" and not idpersona="1" limit 8'
		);
		if ($result->num_rows > 0) {
			while ($row = $result->fetch_assoc()) {
				$html .= '<div><a class="suggest-element"  ndocumento="' . utf8_encode($row['numero_documento']) . '"  ncomercial="' . utf8_encode($row['razon_social']) . '"  domicilio="' . utf8_encode($row['domicilio_fiscal']) . '" id="' . $row['idpersona'] . '" email="' . $row['email'] . '">' . utf8_encode($row['razon_social']) . '</a></div>';
			}
		}
		echo $html;
	}


	public function combocliente()
	{

		$sql = "select * from persona where tipo_persona='cliente'";
		return ejecutarConsulta($sql);
	}






}

?>