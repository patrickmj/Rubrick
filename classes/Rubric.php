<?php

require_once('RubricLine.php');
require_once('RubricLineValue.php');

ARC2::inc('PMJ_ResourceGraphPlugin');

class Rubric {
    public $lines = array();
    public $graph ;
	public $uri = false;

    public function __construct($jsonObj) {
		global $graphConfig;
		

		$res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);

		$this->name = urldecode($jsonObj->rName);
/* I'm making all rubric submissions final, so always mint a new URI. new rubrics can be created from old one's, though */
		$this->mintURI();

		$res->setURI($this->uri);
		$res->addPropValue('rdf:type', 'r:Rubric', 'uri');
		$res->addPropValue('r:name', $this->name, 'literal' );
		$res->addPropValue('sioc:has_creator', $_SESSION['userURI'], 'uri');
		$res->addPropValue('dcterms:created', date('c'), 'literal', 'xsd:dateTime')	;


	

		foreach ($jsonObj->rubricMeta as $valObj) {
			foreach($valObj as $key=>$valArray) {
				switch($key) {
					
				case 'rDesc':
					$res->addPropValue('r:description', urldecode($valArray[0]), 'literal' );	
				break;
				
				case 'rTags':
					$tagsGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);

                    foreach($valArray  as $tag) {
//							$tagsGraph->merge($this->processTag(urldecode($tag)));
                    }
				break;
				
				case 'rPublic' :
					$res->addPropValue('r:isPublic', (string) $valArray[0], 'literal');
				break;


				default:
				
				break;
				}
			}
		}

        foreach ($jsonObj->rubricLines as $rubricLineObj) {
            $newLine = new RubricLine($rubricLineObj);
			$this->lines[] = $newLine;
			$res->addPropValue('r:hasLine' , $newLine->uri , 'uri');

        }

		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
		$this->graph->addResource($res);		
		/* Add the context info */

//TODO: build this into the UI

		foreach($jsonObj->rubricMeta[4]->rContexts as $cURI) {
			$contextRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
			$contextRes->setURI($cURI);
			$contextRes->addPropValue('r:hasRubric', $this->uri, 'uri');
			$this->graph->addResource($contextRes);
		}
	
    }

    public function mintURI() {
		//TODO: handle case when URI is already known!

		$this->uri = 'http://data.rubrick-jetpack.org/Rubrics/' . sha1($_SESSION['userURI'] . time() );
		return $this->uri;    
    }
    
    public function buildGraph() {
    	foreach($this->lines as $line) {
			$this->graph->mergeResourceGraph($line->graph);
		}
    }
}




?>
