<?php

include('config.php');
include(CLASSES_DIR . 'RubricSelector.php');
include(CLASSES_DIR . 'RubricLineSelector.php');
include(CLASSES_DIR . 'RubricLineValueSelector.php');


header('Content-type: application/json');

$returnDataObj = new StdClass();

//$rSel = new RubricSelector(array('pageURL'=> 'http://localhost/testJS/jetpacks/rubrick/testPage.html'));

$arr = array('uri'=> 'http://data.rubrick-jetpack.org/Rubrics/7ec851c1eec48c3fb0bbd0863b201a90501368c6', 'by'=>'byURI');
$rSel = new RubricSelector($arr);


$rSel->doQuery();
$rSel->processResultSet();

$returnDataObj->rObj = $rSel->preJSONObj;

$lineURIs = $rSel->extractBinding('rLineURI');

$lineValURIs = array();

foreach($lineURIs as $rLineURI) {
	$rLineSel = new RubricLineSelector(array('uri'=>$rLineURI));
	$rLineSel->doQuery();
	$rLineSel->processResultSet();
	$returnDataObj->rLines->$rLineURI = $rLineSel->preJSONObj; 
	$lineValURIs = array_merge($lineValURIs, $rLineSel->extractBinding('rLValueURI'));
}


foreach($lineValURIs as $lineValURI) {
	$rlvSel = new RubricLineValueSelector(array('uri'=>$lineValURI));
	$rlvSel->doQuery();
	$rlvSel->processResultSet();
	$returnDataObj->rLineVals->$lineValURI = $rlvSel->preJSONObj;

}

//echo $rSel->getJSON();
echo json_encode($returnDataObj) ;




?>
