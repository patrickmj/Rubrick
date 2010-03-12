<?php

ARC2::inc('PMJ_ResourceGraphPlugin');
ARC2::inc('PMJ_ResourcePlusPlugin');


class GraphBuilder {

	public $addGraph;
	public $deleteGraph;
	public $uri;
	public $typeURI;
	public $res;
	public $store;
	public $relPred;
	public $relResourceURI;
	public $revPred;
	public $revResourceURI;
	public $postData;
	public $aggregates = array();
	public $superClasses = array();
	public $creatorPred = 'sioc:has_creator';
	public $createdPred = 'dcterms:created';
	public $creator = false;
	public $created = false;
	public $datePreds = array(  'dc:date', 
							    'dcterms:date', 
								'dcterms:created',
							 );


	public function __construct($uri = false, $initData = false) {
		global $store;
		
		$this->_setPostData($initData);
		
		
		
		
		if( isset($initData['properties'] ) ) {
			foreach ($initData['properties'] as $property=>$val) {
				$this->$property = $val;
			}
		}
		
		$this->_setURI($uri, $initData);
		
		$this->res = $this->_getEmptyResource();
		$this->res->setURI($this->uri);
		$this->res->addPropValue('rdf:type', $this->typeURI, 'uri');

		// 'Manually' infer the superclasses
		foreach($this->superClasses as $superClass) {
			$this->res->addPropValue('rdf:type', $superClass, 'uri');
		}

		$this->store = $store;
		$this->addGraph = $this->_getEmptyGraph();		
		$this->deleteGraph = $this->_getEmptyGraph(); 
		
	}

	/**
		finalizeGraph stores the specified graph to the triplestore
	*/

	public function finalizeGraph($g, $recursive = false) {
		$graph = $this->_getGraph($g);
		if($graph->triplesCount() == 0 ) {
			return;
		}
		switch ($g) {
			case 'add':
				$q = 'INSERT INTO <> { '  . $graph->toNTriples() . ' } ' ;		
			break;
			
			case 'delete' :
				$q = 'DELETE { '  . $graph->toNTriples() . ' } ' ;						
			break;
		}
		
		$rs = $this->store->query($q);
		// error handling based on teh store's response

		if($recursive) {
			foreach($this->aggregates as $ag) {
				$ag->finalizeGraph($g, true);
			}
		}
	}

	public function aggregateGraphs($g, $recursive = false) {
		$retGraph = $this->_getEmptyGraph();
		$retGraph->mergeResourceGraph($this->_getGraph($g));
		foreach($this->aggregates as $agg) {
			$aggGraph = $agg->_getGraph($g);
			$retGraph->mergeResourceGraph($aggGraph);
			if($recursive) {
				$retGraph->mergeResourceGraph($agg->aggregateGraphs($g, true));
			}
		}
		return $retGraph;
	}

	/**
	 * getRelTriple returns the triple to use to relate this resource's URI to the URIs of its aggregated resources, with this resources URI as the subject
	 * @param  
	 * @return PMJ_ResourcePlusPlugin or false
	*/

	public function getRelTriple()
	{
		if($this->relPred && $this->relResourceURI) {
			$res = $this->_getEmptyResource();
			$res->setURI($this->uri);
			$res->addPropValue($this->relPred, $this->relResourceURI, 'uri');
			return $res;
		}
		return false;

	}

	/**
	 * getRevTriple returns the triple to use to relate this resource's URI to the URIs of its aggregated resources, with this resources URI as the object
	 * @param  
	 * @return PMJ_ResourcePlusPlugin or false
	*/

	public function getRevTriple()
	{
		if($this->revPred && $this->revResourceURI) {
			$res = $this->_getEmptyResource();
			$res->setURI($this->revResourceURI);
			$res->addPropValue($this->revPred, $this->uri, 'uri');
			return $res;
		}
		return false;
	}

	/**
	 * buildAddGraph
	 * @param 
	 * @return
	*/

	public function buildAddGraph()
	{
		# code...
	}

