<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
include(CLASSES_DIR . 'Updater.php');
//header("Content-type: application/json");

$POST['jsonStr'] = '{"new":"{\"http://code.rubrick-jetpack.org/vocab/Context1\":{\"http://code.rubrick-jetpack.org/vocab/hasRubric\":[{\"value\":\"http://data.rubrick-jetpack.org/Rubrics/0280bce1098ee66c35f8027d3a200b9f9d6cc90a\",\"type\":\"uri\"},{\"value\":\"http://data.rubrick-jetpack.org/Rubric/e8b35301ee7356e7327c04ebcb124d0326c9985e\",\"type\":\"uri\"},{\"value\":\"http://data.rubrick-jetpack.org/Rubric/0d16f131095427d03361d9d4a2097c9e112f8035\",\"type\":\"uri\"}]}}","old":"{}"}';
//$testPost['uri'] = 'http://testURI.org';

$store = ARC2::getStore($config);
$responseObj = new stdClass();
//$postObj = json_decode($_POST['jsonStr']);
$postObj = json_decode($_POST['jsonStr']);

$updater = new Updater(false, array('post'=>$postObj));
//print_r($updater->postData);

$updater->buildAddGraph();
$updater->buildDeleteGraph();
$updater->finalizeGraph('add');
$updater->finalizeGraph('delete');
//print_r($updater->store->getErrors());
//echo $updater->addGraph->toNTriples();
//echo json_encode($updater->deleteGraph->toRDFJSON(true) );

?>