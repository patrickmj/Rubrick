<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
include(CLASSES_DIR . 'Updater.php');
header("Content-type: application/json");

$testPost['jsonStr'] = '{"old":"{\"http://code.rubrick-jetpack.org/vocab/Context1\":{\"http://rdfs.org/sioc/ns#name\":[{\"value\":\"Demo\",\"type\":\"literal\"}],\"http://code.rubrick-jetpack.org/vocab/description\":[{\"value\":\"Just a demo\",\"type\":\"literal\"}]}}","new":"{\"http://code.rubrick-jetpack.org/vocab/Context1\":{\"http://rdfs.org/sioc/ns#name\":[{\"value\":\"Demo\",\"type\":\"literal\"}],\"http://code.rubrick-jetpack.org/vocab/description\":[{\"value\":\"Just a demo ed\",\"type\":\"literal\"}]}}","uri":"http://code.rubrick-jetpack.org/vocab/Context1"}';
$testPost['uri'] = 'http://testURI.org';

$store = ARC2::getStore($config);
$responseObj = new stdClass();
//$postObj = json_decode($_POST['jsonStr']);
$postObj = json_decode($_POST['jsonStr']);

$updater = new Updater($_POST['uri'], array('post'=>$postObj));
//print_r($updater->postData);

$updater->buildAddGraph();
$updater->buildDeleteGraph();
$updater->finalizeGraph('add');
$updater->finalizeGraph('delete');

//echo json_encode($updater->deleteGraph->toRDFJSON(true) );

?>