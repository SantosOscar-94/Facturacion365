<?php
//Incluímos inicialmente la conexión a la base de datos
require "../config/Conexion.php";
class PosModelo
{
    //Implementamos nuestro constructor
    public function __construct()
    {

    }
    //Listar los articulos
    public function listarProducto($idempresa, $idfamilia = null, $busqueda = null)
    {

        $filtro = "";
        if (!is_null($idfamilia)) {
            $filtro = " AND a.idfamilia = '$idfamilia'";
        }

        if (!is_null($busqueda) && $busqueda != "") {
            $filtro .= " AND (a.codigo LIKE '%$busqueda%' OR a.nombre LIKE '%$busqueda%')";
        }

        $sql = "select 
        a.idarticulo, 
        f.idfamilia, 
        a.codigo_proveedor, 
        a.codigo, 
        f.descripcion as familia, 
        left(a.nombre, 50) as nombre, 
        format(a.stock,2) as stock, 
        a.precio_venta as precio, 
        a.costo_compra,
        (a.precio_venta * 0.18) as precio_unitario,
        a.cicbper,
        format(a.mticbperu,2) as mticbperu,
        a.factorc,
        a.descrip,
        a.tipoitem,
        a.imagen, 
        a.estado, 
        a.precio_final_kardex,
        a.precio2,
        a.precio3,
        a.unidad_medida,
        a.ccontable,
        a.stock as st2,
        um.nombreum,
        um.abre,
        date_format(a.fechavencimiento, '%d/%m/%Y') as fechavencimiento,
        al.nombre as nombreal
    from 
        articulo a 
        inner join familia f on a.idfamilia=f.idfamilia 
        inner join almacen al on a.idalmacen=al.idalmacen 
        inner join empresa e on al.idempresa=e.idempresa 
        inner join umedida um on a.umedidacompra=um.idunidad 
    where 
        a.tipoitem = 'productos'
        and not a.nombre='1000ncdg' 
        and e.idempresa='$idempresa' 
        and al.estado='1' 
        $filtro";

        return ejecutarConsulta($sql);

    }

    //listar las categorias : 

    public function listarCategorias()
    {
        $sql = "select
                    f.idfamilia,
                    f.descripcion as familia,
                    f.estado
                from
                    familia f
                where
                    f.estado = '1'"; // elimina esta línea si también quieres categorías inactivas

        return ejecutarconsulta($sql);
    }


    //listar todas las BOLETAS
    public function listarBoletas($idempresa)
    {

        $sql = "select 
        b.idboleta,
        date_format(b.fecha_emision_01, '%d/%m/%y') as fecha,
        b.idcliente,
        left(p.razon_social, 20) as cliente,
        b.vendedorsitio,
        u.nombre as usuario,
        b.tipo_documento_06,
        b.numeracion_07,
        format(b.importe_total_23, 2) as importe_total_23, 
        b.estado, 
        p.nombres, 
        p.apellidos,
        e.numero_ruc,
        p.email,
        b.CodigoRptaSunat,
        b.DetalleSunat,
        b.tarjetadc,
        b.montotarjetadc,
        b.transferencia,
        b.montotransferencia,
        b.tipo_moneda_24 as moneda,
        b.tcambio,
        (b.tcambio * importe_total_23) as valordolsol,
        b.formapago,
        group_concat(a.nombre) as nombre_articulo
    from 
        boleta b 
        inner join persona p on b.idcliente = p.idpersona 
        inner join usuario u on b.idusuario = u.idusuario 
        inner join empresa e on b.idempresa = e.idempresa
        left join detalle_boleta_producto db on b.idboleta = db.idboleta 
        left join articulo a on db.idarticulo = a.idarticulo
    where
        date(b.fecha_emision_01) = current_date and e.idempresa = '$idempresa'
    group by
        b.idboleta
    order by
        b.idboleta desc;
    ";

        return ejecutarConsulta($sql);

    }


