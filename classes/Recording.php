<?php

require_once(CLASSES_DIR . 'RubrickBuilder.php');

class Recording extends RubrickBuilder {

	public $typeURI = 'r:Recording' ;
	
	public function buildAddGraph() {
		$this->_addCreatorToThisRes();
		$this->_addCreatedToThisRes();
		$this->processLineValues();
		
		$this->res->addPropValue('r:usesRubric', $_POST['rubricURI']);		
		$contextRes = $this->_getEmptyResource();
		$contextRes->setURI($_POST['context']);
		$contextRes->addPropValue('r:hasRecording', $recordingURI, 'uri');

		$this->addResourceToGraph($contextRes);
		$this->addResourceToAddGraph($this->res);
	}

	public function processLineValues() {

		if(is_array($this->postData['r:hasLineValues'])) {
			foreach($this->postData['r:hasLineValues'] as $lineValueURI) {
				$recordingRes->addPropValue('r:hasLineValue', $lineValueURI, 'uri');
			}
		} else {
			$recordingRes->addPropValue('r:hasLineValue', $this->postData['r:hasLineValues'], 'uri');
		}
	}
}

?>
