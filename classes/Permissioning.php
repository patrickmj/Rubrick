<?php //
require_once(CLASSES_DIR . 'RubrickBuilder.php');
include_once(ARC_DIR . 'ARC2.php');


class Permissioning extends RubrickBuilder {


	public $typeURI = "r:Permissioning";
	public $revPred = "r:hasPermissioning";


	public function buildAddGraph() {		
		$this->res->addPropValue('r:hasPermission', $this->postData->perm, 'uri');
		foreach($this->postData->allow as $allowURI) {
			$this->res->addPropValue('r:allow', $allowURI, 'uri');
		}		
		$this->addResourceToGraph($this->res, 'add');
		$this->addRevRelTriples('add');
	}
}


?>
