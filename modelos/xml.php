<?php class CustomHeaders extends SoapHeader
{
    private
    $wss_ns = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';
    function __construct($user, $pass, $ns = null)
    {
        if ($ns) {
            $this->wss_ns = $ns;
        }
        $auth = new stdClass();
        $auth->Username = new SoapVar($user, XSD_STRING, NULL, $this->wss_ns, NULL, $this->wss_ns);
        $auth->Password = new SoapVar($pass, XSD_STRING, NULL, $this->wss_ns, NULL, $this->wss_ns);
        $username_token = new stdClass();
        $username_token->UsernameToken = new SoapVar($auth, SOAP_ENC_OBJECT, NULL, $this->wss_ns, 'UsernameToken', $this->wss_ns);
        $security_sv = new SoapVar(new SoapVar($username_token, SOAP_ENC_OBJECT, NULL, $this->wss_ns, 'UsernameToken', $this->wss_ns), SOAP_ENC_OBJECT, NULL, $this->wss_ns, 'Security', $this->wss_ns);
        parent::__construct($this->wss_ns, 'Security', $security_sv, true);
    }
}

?>

<?php

class CtrComprobante
{
    // require 'modelos/ConsultaM.php';
    public function declara($compr = '')
    {
        if (isset($_GET['comprobante'])) {
            $compr = $_GET['comprobante'];
        }

        $items = new ConsultaM();
        $sql = "SELECT c.idEmp, c.idDoc, LPAD(c.serDoc, 4, '0') as serDoc, LPAD(c.numDoc, 8, '0') as numDoc, c.idEmpl, c.totCom, c.idEstCom, c.tipNot, c.comRel, c.idEstComEle, e.razEmp, e.ctaDtr, e.ubgEmp 
            FROM comprobante AS c, perempresa AS e 
            WHERE e.idEmp = c.idEmp AND c.id_com = '$compr' AND c.estReg=1;";
        $lisrs = $items->consul($sql, 1);
        $row = $lisrs->fetch_assoc();
        $est = $row['idEstCom'];
        $exi = $row['idEstComEle'];
        $raz = $row['razEmp'];
        $cta = $row['ctaDtr'];
        $ubg = $row['ubgEmp'];
        $emp = $row['idEmp'];
        $name = $row['idEmp'] . "-" . substr($row['idDoc'], 11, 2) . "-" . substr($row['idDoc'], 13, 4) . "-" . $row['numDoc'];

        if ($exi == 1) {
            if ($est != 'ANU' || $est != 'FAL') {
                $lcomp = $items->tracmpelev($compr);
                $ldcom = $items->tracmpdeelev($compr);
                $json = $this->genexml($lcomp, $ldcom, $raz, $cta, $ubg);

                if ($json != '') {
                    $dataxml = $json;
                    $rutax = "filesx/" . $row['idEmp'] . "/";
                    $filenax = $name . ".xml";
                    $fh = fopen($filenax, 'w') or die("No se puede abrir el archivo");
                    fwrite($fh, $dataxml);
                    fclose($fh);
                    require_once("greenter/Greenter.php");
                    $invo = new Greenter();
                    $out = $invo->getDatFac($filenax, $name);
                    if (!file_exists($rutax)) {
                        mkdir($rutax);
                    }
                    $rutaz = "filesz/" . $row['idEmp'] . "/";
                    $filenaz = $name . ".zip";
                    $zip = new ZipArchive();
                    if ($zip->open($filenaz, ZIPARCHIVE::CREATE) === true) {
                        //$zip->addEmptyDir("dummy");
                        $zip->addFile($filenax);
                        $zip->close();
                        if (!file_exists($rutaz)) {
                            mkdir($rutaz);
                        }
                        $imagen = file_get_contents($filenaz);
                        $imageData = base64_encode($imagen);
                        rename($filenax, $rutax . $filenax);
                        rename($filenaz, $rutaz . $filenaz);
                        $resu = $items->senten("UPDATE comprobante SET idEstComEle =2 WHERE id_com = '$compr' AND estReg =1;");
                    } else {
                        unlink($rutax . $filenax);
                        $out = "Error al comprimir archivo";
                    }
                } else {
                    $out = "No se genero xml";
                }
            }
        }
    }


