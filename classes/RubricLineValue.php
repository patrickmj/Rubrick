<?php



class RubricLineValue {
    public $graph ;
    public $description;
    public $score;
    public $uri;
	public $lineURI;
    public $field; 


    public function __construct($fieldObj, $lineURI) {
		global $graphConfig;    
		$this->lineURI = $lineURI;

		
	    $res = ARC2::getComponent('PMJ_ResourcePlusPlugin', $graphConfig);


		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
		

		
        foreach($fieldObj as $key=>$val) {
            if($key == 'score') {
                $this->score = $val;				
            } else {
                $this->description= urldecode($val[0]);				
				$this->uri = $lineURI . '-' . $key;
            }
        
        }
		$res->setURI($this->uri);
		$res->addPropValue('rdf:type', 'r:RubricLineValue', 'uri');
		$res->addPropValue('r:score', $this->score, 'literal');
		$res->addPropValue('r:description', $this->description, 'literal');
		$this->graph->addResource($res);
    }


} 



?>
