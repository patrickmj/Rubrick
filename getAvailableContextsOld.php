<?php

include('config.php');
include_once('checkLogin.php');
include(CLASSES_DIR . 'ContextSelector.php');
include(CLASSES_DIR . 'RubricSelector.php');
include(CLASSES_DIR . 'PermissionsManager.php');
include(CLASSES_DIR . 'RecordingSelector.php');

header('Content-type: application/json');



$obj = new stdClass();
$pm = new PermissionsManager();
$pm->doQueries();

$obj->perms = $pm->perms;
$contextsForRecordings = array();
$contextsForSubmissions = array();


$contexts = new stdClass();
$rubricURIs = array();
foreach($pm->perms as $context=>$perms) {
	$cSelector = new ContextSelector(array('uri'=>$context, 'by'=>'byURI'));
	$cSelector->setQuery();
	$cSelector->doQuery();
	$cSelector->processResultSet();
	$contexts->$context = $cSelector->preJSONObj;

	$rubricURIs = array_merge($rubricURIs, $cSelector->extractBinding('rURI'));

	if( in_array('viewRecordings', $perms)) {
		$contextsForRecordings[] = $context;
	}

	if( in_array('submit', $perms)) {
		$contextsForSubmissions[] = $context;
	}
}
$rContext = "r:Context";
$obj->$rContext = $contexts;



$rubricsObj = new stdClass();
foreach($rubricURIs as $rubricURI) {
	if($rubricURI != '') {
		$rubricSel = new RubricSelector(array('by'=>'byURI'));
		$rubricSel->uri = $rubricURI;
		$rubricSel->setQuery();
		$rubricSel->doQuery();
		$rubricSel->processResultSet();
		$rubricsObj->$rubricURI =  $rubricSel->preJSONObj;

	}

}
$rRubric = "r:Rubric";
$obj->$rRubric = $rubricsObj;



$rSel = new RecordingSelector(array('by'=>'byContext'));
foreach($contextsForRecordings as $context) {
	$rSel->ecURI = $context;
	$rSel->setQuery();
	$rSel->doQuery();
	$rSel->processResultSet();
}
$rRecording = "r:Recording";
$obj->$rRecording = $rSel->preJSONObj;

/*

$subSel = new SubmissionSelector(array('by'=>'byContext'));
foreach($contextsForSubmissions as $context) {
	$subSel->ecURI = $context;
	$subSel->setQuery();
	$subSel->doQuery();
	$subSel->processResultSet();
}
$obj->submissions = $rSel->preJSONObj;

*/

$obj->message = "ok";
echo json_encode($obj);




?>
