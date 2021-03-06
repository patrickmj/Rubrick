<?php

ARC2::inc('negotiators_DOMDocumentPlugin');


class negotiators_RSSFeedPlugin extends negotiators_DOMDocumentPlugin {

	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function negotiators_RSSFeedPlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);


	}

	function __init()
	{
		parent::__init();
		$this->xpath->registerNamespace('content' , "http://purl.org/rss/1.0/modules/content/");
		$this->xpath->registerNamespace('wfw' , "http://wellformedweb.org/CommentAPI/");
		$this->xpath->registerNamespace('dc' , "http://purl.org/dc/elements/1.1/");
		$this->xpath->registerNamespace('atom' , "http://www.w3.org/2005/Atom");
		$this->xpath->registerNamespace( 'sy' , "http://purl.org/rss/1.0/modules/syndication/");
		$this->xpath->registerNamespace('slash' , "http://purl.org/rss/1.0/modules/slash/");
		$this->ns['sioc'] = 'http://rdfs.org/sioc/ns#';
		$this->ns['dcterms'] = 'http://purl.org/dc/terms/';
		$this->ns['foaf'] = 'http://xmlns.com/foaf/0.1/';

	}


	function preProcess()
	{


		$linkNodes = $this->xpath->query('//channel/link');
		$linkNode = $linkNodes->item(0);
		$pageURL = $this->trimSlash($linkNode->textContent);
		$siteURI = $pageURL . "#this";

		$siteRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', array('ns' => $this->ns));
		$siteRes->setURI($siteURI);
		$titles = $this->xpath->query('//channel/title');
		$siteRes->addPropValue('dcterms:title', $titles->item(0)->textContent, 'literal');
		$siteRes->addPropValue('rdf:type' , 'sioc:Site');
		$siteRes->addPropValue('foaf:page' , $pageURL );
		$this->graph->addResource($siteRes);


		$items = $this->source->getElementsByTagName('item');
		for($i = 0; $i < $items->length; $i++) {
			$this->addSubNegotiator('negotiators_RSSItemPlugin', array('source' => $items->item($i) , 'revURI' => $siteURI , 'xpath' => $this->xpath ) ) ;
		}
	}

	function processCurrResource() 
	{

	}

	function postProcess()
	{
		$this->gatherSubnegotiatorGraphs();
	}


}

?>
