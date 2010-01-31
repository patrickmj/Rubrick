<?php

require_once('Selector.php');


class RubricLineValueSelector extends Selector {


	public function setQuery()
	{
		$queryStr = $this->prefixes;
		$queryStr .= "  
SELECT DISTINCT  ?desc ?score
WHERE {

	<$this->uri>	
					r:description ?desc ; 
					r:score ?score . 

}


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
			$obj->desc = $this->rs['result']['rows'][0]['desc'];
			$obj->score = $this->rs['result']['rows'][0]['score'];
		}
	
		$this->preJSONObj = $obj;

	}



}

?>
