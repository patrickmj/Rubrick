<?php //Context.php

include_once(ARC_DIR . 'ARC2.php');


class Context {


	public $graph;
	public $store;
	public $contextURI;
	public $postObject;

	public function __construct( $postObject = null) {
		global $config; 
		$this->store = ARC2::getStore($config);
		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $config);
		$this->uri = $this->mintContextURI();
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


		if($postObject) {
			$this->postObject = $postObject;
		}

	}

	public function buildPrivateGraph() {
		$contextRes = $this->buildContextResource();
		foreach ($this->defaultPermissions as $permObj) {
			$newRes = $this->buildPermissioningResource($permObj);
			$this->graph->addResource($newRes);
			$contextRes->addPropValue('r:hasPermissioning', $newRes->uri, 'uri');
		}
		$this->graph->addResource($contextRes);
		
	}

	public function buildContextResource() {
		global $graphConfig;
		$res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);		
		$res->setURI($this->uri);
		$res->addPropValue('r:name', $this->postObject->name, 'literal');
		$res->addPropValue('r:description', $this->postObject->desc, 'literal');
		$res->addPropValue('rdf:type', 'r:Context', 'uri');
		$res->addPropValue('sioc:has_creator', $_SESSION['userURI'], 'uri');
		$res->addPropValue('dcterms:created', date('c'), 'literal', 'xsd:dateTime')	;
		return $res; 
	}

	public function buildPermissioningResource($pingObj) {
		global $graphConfig;
		$res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
		$res->setURI($this->mintPermissioningURI() );
		$res->addPropValue('rdf:type', 'r:Permissioning', 'uri');
		$res->addPropValue('r:hasPermission', $pingObj->perm, 'uri');
		foreach($pingObj->allow as $allowURI) {
			$res->addPropValue('r:allow', $allowURI, 'uri');
		}
		return $res;
	}

	public function processPostObject() {
		
		if($this->postObject->action == 'create') {
			if(isset($this->postObject->perms)) {


			} else {
				$this->buildPrivateGraph();
			}


		}

	}

	private function deleteContextGraph() {

	}

	private function mintContextURI() {
		$uri = 'http://data.rubrick-jetpack.org/Contexts/' . sha1($_SESSION['userURI'] . microtime()) ; 
		return $uri;
	}

	private function mintPermissioningURI() {
		$uri = 'http://data.rubrick-jetpack.org/Permissionings/' . sha1($_SESSION['userURI'] . microtime()) ; 
		return $uri; 
	}


}


?>
