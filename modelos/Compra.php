
<?php 
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";
 
Class Compra
{
    //Implementamos nuestro constructor
    public function __construct()
    {
 
    }
 
    //Implementamos un método para insertar registros
    public function insertar($idusuario, $idproveedor, $fecha_emision, $tipo_comprobante, $serie_comprobante, $num_comprobante, $guia, $subtotal_compra, $total_igv, $total_compra, $idarticulo, $valor_unitario,  $cantidad, $subtotalBD,  $codigo, $unidad_medida, $tcambio, $hora, $moneda, $idempresa)
    {


    

        $sql="insert into compra (
            idusuario, 
            idproveedor,
            fecha, 
            tipo_documento, 
            serie, 
            numero, 
            guia, 
            subtotal, 
            igv, 
            total, 
            subtotal_$, 
            igv_$, 
            total_$, 
            tcambio,
            moneda, 
            idempresa
            ) 
          values 
            (
          '$idusuario', 
          '$idproveedor', 
          '$fecha_emision $hora', 
          '$tipo_comprobante', 
          '$serie_comprobante', 
          '$num_comprobante', 
          '$guia', 
          '$subtotal_compra', 
          '$total_igv', 
          '$total_compra', 
          '0', 
          '0',
          '0', 
          '$tcambio',
          '$moneda',
          '$idempresa'
          )";
        //return ejecutarConsulta($sql);
        $idcompranew=ejecutarConsulta_retornarID($sql);
        $num_elementos=0;
        $sw=true;
        while ($num_elementos < count($idarticulo))
        {
          if ($moneda=="USD") { $valor_unitario[$num_elementos]=$valor_unitario[$num_elementos] * $tcambio; }

            $sql_detalle = "insert into 
            detalle_compra_producto 
            (
              idcompra, 
              idarticulo, 
              valor_unitario, 
              cantidad, 
              subtotal, 
              valor_unitario_$, 
              subtotal_$) 
            values
             ('$idcompranew', 
             '$idarticulo[$num_elementos]',
             '$valor_unitario[$num_elementos]', 
             '$cantidad[$num_elementos]', 
             valor_unitario * '$cantidad[$num_elementos]',
             '0',
             '0')";



            // $sql_update_articulo_1="update 
            // articulo 
            // set 
            // valor_fin_kardex=(select valor_final from kardex where idarticulo='$idarticulo[$num_elementos]' and transaccion='COMPRA' order by idkardex desc limit 1), 
            // precio_final_kardex=(select costo_2 from kardex where idarticulo='$idarticulo[$num_elementos]' order by idkardex desc limit 1)
            // where idarticulo='$idarticulo[$num_elementos]'";
            // ejecutarConsulta($sql_update_articulo_1) or $sw = false;


             //Guardar en Kardex
            $sql_kardex="insert into 
            kardex 
            (
              idcomprobante, 
              idarticulo, 
              transaccion, 
              codigo, 
              fecha, 
              tipo_documento, 
              numero_doc, 
              cantidad, 
              costo_1, 
              unidad_medida, 
              saldo_final, 
              costo_2, 
              valor_final,
              idempresa,
              tcambio,
              moneda
              )
             values 
             ('$idcompranew',
             '$idarticulo[$num_elementos]',
             'COMPRA', 
             '$codigo[$num_elementos]', 
             '$fecha_emision', 
             '$tipo_comprobante', 
             '$serie_comprobante-$num_comprobante', 
             '$cantidad[$num_elementos]', 
             '$valor_unitario[$num_elementos]', 
             '$unidad_medida[$num_elementos]',

        (select saldo_finu +  '$cantidad[$num_elementos]' from articulo where idarticulo='$idarticulo[$num_elementos]' ),

        (select saldo_finu * precio_final_kardex + ( '$valor_unitario[$num_elementos]' * '$cantidad[$num_elementos]') from articulo where idarticulo='$idarticulo[$num_elementos]')/(select  saldo_finu + '$cantidad[$num_elementos]' from articulo where idarticulo='$idarticulo[$num_elementos]'), 

             saldo_final * costo_2,

             '$idempresa' ,
             '$tcambio',
             '$moneda'

           )";

//FORMULA PARA ACTUALIZAR COSTO DE COMPRA Y VALOR FINAL ========================
// (COSTO DE COMPRA * CANTIDAD)+VALOR FINAL KARDEX / (SALDO FINAL + CANTIDAD)

            $sql_update_articulo="update 
            articulo 
            set 
            valor_fin_kardex=(select valor_final from kardex where idarticulo='$idarticulo[$num_elementos]' and transaccion='COMPRA' order by idkardex desc limit 1), 
            precio_final_kardex=(select costo_2 from kardex where idarticulo='$idarticulo[$num_elementos]' order by idkardex desc limit 1),
            saldo_finu=saldo_finu + '$cantidad[$num_elementos]', 
            comprast=comprast + '$cantidad[$num_elementos]', 
            valor_finu=((saldo_iniu + comprast) - ventast) * precio_final_kardex, 
            stock=saldo_finu
            where idarticulo='$idarticulo[$num_elementos]'";


            // valor_fin_kardex=(select valor_final from kardex where idarticulo='$idarticulo[$num_elementos]' and transaccion='COMPRA' order by idkardex desc limit 1), 
            // precio_final_kardex=(select costo_2 from kardex where idarticulo='$idarticulo[$num_elementos]' order by idkardex desc limit 1)
            // where idarticulo='$idarticulo[$num_elementos]'";

                            
            ejecutarConsulta($sql_detalle) or $sw = false;
            ejecutarConsulta($sql_kardex) or $sw = false;
            ejecutarConsulta($sql_update_articulo) or $sw = false;
            $num_elementos=$num_elementos + 1;
        }
 
        return $idcompranew;

  //  } else { //INTERMEDIO IF TIPO DE MONEDA CASO DOLARES

//       $sql="insert into compra (
//           idusuario, 
//           idproveedor,
//           fecha, 
//           tipo_documento, 
//           serie, 
//           numero, 
//           guia, 
//           subtotal, 
//           igv, 
//           total, 
//           subtotal_$, 
//           igv_$, 
//           total_$, 
//           tcambio,
//           moneda,
//           idempresa
//           ) 
//         values 
//         ('$idusuario', 
//         '$idproveedor', 
//         '$fecha_emision $hora', 
//         '$tipo_comprobante', 
//         '$serie_comprobante', 
//         '$num_comprobante', 
//         '$guia', 
//         '$subtotal_compra' * $tcambio, 
//         '$total_igv' * $tcambio, 
//         '$total_compra' * $tcambio, 
//         '$subtotal_compra', 
//         '$total_igv',
//         '$total_compra', 
//         '$tcambio',
//         '$moneda',
//         '$idempresa'
//           )";
//          $idcompranew=ejecutarConsulta_retornarID($sql);

//         $num_elementos=0;
//         $sw=true;
//         while ($num_elementos < count($idarticulo))
//         {
//             $sql_detalle = "insert into 
//             detalle_compra_producto 
//             (
//             idcompra, 
//             idarticulo, 
//             valor_unitario, 
//             cantidad, 
//             subtotal, 
//             valor_unitario_$, 
//             subtotal_$) 
//             values
//              (
//              '$idcompranew', 
//              '$idarticulo[$num_elementos]',
//              '$valor_unitario[$num_elementos]' * $tcambio, 
//              '$cantidad[$num_elementos]', 
//              valor_unitario * '$cantidad[$num_elementos]',
//              '$valor_unitario[$num_elementos]',
//              valor_unitario_$ * '$cantidad[$num_elementos]')";
//              //Guardar en Kardex
//             $sql_kardex="insert into kardex 
//             (idcomprobante, idarticulo, transaccion, codigo, fecha, tipo_documento, numero_doc, cantidad, costo_1, unidad_medida, saldo_final, costo_2, valor_final, idempresa)

//              values 
//              ('$idcompranew',
//              '$idarticulo[$num_elementos]',
//              'COMPRA', 
//              '$codigo[$num_elementos]', 
//              '$fecha_emision', 
//              '$tipo_comprobante', 
//              '$serie_comprobante-$num_comprobante', 
//              '$cantidad[$num_elementos]', 
//              '$valor_unitario[$num_elementos]' * $tcambio, 
//              '$unidad_medida[$num_elementos]',
//              '0',
//              '0',
//              '0', '$idempresa' 
//            )";

// //FORMULA PARA ACTUALIZAR COSTO DE COMPRA Y VALOR FINAL ========================
// // (COSTO DE COMPRA * CANTIDAD)+VALOR FINAL KARDEX / (SALDO FINAL + CANTIDAD)

//             $sql_update_articulo="update 
//             articulo 
//             set 
//             saldo_finu=saldo_finu + '$cantidad[$num_elementos]', 
//             comprast=comprast + '$cantidad[$num_elementos]', 
//             valor_finu=((saldo_iniu + comprast)-ventast)*costo_compra, 
//             stock=saldo_finu ,
//                 valor_fin_kardex=(select valor_final 
//                   from 
//                   kardex 
//                   where 
//                   idarticulo='$idarticulo[$num_elementos]' and transaccion='COMPRA' order by idkardex desc limit 1), 

//                 precio_final_kardex=(select costo_2 from kardex where idarticulo='$idarticulo[$num_elementos]' order by idkardex desc limit 1)
                
//                 where idarticulo='$idarticulo[$num_elementos]'";

                            
//             ejecutarConsulta($sql_detalle) or $sw = false;
//             ejecutarConsulta($sql_kardex) or $sw = false;
//             ejecutarConsulta($sql_update_articulo) or $sw = false;
//             $num_elementos=$num_elementos + 1;
//         }
 
//         return $idcompranew;
      
//     }//FIN DE IF

}//FIN DE FUNCION






