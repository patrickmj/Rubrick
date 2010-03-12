<?php

require_once(CLASSES_DIR . 'RubrickBuilder.php');

class Tag extends RubrickBuilder {

	public $typeURI = 'tagging:Tag';
	public $revPred = 'tagging:associatedTag';
	
	public function buildAddGraph() {
		$this->res->addPropValue('tagging:name', urldecode($this->postData), 'literal');
		$this->addRevRelTriples('add');
		$this->addResourceToGraph($this->res, 'add');
	}

	public function mintURI() {
		$simpleName = strtolower(str_replace(' ', '_', trim(urldecode($this->postData))));
		return 'http://data.rubrick-jetpack.org/Tag/' . $simpleName;
	}
}

?>
