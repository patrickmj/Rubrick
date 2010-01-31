<?php

ARC2::inc('negotiators_DOMNodePlugin');

class negotiators_RSSItemPlugin extends negotiators_DOMNodePlugin {

	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function negotiators_DOMNodePlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);


	}

	function __init()
	{
		parent::__init();
		$this->revProp = 'sioc:has_container';
		$this->ns['xsd'] = "http://www.w3.org/2001/XMLSchema#";

	}


	function preProcess()
	{
		date_default_timezone_set('America/New_York');
		$linkNodes = $this->xpath->query('link', $this->source);
		$postPage = $this->trimSlash($linkNodes->item(0)->textContent );
		$postURI =  $postPage . '#this';
		$postRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', array('ns' => $this->ns)) ;
		$postRes->setURI($postURI);
		$postRes->addPropValue($this->revProp, $this->revURI);
		$titleNodes = $this->xpath->query('title', $this->source);
		$postRes->addPropValue('dcterms:title' , $titleNodes->item(0)->textContent);
		$createdNodes = $this->xpath->query('pubDate', $this->source);
		$created = $createdNodes->item(0)->textContent;
		$createdDateTime = date_create($created);
	
		$postRes->addPropValue('dcterms:created', $createdDateTime->format('c'), 'literal' , 'xsd:dateTime'  );


		$this->graph->addResource($postRes);

	}

}


?>
