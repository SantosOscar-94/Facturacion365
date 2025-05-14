<?php 
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";

Class Catalogo6
{
	//Implementamos nuestro constructor
	public function __construct()
	{

	}

	//Implementamos un método para insertar registros
	public function insertar($codigo, $descripcion , $abrev )
	{
		$sql="insert into catalogo6 (id, codigo, descripcion, abrev) values (null, '$codigo', '$descripcion', '$abrev')";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para editar registros
	public function editar($id, $codigo, $descripcion, $abrev)
	{
		$sql="update catalogo6 set codigo='$codigo', descripcion='$descripcion', abrev='$abrev' where id='$id'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para desactivar familias
	public function desactivar($id)
	{
		$sql="update catalogo6 set estado='0' where id='$id'";
		return ejecutarConsulta($sql);
	}

	//Implementamos un método para activar categorías
	public function activar($id)
	{
		$sql="update catalogo6 set estado='1' where id='$id'";
		return ejecutarConsulta($sql);
	}

	//Implementar un método para mostrar los datos de un registro a modificar
	public function mostrar($id)
	{
		$sql="select * from catalogo6 where id='$id'";
		return ejecutarConsultaSimpleFila($sql);
	}

	//Implementar un método para listar los registros
	public function listar()
	{
		$sql="select * from catalogo6";
		return ejecutarConsulta($sql);		
	}

	public function listar2()
{
    $sql="select id, codigo, descripcion, estado from catalogo6";
    return ejecutarConsulta($sql);		
}

	
}

?>