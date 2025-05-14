<?php 
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";
 
Class Guiaremision
{
    //Implementamos nuestro constructor
    public function __construct()
    {
 
    }
 



 //Implementamos un método para insertar registros para factura
    public function insertar($idguia,$serie,$numero, $pllegada, $destinatario, $nruc, $ppartida, $fecha, $ncomprobante, $ocompra, $motivo, $idcomprobante,$idserie)


    {

        $sw=true;

        $sql="insert into guia (snumero,  pllegada, destinatario, nruc, ppartida, fechat, ncomprobante, ocompra, motivo, idcomprobante)
        values ('$serie-$numero', '$pllegada', '$destinatario', '$nruc', '$ppartida', '$fecha', '$ncomprobante', '$ocompra', '$motivo', '$idcomprobante')";
        //return ejecutarConsulta($sql);
        $idguianew=ejecutarConsulta_retornarID($sql);
 
        
        //Para actualizar numeracion de las series de la factura
         $sql_update_comprobante="update factura set idguia='$idguianew', guia_remision_29_2='$serie-$numero'  where idfactura='$idcomprobante'";
         ejecutarConsulta($sql_update_comprobante) or $sw = false;
         //Fin


        //Para actualizar numeracion de las series de la factura
         $sql_update_numeracion="update numeracion set numero='$numero' where idnumeracion='$idserie'";
         ejecutarConsulta($sql_update_numeracion) or $sw = false;
         //Fin
         return $sw;

    }


function buscarComprobante(){
    
    $sql="select f.idfactura, p.tipo_documento as tdcliente, p.numero_documento as ndcliente, p.razon_social as rzcliente ,p.domicilio_fiscal as domcliente, f.tipo_documento_07 as tipocomp, f.numeracion_08 as numerodoc, format(f.total_operaciones_gravadas_monto_18_2,2) as subtotal, format(f.sumatoria_igv_22_1,2) as igv, format(f.importe_total_venta_27,2) as total from factura f inner join persona p on f.idcliente=p.idpersona where p.tipo_persona='cliente' and f.estado='1' order by f.idfactura desc";
        return ejecutarConsulta($sql); 
    
}

function buscarComprobanteId($idcomprobante){
    
    $sql="select  f.idfactura, p.tipo_documento, p.numero_documento, p.razon_social,p.domicilio_fiscal as domicilio, f.tipo_documento_07 as tipocomp, f.numeracion_08 as numerodoc,  df.cantidad_item_12 as cantidad, a.codigo, a.nombre as descripcion, df.valor_uni_item_14 as vui, df.igv_item as igvi, df.precio_venta_item_15_2 as pvi, df.valor_venta_item_21 as vvi, f.total_operaciones_gravadas_monto_18_2 as subtotal, f.sumatoria_igv_22_1 as igv, f.importe_total_venta_27 as total, a.unidad_medida from factura f inner join detalle_fac_art df on f.idfactura=df.idfactura inner join articulo a on df.idarticulo=a.idarticulo inner join persona p on f.idcliente=p.idpersona where p.tipo_persona='cliente'  and f.idfactura='$idcomprobante' and f.estado='1'";
        return ejecutarConsulta($sql); 
    
}

     //Implementar un método para listar los registros
    public function listar()
    {
        $sql="select g.idguia, g.fechat, g.snumero, g.destinatario , g.ncomprobante, g.estado from guia g inner join factura f on g.idcomprobante=f.idfactura order by g.idguia desc";
        return ejecutarConsulta($sql);      
    }
    
    public function cabecera($idguia){
        $sql="select  idguia, snumero, pllegada, destinatario, nruc, ppartida, fechat, ncomprobante, motivo ,estado FROM guia where idguia='$idguia'";
        return ejecutarConsulta($sql);
    }

    public function ventadetalle($idguia){
        $sql="select a.nombre as articulo, a.codigo, format(dfa.cantidad_item_12,2) as cantidad_item_12, dfa.valor_uni_item_14, format((dfa.cantidad_item_12 * dfa.precio_venta_item_15_2),2) as subtotal, dfa.precio_venta_item_15_2, dfa.valor_venta_item_21, a.unidad_medida from detalle_fac_art dfa INNER JOIN articulo a on dfa.idarticulo=a.idarticulo inner join factura f on f.idfactura=dfa.idfactura where f.idguia='$idguia'";
        return ejecutarConsulta($sql);
    }
    
}
?>