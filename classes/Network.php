<?php

require_once(CLASSES_DIR . 'RubrickBuilder.php');

class Network extends RubrickBuilder {

	public $superClasses = array('sioc:UserGroup');
	public $typeURI = 'r:Network';


	public function buildAddGraph() {
		$this->_addLiteralsAndURIsToThisRes();
		$this->_addCreatorToThisRes();
		$this->_addCreatedToThisRes();
		$this->addResourceToGraph($this->res, 'add');
	}



}

?>