    public function genexml($com, $dcom, $raz, $cta, $ubg)
    {
        $tp = 0;
        $xml = "";
        while ($row = $com->fetch_assoc()) {
            $tp = substr($row['idDoc'], 11, 2);
            if ($row['porDtrCom'] > 0) {
                $opera = '1001';
            } else {
                $opera = '0101';
            }

            switch ($tp) {
                case "01":
                    $hxml = '<?xml version="1.0" encoding="utf-8"?>
            <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
                     xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                     xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                     xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                     xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
                <ext:UBLExtensions>
                    <ext:UBLExtension>
                        <ext:ExtensionContent/>
                    </ext:UBLExtension>
                </ext:UBLExtensions>
                <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
                <cbc:CustomizationID>2.0</cbc:CustomizationID>
                <cbc:ID>' . substr($row['idDoc'], 13, 4) . '-' . $row['numDoc'] . '</cbc:ID>
                <cbc:IssueDate>' . substr($row['fecDocCom'], 0, 10) . '</cbc:IssueDate>
                <cbc:IssueTime>' . substr($row['fecRegCom'], 11, 8) . '</cbc:IssueTime>
                <cbc:InvoiceTypeCode listID="' . $opera . '">' . $tp . '</cbc:InvoiceTypeCode>
                <cbc:Note languageLocaleID="1000">' . strtoupper($this->numtolet(abs($row['totCom']), "")) . '</cbc:Note>
                ';
                    $ldtr = '';
                    if ($row['porDtrCom'] > 0) {
                        $ldtr = '<cbc:Note languageLocaleID="2006">Leyenda: Operación sujeta a detracción</cbc:Note>
                ';
                    }
                    $hxml1 = '<cbc:DocumentCurrencyCode>' . $row['codMon'] . '</cbc:DocumentCurrencyCode>
                <cac:Signature>
                    <cbc:ID>' . $row['idEmp'] . '</cbc:ID>
                    <cbc:Note>SENCON</cbc:Note>
                    <cac:SignatoryParty>
                        <cac:PartyIdentification>
                            <cbc:ID>' . $row['idEmp'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyName>
                            <cbc:Name><![CDATA[' . $raz . ']]></cbc:Name>
                        </cac:PartyName>
                    </cac:SignatoryParty>
                    <cac:DigitalSignatureAttachment>
                        <cac:ExternalReference>
                            <cbc:URI>#SIGN-SENCON</cbc:URI>
                        </cac:ExternalReference>
                    </cac:DigitalSignatureAttachment>
                </cac:Signature>
                <cac:AccountingSupplierParty>
                    <cac:Party>
                        <cac:PartyIdentification>
                            <cbc:ID schemeID="6">' . $row['idEmp'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyName>
                            <cbc:Name><![CDATA[' . $raz . ']]></cbc:Name>
                        </cac:PartyName>
                        <cac:PartyLegalEntity>
                            <cbc:RegistrationName><![CDATA[' . $raz . ']]></cbc:RegistrationName>
                            <cac:RegistrationAddress>
                                <cbc:ID>' . $ubg . '</cbc:ID>
                                <cbc:AddressTypeCode>0001</cbc:AddressTypeCode>
                            </cac:RegistrationAddress>
                        </cac:PartyLegalEntity>
                    </cac:Party>
                </cac:AccountingSupplierParty>
                <cac:AccountingCustomerParty>
                    <cac:Party>
                        <cac:PartyIdentification>
                            <cbc:ID schemeID="' . $row['tipDocCli'] . '">' . $row['docCli'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyLegalEntity>
                            <cbc:RegistrationName><![CDATA[' . trim($row['razPer']) . ']]></cbc:RegistrationName>
                        </cac:PartyLegalEntity>
                    </cac:Party>
                </cac:AccountingCustomerParty>
                ';
                    $pdtr = '';
                    if ($row['porDtrCom'] > 0) {
                        $pdtr = '<cac:PaymentMeans>
                    <cbc:PaymentMeansCode>009</cbc:PaymentMeansCode>
                    <cac:PayeeFinancialAccount>
                        <cbc:ID>' . $cta . '</cbc:ID>
                    </cac:PayeeFinancialAccount>
                </cac:PaymentMeans>
                <cac:PaymentTerms>
                    <cbc:PaymentMeansID>' . $row['codDtrCom'] . '</cbc:PaymentMeansID>
                    <cbc:PaymentPercent>' . $row['porDtrCom'] . '</cbc:PaymentPercent>
                    <cbc:Amount currencyID="PEN">' . number_format(abs(($row['totCom'] * $row['porDtrCom']) * $row['tipCam']), 2, '.', '') . '</cbc:Amount>
                </cac:PaymentTerms>
                ';
                    }
                    $hxml2 = '<cac:TaxTotal>
                    <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['igvCom']), 2, '.', '') . '</cbc:TaxAmount>
                    ';
                    $iscc = '';
                    if ($row['iscCom'] > 0) {
                        $iscc = '<cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['valCom']), 2, '.', '') . '</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['iscCom']), 2, '.', '') . '</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cac:TaxScheme>
                                <cbc:ID>2000</cbc:ID>
                                <cbc:Name>ISC</cbc:Name>
                                <cbc:TaxTypeCode>EXC</cbc:TaxTypeCode>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal>
                    ';
                    }
                    $opgr = '';
                    if ($row['tipOpe'] == 10) {
                        $opgr = '<cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['valCom']), 2, '.', '') . '</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['igvCom']), 2, '.', '') . '</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cac:TaxScheme>
                                <cbc:ID>1000</cbc:ID>
                                <cbc:Name>IGV</cbc:Name>
                                <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal>
                    ';
                    }
                    $hxml3 = '</cac:TaxTotal>
                <cac:LegalMonetaryTotal>
                    <cbc:LineExtensionAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['valCom']), 2, '.', '') . '</cbc:LineExtensionAmount>
                    <cbc:PayableAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['totCom']), 2, '.', '') . '</cbc:PayableAmount>
                </cac:LegalMonetaryTotal>
                ';
                    $dxml = '';
                    $cont = 0;
                    while ($drow = $dcom->fetch_assoc()) {
                        $cont = $cont + 1;
                        $dscri = $drow['descri'] . $drow['descriPer'];
                        if ($dscri == "") {
                            $parra = "POR SERVICIO DE " . $drow['idCcp'] . " PERIODO: " . $drow['mesCro'] . "-" . $drow['anoCro'] . " " . $drow['cndCom'];
                        } else {
                            $parra = strtoupper($drow['descri'] . ' ' . $drow['descriPer']);
                        }
                        $valu = abs($drow['pago']) / 1.18;
                        $igvu = abs($drow['pago']) - round($valu, 2);
                        $preu = (($valu) / $drow['canti']);
                        $prec = abs($drow['pago']) / $drow['canti'];
                        $dxml1 = '<cac:InvoiceLine>
                    <cbc:ID>' . $cont . '</cbc:ID>
                    <cbc:InvoicedQuantity unitCode="' . $drow['medi'] . '">' . number_format($drow['canti'], 2, '.', '') . '</cbc:InvoicedQuantity>
                    <cbc:LineExtensionAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:LineExtensionAmount>
                    <cac:PricingReference>
                        <cac:AlternativeConditionPrice>
                            <cbc:PriceAmount currencyID="' . $row['codMon'] . '">' . number_format($prec, 2, '.', '') . '</cbc:PriceAmount>
                            <cbc:PriceTypeCode>01</cbc:PriceTypeCode>
                        </cac:AlternativeConditionPrice>
                    </cac:PricingReference>
                    <cac:TaxTotal>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($igvu, 2, '.', '') . '</cbc:TaxAmount>
                        ';
                        $iscd = '';
                        if ($row['iscCom'] > 0) {
                            $iscd = '<cac:TaxSubtotal>
                            <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxableAmount>
                            <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxAmount>
                            <cac:TaxCategory>
                                <cbc:Percent>2.00</cbc:Percent>
                                <cbc:TierRange>02</cbc:TierRange>
                                <cac:TaxScheme>
                                    <cbc:ID>2000</cbc:ID>
                                    <cbc:Name>ISC</cbc:Name>
                                    <cbc:TaxTypeCode>EXC</cbc:TaxTypeCode>
                                </cac:TaxScheme>
                            </cac:TaxCategory>
                        </cac:TaxSubtotal>
                        ';
                        }
                        $dxml2 = '<cac:TaxSubtotal>
                            <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxableAmount>
                            <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($igvu, 2, '.', '') . '</cbc:TaxAmount>
                            <cac:TaxCategory>
                                <cbc:Percent>18.00</cbc:Percent>
                                <cbc:TaxExemptionReasonCode>10</cbc:TaxExemptionReasonCode>
                                <cac:TaxScheme>
                                    <cbc:ID>1000</cbc:ID>
                                    <cbc:Name>IGV</cbc:Name>
                                    <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                                </cac:TaxScheme>
                            </cac:TaxCategory>
                        </cac:TaxSubtotal>
                    </cac:TaxTotal>
                    <cac:Item>
                        <cbc:Description><![CDATA[' . trim($parra) . ']]></cbc:Description>
                    </cac:Item>
                    <cac:Price>
                        <cbc:PriceAmount currencyID="' . $row['codMon'] . '">' . number_format($preu, 2, '.', '') . '</cbc:PriceAmount>
                    </cac:Price>
                </cac:InvoiceLine>
                ';
                        $dxml = $dxml . $dxml1 . $iscd . $dxml2;
                    }
                    $fxml = '</Invoice>';
                    $xml = $hxml . $ldtr . $hxml1 . $pdtr . $hxml2 . $iscc . $opgr . $hxml3 . $dxml . $fxml;
                    break;
                case "03":
                    break;
                case "07":
                    $hxml = '<?xml version="1.0" encoding="utf-8"?>
            <CreditNote xmlns="urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2"
                        xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                        xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                        xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                        xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
                <ext:UBLExtensions>
                    <ext:UBLExtension>
                        <ext:ExtensionContent/>
                    </ext:UBLExtension>
                </ext:UBLExtensions>
                <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
                <cbc:CustomizationID>2.0</cbc:CustomizationID>
                <cbc:ID>' . substr($row['idDoc'], 13, 4) . '-' . $row['numDoc'] . '</cbc:ID>
                <cbc:IssueDate>' . substr($row['fecDocCom'], 0, 10) . '</cbc:IssueDate>
                <cbc:IssueTime>' . substr($row['fecRegCom'], 11, 8) . '</cbc:IssueTime>
                <cbc:DocumentCurrencyCode>' . $row['codMon'] . '</cbc:DocumentCurrencyCode>
                <cac:DiscrepancyResponse>
                    <cbc:ReferenceID>' . substr($row['comRel'], 2, 13) . '</cbc:ReferenceID>
                    <cbc:ResponseCode>' . $row['tipNot'] . '</cbc:ResponseCode>
                    <cbc:Description>' . $row['motNot'] . '</cbc:Description>
                </cac:DiscrepancyResponse>
                <cac:BillingReference>
                    <cac:InvoiceDocumentReference>
                        <cbc:ID>' . substr($row['comRel'], 2, 13) . '</cbc:ID>
                        <cbc:DocumentTypeCode>' . substr($row['comRel'], 0, 2) . '</cbc:DocumentTypeCode>
                    </cac:InvoiceDocumentReference>
                </cac:BillingReference>
                <cac:Signature>
                    <cbc:ID>' . $row['idEmp'] . '</cbc:ID>
                    <cbc:Note>SENCON</cbc:Note>
                    <cac:SignatoryParty>
                        <cac:PartyIdentification>
                            <cbc:ID>' . $row['idEmp'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyName>
                            <cbc:Name><![CDATA[' . $raz . ']]></cbc:Name>
                        </cac:PartyName>
                    </cac:SignatoryParty>
                    <cac:DigitalSignatureAttachment>
                        <cac:ExternalReference>
                            <cbc:URI>#SIGN-SENCON</cbc:URI>
                        </cac:ExternalReference>
                    </cac:DigitalSignatureAttachment>
                </cac:Signature>
                <cac:AccountingSupplierParty>
                    <cac:Party>
                        <cac:PartyIdentification>
                            <cbc:ID schemeID="6">' . $row['idEmp'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyName>
                            <cbc:Name><![CDATA[' . $raz . ']]></cbc:Name>
                        </cac:PartyName>
                        <cac:PartyLegalEntity>
                            <cbc:RegistrationName><![CDATA[' . $raz . ']]></cbc:RegistrationName>
                            <cac:RegistrationAddress>
                                <cbc:ID>' . $ubg . '</cbc:ID>
                                <cbc:AddressTypeCode>0001</cbc:AddressTypeCode>
                            </cac:RegistrationAddress>
                        </cac:PartyLegalEntity>
                    </cac:Party>
                </cac:AccountingSupplierParty>
                <cac:AccountingCustomerParty>
                    <cac:Party>
                        <cac:PartyIdentification>
                            <cbc:ID schemeID="' . $row['tipDocCli'] . '">' . $row['docCli'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyLegalEntity>
                            <cbc:RegistrationName><![CDATA[' . trim($row['razPer']) . ']]></cbc:RegistrationName>
                        </cac:PartyLegalEntity>
                    </cac:Party>
                </cac:AccountingCustomerParty>
                <cac:TaxTotal>
                    <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['igvCom']), 2, '.', '') . '</cbc:TaxAmount>
                    ';
                    $iscc = '';
                    if ($row['iscCom'] > 0) {
                        $iscc = '<cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">{{ doc.mtoBaseIsc|n_format }}</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">{{ doc.mtoISC|n_format }}</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cac:TaxScheme>
                                <cbc:ID>2000</cbc:ID>
                                <cbc:Name>ISC</cbc:Name>
                                <cbc:TaxTypeCode>EXC</cbc:TaxTypeCode>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal>
                    ';
                    }
                    $opgr = '';
                    if ($row['tipOpe'] == 10) {
                        $opgr = '<cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['valCom']), 2, '.', '') . '</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['igvCom']), 2, '.', '') . '</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cac:TaxScheme>
                                <cbc:ID>1000</cbc:ID>
                                <cbc:Name>IGV</cbc:Name>
                                <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal>
                    ';
                    }
                    $hxml1 = '</cac:TaxTotal>
                <cac:LegalMonetaryTotal>
                    <cbc:LineExtensionAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['valCom']), 2, '.', '') . '</cbc:LineExtensionAmount>
                    <cbc:PayableAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['totCom']), 2, '.', '') . '</cbc:PayableAmount>
                </cac:LegalMonetaryTotal>
                ';
                    $dxml = '';
                    $cont = 0;
                    while ($drow = $dcom->fetch_assoc()) {
                        $cont = $cont + 1;
                        $dscri = $drow['descri'] . $drow['descriPer'];
                        if ($dscri == "") {
                            $parra = "POR SERVICIO DE " . $drow['idCcp'] . " PERIODO: " . $drow['mesCro'] . "-" . $drow['anoCro'] . " " . $drow['cndCom'];
                        } else {
                            $parra = strtoupper($drow['descri'] . ' ' . $drow['descriPer']);
                        }
                        $valu = abs($drow['pago']) / 1.18;
                        $igvu = abs($drow['pago']) - round($valu, 2);
                        $preu = (($valu) / $drow['canti']);
                        $prec = abs($drow['pago']) / $drow['canti'];
                        $dxml1 = '<cac:CreditNoteLine>
                    <cbc:ID>' . $cont . '</cbc:ID>
                    <cbc:CreditedQuantity unitCode="' . $drow['medi'] . '">' . number_format($drow['canti'], 2, '.', '') . '</cbc:CreditedQuantity>
                    <cbc:LineExtensionAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:LineExtensionAmount>
                    <cac:PricingReference>
                        <cac:AlternativeConditionPrice>
                            <cbc:PriceAmount currencyID="' . $row['codMon'] . '">' . number_format($prec, 2, '.', '') . '</cbc:PriceAmount>
                            <cbc:PriceTypeCode>01</cbc:PriceTypeCode>
                        </cac:AlternativeConditionPrice>
                    </cac:PricingReference>
                    <cac:TaxTotal>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($igvu, 2, '.', '') . '</cbc:TaxAmount>
                        ';
                        $iscd = '';
                        if ($row['iscCom'] > 0) {
                            $iscd = '<cac:TaxSubtotal>
                            <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxableAmount>
                            <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxAmount>
                            <cac:TaxCategory>
                                <cbc:Percent>2.00</cbc:Percent>
                                <cbc:TierRange>02</cbc:TierRange>
                                <cac:TaxScheme>
                                    <cbc:ID>2000</cbc:ID>
                                    <cbc:Name>ISC</cbc:Name>
                                    <cbc:TaxTypeCode>EXC</cbc:TaxTypeCode>
                                </cac:TaxScheme>
                            </cac:TaxCategory>
                        </cac:TaxSubtotal>
                        ';
                        }
                        $dxml2 = '<cac:TaxSubtotal>
                            <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxableAmount>
                            <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($igvu, 2, '.', '') . '</cbc:TaxAmount>
                            <cac:TaxCategory>
                                <cbc:Percent>18.00</cbc:Percent>
                                <cbc:TaxExemptionReasonCode>10</cbc:TaxExemptionReasonCode>
                                <cac:TaxScheme>
                                    <cbc:ID>1000</cbc:ID>
                                    <cbc:Name>IGV</cbc:Name>
                                    <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                                </cac:TaxScheme>
                            </cac:TaxCategory>
                        </cac:TaxSubtotal>
                    </cac:TaxTotal>
                    <cac:Item>
                        <cbc:Description><![CDATA[' . trim($parra) . ']]></cbc:Description>
                    </cac:Item>
                    <cac:Price>
                        <cbc:PriceAmount currencyID="' . $row['codMon'] . '">' . number_format($preu, 2, '.', '') . '</cbc:PriceAmount>
                    </cac:Price>
                </cac:CreditNoteLine>
                ';
                        $dxml = $dxml . $dxml1 . $iscd . $dxml2;
                    }
                    $fxml = '</CreditNote>';
                    $xml = $hxml . $iscc . $opgr . $hxml1 . $dxml . $fxml;
                    break;
                case "08":
                    $hxml = '<?xml version="1.0" encoding="utf-8"?>
            <DebitNote xmlns="urn:oasis:names:specification:ubl:schema:xsd:DebitNote-2"
                       xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                       xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                       xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                       xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
                <ext:UBLExtensions>
                    <ext:UBLExtension>
                        <ext:ExtensionContent/>
                    </ext:UBLExtension>
                </ext:UBLExtensions>
                <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
                <cbc:CustomizationID>2.0</cbc:CustomizationID>
                <cbc:ID>' . substr($row['idDoc'], 13, 4) . '-' . $row['numDoc'] . '</cbc:ID>
                <cbc:IssueDate>' . substr($row['fecDocCom'], 0, 10) . '</cbc:IssueDate>
                <cbc:IssueTime>' . substr($row['fecRegCom'], 11, 8) . '</cbc:IssueTime>
                <cbc:DocumentCurrencyCode>' . $row['codMon'] . '</cbc:DocumentCurrencyCode>
                <cac:DiscrepancyResponse>
                    <cbc:ReferenceID>' . substr($row['comRel'], 2, 13) . '</cbc:ReferenceID>
                    <cbc:ResponseCode>' . $row['tipNot'] . '</cbc:ResponseCode>
                    <cbc:Description>' . $row['motNot'] . '</cbc:Description>
                </cac:DiscrepancyResponse>
                <cac:BillingReference>
                    <cac:InvoiceDocumentReference>
                        <cbc:ID>' . substr($row['comRel'], 2, 13) . '</cbc:ID>
                        <cbc:DocumentTypeCode>' . substr($row['comRel'], 0, 1) . '</cbc:DocumentTypeCode>
                    </cac:InvoiceDocumentReference>
                </cac:BillingReference>
                <cac:Signature>
                    <cbc:ID>' . $row['idEmp'] . '</cbc:ID>
                    <cbc:Note>SENCON</cbc:Note>
                    <cac:SignatoryParty>
                        <cac:PartyIdentification>
                            <cbc:ID>' . $row['idEmp'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyName>
                            <cbc:Name><![CDATA[' . $raz . ']]></cbc:Name>
                        </cac:PartyName>
                    </cac:SignatoryParty>
                    <cac:DigitalSignatureAttachment>
                        <cac:ExternalReference>
                            <cbc:URI>#SIGN-SENCON</cbc:URI>
                        </cac:ExternalReference>
                    </cac:DigitalSignatureAttachment>
                </cac:Signature>
                <cac:AccountingSupplierParty>
                    <cac:Party>
                        <cac:PartyIdentification>
                            <cbc:ID schemeID="6">' . $row['idEmp'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyName>
                            <cbc:Name><![CDATA[' . $raz . ']]></cbc:Name>
                        </cac:PartyName>
                        <cac:PartyLegalEntity>
                            <cbc:RegistrationName><![CDATA[' . $raz . ']]></cbc:RegistrationName>
                            <cac:RegistrationAddress>
                                <cbc:ID>' . $ubg . '</cbc:ID>
                                <cbc:AddressTypeCode>0001</cbc:AddressTypeCode>
                            </cac:RegistrationAddress>
                        </cac:PartyLegalEntity>
                    </cac:Party>
                </cac:AccountingSupplierParty>
                <cac:AccountingCustomerParty>
                    <cac:Party>
                        <cac:PartyIdentification>
                            <cbc:ID schemeID="' . $row['tipDocCli'] . '">' . $row['docCli'] . '</cbc:ID>
                        </cac:PartyIdentification>
                        <cac:PartyLegalEntity>
                            <cbc:RegistrationName><![CDATA[' . trim($row['razPer']) . ']]></cbc:RegistrationName>
                        </cac:PartyLegalEntity>
                    </cac:Party>
                </cac:AccountingCustomerParty>
                <cac:TaxTotal>
                    <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['igvCom']), 2, '.', '') . '</cbc:TaxAmount>
                    ';
                    $iscc = '';
                    if ($row['iscCom'] > 0) {
                        $iscc = '<cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">{{ doc.mtoBaseIsc|n_format }}</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">{{ doc.mtoISC|n_format }}</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cac:TaxScheme>
                                <cbc:ID>2000</cbc:ID>
                                <cbc:Name>ISC</cbc:Name>
                                <cbc:TaxTypeCode>EXC</cbc:TaxTypeCode>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal>
                    ';
                    }
                    $opgr = '';
                    if ($row['tipOpe'] == 10) {
                        $opgr = '<cac:TaxSubtotal>
                        <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['valCom']), 2, '.', '') . '</cbc:TaxableAmount>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['igvCom']), 2, '.', '') . '</cbc:TaxAmount>
                        <cac:TaxCategory>
                            <cac:TaxScheme>
                                <cbc:ID>1000</cbc:ID>
                                <cbc:Name>IGV</cbc:Name>
                                <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                            </cac:TaxScheme>
                        </cac:TaxCategory>
                    </cac:TaxSubtotal>
                    ';
                    }
                    $hxml1 = '</cac:TaxTotal>
                <cac:LegalMonetaryTotal>
                    <cbc:LineExtensionAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['valCom']), 2, '.', '') . '</cbc:LineExtensionAmount>
                    <cbc:PayableAmount currencyID="' . $row['codMon'] . '">' . number_format(abs($row['totCom']), 2, '.', '') . '</cbc:PayableAmount>
                </cac:LegalMonetaryTotal>
                ';
                    $dxml = '';
                    $cont = 0;
                    while ($drow = $dcom->fetch_assoc()) {
                        $cont = $cont + 1;
                        $dscri = $drow['descri'] . $drow['descriPer'];
                        if ($dscri == "") {
                            $parra = "POR SERVICIO DE " . $drow['idCcp'] . " PERIODO: " . $drow['mesCro'] . "-" . $drow['anoCro'] . " " . $drow['cndCom'];
                        } else {
                            $parra = strtoupper($drow['descri'] . ' ' . $drow['descriPer']);
                        }
                        $valu = abs($drow['pago']) / 1.18;
                        $igvu = abs($drow['pago']) - round($valu, 2);
                        $preu = (($valu) / $drow['canti']);
                        $prec = abs($drow['pago']) / $drow['canti'];
                        $dxml1 = '<cac:DebitNoteLine>
                    <cbc:ID>' . $cont . '</cbc:ID>
                    <cbc:DebitedQuantity unitCode="' . $drow['medi'] . '">' . number_format($drow['canti'], 2, '.', '') . '</cbc:DebitedQuantity>
                    <cbc:LineExtensionAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:LineExtensionAmount>
                    <cac:PricingReference>
                        <cac:AlternativeConditionPrice>
                            <cbc:PriceAmount currencyID="' . $row['codMon'] . '">' . number_format($prec, 2, '.', '') . '</cbc:PriceAmount>
                            <cbc:PriceTypeCode>01</cbc:PriceTypeCode>
                        </cac:AlternativeConditionPrice>
                    </cac:PricingReference>
                    <cac:TaxTotal>
                        <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($igvu, 2, '.', '') . '</cbc:TaxAmount>
                        ';
                        $iscd = '';
                        if ($row['iscCom'] > 0) {
                            $iscd = '<cac:TaxSubtotal>
                            <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxableAmount>
                            <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxAmount>
                            <cac:TaxCategory>
                                <cbc:Percent>2.00</cbc:Percent>
                                <cbc:TierRange>02</cbc:TierRange>
                                <cac:TaxScheme>
                                    <cbc:ID>2000</cbc:ID>
                                    <cbc:Name>ISC</cbc:Name>
                                    <cbc:TaxTypeCode>EXC</cbc:TaxTypeCode>
                                </cac:TaxScheme>
                            </cac:TaxCategory>
                        </cac:TaxSubtotal>
                        ';
                        }
                        $dxml2 = '<cac:TaxSubtotal>
                            <cbc:TaxableAmount currencyID="' . $row['codMon'] . '">' . number_format($valu, 2, '.', '') . '</cbc:TaxableAmount>
                            <cbc:TaxAmount currencyID="' . $row['codMon'] . '">' . number_format($igvu, 2, '.', '') . '</cbc:TaxAmount>
                            <cac:TaxCategory>
                                <cbc:Percent>18.00</cbc:Percent>
                                <cbc:TaxExemptionReasonCode>10</cbc:TaxExemptionReasonCode>
                                <cac:TaxScheme>
                                    <cbc:ID>1000</cbc:ID>
                                    <cbc:Name>IGV</cbc:Name>
                                    <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                                </cac:TaxScheme>
                            </cac:TaxCategory>
                        </cac:TaxSubtotal>
                    </cac:TaxTotal>
                    <cac:Item>
                        <cbc:Description><![CDATA[' . trim($parra) . ']]></cbc:Description>
                    </cac:Item>
                    <cac:Price>
                        <cbc:PriceAmount currencyID="' . $row['codMon'] . '">' . number_format($preu, 2, '.', '') . '</cbc:PriceAmount>
                    </cac:Price>
                </cac:DebitNoteLine>
                ';
                        $dxml = $dxml . $dxml1 . $iscd . $dxml2;
                    }
                    $fxml = '</DebitNote>';
                    $xml = $hxml . $iscc . $opgr . $hxml1 . $dxml . $fxml;
                    break;
                default:
                    $xml = '';
                    break;
            }
        }
        return $xml;
    }

    function numtolet($xcifra, $mone)
    {
        $xarray = array(
            0 => "Cero",
            1 => "UNO",
            "DOS",
            "TRES",
            "CUATRO",
            "CINCO",
            "SEIS",
            "SIETE",
            "OCHO",
            "NUEVE",
            "DIEZ",
            "ONCE",
            "DOCE",
            "TRECE",
            "CATORCE",
            "QUINCE",
            "DIECISEIS",
            "DIECISIETE",
            "DIECIOCHO",
            "DIECINUEVE",
            "VEINTI",
            30 => "TREINTA",
            40 => "CUARENTA",
            50 => "CINCUENTA",
            60 => "SESENTA",
            70 => "SETENTA",
            80 => "OCHENTA",
            90 => "NOVENTA",
            100 => "CIENTO",
            200 => "DOSCIENTOS",
            300 => "TRESCIENTOS",
            400 => "CUATROCIENTOS",
            500 => "QUINIENTOS",
            600 => "SEISCIENTOS",
            700 => "SETECIENTOS",
            800 => "OCHOCIENTOS",
            900 => "NOVECIENTOS"
        );
        //
        $xcifra = trim($xcifra); //1541.23
        $xlength = strlen($xcifra); //7
        $xpos_punto = strpos($xcifra, "."); //4
        $xaux_int = $xcifra; //1541.23
        $xdecimales = "00"; //00
        if (!($xpos_punto === false)) {
            if ($xpos_punto == 0) { //.23
                $xcifra = "0" . $xcifra; //0.23
                $xpos_punto = strpos($xcifra, "."); //1
            }
            $xaux_int = substr($xcifra, 0, $xpos_punto); // obtengo el entero de la cifra a covertir 1541
            $xdecimales = substr($xcifra . "00", $xpos_punto + 1, 2); // obtengo los valores decimales 1541.2300
        }

        $XAUX = str_pad($xaux_int, 18, " ", STR_PAD_LEFT); // ajusto la longitud de la cifra, para que sea divisible por centenas de miles (grupos de 6)
        $xcadena = "";
        for ($xz = 0; $xz < 3; $xz++) {
            $xaux = substr($XAUX, $xz * 6, 6);
            $xi = 0;
            $xlimite = 6; // inicializo el contador de centenas xi y establezco el límite a 6 dígitos en la parte entera
            $xexit = true; // bandera para controlar el ciclo del While
            while ($xexit) {
                if ($xi == $xlimite) { // si ya llegó al límite máximo de enteros
                    break; // termina el ciclo
                }

                $x3digitos = ($xlimite - $xi) * -1; // comienzo con los tres primeros digitos de la cifra, comenzando por la izquierda
                $xaux = substr($xaux, $x3digitos, abs($x3digitos)); // obtengo la centena (los tres dígitos)
                for ($xy = 1; $xy < 4; $xy++) { // ciclo para revisar centenas, decenas y unidades, en ese orden
                    switch ($xy) {
                        case 1: // checa las centenas
                            if (substr($xaux, 0, 3) < 100) { // si el grupo de tres dígitos es menor a una centena ( < 99) no hace nada y pasa a revisar las decenas

                            } else {
                                $key = (int) substr($xaux, 0, 3);
                                if (TRUE === array_key_exists($key, $xarray)) { // busco si la centena es número redondo (100, 200, 300, 400, etc..)
                                    $xseek = $xarray[$key];
                                    $xsub = $this->subfijo($xaux); // devuelve el subfijo correspondiente (Millón, Millones, Mil o nada)
                                    if (substr($xaux, 0, 3) == 100)
                                        $xcadena = " " . $xcadena . " CIEN " . $xsub;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                    $xy = 3; // la centena fue redonda, entonces termino el ciclo del for y ya no reviso decenas ni unidades
                                } else { // entra aquí si la centena no fue numero redondo (101, 253, 120, 980, etc.)
                                    $key = (int) substr($xaux, 0, 1) * 100;
                                    $xseek = $xarray[$key]; // toma el primer caracter de la centena y lo multiplica por cien y lo busca en el arreglo (para que busque 100,200,300, etc)
                                    $xcadena = " " . $xcadena . " " . $xseek;
                                } // ENDIF ($xseek)
                            } // ENDIF (substr($xaux, 0, 3) < 100)
                            break;
                        case 2: // checa las decenas (con la misma lógica que las centenas)
                            if (substr($xaux, 1, 2) < 10) {

                            } else {
                                $key = (int) substr($xaux, 1, 2);
                                if (TRUE === array_key_exists($key, $xarray)) {
                                    $xseek = $xarray[$key];
                                    $xsub = $this->subfijo($xaux);
                                    if (substr($xaux, 1, 2) == 20)
                                        $xcadena = " " . $xcadena . " VEINTE " . $xsub;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                    $xy = 3;
                                } else {
                                    $key = (int) substr($xaux, 1, 1) * 10;
                                    $xseek = $xarray[$key];
                                    if (20 == substr($xaux, 1, 1) * 10)
                                        $xcadena = " " . $xcadena . " " . $xseek;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " Y ";
                                } // ENDIF ($xseek)
                            } // ENDIF (substr($xaux, 1, 2) < 10)
                            break;
                        case 3: // checa las unidades
                            if (substr($xaux, 2, 1) < 1) { // si la unidad es cero, ya no hace nada

                            } else {
                                $key = (int) substr($xaux, 2, 1);
                                $xseek = $xarray[$key]; // obtengo directamente el valor de la unidad (del uno al nueve)
                                $xsub = $this->subfijo($xaux);
                                $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                            } // ENDIF (substr($xaux, 2, 1) < 1)
                            break;
                    } // END SWITCH
                } // END FOR
                $xi = $xi + 3;
            } // ENDDO

            if (substr(trim($xcadena), -5, 5) == "ILLON") // si la cadena obtenida termina en MILLON o BILLON, entonces le agrega al final la conjuncion DE
                $xcadena .= " DE";

            if (substr(trim($xcadena), -7, 7) == "ILLONES") // si la cadena obtenida en MILLONES o BILLONES, entoncea le agrega al final la conjuncion DE
                $xcadena .= " DE";

            // ----------- esta línea la puedes cambiar de acuerdo a tus necesidades o a tu país -------
            $moneda = "";
            if (trim($mone) != "") {
                switch ($mone) {
                    case "PEN":
                        $moneda = "SOLES";
                        break;
                    case "USD":
                        $moneda = "DOLARES AMERICANOS";
                        break;
                    case "XEU":
                        $moneda = "EUROS";
                        break;
                    case "CHF":
                        $moneda = "FRANCOS SUIZOS";
                        break;
                    case "GBP":
                        $moneda = "LIBRAS ESTERLINAS";
                        break;
                    case "JPY":
                        $moneda = "YENES";
                        break;
                    default:
                        $moneda = "";
                        break;
                }
            }
            if (trim($xaux) != "") {
                switch ($xz) {
                    case 0:
                        if (trim(substr($XAUX, $xz * 6, 6)) == "1")
                            $xcadena .= "UN BILLON ";
                        else
                            $xcadena .= " BILLONES ";
                        break;
                    case 1:
                        if (trim(substr($XAUX, $xz * 6, 6)) == "1")
                            $xcadena .= "UN MILLON ";
                        else
                            $xcadena .= " MILLONES ";
                        break;
                    case 2:
                        if ($xcifra < 1) {
                            $xcadena = "CERO CON $xdecimales/100 " . $moneda;
                        }
                        if ($xcifra >= 1 && $xcifra < 2) {
                            $xcadena = "UNO CON $xdecimales/100 " . $moneda;
                        }
                        if ($xcifra >= 2) {
                            $xcadena .= " CON $xdecimales/100 " . $moneda; //
                        }
                        break;
                } // endswitch ($xz)
            } // ENDIF (trim($xaux) != "")
            // ------------------      en este caso, para México se usa esta leyenda     ----------------
            $xcadena = str_replace("VEINTI ", "VEINTI", $xcadena); // quito el espacio para el VEINTI, para que quede: VEINTICUATRO, VEINTIUN, VEINTIDOS, etc
            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles
            $xcadena = str_replace("UNO UNO", "UNO", $xcadena); // quito la duplicidad
            //$xcadena = str_replace("UNO UN ", "UN ", $xcadena); // quito la duplicidad
            $xcadena = str_replace("UNO MIL ", "UN MIL ", $xcadena); // quito la duplicidad
            //$xcadena = str_replace("UN MIL UN ", "UN MIL ", $xcadena); // quito la duplicidad
            //$xcadena = str_replace("UN MIL UNO MILLONES", "UN MIL MILLONES", $xcadena); // quito la duplicidad

            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles
            $xcadena = str_replace("BILLON DE MILLONES", "BILLON DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("BILLONES DE MILLONES", "BILLONES DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("DE UNO", "UNO", $xcadena); // corrigo la leyenda
        } // ENDFOR ($xz)
        return trim($xcadena);
    }
    function subfijo($xx)
    { // esta función regresa un subfijo para la cifra
        $xx = trim($xx);
        $xstrlen = strlen($xx);
        if ($xstrlen == 1 || $xstrlen == 2 || $xstrlen == 3)
            $xsub = "";
        //
        if ($xstrlen == 4 || $xstrlen == 5 || $xstrlen == 6)
            $xsub = "MIL";
        //
        return $xsub;
    }
} ?>

