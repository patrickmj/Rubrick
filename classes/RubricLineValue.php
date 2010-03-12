<?php

require_once(CLASSES_DIR . 'RubrickBuilder.php');

class RubricLineValue extends RubrickBuilder {

	public $typeURI = 'r:RubricLineValue';
	public $revPred = 'r:hasLineValue';

	public function buildAddGraph() {
		//Getting the description out is slag, at least until I can figure out how to redo the javascript fields
		//print_r($this->postData);
		$this->revResourceURI = $this->rubricLineURI;
		
		$this->res->addPropValue('r:score', $this->score, 'literal');
		if(isset($desc) ) {
			$this->res->addPropValue('r:description', $desc, 'literal');	
		}
		
		$this->addResourceToGraph($this->res, 'add');
		$this->addRevRelTriples('add');
	}
	
	public function mintURI() {
		return $this->rubricLineURI . "-s" . $this->score;
	}
} 



?>
