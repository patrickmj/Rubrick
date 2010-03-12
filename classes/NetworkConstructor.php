<?php

require_once('Constructor.php');


class NetworkConstructor extends Constructor {


	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {

		case 'byCreatorURI':
			$queryStr .= "

CONSTRUCT 
{
	?network a r:Network ;
	  sioc:name ?name ;
	  r:description ?desc ;
	  sioc:has_member ?member ; 
	  sioc:has_creator <$this->creatorURI> .
	  ?member a sioc:User ;
	     sioc:name ?mName . 
}

WHERE
{

	?network a r:Network ;
	  sioc:name ?name ;
	  r:description ?desc ;	  
	  sioc:has_creator <$this->creatorURI> .
	  
	OPTIONAL {
	?network sioc:has_member ?member ;
		sioc:has_creator <$this->creatorURI> .
	}
	OPTIONAL {
		?network sioc:has_member ?member .
		?member sioc:name ?mName .
		
	}
}	";

		break;


		

		}
		$this->query = $queryStr;
	



	}
}
?>
