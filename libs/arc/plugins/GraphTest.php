<?php


require_once ('PHPUnit/Framework.php') ;
include_once ('../ARC2.php');
 



class GraphTest extends PHPUnit_Framework_TestCase {



	public function getRes1() 
	{
		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);

	    $res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $conf);
		$res->setURI('http://example.info/resourceplus1');
		$res->addPropValue('foaf:page', 'http://twitter.com');
		$res->addPropValue('rdfs:type', 'foaf:Person');
		$res->addPropValue('dcterms:title', "Unit testing rocks my world", 'literal', 'xsd:string', 'en');
		$res->addPropValue('dcterms:title', "Froggies", 'literal', null, 'fr');
		$res->addPropValue('dcterms:title', "Das Boot", 'literal', null, 'de');
		$res->addPropValue('dcterms:date', '2009-11-20', 'literal', 'xsd:date');
		$res->addPropValue('rdfs:type', 'foaf:Person');

		return $res;
	}

	public function getRes2() 
	{
		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);

	    $res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $conf);
		$res->setURI('http://xmlns.com/foaf/0.1/Person');
		$res->addPropValue('rdfs:label', 'Person', 'literal');
		return $res;
	}

	public function getG1() {

		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);
		$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', $conf);
		$index1 = array(
		  '_:john' => array(
			'http://xmlns.com/foaf/0.1/knows' => array(
			  array('value' => '_:bill', 'type' => 'bnode'),
			  array('value' => '_:bob', 'type' => 'bnode'),
			),
		  ),
		);
		$g->mergeIndex($index1);

		return $g;

	}

	public function getG2() {
		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);
		$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', $conf);


		$index2 = array(
		  'http://example.info/resourceplus1' => array(
			'http://xmlns.com/foaf/0.1/knows' => array(
			  array('value' => '_:bill', 'type' => 'bnode'),
			  array('value' => '_:bob', 'type' => 'bnode'),
			),
		  ),
		);	

		$g->mergeIndex($index2);
		return $g;



	}

	public function getG3() {

		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);
		$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', $conf);
		$g->addResource($this->getRes1());
		$g->addResource($this->getRes2());
		return $g;

	}

	public function testtoIndex()
	{
		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);
		$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', $conf);
		$g->addResource($this->getRes1());
		$index = $g->toIndex();
		$this->assertEquals(1, count($index));

		$g->addResource($this->getRes2());
		$index = $g->toIndex();
		$this->assertEquals(2, count($index));

	}


	public function testMergeIndex()
	{

		$index1 = array(
		  '_:john' => array(
			'http://xmlns.com/foaf/0.1/knows' => array(
			  array('value' => '_:bill', 'type' => 'bnode'),
			  array('value' => '_:bob', 'type' => 'bnode'),
			),
		  ),
		);

		$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', array());
		$g->mergeIndex($index1);
		$this->assertEquals(1 , $g->resourceCount());
		$this->assertTrue(array_key_exists('_:john' , $g->resources));


		$index2 = array(
		  'http://example.info/resourceplus1' => array(
			'http://xmlns.com/foaf/0.1/knows' => array(
			  array('value' => '_:bill', 'type' => 'bnode'),
			  array('value' => '_:bob', 'type' => 'bnode'),
			),
		  ),
		);			

		$g->mergeIndex($index2);
		$this->assertEquals(2 , $g->resourceCount());
		$this->assertTrue(array_key_exists('_:john' , $g->resources));
		$this->assertTrue(array_key_exists('http://example.info/resourceplus1' , $g->resources));
	
		$this->assertEquals(4, $g->triplesCount() );

	}

	public function testMergeResourceGraph()
	{
		$g1 = $this->getG1();
		$g2 = $this->getG2();

		$g1->mergeResourceGraph($g2);
		$this->assertEquals(2 , $g1->resourceCount());
		$this->assertTrue(array_key_exists('_:john' , $g1->resources));
		$this->assertTrue(array_key_exists('http://example.info/resourceplus1' , $g1->resources));
		$this->assertEquals(4, $g1->triplesCount() );
		$this->assertEquals(2, $g2->triplesCount() );

	}



	public function testAddPrefix()
	{

	}


	public function testRemoveResource()
	{
		$g1 = $this->getG1();
		$g1->removeResource('_:john');
		$this->assertFalse(array_key_exists('_:john', $g1->resources));
	

		$g2 = $this->getG2();
		$res = $this->getRes1();
		$g2->removeResource($res);
		$this->assertFalse(array_key_exists('_:john', $g2->resources));

	}

	public function testResourceCount()
	{
		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);
		$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', $conf);
		$r = $this->getRes1();
		$g->addResource($r);		
		$this->assertEquals(1, $g->resourceCount() );
	}

	public function testAddResource()
	{
		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/',
			'foaf' => 'http://xmlns.com/foaf/0.1/',
			'xsd' => 'http://www.w3.org/2001/XMLSchema#',
			'dcterms' => 'http://purl.org/dc/terms/'
		  )
		);
		$g = ARC2::getComponent('PMJ_ResourceGraphPlugin', $conf);
		$r1 = $this->getRes1();
		$g->addResource($r1);

		$r2 = $this->getRes2();
		$g->addResource($r2);


		//is it there?
		$this->assertEquals(2, $g->resourceCount());
		//did I avoid duplicates?
		$g->addResource($r1);
		$this->assertEquals(2, $g->resourceCount());
		//are the resources merging?




		$r1tripleCount = $g->resources['http://example.info/resourceplus1']->triplesCount();
		
		$r3 = $this->getRes1();
		$r3->addPropValue('rdfs:type', 'foaf:Group');

		$g->addResource($r3);
		$this->assertEquals($r1tripleCount + 1 , $g->resources['http://example.info/resourceplus1']->triplesCount() );

		
	}


	public function testGetResource()
	{
		$g = $this->getG1();
		$r = $this->getRes1();
		$g->addResource($r);
		$res = $g->getResource('http://example.info/resourceplus1');
		$this->assertEquals('http://example.info/resourceplus1' , $res->uri);
	}



	public function testGetResourcesByType()
	{
		$g = $this->getG1();
		$g->addResource($this->getRes1());

		$resArray = $g->getResourcesByType('foaf:Person');
		$this->assertEquals('http://example.info/resourceplus1', $resArray[0]->uri);
	}



	public function testGetResourcesByTypes()
	{
		$g = $this->getG1();
		$g->addResource($this->getRes1());

		$resArray = $g->getResourcesByTypes(array('foaf:Person'));
		$this->assertEquals('http://example.info/resourceplus1', $resArray['foaf:Person'][0]->uri);
	}

	public function testGetResourcesWithProp()
	{
		$g = $this->getG1();
		$g->addResource($this->getRes1());

		$resArray = $g->getResourcesWithProp('dcterms:title');
		$this->assertEquals('http://example.info/resourceplus1', $resArray[0]->uri);
	}



	public function testGetResourcesWithPropValue()
	{
		$g = $this->getG1();
		$g->addResource($this->getRes1());

		$resArray = $g->getResourcesWithPropValue('dcterms:title', "Das Boot");
		$this->assertEquals('http://example.info/resourceplus1', $resArray[0]->uri);
	}



	public function testGetResourcesWithPropLang()
	{
		$g = $this->getG1();
		$g->addResource($this->getRes1());

		$resArray = $g->getResourcesWithPropLang('dcterms:title', "de");
		$this->assertEquals('http://example.info/resourceplus1', $resArray[0]->uri);
	}


	public function testGetResourcesWithPropDatatype()
	{
		$g = $this->getG1();
		$g->addResource($this->getRes1());

		$resArray = $g->getResourcesWithPropDatatype('dcterms:date', "xsd:date");
		$this->assertEquals('http://example.info/resourceplus1', $resArray[0]->uri);
	}


	public function testGetResourcesByNamespace()
	{
		$g = $this->getG1();
		$g->addResource($this->getRes2());

		$resArray = $g->getResourcesByNamespace('foaf');
		$this->assertEquals('http://xmlns.com/foaf/0.1/Person', $resArray[0]->uri);
	}


	public function testRemoveResourcesByType()
	{
		$g = $this->getG3();
		$g->removeResourcesByType('foaf:Person');
		$this->assertFalse(array_key_exists('http://example.info/resourceplus1', $g->resources));
		$this->assertTrue(array_key_exists('http://xmlns.com/foaf/0.1/Person', $g->resources));
	}


	public function testRemoveResourcesByTypes()
	{
		$g = $this->getG3();
		$g->removeResourcesByTypes(array('foaf:Person'));
		$this->assertFalse(array_key_exists('http://example.info/resourceplus1', $g->resources));
		$this->assertTrue(array_key_exists('http://xmlns.com/foaf/0.1/Person', $g->resources));
	}


	public function testRemoveResourcesWithProp()
	{
		$g = $this->getG3();
		$g->removeResourcesWithProp('dcterms:title');
		$this->assertFalse(array_key_exists('http://example.info/resourceplus1', $g->resources));
		$this->assertTrue(array_key_exists('http://xmlns.com/foaf/0.1/Person', $g->resources));
	}


	public function testRemoveResourcesByNamespace()
	{
		$g = $this->getG3();
		$g->removeResourcesByNamespace('foaf');
		$this->assertTrue(array_key_exists('http://example.info/resourceplus1', $g->resources));
		$this->assertFalse(array_key_exists('http://xmlns.com/foaf/0.1/Person', $g->resources));
	}


	public function testRemovePropsByNamespace()
	{
		$g = $this->getG3();


	}


	public function testRemoveResourcesWithPropValue()
	{
		$g = $this->getG3();
		$g->removeResourcesWithPropValue('rdfs:label', 'Person');
		$this->assertTrue(array_key_exists('http://example.info/resourceplus1', $g->resources));
		$this->assertFalse(array_key_exists('http://xmlns.com/foaf/0.1/Person', $g->resources));
	}


	public function testRemoveValuesWithLang()
	{
		$g = $this->getG3();


	}


	public function testRemoveValuesWithoutLang()
	{
		$g = $this->getG3();


	}


	public function testRemoveProp()
	{
		$g = $this->getG3();
	}


	public function testRemoveProps()
	{
		$g = $this->getG3();
	}


}



?>