    public function listarcomprobantesvarios($idempresa, $fechainicio, $fechafinal, $tipocomprobante, $idusuario) 
{
    $data = array();

    if ($tipocomprobante == "Boleta" || $tipocomprobante == "Todos") {
        $sqlBoleta = "select 
        b.idboleta as id,
        date_format(b.fecha_emision_01, '%d/%m/%y') as fecha,
        b.idcliente,
        left(p.razon_social, 20) as cliente,
        b.vendedorsitio,
        u.nombre as usuario,
        b.tipo_documento_06,
        b.numeracion_07,
        format(b.importe_total_23, 2) as total, 
        b.estado as respuestaComprobante, 
        p.nombres, 
        p.apellidos,
        e.numero_ruc,
        p.email,
        b.CodigoRptaSunat,
        b.DetalleSunat,
        b.tarjetadc,
        b.montotarjetadc,
        b.transferencia,
        b.montotransferencia,
        b.tipo_moneda_24 as moneda,
        b.tcambio,
        (b.tcambio * importe_total_23) as valordolsol,
        b.formapago,
        group_concat(a.nombre) as nombre_articulo,
        sum(db.cantidad_item_12) as unidades_vendidas
    from 
        boleta b 
        inner join persona p on b.idcliente = p.idpersona 
        inner join usuario u on b.idusuario = u.idusuario 
        inner join empresa e on b.idempresa = e.idempresa
        left join detalle_boleta_producto db on b.idboleta = db.idboleta 
        left join articulo a on db.idarticulo = a.idarticulo
    where
        date(b.fecha_emision_01) between '$fechainicio' and '$fechafinal'
        and e.idempresa = '$idempresa'
        and u.idusuario = '$idusuario' -- Agregar condición para idusuario
        and (u.cargo = 0 or (u.cargo = 1 and b.idusuario = '$idusuario')) -- Agregar condición para cargo
    group by
        b.idboleta
    order by
        b.idboleta desc;"; // Tu consulta para Boletas aquí
        $data['boletas'] = ejecutarconsulta($sqlBoleta);
    }

    if ($tipocomprobante == "Factura" || $tipocomprobante == "Todos") {
        $sqlFactura = "select
        f.idfactura as id,
        date_format(f.fecha_emision_01, '%d/%m/%y') as fecha,
        date_format(CURDATE(), '%Y%m%d') AS fechabaja,
        f.idcliente,
        p.razon_social AS cliente,
        f.vendedorsitio,
        u.nombre AS usuario,
        f.tipo_documento_07,
        f.numeracion_08,
        format(f.importe_total_venta_27, 2) as total,
        f.sumatoria_igv_22_1,
        f.estado as respuestaComprobante,
        e.numero_ruc,
        p.email,
        f.CodigoRptaSunat,
        f.DetalleSunat,
        f.tarjetadc,
        f.transferencia,
        f.montotarjetadc,
        f.montotransferencia,
        f.tipo_moneda_28 AS moneda,
        f.tcambio,
        (f.tcambio * f.importe_total_venta_27) AS valordolsol,
        f.otroscargos,
        f.formapago,
        group_concat(a.nombre) as nombre_articulo,
        sum(df.cantidad_item_12) as unidades_vendidas   
    from
        factura f 
        inner join persona p on f.idcliente = p.idpersona
        inner join usuario u on f.idusuario = u.idusuario
        inner join empresa e on f.idempresa = e.idempresa
        left join detalle_fac_art df on f.idfactura = df.idfactura
        left join articulo a on df.idarticulo = a.idarticulo
    where
        date(f.fecha_emision_01) between '$fechainicio' and '$fechafinal'
        and e.idempresa = '$idempresa'
        and u.idusuario = '$idusuario' -- Agregar condición para idusuario
        and (u.cargo = 0 or (u.cargo = 1 and f.idusuario = '$idusuario')) -- Agregar condición para cargo
    group by
        f.idfactura
    order by
        f.idfactura desc;"; // Tu consulta para Facturas aquí
        $data['facturas'] = ejecutarconsulta($sqlFactura);
    }

    if ($tipocomprobante == "NotaPedido" || $tipocomprobante == "Todos") {
        $sqlNotaPedido = "select
        b.idboleta as id,
        date_format(b.fecha_emision_01, '%d/%m/%y') as fecha,
        b.idcliente,
        left(p.razon_social, 20) as cliente,
        b.vendedorsitio,
        u.nombre as usuario,
        b.tipo_documento_06,
        b.numeracion_07,
        b.monto_15_2 as total,
        b.adelanto,
        b.faltante,
        format(b.importe_total_23, 2) as importe_total_23,
        b.estado as respuestaComprobante,
        p.nombres,
        p.apellidos,
        e.numero_ruc,
        p.email,
        p.idpersona,
        'Nota de Venta' as tipo_comprobante,
        group_concat(a.nombre) as nombre_articulo,
        sum(dnp.cantidad_item_12) as unidades_vendidas
    from
        notapedido b
        inner join persona p on b.idcliente = p.idpersona
        inner join usuario u on b.idusuario = u.idusuario
        inner join empresa e on b.idempresa = e.idempresa
        left join detalle_notapedido_producto dnp on b.idboleta = dnp.idboleta
        left join articulo a on dnp.idarticulo = a.idarticulo
    where
        date(b.fecha_emision_01) between '$fechainicio' and '$fechafinal'
        and e.idempresa = '$idempresa'
        and u.idusuario = '$idusuario' -- Agregar condición para idusuario
        and (u.cargo = 0 or (u.cargo = 1 and b.idusuario = '$idusuario')) -- Agregar condición para cargo
    group by
        b.idboleta, fecha, b.idcliente, p.razon_social, b.vendedorsitio, u.nombre,
        b.tipo_documento_06, b.numeracion_07, b.monto_15_2, b.adelanto, b.faltante,
        b.importe_total_23, b.estado, p.nombres, p.apellidos, e.numero_ruc, p.email, p.idpersona
    order by
        b.idboleta desc;"; // Tu consulta para Notas de Pedido aquí
        $data['notaspedido'] = ejecutarconsulta($sqlNotaPedido);
    }

    return $data;
}


