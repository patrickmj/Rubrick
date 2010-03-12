<?php

include_once(ARC_DIR . 'ARC2.php');

class Constructor {

	public $query = '';
	public 	$prefixes = PREFIXES;				 
	public 	$rs = array();
	public 	$rdfjson;
	public 	$store;
	

	public function __construct($vars) {
		global $config;
		global $graphConfig;
		$this->store = ARC2::getStore($config);
		foreach ($vars as $var=>$val) {
			$this->$var = $val;
		}
		
		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
		$this->setQuery();
		$this->doQuery();
		$this->processResultSet();
	}


	/**
	 * buildQuery
	 * 
	 * cheesy way to set the variables within the query
	 * @param type 
	 * @return
	*/

	public function setQuery($query = false)
	{
		$defaultQuery = "";

		$query = $query ? $query : $defaultQuery;
		$this->query = $query;
	}

	/**
	 * doQuery
	 * @param  name
	 * @return
	*/

	public function doQuery()
	{
		$this->rs = $this->store->query($this->query);
	}





	/**
	 * processResultSet

		Builds the preJSONObj from the rs
	
	 * @param type 
	 * @return
	*/

	public function processResultSet()
	{
		$index = $this->rs['result'];
		$this->graph->mergeIndex($index);
	}

	public function toRDFJSON($asObject = false) {
		return $this->graph->toRDFJSON($asObject);
	}

}

?>
