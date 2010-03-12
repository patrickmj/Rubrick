<?php

require_once(CLASSES_DIR . 'RubrickBuilder.php');
require_once(CLASSES_DIR . 'Tag.php');

class Tagging extends RubrickBuilder {

	public $revPred = 'tagging:tag';
	public $typeURI = 'tagging:Tagging';
	
	public function buildAddGraph() {
		
		
		$this->_addCreatorToThisRes();
		foreach($this->postData->literals as $obj) {
			if($obj->p == 'sioc:name') {
				$newTag = new Tag(false, array('post'=>$obj->o ) );
				$newTag->revResourceURI = $this->uri;
				$newTag->buildAddGraph();
				$this->addGraphToGraph($newTag->addGraph, 'add');
			}
		}
		$this->addRevRelTriples('add');
		$this->addResourceToGraph($this->res, 'add');
	}



	public function buildUpdateGraph() {
		$this->_addCreatedToThisRes();
		$this->updateGraph = $this->_getEmptyGraph();
		$tagURIs = $this->newTagGraph->extractResourceObjectsArrayAroundProp('tagging:tag');
		foreach($tagURIs as $sURI=>$tagURI) {
			$this->res->addPropValue('tagging:associatedTag', $tagURI, 'uri');
			$this->revResourceURI = $sURI;
			$this->addRevRelTriples('update');
		}
		$this->updateGraph->addResource($this->res);
	}
	
}


?>