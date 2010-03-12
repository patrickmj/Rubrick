<?php

require_once('Constructor.php');


class RubricLineValueConstructor extends Constructor {


	public function setQuery()
	{
		$queryStr = $this->prefixes;
		$queryStr .= "
		
CONSTRUCT 		
{

	<$this->uri>	
					r:description ?desc ; 
					r:score ?score . 

}	
	
WHERE {

	<$this->uri>	
					r:description ?desc ; 
					r:score ?score . 

}
		";

		$this->query = $queryStr;
	}



}

?>
