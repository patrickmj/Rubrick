<?php


class negotiators_ANodePlugin extends negotiators_DataNegotiatorPlugin{

	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function negotiators_ANodePlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);


	}

	function __init()
	{
		parent::__init();


		$this->ns['sioc'] = 'http://rdfs.org/sioc/ns#'; //make sure sioc is in the available namespace prefixes
		if (! $this->revProp) { //if not passed a config revProp, fill in default of sioc:links_to
			$this->revProp = $this->expandPName('sioc:links_to');
		}
		if(isset ($this->a['parentURI'])) {
			$this->revURI = $this->a['parentURI'];
		}


	}

	function setNode($aNode)
	{
		$this->setSource($aNode);
	}

	function processCurrResource()
	{
		if ( ! $this->currURI) {
			$this->currURI = $this->source->getAttribute('href');
		}
		return parent::processCurrResource();	

	}

	

}

?>
