<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');

header("Content-type: application/json");
$store = ARC2::getStore($config);
/*
$s = $_GET['s'];
$p = $_GET['p'];
$o = $_GET['o'];
*/
$triplesObj = json_decode($_POST['data']);

foreach($triplesObj as $triple) {
	$query = $prefixes . " ASK WHERE { <$triple->s> <$triple->p> <$triple->o> } ";	
	$retObj = new stdClass();	
}

$rs = (bool) $store->query($query, 'raw');


$retObj->status = "ok";
$retObj->message = false;
//$retObj->id = $_GET['id'];
$retObj->result = $rs;

echo json_encode($retObj);

?>