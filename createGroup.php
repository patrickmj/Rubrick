<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
require_once(CLASSES_DIR . 'UserGroup.php');


$store = ARC2::getStore($config);
//header("Content-type: application/json");

$postObj = new stdClass();
foreach($_POST as $key=>$val) {
	$postObj->$key = $val;
}
$init = array('post' => $postObj);

$ug = new UserGroup(false, $init);
$ug->buildAddGraph();



$ug->finalizeGraph('add');

echo $ug->addGraph->toTurtle();




?>