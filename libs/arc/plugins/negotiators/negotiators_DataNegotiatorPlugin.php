<?php


ARC2::inc('Class');
include_once('NegotiatorSelector.php');

class negotiators_DataNegotiatorPlugin extends ARC2_Class
{

	

	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function negotiators_DataNegotiatorPlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);
	}

	function __init() 
	{
		parent::__init();
		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', array('ns' => $this->ns));
		if(! isset($this->currURI ) ) {
			$this->currURI = isset($this->a['currURI']) ? $this->expandPName($this->a['currURI']) : false;
		}

		if(! isset($this->revProp ) ) {
			$this->revProp = isset($this->a['revProp']) ? $this->expandPName($this->a['revProp']) : false;
		}

		if(! isset($this->revURI ) ) {
			$this->revURI = isset($this->a['revURI']) ? $this->expandPName($this->a['revURI']) : false;
		}

		$this->storeGraphURI = isset($this->a['storeGraphURI']) ? $this->expandPName($this->a['storeGraphURI']) : '';
 		$this->subNegotiators = array();
		$this->store = isset($this->a['store']) ? $this->a['store'] : false;
		$this->selector = isset($this->a['selector']) ? $this->a['selector'] : NegotiatorSelector::getInstance();
		$this->source = isset($this->a['source']) ? $this->a['source'] : false;
		$this->ns['rdfs'] = 'http://www.w3.org/2000/01/rdf-schema#';
		$this->ns['rdf'] = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
		$this->ns['xsd'] = "http://www.w3.org/2001/XMLSchema#";

	}

	public function setSource($src)
	{

		$this->source = $src;

	}

	public function setStore($store)
	{
		$this->store = $store;
	}

	public function setCurrURI($uri)
	{
		$this->currURI = $uri;
	}

	public function addGraphToStore() 
	{
		$this->store->insert($this->graph->toIndex(), $this->storeGraphURI);
	}

	/**
	 * processCurrResource
	*/

	public function processCurrResource()
	{
		if( ! $this->currURI) {			
			return false;
		}


	//	$this->currResource = ARC2::getComponent('PMJ_ResourcePlusPlugin', array('ns' => $this->ns));
		$this->currResource->setURI($this->currURI);

		if($this->currResource->triplesCount() > 0) {
			$this->graph->addResource($this->currResource);
		}



		if($this->revProp && $this->revURI) {
			$revResource = ARC2::getComponent('PMJ_ResourcePlusPlugin' , array('ns' => $this->ns));
			$revResource->setURI($this->revURI);
			$revResource->addPropValue($this->revProp, $this->currURI, 'uri');
			$this->graph->addResource($revResource);
			return true;
		} else {
			$this->addError('no revProp or no revURI');
			return false;
		}
	}



	/**
	 * addGraph
	 * @param PMJ_ResourceGraphPlugin $g
	 * @return
	*/

	public function addGraph($g)
	{
		$this->graph->mergeResourceGraph($g);
	}


	/**
	 * merge
	 * @param $negotiators_DataNegotiatorPlugin $n
	*/

	public function merge($n)
	{
		$this->addGraph($n->graph);
	}


	/**
	 * addSubNegotiator
	 * @param negotiators_DataNegotiatorPlugin $n
	*/

	public function addSubNegotiator($n, $conf = false)
	{
		if( ! $conf ) $conf = array();

		if(! isset($conf['ns'])) $conf['ns'] = $this->ns;
		if(! isset($conf['store'])) $conf['store'] = $this->store;
		$conf['parentURI'] = $this->currURI;
		$conf['storeGraphURI'] = $this->storeGraphURI;


		$this->subNegotiators[] = ARC2::getComponent($n, $conf);
	}


	/**
	 * addSubNegotiatorsByTest
	 * @param string $testStr
	*/

	public function addSubNegotiatorsByTest($testStr, $negsToTestArray = false)
	{
		$nArray = $this->selector->applyTestOnNegotiators($testStr, $negsToTestArray);
	
		foreach($nArray as $n) {
			$this->subNegotiators[$n] = ARC2::getComponent($n);
		}
	}


	/**
	 * process
	*/

	
	public function process($addOnProcess = false, $destroyOnAdd = false)
	{
		$this->preProcess();
		$this->processCurrResource();
		$this->processSubNegotiators($addOnProcess, $destroyOnAdd);
		$this->postProcess();


		if($addOnProcess) {
			$this->addToStore();
		}

		if($destroyOnAdd) {
			unset($this);
		}

	}

	public function preProcess()
	{

	}


	public function postProcess()
	{

	}


	/**
	 * processSubNegotiators
	*/

	public function processSubNegotiators($addOnProcess = false, $destroyOnAdd = false)
	{
		foreach($this->subNegotiators as $n) {
			$n->process($addOnProcess, $destroyOnAdd);
		}
	}

	public function trimSlash($url)
	{
		return rtrim(trim($url), '/');

	}


	/**
	 * gatherSubnegotiatorGraphs
	 * @param boolean $destroyWhenGathered
	*/

	public function gatherSubnegotiatorGraphs($destroyWhenGathered = true)
	{
		for($i = count($this->subNegotiators) - 1 ; $i >=0 ; $i--) {
			$this->merge($this->subNegotiators[$i]);
			if($destroyWhenGathered) unset($this->subNegotiators[$i]);
		}
	}

	/**
	 * applyTest used by Selector to decide whether the negotiator is designed to work on a specific condition, such as
	 *			 a domain, xpath, nodeName, etc.
	 * @param string $testVal
	 * @return
	*/

	static function applyTest($testVal)
	{
		return false;
	}
}
?>