<html>

<head>
    <title>test </title>
</head>

<body>

    <?php
    /* CONSULTA COMPROBANTES FIRMADOS
    require 'model/ComprobanteM.php';
    $items = new ComprobanteM();
    if(isset($_GET['empre'])){$emp=$_GET['empre'];}else{$emp="NUL";}
    if(isset($_GET['fecha'])){$fec=$_GET['fecha'];}else{$fec="1990-01-01";}
    $rst=$items->trafacfir($emp,$fec);
    $nrows=$rst->num_rows;*/?>
    Numero de registros: (1)
    <?php /*echo $nrows */?><br>

    <ul>
        <?php $conti = 0;
        /*LOOP DE COMPROBANTES
        while($frow=$rst->fetch_assoc()){
          $name= $frow['idEmp']."-".substr($frow['idDoc'],11,2)."-".substr($frow['idDoc'],13,4)."-".$frow['numDoc'];*/

        //<!---archivo de ejemplo
        $name = '20100302269-01-F005-00002802';
        $imageData = "";
        //-->
        
        ?>
        <li>
            <?= $conti = $conti + 1 ?> :
            <?= $name ?>
            <br>
            <?php $filenaz = $name . ".zip";
            if (file_exists($filenaz)) {
                $imagen = file_get_contents($filenaz);
                $imageData = base64_encode($imagen);
                $out = "Zip codificado";
            } else {
                $out = "No existe zip";
            }

            $xmlsenbill = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.sunat.gob.pe">
            <soapenv:Header>
            <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <wsse:UsernameToken>
            <wsse:Username>20100302269MODDATOS</wsse:Username>
            <wsse:Password>moddatos</wsse:Password>
            </wsse:UsernameToken>
            </wsse:Security>
            </soapenv:Header>
            <soapenv:Body>
            <ser:sendBill>
            <fileName>' . $name . '.zip</fileName>
            <contentFile>' . $imageData . '</contentFile>
            </ser:sendBill>
            </soapenv:Body>
            </soapenv:Envelope>';

            echo $out . "<br>";
            echo "<textarea cols='100'>" . $xmlsenbill . "</textarea><br><br>";

            //CLASE SOAP
            
            //<!---Servicio web
            $service = 'https://ose-test.com/ol-ti-itcpe/billService.svc?wsdl';
            //--->Servicio web 
            
            $headers = new CustomHeaders('20100302269MODDATOS', 'MODDATOS');
            $client = new SoapClient(
                $service,
                [
                    'cache_wsdl' => WSDL_CACHE_NONE,
                    'trace' => TRUE,
                    'soap_version' => SOAP_1_1
                ]
            );
            $client->__setSoapHeaders([$headers]);

            $fcs = $client->__getFunctions();
            //var_dump($fcs);
            
            $fileName = '20100302269-01-F005-00002802.zip';
            $params = array('fileName' => $fileName, 'contentFile' => file_get_contents($fileName));
            $status = $client->sendBill($params);
            print_r($status);
            /*$params= array( 'fileName' => $filenaz, 'contentFile' => $imageData );


            try {
                print( $client->__soapCall('sendBill',array($params)) );
            } catch (SoapFault $exception) {
              print_r($client->__getLastRequest());
              echo $exception;
            }*/



            //CLASE NUSOAP
