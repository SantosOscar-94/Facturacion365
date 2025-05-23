<?php
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";

class Familia
{
	//Implementamos nuestro constructor
	public function __construct()
	{

	}

	//Implementamos un método para insertar registros
	public function insertarCategoria($descrip, $idempresa, $estado)
	{
		$sql = "insert into familia (descripcion, idempresa, estado)
		values ('$descrip', '$idempresa', 1);";
		return ejecutarConsulta($sql);
	}



	public function insertaralmacen($nombre, $direc, $idempresa)
	{
		$sql = "insert into almacen (nombre, direccion, idempresa)
		values ('$nombre', '$direc', '$idempresa')";
		return ejecutarConsulta($sql);
	}

	public function insertaraunidad($nombre, $abre, $equivalencia)
	{
		$sql = "insert into umedida (nombreum, abre, equivalencia)
		values ('$nombre', '$abre', '$equivalencia')";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para editar registros
	public function editar($idfamilia, $nombre)
	{
		$sql = "update familia set descripcion='$nombre' where idfamilia='$idfamilia'";
		return ejecutarConsulta($sql);
	}


	//Implementamos un método para desactivar familias
	public function desactivar($idfamilia)
	{
		$sql = "update familia SET estado='0' where idfamilia='$idfamilia'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para activar categorías
	public function activar($idfamilia)
	{
		$sql = "update familia SET estado='1' where idfamilia='$idfamilia'";
		return ejecutarConsulta($sql);
	}

	//Implementar un método para mostrar los datos de un registro a modificar
	public function mostrar($idfamilia)
	{
		$sql = "select * from familia where idfamilia='$idfamilia'";
		return ejecutarConsultaSimpleFila($sql);
	}

	//validar duplicado
	public function validarCategoria($nombre)
	{
		$sql = "select * from familia where descripcion='$nombre'";
		return ejecutarConsultaSimpleFila($sql);
	}


	//Implementar un método para listar los registros
	public function listar($idempresa)
	{
		$sql = "select * from familia where idempresa = '$idempresa' ";
		return ejecutarConsulta($sql);
	}
	//Implementar un método para listar los registros y mostrar en el select
	public function select()
	{
		$sql = "select * from familia where estado=1 and not idfamilia='0' order by idfamilia desc";
		return ejecutarConsulta($sql);
	}




}

?>