<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
require_once(CLASSES_DIR . 'Context.php');

$store = ARC2::getStore($config);

if (!$store->isSetUp()) {
  $store->setUp();
}
$testArray = array('label' => 'TestLabel', 'desc'=>'Test Description');

$newContext = new Context(false, $_POST);
$newContext->buildAddGraph();

$retObj = new StdClass();
$retObj->uri = $newContext->uri;
$retObj->label = $newContext->postData['label'];
$retObj->status = 'success';


header('Content-type: application/json');
echo json_encode($retObj);



?>
