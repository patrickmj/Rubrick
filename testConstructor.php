<?php
include('config.php');
include(CLASSES_DIR . 'ContextConstructor.php');
include(CLASSES_DIR . 'RubricConstructor.php');
include(CLASSES_DIR . 'RecordingConstructor.php');
include(CLASSES_DIR . 'PermissionsManager.php');

header('Content-type: application/json');

$obj = new stdClass();
$pm = new PermissionsManager();
$pm->doQueries();
$obj->perms = $pm->perms;

$contextsForRecordings = array();
$contextsForSubmissions = array();
$rubricURIs = array();
$bigGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
foreach($pm->perms as $context=>$perms) {
	$cConst = new ContextConstructor(array('uri'=>$context, 'by'=>'byURI'));
	$bigGraph->mergeResourceGraph($cConst->graph);

	if( in_array('viewRecordings', $perms)) {
		$recConst = new RecordingConstructor(array('cURI'=>$context, 'by'=>'byContext'));
		$bigGraph->mergeResourceGraph($recConst->graph);
	}

	if( in_array('submit', $perms)) {
		//gather up submissions?
	}
	
}

$contexts = $bigGraph->getResourcesGraphByType('r:Context');
$rubrics = $bigGraph->getResourcesGraphByType('r:Rubric');
$recordings = $bigGraph->getResourcesGraphByType('r:Recording');

$rContext = "r:Context";
$rRubric = "r:Rubric";
$rRecording = "r:Recording";

$obj->$rContext = $contexts->toRDFJSON(true);
$obj->$rRubric = $rubrics->toRDFJSON(true);
$obj->$rRecording = $recordings->toRDFJSON(true);
echo json_encode($obj);

?>