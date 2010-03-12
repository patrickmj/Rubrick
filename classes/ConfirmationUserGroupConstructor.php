<?php

require_once('Constructor.php');


class ConfirmationUserGroupConstructor extends Constructor {

//http://code.rubrick-jetpack.org/vocab/Context1
	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {
	
		case 'byCreatorURI':
			
			$queryStr .= "
			
			CONSTRUCT {

				?ug rdf:type ?type;
						sioc:has_creator <$this->creatorURI> ;
						sioc:name ?name ; 
						r:description ?desc .
			}
			
			
			WHERE {
				?ug a sioc:UserGroup ;
					rdf:type ?type;
					sioc:has_creator <$this->creatorURI> ;
				    sioc:name ?name ; 
					r:description ?desc .
			}";			
			
			
		break;
	

		}


		$this->query = $queryStr;
	}


}

?>