public function insertarsubarticulo(
  $idusuario, 
  $idproveedor, 
  $fecha_emision, 
  $tipo_comprobante, 
  $serie_comprobante, 
  $num_comprobante, 
  $guia, 
  $subtotal_compra, 
  $total_igv, 
  $total_compra, 
  $idarticulo, 
  $valor_unitario,  
  $cantidad, 
  $subtotalBD,  
  $codigo, 
  $unidad_medida, 
  $tcambio, 
  $hora, 
  $moneda, 
  $idempresa,
  $codigobarra,
  $idarticulonarti,
  $totalcantidad,
  $totalcostounitario,
  $vunitario,
  $factorc)
    {


    

        $sql="insert into compra (
            idusuario, 
            idproveedor,
            fecha, 
            tipo_documento, 
            serie, 
            numero, 
            guia, 
            subtotal, 
            igv, 
            total, 
            subtotal_$, 
            igv_$, 
            total_$, 
            tcambio,
            moneda, 
            idempresa
            ) 
          values 
            (
          '$idusuario', 
          '$idproveedor', 
          '$fecha_emision $hora', 
          '$tipo_comprobante', 
          '$serie_comprobante', 
          '$num_comprobante', 
          '$guia', 
          '$subtotal_compra', 
          '$total_igv', 
          '$total_compra', 
          '0', 
          '0',
          '0', 
          '$tcambio',
          '$moneda',
          '$idempresa'
          )";
        $idcompranew=ejecutarConsulta_retornarID($sql);
        
        $sw=true;



            $sql_detalle = "insert into 
            detalle_compra_producto 
            (
              idcompra, 
              idarticulo, 
              valor_unitario, 
              cantidad, 
              subtotal, 
              valor_unitario_$, 
              subtotal_$) 
            values
             (
             '$idcompranew', 
             '$idarticulonarti',
             '$vunitario', 
             '$totalcantidad' / '$factorc', 
              valor_unitario * '$totalcantidad',
             '0',
             '0')";

             ejecutarConsulta($sql_detalle) or $sw = false;


