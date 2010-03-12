<?php

require_once('GraphBuilder.php');
ARC2::inc('PMJ_ResourceGraphPlugin');
ARC2::inc('PMJ_ResourcePlusPlugin');


class RubrickBuilder extends GraphBuilder {



	public function buildAddGraph() {

		$this->_addCreatorToThisRes();
		$this->_addCreatedToThisRes();
		$this->_addLiteralsAndURIsToThisRes();
		$this->addResourceToGraph($this->res, 'add');
	}

	/**
	 * storeGraphToSessionConfirm
	 * @param string $graph either 'add' or 'delete'
	 * @return
	*/

	public function storeGraphToSessionConfirm($g)
	{
		$graph = $this->_getGraph($g);
		$serializedGraph = serialize($graph);
		$_SESSION['tempGraph'] = $serializedGraph;
		$_SESSION['tempObjURI'] = $this->uri;
	}

	/**
	 * restoreGraphFromTemp
	 * @param type $g
	 * @return
	*/

	public function restoreGraphFromTemp($g)
	{
		$graph = $this->_getGraph($g);
		$graph->mergeResourceGraph( unserialize($_SESSION['tempGraph']) );
		$this->uri = $_SESSION['tempObjURI'];
	}


}



?>
