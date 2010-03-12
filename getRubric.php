<?php

include('config.php');
include('checkLogin.php');
include(CLASSES_DIR . 'RubricConstructor.php');
include(CLASSES_DIR . 'RubricLineConstructor.php');
include(CLASSES_DIR . 'RubricLineValueConstructor.php');
include(CLASSES_DIR . 'PermissionsManager.php');
include(CLASSES_DIR . 'RecordingConstructor.php');

header('Content-type: application/json');

$bigGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
$pm = new PermissionsManager();
$pm->doQueries();
$obj->perms = $pm->perms;
$obj = new stdClass();


//$rubricURI = $_GET['uri'];
$rubricURI = 'http://data.rubrick-jetpack.org/Rubric/375fc5437c3f1b47f50fb7803ba956cfa761c51e';
$rubric = new RubricConstructor(array('uri'=>$rubricURI, 'by'=>'byURI'));
$bigGraph->mergeResourceGraph($rubric->graph);

$lineURIs = $rubric->graph->getObjectsForResourcePred($rubricURI, 'r:hasLine');


foreach($lineURIs as $lURI) {
	$lConst = new RubricLineConstructor(array('uri'=>$lURI));
	//echo json_encode($lConst->graph->toRDFJSON(true) );
	$bigGraph->mergeResourceGraph($lConst->graph);	
}





if( $pm->hasPermission($_GET['contextURI'], 'r:viewRecordings') ) {
	$recConst = new RecordingConstructor(array('rubricURI'=>$_GET['uri'],
											   'cURI'=>$_GET['contextURI'],
											   'by'=>'byContextRubric'));
	$bigGraph->mergeResourceGraph($recConst->graph);
}



$rubrics = $bigGraph->getResourcesGraphByType('r:Rubric');
$recordings = $bigGraph->getResourcesGraphByType('r:Recording');
$rubricLines = $bigGraph->getResourcesGraphByType('r:RubricLine');
$rubricLineValues = $bigGraph->getResourcesGraphByType('r:RubricLineValue');

$rRecording = "r:Recording";
$rRubricLine = "r:RubricLine";
$rRubricLineValue = "r:RubricLineValue";
$rRubric = "r:Rubric";

//$obj->full = $bigGraph->toRDFJSON(true);
$obj->$rRubric = $rubrics->toRDFJSON(true);
$obj->$rRubricLineValue = $rubricLineValues->toRDFJSON(true);
$obj->$rRubricLine = $rubricLines->toRDFJSON(true);
$obj->$rRecording = $recordings->toRDFJSON(true);

//echo json_encode($bigGraph->toRDFJSON(true));
echo json_encode($obj) ;


?>
