<?php
include('config.php');
include('checkLogin.php');
include(CLASSES_DIR . 'ContextConstructor.php');
include(CLASSES_DIR . 'RubricConstructor.php');
include(CLASSES_DIR . 'RecordingConstructor.php');
include(CLASSES_DIR . 'PermissionsManager.php');
include(CLASSES_DIR . 'ConfirmationUserGroupConstructor.php');
include(CLASSES_DIR . 'NetworkConstructor.php');
include(CLASSES_DIR . 'TagCollector.php');

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

	$rubricConst = new RubricConstructor(array('contextURI'=>$context, 'by'=>'byContextURI'));
	$bigGraph->mergeResourceGraph($rubricConst->graph);


	if( $pm->hasPermission($context, 'r:viewRecordings') ) {
		$recConst = new RecordingConstructor(array('cURI'=>$context, 'by'=>'byContext'));
		$bigGraph->mergeResourceGraph($recConst->graph);
	}


	if( in_array('submit', $perms)) {
		//gather up submissions
	}
	
}

$myConfUserGroups = new ConfirmationUserGroupConstructor(array('by'=>'byCreatorURI' , 'creatorURI'=>$_SESSION['userURI']));
$myNetworks = new NetworkConstructor(array('by'=>'byCreatorURI' , 'creatorURI'=>$_SESSION['userURI']));
$bigGraph->mergeResourceGraph($myConfUserGroups->graph);
$bigGraph->mergeResourceGraph($myNetworks->graph);

$myRubrics = new RubricConstructor(array('creatorURI'=>$_SESSION['userURI'], 'by'=>'byCreatorURI') );
$bigGraph->mergeResourceGraph($myRubrics->graph);

$users = $bigGraph->getResourcesGraphByType('sioc:User');


$allSubjectURIs = $bigGraph->getResourceURIs();
$tc = new TagCollector(array('uris'=>$allSubjectURIs));
$tc->buildTagGraphForAllURIs();


$contexts = $bigGraph->getResourcesGraphByType('r:Context');
$rubrics = $bigGraph->getResourcesGraphByType('r:Rubric');
$recordings = $bigGraph->getResourcesGraphByType('r:Recording');
$rContext = "r:Context";
$rRubric = "r:Rubric";
$rRecording = "r:Recording";
$rConfirmationUserGroup = "r:ConfirmationUserGroup";
$rNetwork = "r:Network";
$taggingTag = "tagging:Tag";
$siocUser = "sioc:User";

$obj->$taggingTag = $tc->graph->toRDFJSON(true);
$tc->setTagURIsFromGraph();
$obj->tagURIMap = $tc->buildTagURIMap();


$obj->$siocUser = $users->toRDFJSON(true);
$obj->$rNetwork = $myNetworks->toRDFJSON(true);

$obj->$rConfirmationUserGroup = $myConfUserGroups->toRDFJSON(true);
$obj->$rContext = $contexts->toRDFJSON(true);
$obj->$rRubric = $rubrics->toRDFJSON(true);
$obj->$rRecording = $recordings->toRDFJSON(true);

echo json_encode($obj);

?>