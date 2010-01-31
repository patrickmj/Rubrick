<?php
//error_reporting(0);
include('config.php');
include(ARC_DIR . 'ARC2.php');
include_once(BASE_DIR . 'checkLogin.php');
ARC2::inc('PMJ_ResourceGraphPlugin');
//require_once(CLASSES_DIR . 'Recording.php');

header('Content-type: application/json');


$store = ARC2::getStore($config);

if (!$store->isSetUp()) {
  $store->setUp();
}

/* Parse what ARC can from the page */

//this can take a bit long, though.
try{

	$parser = ARC2::getSemHTMLParser();
	$parser->parse($_POST['page']);
	$parser->extractRDF('dc rdfa');
	$triples = $parser->getTriples();

	$q = 'INSERT INTO <>  { '  . $parser->toNTriples($triples) . ' } ' ;
	$parseRS = $store->query($q);
} catch(Exception $e) {


}


$graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
$recordingRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
$userURI =  $_SESSION['userURI'];  
$recordingURI = 'http://data.rubrick-jetpack.org/Recordings/' . sha1($userURI . time()) ;

$recordingRes->setURI( $recordingURI );
$recordingRes->addPropValue('rdf:type' ,'r:Recording', 'uri');
$recordingRes->addPropValue('sioc:has_creator', $userURI, 'uri' );
$recordingRes->addPropValue('r:hasPage', $_POST['page'] , 'uri' );
$recordingRes->addPropValue('dcterms:created', date('c'), 'literal', 'xsd:dateTime')	;
$recordingRes->addPropValue('r:hasRubric', $_POST['rubric'], 'uri');




if(is_array($_POST['lineValues'])) {
	foreach($_POST['lineValues'] as $lineValueURI) {
		$recordingRes->addPropValue('r:hasLineValue', $lineValueURI, 'uri');
	}
} else {
	$recordingRes->addPropValue('r:hasLineValue', $_POST['lineValues'], 'uri');
}

$contextRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
$contextRes->setURI($_POST['context']);
$contextRes->addPropValue('r:hasRecording', $recordingURI, 'uri');

$graph->addResource($contextRes);
$graph->addResource($recordingRes);
$q = 'INSERT INTO <>  { '  . $graph->toNTriples() . ' } ' ;
//echo htmlspecialchars($graph->toNTriples());

$rs = $store->query($q);

$message = 'Data is happily saved!';
echo "{ message : '" . $message .  "'   }";
?>