    // public function listarComprobantesVarios($idempresa, $fechainicio, $fechafinal, $tipocomprobante)
    // {

    //     $sql = "";

    //     // Agregar consulta para Boletas si se requiere
    //     if ($tipocomprobante == "Boleta" || $tipocomprobante == "Todos") {
    //         $sql .= "
    //         select 
    //             b.idcliente as id,
    //             date_format(b.fecha_emision_01, '%d/%m/%y') as fecha,
    //             p.razon_social as cliente,
    //             b.estado,
    //             'Boleta' as tipo_comprobante,
    //             group_concat(a.nombre) as productos,
    //             sum(dbp.cantidad_item_12) as unidades_vendidas,
    //             (b.importe_total_23) as total
    //         from 
    //             boleta b 
    //             inner join persona p on b.idcliente = p.idpersona
    //             inner join detalle_boleta_producto dbp on b.idboleta = dbp.idboleta
    //             inner join articulo a on dbp.idarticulo = a.idarticulo
    //         where
    //             date(b.fecha_emision_01) between '$fechainicio' and '$fechafinal' and b.idempresa = '$idempresa'
    //         group by b.idcliente, fecha, p.razon_social, b.estado, tipo_comprobante
    // ";
    //     }

    //     // Agregar consulta para Facturas si se requiere
    //     if ($tipocomprobante == "Factura" || $tipocomprobante == "Todos") {
    //         if ($sql != "") { // Verificar si ya hay una consulta
    //             $sql .= " union ";
    //         }
    //         $sql .= "
    //         select 
    //         f.idcliente as id,
    //         date_format(f.fecha_emision_01, '%d/%m/%y') as fecha,
    //         p.razon_social as cliente,
    //         f.estado,
    //         'Factura' as tipo_comprobante,
    //         group_concat(a.nombre) as productos,
    //         sum(dfa.cantidad_item_12) as unidades_vendidas,
    //         (f.importe_total_venta_27) as total
    //     from 
    //         factura f 
    //         inner join persona p on f.idcliente = p.idpersona
    //         inner join detalle_fac_art dfa on f.idfactura = dfa.idfactura
    //         inner join articulo a on dfa.idarticulo = a.idarticulo
    //     where
    //         date(f.fecha_emision_01) between '$fechainicio' and '$fechafinal' and f.idempresa = '$idempresa'
    //     group by f.idcliente, fecha, p.razon_social, f.estado, tipo_comprobante
    // ";
    //     }

    //     // Agregar consulta para NotaPedido si se requiere
    //     if ($tipocomprobante == "NotaPedido" || $tipocomprobante == "Todos") {
    //         if ($sql != "") { // Verificar si ya hay una consulta
    //             $sql .= " union ";
    //         }
    //         $sql .= "
    //         select 
    //         b.idcliente as id,
    //         date_format(b.fecha_emision_01, '%d/%m/%y') as fecha,
    //         p.razon_social as cliente,
    //         b.estado,
    //         'Nota de Venta' as tipo_comprobante,
    //         group_concat(a.nombre) as productos,
    //         sum(dnp.cantidad_item_12) as unidades_vendidas,
    //         (b.importe_total_23) as total
    //     from 
    //         notapedido b 
    //         inner join persona p on b.idcliente = p.idpersona
    //         inner join detalle_notapedido_producto dnp on b.idboleta = dnp.idboleta
    //         inner join articulo a on dnp.idarticulo = a.idarticulo
    //     where
    //         date(b.fecha_emision_01) between '$fechainicio' and '$fechafinal' and b.idempresa = '$idempresa'
    //     group by b.idcliente, fecha, p.razon_social, b.estado, tipo_comprobante
    // ";
    //     }
    //     return ejecutarConsulta($sql);

    // }


    public function insertarClientePOS($tipo_documento, $numero_documento, $razon_social, $domicilio_fiscal)
    {
        $tipo_persona = 'cliente';
        $estado = 1; // Siempre 1 según tu requisito
        $sql = "insert into persona (tipo_persona, tipo_documento, numero_documento, razon_social, domicilio_fiscal, estado) values ('$tipo_persona', '$tipo_documento', '$numero_documento', '$razon_social', '$domicilio_fiscal', '$estado')";
        return ejecutarConsulta($sql);
    }

    // Esta función verifica si el cliente con un determinado RUC ya existe en la base de datos.
    public function clienteExiste($numero_documento)
    {
        $sql = "select * from persona where numero_documento = '$numero_documento'";
        $resultado = ejecutarConsulta($sql);
        return mysqli_num_rows($resultado) > 0;
    }



}