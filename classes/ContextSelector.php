<?php

require_once('Selector.php');


class ContextSelector extends Selector {


	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {

		case 'byURI':
			$queryStr .= "  
			SELECT DISTINCT ?name ?desc ?rURI
			WHERE {

				<$this->uri>  r:name ?name ; 
							r:description ?desc .

				OPTIONAL {
				<$this->uri>  r:hasRubric ?rURI . 
				}
			}
			";

		break;

		case 'byPermission':

			$queryStr .= "
				SELECT DISTINCT ?name ?desc ?cURI
				WHERE {
					?cURI r:hasPermissioning ?perming ;
						r:description ?desc ;
						r:name ?name .
					?perming r:hasPermission '$this->perm' . 
				}

			";


		break;

		default:

			$queryStr .= "  
			SELECT DISTINCT ?name ?desc ?rURI ?rLineURI 
			WHERE {

				?context	r:hasSubmission <$this->pageURL> ;
							r:hasRubric ?rURI .

				?rURI 		r:name ?name ; 
							r:description ?desc ;
							r:hasLine ?rLineURI . 

			}
			";

		break;

		}


		$this->query = $queryStr;
	}


	/**
	 * processResultSet
	 * @return
	*/

	public function processResultSet()
	{
		$obj = new StdClass();
		$obj->name = $this->rs['result']['rows'][0]['name'];
		$obj->desc = $this->rs['result']['rows'][0]['desc'];
		if( isset($this->rs['result']['rows'][0]['rURI']) ) {
			$obj->rubricURIs = $this->extractBinding('rURI');	
		}
		if( isset($this->rs['result']['rows'][0]['cURI']) ) {
			$obj->cURI = $this->rs['result']['rows'][0]['cURI'];	
		}

		$this->preJSONObj = $obj;

	}
}

?>
