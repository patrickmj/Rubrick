
<?php

include_once('../../ARC2.php');

class DOMDocTest extends PHPUnit_Framework_TestCase {


	function __construct() 
	{
		$this->testDoc = new DOMDocument();
		$this->testDoc->load('testDoc.html');

	}

	function getDOMDocNeg()
	{
		$conf = array(
			  'ns' => array(
				'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
				'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
				'dbpedia' => 'http://dbpedia.org/ontology/',
				'foaf' => 'http://xmlns.com/foaf/0.1/',
				'xsd' => 'http://www.w3.org/2001/XMLSchema#',
				'dcterms' => 'http://purl.org/dc/terms/'
			  ),

		'source' => $this->testDoc,
		'storeGraphURI' => 'http://example.org/graphURI'
		);

		$domNeg =  ARC2::getComponent('negotiators_DOMDocumentPlugin', $conf);
		$domNeg->setCurrURI('http://example.org/domDoc');
		return $domNeg;
	}

	function getANodeNeg()
	{
		$conf = array(
			  'ns' => array(
				'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
				'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
				'dbpedia' => 'http://dbpedia.org/ontology/',
				'foaf' => 'http://xmlns.com/foaf/0.1/',
				'xsd' => 'http://www.w3.org/2001/XMLSchema#',
				'dcterms' => 'http://purl.org/dc/terms/'
			  ),

		
		);

		$docNeg = $this->getDOMDocNeg();
		$aNodes = $docNeg->source->getElementsByTagName('a');
		$conf['source'] = $aNodes->item(0);


		return ARC2::getComponent('negotiators_ANodePlugin', $conf);

	}



	public function testDOMDocInit()
	{

		$docNeg = $this->getDOMDocNeg();

		$this->assertEquals('DOMDocument', get_class($docNeg->source));
		$this->assertEquals('http://example.org/domDoc', $docNeg->currURI);

	}
	

	public function testANodeInit()
	{
		$conf = array(
			  'ns' => array(
				'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
				'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
				'dbpedia' => 'http://dbpedia.org/ontology/',
				'foaf' => 'http://xmlns.com/foaf/0.1/',
				'xsd' => 'http://www.w3.org/2001/XMLSchema#',
				'dcterms' => 'http://purl.org/dc/terms/'
			  ),

		
		);

		$docNeg = $this->getDOMDocNeg();
		$aNodes = $docNeg->source->getElementsByTagName('a');
		$conf['source'] = $aNodes->item(0);
		$aNeg = $this->getANodeNeg($conf);

		$this->assertEquals('DOMElement', get_class($aNeg->source) );
	

	}
	


	public function testProcessDOMDoc()
	{

		$docNeg = $this->getDOMDocNeg();
		$docNeg->process();
		


		$this->assertEquals(0, $docNeg->currResource->triplesCount());
		$this->assertFalse( array_key_exists('http://example.org/domDoc' , $docNeg->graph->resources));
		$this->assertEquals(0, count($docNeg->graph->resources) );
		$this->assertEquals(0, $docNeg->graph->resourceCount() );


		$this->assertEquals(0, $docNeg->graph->triplesCount()) ;


		$this->assertEquals(1, $docNeg->subNegotiators[0]->graph->triplesCount());

		$docNeg->gatherSubnegotiatorGraphs(false);


		$this->assertEquals(1 , $docNeg->graph->resourceCount());

		$this->assertTrue($docNeg->graph->hasTriple('http://example.org/domDoc', 'sioc:links_to', 'http://example.org/link1'));
		$this->assertTrue($docNeg->graph->hasTriple('http://example.org/domDoc', 'sioc:links_to', 'http://example.org/link2'));
	}
	



	public function testProcessANode()
	{
		$docNeg = $this->getDOMDocNeg();
		$docNeg->preProcess();
		$this->assertEquals(2 , count($docNeg->subNegotiators));
		$aNeg = $docNeg->subNegotiators[0];

		$aNeg->process();

		$this->assertEquals('http://example.org/link1' , $aNeg->currURI);

		$this->assertEquals('http://example.org/domDoc', $docNeg->currURI);
		$this->assertEquals('http://rdfs.org/sioc/ns#links_to', $aNeg->revProp);
		$this->assertEquals('http://example.org/domDoc', $aNeg->revURI);

		$this->assertTrue($aNeg->processCurrResource());


		$this->assertTrue($aNeg->graph->hasTriple('http://example.org/domDoc', 'http://rdfs.org/sioc/ns#links_to', 'http://example.org/link1'));

		$this->assertEquals(1 , $aNeg->graph->triplesCount());	

	}
	
	public function testAddGraphToStore()
	{


		$storeConf = array(

		 'db_host' => 'localhost', /* optional, default is localhost */
		 'db_name' => 'negtest',
		 'db_user' => 'negtest',
		 'db_pwd' => 'negtest',

		  /* store name (= table prefix) */
		//  'store_name' => 'my_store',
		);


		
		$store = ARC2::getStore($storeConf);

		$store->reset();

		if (!$store->isSetUp()) {
		  $store->setUp();
		}

		$docNeg = $this->getDOMDocNeg();
		$docNeg->setStore($store);
		$docNeg->process();		
		$docNeg->gatherSubnegotiatorGraphs(false);
		$docNeg->addGraphToStore();
		
		$q = 'SELECT DISTINCT ?s ?p ?o WHERE { ?s ?p ?o }';
		$rs = $store->query($q);
		if (!$store->getErrors()) {
		  $rows = $rs['result']['rows'];
		  $this->assertEquals( 'http://example.org/domDoc', $rows[0]['s']);
		  
		}

		$q = 'SELECT DISTINCT ?s ?p ?o WHERE { GRAPH <http://example.org/graphURI> { ?s ?p ?o } }';
		$rs = $store->query($q);
		if (!$store->getErrors()) {
		  $rows = $rs['result']['rows'];
		  $this->assertEquals( 'http://example.org/domDoc', $rows[0]['s']);
		  $this->assertEquals(2, count($rows));
		  
		}


		$q = 'SELECT DISTINCT ?s ?p ?o WHERE { GRAPH <http://example.org/graphURIX> { ?s ?p ?o } }';
		$rs = $store->query($q);
		if (!$store->getErrors()) {
		  $rows = $rs['result']['rows'];
		  $this->assertEquals(0, count($rows));

		  
		}		

	}

}

?>
