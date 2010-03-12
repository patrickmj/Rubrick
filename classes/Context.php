<?php //Context.php
require_once(CLASSES_DIR . 'RubrickBuilder.php');
require_once(CLASSES_DIR . 'Permissioning.php');
include_once(ARC_DIR . 'ARC2.php');


class Context extends RubrickBuilder {


	public $typeURI = "r:Context";


	public function __construct($uri = false, $postData = false) {
		parent::__construct($uri, $postData);
		$this->setDefaultPermissions();		

	}

	public function setDefaultPermissions() {

		$this->defaultPermissions = array();

		$recordPerm = new StdClass();
		$recordPerm->perm = 'r:record';
		$recordPerm->allow[] = 'r:creator';
		$this->defaultPermissions[] = $recordPerm;

		$viewPerm = new StdClass();
		$viewPerm->perm = 'r:viewRecordings';
		$viewPerm->allow[] = 'r:creator';
		$this->defaultPermissions[] = $viewPerm;

		$getReportPerm = new StdClass();
		$getReportPerm->perm = 'r:getReport';
		$getReportPerm->allow[] = 'r:creator';
		$this->defaultPermissions[] = $getReportPerm;

		$addRubricPerm = new StdClass();
		$addRubricPerm->perm = 'r:addRubric';
		$addRubricPerm->allow[] = 'r:creator';
		$this->defaultPermissions[] = $addRubricPerm;

	}

	public function buildAddGraph() {
		$this->_addLiteralsAndURIsToThisRes();
		$this->_addCreatorToThisRes();
		$this->_addCreatedToThisRes();
		$this->buildDefaultPermissionings();
		$this->addResourceToGraph($this->res, 'add');
	}


	public function buildDefaultPermissionings() {
		foreach ($this->defaultPermissions as $permObj) {
			$newPermissioning = new Permissioning(false, array( 'properties'=>array('revResourceURI'=>$this->uri), 'post'=>$permObj) );
			$newPermissioning->revPredURI = $this->uri;
			$newPermissioning->buildAddGraph();
			$this->aggregates[] = $newPermissioning;
		}
	}
}


?>
