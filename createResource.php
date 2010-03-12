<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');

header("Content-type: text/json");
$store = ARC2::getStore($config);
$responseObj = new stdClass();
$postObj = json_decode($_POST['jsonStr']);


$init = array('post' => $postObj);

switch ($postObj->type) {
	case "r:ConfirmationUserGroup" :
		require_once(CLASSES_DIR . 'ConfirmationUserGroup.php');		
		$newRes = new ConfirmationUserGroup(false, $init);
	break;

	case "r:Context":
		require_once(CLASSES_DIR . 'Context.php');
		$newRes = new Context(false, $init);		
	break;

	case "r:Network":
		require_once(CLASSES_DIR . 'Network.php');
		$newRes = new Network(false, $init);
	break;

	case "r:Permissioning":
		require_once(CLASSES_DIR . 'Permissioning.php');
		$newRes = new Permissioning(false, $init);
	break;

	case "r:Rubric":
		require_once(CLASSES_DIR . 'Rubric.php');
		$newRes = new Rubric(false, $init);
	break;

	case "r:RubricLine":
		require_once(CLASSES_DIR . 'RubricLine.php');
		$newRes = new RubricLine(false, $init);
		$metaRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
		$metaRes->setURI($newRes->uri);
		$metaRes->addPropValue('sioc:name', 'New Line Label', 'literal');
		$metaRes->addPropValue('r:description', 'New Line Description' , 'literal');
		$newRes->addGraph->addResource($metaRes);
	break;
	case "tagging:Tagging":
		require_once(CLASSES_DIR . 'Tagging.php');
		$newRes = new Tagging(false, $init);
		$newRes->revResourceURI = $postObj->revURI;
	break;

}



//$retGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);

$newRes->buildAddGraph();
$newRes->finalizeGraph('add', true);

$responseObj->graph = $newRes->addGraph->toRDFJSON(true);
$responseObj->status = "ok";
$responseObj->message = "All good in the hood";
$responseObj->uri = $newRes->uri;
$responseObj->type = $newRes->typeURI;
	

echo json_encode($responseObj);







?>