<?php

require_once(CLASSES_DIR . 'RubrickBuilder.php');

class UserGroup extends RubrickBuilder {

	
	public $typeURI = 'sioc:UserGroup';


	public function buildAddGraph() {
		$this->_addLiteralsAndURIsToThisRes();
		$this->_addCreatorToThisRes();
		$this->_addCreatedToThisRes();
		$this->addResourceToGraph($this->res, 'add');
	}



}

?>
