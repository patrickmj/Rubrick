<?php

include('config.php');
include(CLASSES_DIR . 'RubricSelector.php');
include(CLASSES_DIR . 'RubricLineSelector.php');
include(CLASSES_DIR . 'RubricLineValueSelector.php');


header('Content-type: application/json');

$returnDataObj = new StdClass();

//$rSel = new RubricSelector(array('pageURL'=> 'http://localhost/testJS/jetpacks/rubrick/testPage.html'));
$uri = $_GET['uri'];
$by = $_GET['by'];


$arr = array('uri'=> $uri, 'by'=>$by);
$rSel = new RubricSelector($arr);

$rSel->setQuery();
$rSel->doQuery();
$rSel->processResultSet();

$returnDataObj->rObj = $rSel->preJSONObj;

$lineURIs = $rSel->extractBinding('rLineURI');

$lineValURIs = array();

foreach($lineURIs as $rLineURI) {
	$rLineSel = new RubricLineSelector(array('uri'=>$rLineURI));
	$rLineSel->setQuery();
	$rLineSel->doQuery();
	$rLineSel->processResultSet();
	$returnDataObj->rLines->$rLineURI = $rLineSel->preJSONObj; 
	$lineValURIs = array_merge($lineValURIs, $rLineSel->extractBinding('rLValueURI'));
}


foreach($lineValURIs as $lineValURI) {
	$rlvSel = new RubricLineValueSelector(array('uri'=>$lineValURI));
	$rlvSel->setQuery();
	$rlvSel->doQuery();
	$rlvSel->processResultSet();
	$returnDataObj->rLineVals->$lineValURI = $rlvSel->preJSONObj;

}

//TODO: get any recordings that go with it


$returnDataObj->rubricURI = $uri;
//echo $rSel->getJSON();
echo json_encode($returnDataObj) ;




?>
