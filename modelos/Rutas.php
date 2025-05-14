<?php 
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";
 
Class Rutas
{
    //Implementamos nuestro constructor
    public function __construct()
    {
 
    }
 
    //Implementamos un método para insertar registros
    public function insertar($rutadata, $rutafirma, $rutaenvio, $rutarpta, $rutadatalt, $rutabaja, $rutaresumen, $rutadescargas, $rutaple, $idempresa, $unziprpta, $rutaarticulos, $rutalogo, $rutausuarios, $salidafacturas, $salidaboletas)
    {
        $sql="insert into rutas (
                rutadata, rutafirma, rutaenvio, rutarpta, rutadatalt, rutabaja, rutaresumen, rutadescargas, rutaple, idempresa, unziprpta, rutaarticulos, rutalogo, rutausuarios, salidafacturas, salidaboletas
                ) 
              values ('$rutadata','$rutafirma','$rutaenvio', '$rutarpta', '$rutadatalt', '$rutabaja', '$rutaresumen', '$rutadescargas', '$rutaple', '$idempresa', '$unziprpta',  '$rutaarticulos', '$rutalogo',  '$rutausuarios', '$salidafacturas', '$salidaboletas')";
        return ejecutarconsulta($sql);
    }
    
 
    //Implementamos un método para editar registros
    public function editar($idruta,$rutadata,$rutafirma,$rutaenvio, $rutarpta, $rutadatalt, $rutabaja, $rutaresumen, $rutadescargas, $rutaple,$idempresa, $unziprpta , $rutaarticulos, $rutalogo,  $rutausuarios, $salidafacturas, $salidaboletas)
    {
        $sql="update rutas 
        set 
        rutadata='$rutadata',
        rutafirma='$rutafirma',
         rutaenvio='$rutaenvio',
         rutarpta='$rutarpta',
         rutadatalt='$rutadatalt',
         rutabaja='$rutabaja',
         rutaresumen='$rutaresumen',
         rutadescargas='$rutadescargas',
         rutaple='$rutaple',
         idempresa='$idempresa',
         unziprpta='$unziprpta',
         rutaarticulos='$rutaarticulos', 
         rutalogo='$rutalogo',  
         rutausuarios='$rutausuarios',
         salidafacturas='$salidafacturas',
         salidaboletas='$salidaboletas'
        where 
        idruta='$idruta'";
        return ejecutarConsulta($sql);
    }
 
   
    //Implementar un método para mostrar los datos de un registro a modificar
    public function mostrar($idruta)
    {
        $sql="select
         * 
        from
        rutas  
        where 
        idruta='$idruta'";
        return ejecutarConsultaSimpleFila($sql);
    }

    //Implementar un método para mostrar los datos de un registro a modificar
    public function mostrar2($idempresa)
    {
        $sql="select * from rutas r inner join empresa e on r.idempresa=e.idempresa  
        where 
        e.idempresa='$idempresa'";
        return ejecutarConsulta($sql);
    }

    public function listar($idempresa)
    {
        $sql="select * from rutas r inner join empresa e on r.idempresa=e.idempresa where e.idempresa='$idempresa'";
        return ejecutarConsulta($sql);      
    }
 
 
}
 
?>