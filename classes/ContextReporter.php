<?php //ContextReporter.php

include_once(ARC_DIR . 'ARC2.php');



class ContextReporter {


	public $bindings = array('rName', 'pURL', 'pTitle', 'lvScore', 'lvDesc', 'pTitle', 'recorderUserName');
	public $store;
//TODO: make $query build up from options passed
	public $query = '';

	public function __construct($contextURI) {
		global $config;
		$this->store = ARC2::getStore($config);
		$this->contextURI = $contextURI;
		$this->query = "

SELECT DISTINCT ?rName ?pURL ?pTitle  ?lvDesc  ?lvScore 
WHERE  {
	<$this->contextURI> r:hasRubric ?rubric ; 
r:hasRubric ?rubric ; 
	    r:hasRecording ?rec .
        ?rubric sioc:name ?rName . 
	?rec r:hasLineValue ?lv ;
		r:hasPage ?pURL ; 
		 sioc:has_creator ?recCreator . 
	?lv r:score ?lvScore ;
		r:description ?lvDesc . 
OPTIONAL {
	?pURL dc:title ?pTitle . 
}	
}

	";


	}

	public function setBindings($bindingsArray) {
		$this->bindings = $bindingsArray;

	}



	public function doQuery() {
		$this->rs = $this->store->query($this->query);

	}

	public function templateRSasCSV() {
		$csv = "Rubric,Recorded Page,Page Title,Recorded By,Score Description,Score \n";
		foreach($this->rs['result']['rows'] as $row) {

			foreach($this->rs['result']['variables'] as $binding) {
				if(in_array($binding, $this->bindings)) {
					switch($binding) {
						case 'pTitle' :
							if(isset($row['pTitle'])) {
								$csv .= $row['pTitle'] . ',';
							} else {
								$csv .= '(unknown)' . ',';			
							}
						break;

						default:
							$csv .= $row[$binding] . ',';
						break;
					}
				}
			}
			$csv .= "\n";
		}

		return $csv;
	}
}

?>
