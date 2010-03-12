<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
include(CLASSES_DIR . 'Updater.php');



header('Content-type: application/json');

$store = ARC2::getStore($config);
$POST['jsonStr'] = '{"new":"{}","old":"{\"http://data.rubrick-jetpack.org/Rubrics/0280bce1098ee66c35f8027d3a200b9f9d6cc90a\":{\"http://www.holygoat.co.uk/owl/redwood/0.1/tags/tag\":[{\"value\":\"http://data.rubrick-jetpack.org/Tag/tagged_rubric\",\"type\":\"uri\"},{\"value\":\"http://data.rubrick-jetpack.org/Tag/woot_tag_2\",\"type\":\"uri\"}]}}"}';
$postObj = json_decode($POST['jsonStr']);
/*
$jsonObj = json_decode($jsonStr);
$newIndex = json_decode($jsonObj->new, true);
//print_r($newIndex);
$testT = new Tagging(false, array('properties'=>array('newTagGraph' => $newIndex)) );
$testT->buildUpdateGraph();
echo json_encode($testT->updateGraph->toRDFJSON(true) );
*/


$u = new Updater(false, array('post'=>$postObj));
$u->buildDeleteGraph();
echo json_encode($u->deleteGraph->toRDFJSON(true));
?>