/*
  require_once 'nusoap.php';
  $usuario='20100302269MODDATOS';
  $password='moddatos';
  $endpoint='https://ose-test.com/ol-ti-itcpe/billService.svc?wsdl';
  $cliente = new nusoap_client($endpoint,true);
  $cliente->soap_defencoding = 'utf-8';
  $cliente->decode_utf8 = false;
  $err = $cliente->getError();
  if (!empty($err)) {
    $errorMessage = '<h2>Constructor error</h2><pre>' . $err . '</pre>';
    throw new Exception($errorMessage);}

                
        if($response = $cliente->send($xmlsenbill,'sendBill')){
          if($cliente->fault){
            echo "FAULT: <pre>Code: (".$cliente->faultcode.")</pre>";
            echo "String: ".$cliente->faultstring;}
          else{
            print_r('<h4>Response</h4><pre>' .$cliente->response. '</pre>');
            }}
        else{
          echo "Error de envio."; }

        print_r('<h4>Request</h4>' .$cliente->request. '</br>');
        //print_r('<h4>Debug</h4><pre>' . htmlspecialchars($client->debug_str, ENT_QUOTES) . '</pre>');
*/

            ?>
        </li>
        <?php
        /* FIN LOOP
        }*/
        ?>
    </ul>
</body>

</html>