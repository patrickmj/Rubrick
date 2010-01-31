<?php

require_once('Selector.php');


class RubricLineSelector extends Selector {


	public function setQuery()
	{
		$queryStr = $this->prefixes;
		$queryStr .= "  
SELECT DISTINCT ?name ?desc ?order ?rLValueURI
WHERE {

	<$this->uri>	r:name ?name ; 
					r:description ?desc ; 
					r:order ?order ; 
					r:hasLineValue ?rLValueURI . 
	?rLValueURI r:score ?score . 
}
ORDER BY ASC (?score) 
		";

		$this->query = $queryStr;
	}


	/**
	 * processResultSet
	 * @return
	*/

	public function processResultSet()
	{
		$obj = new StdClass();
		if($this->hasRows()) {
			$obj->name = $this->rs['result']['rows'][0]['name'];
			$obj->desc = $this->rs['result']['rows'][0]['desc'];
			$obj->order = $this->rs['result']['rows'][0]['order'];

		}

		$obj->rLValues = $this->extractBinding('rLValueURI');
		$this->preJSONObj = $obj;

	}



}

?>
