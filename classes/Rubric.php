<?php

require_once('RubrickBuilder.php');
require_once('RubricLine.php');
require_once('RubricLineValue.php');

/*
 *	class:	Rubric
 *	
 *
*/

class Rubric extends RubrickBuilder
{

	public $typeURI = 'r:Rubric';

	/**
	 * buildAddGraph
	 * @param  
	 * @return
	*/

	public function buildAddGraph()
	{

		$this->_addCreatorToThisRes();
		$this->_addCreatedToThisRes();
		$this->_addLiteralsAndURIsToThisRes();
		
		if( isset($this->postData->rubricMeta) )  {
			$this->buildMeta();	
		}
		
		if ( isset($this->postData->rubricLines) ) {
			$this->buildLines();
			$this->addRevRelTriples('add');			
		}

		$this->addResourceToGraph($this->res, 'add');
	}

	/**
	 * buildLines
	 * @return
	*/

	public function buildLines()
	{
		foreach ($this->postData->rubricLines as $rubricLineObj) {					
            $newLine = new RubricLine(false, $rubricLineObj);
			$newLine->revResourceURI = $this->uri;
			$newLine->buildAddGraph();
			$this->aggregates[] = $newLine;
        }
	}

	/**
	 * buildMeta	

	 * @return
	*/

	public function buildMeta()
	{
		
		foreach ($this->postData->rubricMeta as $valObj) {
			foreach($valObj as $key=>$valArray) {
				switch($key) {
				
				case 'rName':
					$this->res->addPropValue('sioc:name', urldecode($valArray[0]), 'literal' );	
					
				break;
				
							
				case 'rDesc':
					$this->res->addPropValue('r:description', urldecode($valArray[0]), 'literal' );	
				break;
		
				case 'rTags':

					//using richard newman's tagging ontology, which distinguishes between
					//Tagging and Tag so that dates and names can be associated with a Tag	
				
					$newTagging = new Tagging(false, $valArray);
					$newTagging->revResourceURI = $this->uri;
					$newTagging->buildAddGraph();
					$this->aggregates[] = $newTagging;



				break;
				
				case 'rPublic' :
					$this->res->addPropValue('r:isPublic', (string) $valArray[0], 'literal');
				break;

				case 'rContexts' :
					foreach($valArray as $contextURI) {
						$contextRes = $this->_getEmptyResource();
						$contextRes->setURI($contextURI);
						$contextRes->addPropValue('r:hasRubric', $this->uri, 'uri');
						$this->addResourceToGraph($contextRes, 'add');
					}
					
				break;
			
				default:
				
				break;
				}
			}
		}		
		$this->addResourceToGraph($this->res, 'add');
	}

}



?>
