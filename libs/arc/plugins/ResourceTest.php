<?php



require_once ('PHPUnit/Framework.php') ;
include_once ('../ARC2.php');
 



class ResourceTest extends PHPUnit_Framework_TestCase
{

	public function getRes() 
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

    public function testInit()
    {
      $res = ARC2::getComponent('PMJ_ResourcePlusPlugin', array());
      $this->assertEquals(0, count($res->index));
	
    }

	public function testCountTriples() 
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

		$this->assertEquals(2, $res->triplesCount());
		$res->addPropValue('dcterms:title', "Unit testing rocks my world", 'literal', 'xsd:string', 'en');
		$res->addPropValue('dcterms:title', "Froggies", 'literal', null, 'fr');
		$res->addPropValue('dcterms:title', "Das Boot", 'literal', null, 'de');
		$res->addPropValue('dcterms:date', '2009-11-20', 'literal', 'xsd:date');

		$this->assertEquals(6, $res->triplesCount());
		$res->addPropValue('rdfs:type', 'foaf:Person');
		$this->assertEquals(6, $res->triplesCount());
	}

	public function testInitConf()
	{
		$conf = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
			'dbpedia' => 'http://dbpedia.org/ontology/'
		  )
		);

      $res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $conf);
      $this->assertEquals('http://dbpedia.org/ontology/', $res->ns['dbpedia']);

	}

	public function testMergeNS()
	{
		$conf1 = array(
		  'ns' => array(
			'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
		  )
		);
		$conf2 = array(
		  'ns' => array(
			'dbpedia' => 'http://dbpedia.org/ontology/'
		  )
		);
		$res1 = ARC2::getComponent('PMJ_ResourcePlusPlugin', $conf1);		
	  	$res2 = ARC2::getComponent('PMJ_ResourcePlusPlugin', $conf2);

		$res1->mergeResource($res2);

		$this->assertTrue($res1->ns['dbpedia'] == 'http://dbpedia.org/ontology/' );

	}



	public function testAddPropValue()
	{
		$res = $this->getRes();
		$res->addPropValue('foaf:page', 'http://www.patrickgmj.net/blog');
		$this->assertTrue( in_array('http://www.patrickgmj.net/blog' , $res->getFlattenedProps('foaf:page')) );
		$res->addPropValue('rdfs:type', 'foaf:Agent');
		$this->assertTrue(  in_array('http://xmlns.com/foaf/0.1/Agent', $res->getFlattenedProps('rdfs:type')) );


		$res2 = ARC2::getComponent('PMJ_ResourcePlusPlugin', array('ns' => array('foaf'=>'http://xmlns.com/foaf/0.1/')));

		$res2->setURI('http://example.com');
		$res2->addPropValue('rdfs:type', 'foaf:Agent');
		$this->assertEquals(1, $res2->triplesCount());

		$res2->addPropValue('rdfs:type', 'foaf:Agent');
		$this->assertEquals(1, $res2->triplesCount());
	}



	public function testAddPropValueLiteral() 
	{
		$res = $this->getRes();
		$o = $res->getProp('dcterms:title');
		$this->assertEquals('literal', $o['type']);
		
	}

	public function testAddPropValueDatatype()
	{
		$res = $this->getRes();

		$o = $res->getProp('dcterms:title');
		$this->assertEquals('http://www.w3.org/2001/XMLSchema#string', $o['datatype']);

		$o = $res->getProp('dcterms:date');
		$this->assertEquals('http://www.w3.org/2001/XMLSchema#date', $o['datatype']);		
		$this->assertTrue($res->hasPropDatatype('http://purl.org/dc/terms/date',  'xsd:date'));
	}

	public function testAddPropValueLang()
	{
		$res = $this->getRes();

		$o = $res->getProp('dcterms:title');
		$this->assertEquals('en', $o['lang']);
		$this->assertTrue($res->hasPropLang('dcterms:title',  'en'));
	}

	public function testTypesMethods()
	{
		$res = $this->getRes();
		$this->assertTrue( (boolean) $res->hasPropValue('rdfs:type', 'foaf:Person'));
	

		$this->assertTrue($res->hasType('foaf:Person'));
		$this->assertFalse($res->hasType('foaf:Agent'));
		$this->assertTrue($res->hasType('http://xmlns.com/foaf/0.1/Person'));
	}


	public function testHasMethods() 
	{
		$res = $this->getRes();
		$this->assertFalse($res->hasProp('foaf:maker')) ;


	}

	public function testRemoveProp()
	{
		$res = $this->getRes();
		$res->removeProp('dcterms:title');
		$this->assertFalse($res->hasProp('dcterms:title'));
	}


	public function testRemovePropsByNamespace() 
	{
		$res = $this->getRes();

		$res->removePropsByNamespace('dcterms');
		$this->assertFalse( (boolean) $res->hasProp('dcterms:title'));
		$this->assertFalse( (boolean) $res->hasProp('dcterms:date'));

	}

	public function testRemovePropValue()
	{

		$res = $this->getRes();

		$res->removePropValue('rdfs:type', 'foaf:Person');
		$this->assertFalse((boolean) $res->hasPropValue('rdfs:type', 'foaf:Person'));

	}

	public function testRemoveValuesWithLang() {

		$res = $this->getRes();
		$res->removeValuesWithLang('fr');
		$this->assertFalse( (boolean)  $res->hasPropValue('dcterms:title', 'Froggies'));

	}

	public function testRemoveValuesWithoutLang() {
	
		$res = $this->getRes();
		$res->removeValuesWithoutLang('en');
		$this->assertFalse( (boolean) $res->hasPropValue('dcterms:title', 'Das Boot'));
	}

	public function testRemoveProps()
	{
		$res = $this->getRes();
		$killProps = array('dcterms:title', 'dcterms:date');
		$res->removeProps($killProps);
		$this->assertFalse( (boolean)  $res->hasPropValue('dcterms:title', 'Froggies'));
		$this->assertFalse( (boolean) $res->hasPropValue('dcterms:title', 'Das Boot'));
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

		$index2 = array(
		  'http://example.info/resourceplus1' => array(
			'http://xmlns.com/foaf/0.1/knows' => array(
			  array('value' => '_:bill', 'type' => 'bnode'),
			  array('value' => '_:bob', 'type' => 'bnode'),
			),
		  ),
		);

		$res = $this->getRes();
		$this->assertEquals( 6 , $res->triplesCount());
		$this->assertFalse(	$res->mergeIndex($index1) );
		$this->assertTrue( $res->mergeIndex($index2));
		$this->assertEquals( 8 , $res->triplesCount());

	}

}




?>
