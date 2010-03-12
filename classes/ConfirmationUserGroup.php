<?php
// NB A ConfirmationUserGroup has nothing to do with Catholocism or the cathholic sacrament ;)

require_once(CLASSES_DIR . 'UserGroup.php');

class ConfirmationUserGroup extends UserGroup {

	public $typeURI = 'r:ConfirmationUserGroup';
	public $superClasses = array('sioc:UserGroup');
	public function buildAddGraph() {
		parent::buildAddGraph();


		$this->addResourceToGraph($this->res, 'add');
	}


}

?>
