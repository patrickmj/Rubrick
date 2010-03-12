<?php

require_once(ARC_DIR . 'ARC2.php');

class TagCollector {
	
	public $uris;
	public $graph;
	
	public function __construct($array) {
		global $config;
		global $graphConfig;
		$this->store = ARC2::getStore($config);
		
		if(isset($array['uris'])) {
			$this->uris = $array['uris'];
		}
		if(isset($array['tagURIs'])) {
			$this->tagURIs = $array['tagURIs'];
		}
		
		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);		
	}
	
	public function buildTagGraphForAllURIs() {
		foreach($this->uris as $uri) {
			$this->buildTagGraphForURI($uri);
		}
	}
	
	public function setTagURIsFromGraph() {
		$this->tagURIs = $this->graph->getResourceURIs();
	}
	
	public function buildTagGraphForURI($uri) {
		$queryStr = PREFIXES;
		$queryStr .= "
			CONSTRUCT {
				?tagURI tagging:name ?tagName .
				   
			}
			WHERE {
				<$uri> tagging:tag ?tagging .
				?tagging tagging:associatedTag ?tagURI .
				?tagURI tagging:name ?tagName .
			}
		";
		$index = $this->store->query($queryStr, 'raw');
		$this->graph->mergeIndex($index);
		
	}
	
	public function buildTagURIMap() {
		$retObj = new stdClass();

		
		foreach($this->tagURIs as $tagURI) {
			$queryStr = PREFIXES;
			$queryStr .= "
				SELECT DISTINCT ?resURI
	
				WHERE {
					?resURI tagging:tag ?tagging .
					?tagging tagging:associatedTag <$tagURI> . 
				}
			";
			$rs = $this->store->query($queryStr, 'raw');
			$arr = array();
			
			
			foreach($rs['rows'] as $index=>$obj) {
				$arr[] = $obj['resURI'];
			}
			$retObj->$tagURI = $arr;
		}
		
		
		return $retObj;
	}
}



?>