	/**
	 * buildDeleteGraph
	 * @param  
	 * @return
	*/

	public function buildDeleteGraph()
	{
		# code...
	}

	/**
	 * addRevRelTriples
	 * @param string $g
	 * @return
	*/

	public function addRevRelTriples($g = 'add')
	{
		$rev = $this->getRevTriple();
		$rel = $this->getRelTriple();
		if($rev) {
			$this->addResourceToGraph($rev, $g);
		}

		if($rel) {
			$this->addResourceToGraph($rel, $g);
		}
	}

	/**
	 * addResourceToGraph
	 * @param PMJ_ResourcePlusPlugin $res
	 * @param string $graph 'add' or 'delete'
	 * @return
	*/

	public function addResourceToGraph($res, $g)
		
	{
		$graph = $this->_getGraph($g);
		$graph->addResource($res);
	}

	/**
	 * addGraphToGraph
	 * @param PMJ_ResourceGraphPlugin $res
	 * @param string $graph 'add' or 'delete'
	 * @return
	*/

	public function addGraphToGraph($mergeGraph, $g)
		
	{
		$graph = $this->_getGraph($g);
		$graph->mergeResourceGraph($mergeGraph);
	}

    public function mintURI() {
		return 'http://data.rubrick-jetpack.org/' . get_class($this) . '/' . sha1($_SESSION['userURI'] . microtime() );
    }

	/**
	*	_getGraph returns a graph in this resources for a specific purpose. add and delete are predefined, but subclasses can define what they will
	*		they just need to follow the pattern purposeGraph, e.g. addGraph and deleteGraph
	*/

	protected function _getGraph($g) {
		$graphName = $g . "Graph";
		return $this->$graphName;
	}

	protected function _addLiteralsToThisRes() {
		if( ! isset($this->postData->literals) ) {
			return false;
		}
		
		foreach($this->postData->literals as $po) {
			
			if($this->_isDatePred($po->p)) {
				$this->res->addPropValue($po->p, $po->o,  'literal', 'xsd:dateTime');
			} else {
				$this->res->addPropValue($po->p, $po->o,   'literal');
			}
		}
	}

	protected function _addURIsToThisRes() {
		if( ! isset($this->postData->uris) ) {
			return false;
		}
		foreach($this->postData->uris as $po) {
			$this->res->addPropValue($po->p, $po->o,   'uri');
		}
	}

	protected function _addLiteralsAndURIsToThisRes() {
		$this->_addLiteralsToThisRes();
		$this->_addURIsToThisRes();
	}

	protected function _addCreatorToThisRes() {
		$hasCreator = (bool) $this->store->query("ASK <$this->uri> $this->creatorPred ?o ", 'raw');
		if( ! $hasCreator) {
			$this->res->addPropValue($this->creatorPred, $_SESSION['userURI'], 'uri');
			
		}
	}

	protected function _addCreatedToThisRes() {
		$hasCreated = (bool) $this->store->query("ASK <$this->uri> $this->createdPred ?o ", 'raw');		
		if(! $hasCreated) {
			$this->res->addPropValue($this->createdPred, date('c'), 'literal', 'xsd:dateTime')	;
		}
	}

	protected function _isDatePred($pred) {
		return in_array($pred, $this->datePreds);
	}

	protected function _getEmptyGraph() {
		global $graphConfig;
		return ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
	}

	protected function _getEmptyResource() {
		global $graphConfig;
		return ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
	}
	
	protected function _setURI($uri = false, $initData = false) {
		if($uri) {
			$this->uri = $uri;
			return;
		}
		if( isset( $initData['uri']) ) {
			$this->uri = $initData['uri'];
			return;			
		}
		if( isset( $initData['post']) && isset( $initData['post']->uri ) ) {
			$this->uri = $initData['post']->uri;
			return;
		}
		$this->uri = $this->mintURI();
	}
	
	protected function _setPostData($initData) {
		if( isset($initData['post'] ) ) {
			$this->postData = $initData['post'];
			
		}
	}
}



?>
