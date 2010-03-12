<?php

require_once('RubrickBuilder.php');
require_once('RubricLineValue.php');



/*
 *	class:	RubrickLine
 *	
 *
*/

class RubricLine extends RubrickBuilder
{

	public $typeURI = 'r:RubricLine';
	public $revPred = 'r:hasLine';
	public $valuesCount = 5;
	
	/**
	 * buildAddGraph
	*/

	public function buildAddGraph()
	{
   
        $this->_addCreatorToThisRes();
		$this->_addCreatedToThisRes();
		
		
		$lineValuesGraph = $this->buildLineValues($this->valuesCount);
		$this->addGraph->mergeResourceGraph($lineValuesGraph);
		$this->addResourceToGraph($this->res, 'add');
		$this->addRevRelTriples('add');
	}

	public function buildLineValues($vals) {
		$graph = $this->_getEmptyGraph();
		$val = 0;
		while($val < $vals) {
			$newRubricLineValue = new RubricLineValue(false, array('properties' =>
																array('rubricLineURI'=>$this->uri , 'score'=>$val)
															)
													 );
			$newRubricLineValue->buildAddGraph();
			
			$graph->mergeResourceGraph($newRubricLineValue->addGraph);
			$val++;
		}
		return $graph;
	}
}


?>
