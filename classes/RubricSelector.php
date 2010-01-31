<?php

require_once('Selector.php');


class RubricSelector extends Selector {


	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {

		case 'byURI':
			$queryStr .= "  
			SELECT DISTINCT ?name ?desc ?rLineURI 
			WHERE {

				<$this->uri> 		r:name ?name ; 
							r:description ?desc ;
							r:hasLine ?rLineURI . 
				?rLineURI r:order ?lOrder . 
			}
			ORDER BY ASC (?lOrder)
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
		$rubricObj = new StdClass();
		$rubricObj->name = $this->rs['result']['rows'][0]['name'];
		$rubricObj->desc = $this->rs['result']['rows'][0]['desc'];
		$rubricObj->rLines = $this->extractBinding('rLineURI');
		$uri = $this->uri ? $this->uri : $this->rs['result']['rows'][0]['rURI'];
		$this->preJSONObj = $rubricObj;

	}



}

?>