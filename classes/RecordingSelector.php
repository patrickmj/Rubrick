<?php

require_once('Selector.php');


class RecordingSelector extends Selector {


	public function __construct($vars) {
		global $config;
		$this->store = ARC2::getStore($config);
		foreach ($vars as $var=>$val) {
			$this->$var = $val;
		}
		$this->preJSONObj = new StdClass();

	}

	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {

		case 'byContext':
			$queryStr .= "
				SELECT DISTINCT ?rec ?recLineVal ?page ?rubric
				WHERE {
					<$this->ecURI> r:hasRecording ?rec . 
					?rec r:hasLineValue ?recLineVal ;
						r:hasRubric ?rubric ; 
						r:hasPage ?page . 
				}


			";


		break;



		case 'byURI':
	
		break;


		default:

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


		$recURIs = $this->extractBinding('rec');
		foreach($recURIs as $uri) {
			$this->preJSONObj->$uri = new StdClass();
		}
		foreach($this->rs['result']['rows'] as $row) {
			$uri = $row['rec'];
			$this->preJSONObj->$uri->recordedLineVals[] = $row['recLineVal'];
			$this->preJSONObj->$uri->rubric = $row['rubric'];
			$this->preJSONObj->$uri->page = $row['page'];
		}



	}
}






?>