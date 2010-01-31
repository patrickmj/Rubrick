<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
require_once(CLASSES_DIR . 'Rubric.php');
require_once(CLASSES_DIR . 'Context.php');

		

$store = ARC2::getStore($config);

if (!$store->isSetUp()) {
  $store->setUp();
}

$rjson = stripslashes($_POST['rJSON']) ;
$robj = json_decode( $rjson   );



if($robj == null) {
echo 'fail rubric';
echo $rjson;
die();
}


$cjson = stripslashes($_POST['cJSON']) ;
$cobj = json_decode( $cjson  );

if($cobj == null) {
echo 'fail context';
echo $cjson;
die();
}



$cURIs = array();
$newContextsGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $config);
foreach($cobj as $key=>$newContextObj) {
	$newContext = new Context($newContextObj);
	$newContext->buildPrivateGraph();
	$newCURI = $newContext->uri;
	$newContextsGraph->mergeResourceGraph($newContext->graph);
	if(in_array($key, $robj->rubricMeta[4]->rContexts)) {
		$cURIs[] = urldecode($newCURI);		
	}
}

foreach($robj->rubricMeta[4]->rContexts as $val) {
	if(substr($val, 0, 3) != 'new' ) {
		$cURIs[] = urldecode($val);
	}
}
$robj->rubricMeta[4]->rContexts = $cURIs;


//build contexts if needed, and get an array of the context URIs to pass to Rubric

$newRubric = new Rubric($robj, $cURIs);


$newRubric->buildGraph();

//echo $newRubric->graph->toNTriples();

$q = 'INSERT INTO <>  { '  . $newRubric->graph->toNTriples() . ' } ' ;

$rs = $store->query($q);


$q = 'INSERT INTO <>  { '  . $newContextsGraph->toNTriples() . ' } ' ;

$rs = $store->query($q);



?>
