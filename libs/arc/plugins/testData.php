<?php

include_once('../ARC2.php');



$parser = ARC2::getRDFParser();

/*
$parser->parse('http://dbpedia.org/resource/DBpedia');
$index = $parser->getSimpleIndex(0);
file_put_contents('dbpediaIndex.txt', serialize($index));
*/

$index = unserialize(file_get_contents('dbpediaIndex.txt'));


$conf = array(
  'ns' => array(
	'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
	'dbpedia-owl' => 'http://dbpedia.org/ontology/',
	'foaf' => 'http://xmlns.com/foaf/0.1/',
	'xsd' => 'http://www.w3.org/2001/XMLSchema#',
	'dcterms' => 'http://purl.org/dc/terms/',
	'dbpprop' => 'http://dbpedia.org/property/',
	'dbpres' => 'http://dbpedia.org/resource/' ,
	'yago' => 'http://mpii.de/yago/resource/',
	'owl' => 'http://www.w3.org/2002/07/owl#'
  )
);
$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', $conf);

$g->mergeIndex($index);


$g->removeResourcesWithProp('dbpprop:redirect');
$g->removeResourcesByNameSpace('yago');


echo $g->resourceCount();
echo "<br/><br/>";
echo $g->triplesCount();
echo "<br/><br/>";

$isProductOfs = $g->getResourcesWithProp('dbpprop:products', true);
echo $g->toTurtle();
/*
foreach($isProductOfs as $producer) {
	$parser->parse($producer);
	$g->mergeIndex($parser->getSimpleIndex(0));

}
*/


$dbpediaRes = $g->getResource('dbpres:DBpedia');
$dbpediaSameAs = $dbpediaRes->getProps('owl:sameAs');
print_r($dbpediaSameAs);


?>
