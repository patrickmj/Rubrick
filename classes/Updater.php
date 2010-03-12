<?php

require_once('GraphBuilder.php');
require_once('Tagging.php');
class Updater extends GraphBuilder {
	
	
	
	public function buildAddGraph() {
		$createIndex = json_decode($this->postData->new ,true);
		if(count($createIndex) == 0 ) {
			return;
		}
		$g = $this->_getEmptyGraph();
		$g->mergeIndex($createIndex);
		
		//tease out the special cases for Permissionings and Taggings
		$newTagsGraph = $g->extractGraphAroundProp('tagging:tag');
		$g->removeProp("tagging:tag");
		if($g->resourceCount() > 0) {
			$newTagging = new Tagging(false, array('properties'=>array('newTagGraph' => $newTagsGraph)) );			
			$newTagging->buildUpdateGraph();
			$this->addGraph->mergeResourceGraph($newTagging->updateGraph);
		}
		$this->addGraph->mergeResourceGraph($g);
		
	}
	
	public function buildDeleteGraph() {
		$deleteIndex = json_decode($this->postData->old , true);
		if(count($deleteIndex) == 0 ){
			return;
		}
		$g = $this->_getEmptyGraph();
		$g->mergeIndex($deleteIndex);
		$oldTagsGraph = $g->extractGraphAroundProp('tagging:tag');
		$g->removeProp("tagging:tag");
		$tagURIs = $oldTagsGraph->extractResourceObjectsArrayAroundProp('tagging:tag');
		foreach($tagURIs as $sURI=>$tagURIs) {
			foreach($tagURIs as $tagURI) {
				$query = PREFIXES;
				$query .= "CONSTRUCT {
					<$sURI> tagging:tag ?tagging .
					?tagging tagging:associatedTag <$tagURI> ;
						?p ?o . 
					
					} WHERE {
					<$sURI> tagging:tag ?tagging .
					?tagging tagging:associatedTag <$tagURI> ;
						?p ?o . 					
					}					
				";
				$index = $this->store->query($query, 'raw');
				$g->mergeIndex($index);
			}
		}
		$this->deleteGraph = $g;
	}

}
?>


