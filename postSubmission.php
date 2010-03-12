<?php
//error_reporting(0);
include('config.php');
include(ARC_DIR . 'ARC2.php');
include_once(BASE_DIR . 'checkLogin.php');
ARC2::inc('PMJ_ResourceGraphPlugin');


header('Content-type: application/json');


$store = ARC2::getStore($config);

if (!$store->isSetUp()) {
  $store->setUp();
}

/* Parse what ARC can from the page */

//this can take a bit long, though.



	$parser = ARC2::getSemHTMLParser();
	$parser->parse($_POST['page']);
	$parser->extractRDF('dc rdfa');
	$triples = $parser->getTriples();

	$q = 'INSERT INTO <>  { '  . $parser->toNTriples($triples) . ' } ' ;
	$parseRS = $store->query($q);


$graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
$subRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
$submissionURI = 'http://data.rubrick-jetpack.org/Submissions/' . sha1($userURI . time()) ;
$subRes->setURI($submissionURI);
$subRes->addPropValue('sioc:has_creator', $userURI, 'uri');
$subRes->addPropValue('rdf:type', 'r:Submission', 'uri');
$subRes->addPropValue('r:hasPage', $_POST['page'] , 'uri' );
$subRes->addPropValue('dcterms:created', date('c'), 'literal', 'xsd:dateTime');


$contextRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
$contextRes->setURI($_POST['context']);
$contextRes->addPropValue('r:hasSubmission', $submissionURI, 'uri');

$graph->addResource($contextRes);
$graph->addResource($subRes);


$q = 'INSERT INTO <>  { '  . $graph->toNTriples() . ' } ' ;
//echo htmlspecialchars($graph->toNTriples());

$rs = $store->query($q);

$message = 'Submission is happily saved!';
echo "{ message : '" . $message .  "'   }";



?>
