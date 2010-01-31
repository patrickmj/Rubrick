<?php



class RubricLine {
    
    public $description;
    public $tags = array();
    public $order;
	public $name;
    public $lineValues = array();
	public $uri;
    public $graph ;


    public function __construct($lineObj) {

		global $graphConfig;

		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
	    $res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);
		


		if($lineObj->action == 'create') {
			$this->mintURI($lineObj);
			$res->setURI($this->uri);
		} else {
			$res->setURI($lineObj->rubrickLineURI);
		}		
		$res->addPropValue('rdf:type', 'r:RubricLine', 'uri');
	    $lineVals = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);

        foreach( $lineObj->fields as $fieldObj) {
            foreach($fieldObj as $field=>$valArray) {
                switch($field) {
                    case 'Tags':
						$tagsGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);   
	                    foreach($valArray  as $tag) {
//							$tagsGraph->merge($this->processTag(urldecode($tag)));
                        }
                    
                    break;
                    
                    case 'Description':
						$res->addPropValue('r:description', urldecode($valArray[0]), 'literal');

                    break;

					case 'Name':
						$res->addPropValue('r:name', urldecode($valArray[0]), 'literal');
					break;

					case 'Public':
						$res->addPropValue('r:isPublic', (string) $valArray[0], 'literal');
					break;

                    case 'order':
						$res->addPropValue('r:order', (string) $valArray[0], 'literal');

                    break;
                                        
                    default:
                        $newLineVal = new RubricLineValue($fieldObj, $this->uri); 
						$this->lineValues[] = $newLineVal;
						$this->graph->mergeResourceGraph($newLineVal->graph);
						$res->addPropValue('r:hasLineValue', $newLineVal->uri, 'uri');
                    break;
                }                        
            }
        }

		$this->graph->addResource($res);		

    }



    public function mintURI($lineObj) {
		//TODO: handle case when URI is already known!
		$this->uri = 'http://data.rubrick-jetpack.org/RubricLines/' . sha1( serialize($lineObj) . time() );
		return $this->uri;
    }
    
    public function buildGraph() {
    
    }
}



?>