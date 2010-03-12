<?php

require_once(CLASSES_DIR . 'RubrickBuilder.php');

class Submission extends RubrickBuilder {

	public $typeURI = 'r:Submission';
	
	public function buildAddGraph() {
		$this->_addCreatedToThisRes();
		$this->_addCreatorToThisRes();
		$this->_addLiteralsAndURIsToThisRes();

		$contextRes = $this->_getEmptyResource();
		$contextRes->setURI($_POST['context']);
		$contextRes->addPropValue('r:hasSubmission', $submissionURI, 'uri');

		$this->addResourceToGraph($contextRes);
		$this->addResourceToAddGraph($this->res);
	}


}

?>	
