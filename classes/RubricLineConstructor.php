<?php

require_once('Constructor.php');


class RubricLineConstructor extends Constructor {


	public function setQuery()
	{
		$queryStr = $this->prefixes;
		$queryStr .= "
		
		
CONSTRUCT
{

	<$this->uri> a r:RubricLine ;
					sioc:name ?name ; 
					r:description ?desc ; 
					r:order ?order ; 
					r:hasLineValue ?rLValueURI . 
	?rLValueURI a r:RubricLineValue ;
		r:description ?rlvdesc ;
		r:score ?score . 
}
		
WHERE {

	<$this->uri>	sioc:name ?name ; 
					r:description ?desc ; 
					r:order ?order ; 
					r:hasLineValue ?rLValueURI . 
	?rLValueURI r:description ?rlvdesc ;
		r:score ?score . 
}
ORDER BY DESC (?score) 
		";

		$this->query = $queryStr;
	}




}

?>
