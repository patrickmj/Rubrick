<?php 
require_once(CLASSES_DIR . 'RubrickBuilder.php');
include_once(ARC_DIR . 'ARC2.php');


class Person extends RubrickBuilder {


	public $typeURI = "foaf:Person";
	public $superClasses = array('foaf:Agent');


	public function buildAddGraph() {		
		$this->_addLiteralsAndURIsToThisRes();
		$this->addResourceToGraph($this->res, 'add');
	}
}


?>