$num_elementos=0;
while ($num_elementos < count($idarticulo))
        {
          if ($moneda=="USD") 
            { 
              $valor_unitario[$num_elementos]=$valor_unitario[$num_elementos] * $tcambio; 
            }

             $sqlsubarticulo = "insert into 
            subarticulo 
            (
              idarticulo, 
              codigobarra, 
              valorunitario, 
              preciounitario, 
              stock, 
              umventa,
              estado) 
            values
            (
             '$idarticulo[$num_elementos]',
             '$codigo[$num_elementos]',
             '$valor_unitario[$num_elementos]', 
             ('$valor_unitario[$num_elementos]' * 0.18) + '$valor_unitario[$num_elementos]', 
             '$cantidad[$num_elementos]',
             '$unidad_medida[$num_elementos]',
             '1'
              )";

          

             //Guardar en Kardex
            $sql_kardex="insert into 
            kardex 
            (
              idcomprobante, 
              idarticulo, 
              transaccion, 
              codigo, 
              fecha, 
              tipo_documento, 
              numero_doc, 
              cantidad, 
              costo_1, 
              unidad_medida, 
              saldo_final, 
              costo_2, 
              valor_final,
              idempresa,
              tcambio,
              moneda
              )
             values 
             ('$idcompranew',
             '$idarticulo[$num_elementos]',
             'COMPRA', 
             '$codigo[$num_elementos]', 
             '$fecha_emision', 
             '$tipo_comprobante', 
             '$serie_comprobante-$num_comprobante', 
             '$cantidad[$num_elementos]' / '$factorc', 
             '$valor_unitario[$num_elementos]', 
             '$unidad_medida[$num_elementos]',
              '0',
              '0' , 
              '0',
             '$idempresa' ,
             '$tcambio',
             '$moneda'

           )";

//FORMULA PARA ACTUALIZAR COSTO DE COMPRA Y VALOR FINAL ========================
// (COSTO DE COMPRA * CANTIDAD)+VALOR FINAL KARDEX / (SALDO FINAL + CANTIDAD)

            $sql_update_articulo="update 
            articulo 
            set 
            valor_fin_kardex=(select valor_final from kardex where idarticulo='$idarticulo[$num_elementos]' and transaccion='COMPRA' order by idkardex desc limit 1),

            precio_final_kardex=(select costo_2 from kardex where idarticulo='$idarticulo[$num_elementos]' order by idkardex desc limit 1),

            saldo_finu=saldo_finu + ('$cantidad[$num_elementos]' / '$factorc' ), 

            comprast=comprast + ('$cantidad[$num_elementos]'  / '$factorc'), 

            valor_finu=((saldo_iniu + comprast) - ventast) * precio_final_kardex, 

            stock=saldo_finu
            
            where idarticulo='$idarticulo[$num_elementos]'";
                            
            
            ejecutarConsulta($sqlsubarticulo) or $sw = false;
            ejecutarConsulta($sql_kardex) or $sw = false;
            ejecutarConsulta($sql_update_articulo) or $sw = false;
            $num_elementos=$num_elementos + 1;
        }
 
        return $idcompranew;


}//FIN DE FUNCION

















 
     
    //Implementamos un método para anular categorías
    public function anular($idcompra)
    {
        $sql="update compra set estado='0' WHERE idcompra='$idcompra'";
        return ejecutarConsulta($sql);
    }
 
 
    //Implementar un método para mostrar los datos de un registro a modificar
    public function mostrar($idcompra)
    {
        $sql="select c.idcompra,DATE(c.fecha) as fecha,c.idproveedor,p.razon_social as proveedor,u.idusuario,u.nombre as usuario,c.tipo_documento,c.serie,c.numero,c.total,c.igv,c.estado FROM compra c inner join persona p ON c.idproveedor=p.idpersona inner join usuario u ON c.idusuario=u.idusuario WHERE c.idcompra='$idcompra'";
        return ejecutarConsultaSimpleFila($sql);
    }

    //Implementar un método para mostrar los datos de un registro a modificar
    public function eliminarcompra($idcompra)
    {
        $sql="select c.idcompra,DATE(c.fecha) as fecha,c.idproveedor,p.razon_social as proveedor,u.idusuario,u.nombre as usuario,c.tipo_documento,c.serie,c.numero,c.total,c.igv,c.estado FROM compra c inner join persona p ON c.idproveedor=p.idpersona inner join usuario u ON c.idusuario=u.idusuario WHERE c.idcompra='$idcompra'";
        return ejecutarConsultaSimpleFila($sql);
    }
 
    public function listarDetalle($idcompra)
    {
        $sql="select dc.idcompra, dc.idarticulo, a.nombre, dc.cantidad, dc.valor_unitario, dc.valor_venta, dc.subtotal FROM detalle_compra_producto dc inner join articulo a on dc.idarticulo=a.idarticulo where dc.idcompra='$idcompra'";
        return ejecutarConsulta($sql);
    }
 
    //Implementar un método para listar los registros
    public function listar($idempresa)
    {
        $sql="select 
        c.idcompra, 
        date_format(c.fecha,'%d-%m-%Y') as fecha, 
        c.idproveedor, 
        p.razon_social as proveedor, 
        u.idusuario,
        u.nombre as usuario, 
        ct1.descripcion, 
        c.serie, 
        c.numero, 
        format(c.total,2) as total, 
        c.igv, 
        c.estado 
        from 
        compra c inner join persona p on c.idproveedor=p.idpersona inner join usuario u on c.idusuario=u.idusuario inner join catalogo1 ct1 on c.tipo_documento=ct1.codigo inner join  empresa e on c.idempresa=e.idempresa where e.idempresa='$idempresa'  order by c.idcompra desc ";
        return ejecutarConsulta($sql);      
    }


      public function regcompra($año, $mes, $moneda, $idempresa)
    {
        
        if ($moneda=='usd') {
            $sql="select
         date_format(c.fecha, '%d') as fecha, c.tipo_documento, c.serie, c.numero, p.numero_documento, p.razon_social, c.subtotal_$ as subtotal, c.igv_$ as igv, c.total_$ as total
          from 
            compra c inner join persona p on c.idproveedor=p.idpersona inner join empresa e on c.idempresa=e.idempresa
             where 
             year(c.fecha)='$año' and month(c.fecha)='$mes' and moneda='$moneda' and e.idempresa='$idempresa' and c.estado='1' order by c.fecha asc";
             }
            else
             {
            $sql="select
         date_format(c.fecha, '%d') as fecha, c.tipo_documento, c.serie, c.numero, p.numero_documento, p.razon_social, c.subtotal, c.igv, c.total
          from 
            compra c inner join persona p on c.idproveedor=p.idpersona inner join empresa e on c.idempresa=e.idempresa
             where 
             year(c.fecha)='$año' and month(c.fecha)='$mes' and moneda='$moneda'   and e.idempresa='$idempresa' and c.estado='1'  order by c.fecha asc";
             }
        return ejecutarConsulta($sql);      
    }

    public function totalregcompra($año, $mes)
    {
    $sql="select sum(c.subtotal) as valor_inafecto, sum(c.igv) as igv, sum(c.total) as total  from compra c inner join persona p on c.idproveedor=p.idpersona where year(c.fecha)='$año' and month(c.fecha)='$mes'";
        return ejecutarConsulta($sql);      
    }

    public function totalregcompraReporte($año, $mes, $moneda, $idempresa)
    {
        if ($moneda=='usd') {
    $sql="select
     sum(c.subtotal_$) as subtotal, sum(c.igv_$) as igv, sum(c.total_$) as total 
      from 
      compra c inner join persona p on c.idproveedor=p.idpersona inner join empresa e on c.idempresa=e.idempresa where year(c.fecha)='$año' and month(c.fecha)='$mes' and moneda='$moneda' and e.idempresa='$idempresa' and c.estado='1'";
  }else{
        $sql="select
     sum(c.subtotal) as subtotal, sum(c.igv) as igv, sum(c.total) as total 
      from 
      compra c inner join persona p on c.idproveedor=p.idpersona inner join empresa e on c.idempresa=e.idempresa where year(c.fecha)='$año' and month(c.fecha)='$mes' and moneda='$moneda' and e.idempresa='$idempresa' and c.estado='1'";
  }
   
        return ejecutarConsulta($sql);      
    }

     public function compraReporte1($idcompra)
    {
$sql="select 
concat(c.serie,'-' ,
c.numero) as numero, 
date_format(c.fecha, '%d-%m-%Y') as fecha, 
p.razon_social as proveedor, 
u.nombre as usuario, 
ct1.descripcion as tdocumento, 
a.codigo, 
a.nombre, 
dtc.valor_unitario as vunitario, 
dtc.cantidad, 
dtc.subtotal as stotal, 
year(c.fecha) as año,
c.estado,
c.moneda,
c.tcambio,
um.nombreum
from 
compra c inner join detalle_compra_producto dtc on c.idcompra=dtc.idcompra inner join articulo a on dtc.idarticulo=a.idarticulo inner join persona p on c.idproveedor=p.idpersona inner join usuario u on c.idusuario=u.idusuario inner join catalogo1 ct1 on c.tipo_documento=ct1.codigo 
inner join umedida um on a.umedidacompra=um.idunidad
where c.idcompra='$idcompra'";
        return ejecutarConsulta($sql);      
    }


     public function compraReporte2($idcompra)
    {
$sql="select  
format(subtotal,2) as sbt, 
format(igv,2) as igv_, 
format(total,2) as ttl  
from 
compra  
where idcompra='$idcompra'";
        return ejecutarConsulta($sql);      
    }

    public function datosemp($idempresa)
    {

    $sql="select * from empresa where idempresa='$idempresa'";
    return ejecutarConsulta($sql);      
    }



    public function AnularCompra($idcompra, $fechaemision, $idempresa)
{
$sw=true;
$connect = new mysqli(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME);
mysqli_query( $connect, 'SET NAMES "'.DB_ENCODE.'"');
      //Si tenemos un posible error en la conexión lo mostramos
      if (mysqli_connect_errno())
      {
            printf("Falló conexión a la base de datos: %s\n",mysqli_connect_error());
            exit();
      }

    $query="select dc.idcompra, a.idarticulo, dc.cantidad,  dc.valor_unitario, a.codigo, a.unidad_medida  from detalle_compra_producto dc inner join articulo a on dc.idarticulo=a.idarticulo where idcompra = '$idcompra'";
    $resultado = mysqli_query($connect,$query);

    $Idc=array();
    $Ida=array();
    $Ct=array();
    $Cod=array();
    $Vu=array();
    $Um=array();
    $sw=true;

    while ($fila = mysqli_fetch_assoc($resultado)) {
    for($i=0; $i < count($resultado) ; $i++){
        $Idc[$i] = $fila["idcompra"];  
        $Ida[$i] = $fila["idarticulo"];  
        $Ct[$i] = $fila["cantidad"];  
        $Cod[$i] = $fila["codigo"];  
        $Vu[$i] = $fila["valor_unitario"];  
        $Um[$i] = $fila["unidad_medida"];  

    $sql_update_articulo="update detalle_compra_producto dc inner join 
    articulo a on dc.idarticulo=a.idarticulo 
    set 
     a.saldo_finu=a.saldo_finu - '$Ct[$i]', 
     a.stock=a.stock - '$Ct[$i]', 
     a.comprast=a.comprast - '$Ct[$i]'
    where 
    dc.idcompra='$Idc[$i]' and dc.idarticulo='$Ida[$i]'";


    $sql_update_articulo_2="update detalle_compra_producto dc inner join 
    articulo a on dc.idarticulo=a.idarticulo 
    set 
     a.valor_finu=(a.saldo_iniu + a.comprast - ventast) * a.costo_compra
    where 
    dc.idcompra='$Idc[$i]' and dc.idarticulo='$Ida[$i]'";
        
        
    //ACTUALIZAR TIPO TRANSACCIon KARDEX
    //Guardar en Kardex
    $sql_kardex="update kardex set
          transaccion='COMPRA ANULADA'
    where idcomprobante='$idcompra' and transaccion='COMPRA'";
        }
        //Fin de FOR
         ejecutarConsulta($sql_update_articulo) or $sw=false;
         ejecutarConsulta($sql_update_articulo_2) or $sw=false;
         ejecutarConsulta($sql_kardex) or $sw=false; 

          $sqlestado="update compra set estado='3' where idcompra='$idcompra'";
         ejecutarConsulta($sqlestado) or $sw=false;
        }
        //Fin de WHILE


    return $sw;    

}
     
}
 
?>