<?php

include_once(ARC_DIR . 'ARC2.php');

class Selector {

	public $query = '';
	public 	$prefixes = PREFIXES;
				 
	public 	$rs = array();
	public 	$preJSONObj;
	public 	$store;
	

	public function __construct($vars) {
		global $config;
		$this->store = ARC2::getStore($config);
		foreach ($vars as $var=>$val) {
			$this->$var = $val;
		}
		$this->preJSONObj = new StdClass();

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
	 * extractBinding
	 * @param string $binding
	 * @return
	*/

	public function extractBinding($binding)
	{
		$retArray = array();
		foreach ($this->rs['result']['rows'] as $row) {
			if(isset($row[$binding])) {
				$retArray[] = $row[$binding];
			}
		}

		$retArray = array_unique($retArray);
		return $retArray;
	}



	/**
	 * processResultSet

		Builds the preJSONObj from the rs
	
	 * @param type 
	 * @return
	*/

	public function processResultSet()
	{
		# code...
	}



	/**
	 * getJSON
	 * @param type
	 * @return
	*/

	public function getJSON()
	{
		return json_encode($this->preJSONObj);
	}

	public function hasRows() {
		return isset($this->rs['result']['rows'][0]);
	}
}

?>
