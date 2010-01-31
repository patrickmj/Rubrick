<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
require_once(CLASSES_DIR . 'Rubric.php');


		

$store = ARC2::getStore($config);

if (!$store->isSetUp()) {
  $store->setUp();
}


$obj = json_decode(  $_POST['json']  );

if(isset($_POST['uri'])) {
	$newRubric = new Rubric($obj, $_POST['uri']);
} else {
	$newRubric = new Rubric($obj);
}

$newRubric->buildGraph();

//echo $newRubric->graph->toNTriples();

$q = 'INSERT INTO <>  { '  . $newRubric->graph->toNTriples() . ' } ' ;



$rs = $store->query($q);
//print_r($rs);




?>
