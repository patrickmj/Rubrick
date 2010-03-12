<?php
require_once('../config.php');
require_once(ARC_DIR . 'ARC2.php');
header('Content-type: application/json');
class PermissionCollector {
	
	public $uris;
	public $graph;
	
	public function __construct($contextURIs) {
		global $config;
		global $graphConfig;
		$this->store = ARC2::getStore($config);
		
		$this->uris = $contextURIs;
		
		$this->graph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);		
	}
	
	public function buildPermissionGraphForAllURIs() {
		foreach($this->uris as $uri) {
			$this->buildPermissionGraphForURI($uri);
		}
	}
	
	public function setPermissionURIsFromGraph() {
		$this->tagURIs = $this->graph->getResourceURIs();
	}
	
	public function buildPermissionGraphForURI($uri) {
		$queryStr = PREFIXES;
		$queryStr .= "
			CONSTRUCT {
				<$uri> r:hasPermission ?perm .
				?perm sioc:name ?permName ;
					r:allow ?allowed . 
				
				   
			}
			WHERE {
				<$uri> r:hasPermissioning ?ping .
				?ping r:hasPermission ?perm ;
					r:allow ?allowed .
				?perm r:permissionName ?permName .
			}
		";
		
		$index = $this->store->query($queryStr, 'raw');
		$this->graph->mergeIndex($index);
		
	}
/*	
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
*/	
}
$uris = array('http://code.rubrick-jetpack.org/vocab/Context1',
			  'http://data.rubrick-jetpack.org/Context/275022f95c8dc2437e4a538ae2f36933e0d26bf1',
			  'http://data.rubrick-jetpack.org/Context/06440669704acda4d55e804c6356415cc725bbe6');
$pc = new PermissionCollector($uris);
$pc->buildPermissionGraphForAllURIs();
echo json_encode($pc->graph->toRDFJSON(true));

?>