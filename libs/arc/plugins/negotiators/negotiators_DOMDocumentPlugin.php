<?php


ARC2::inc('negotiators_DataNegotiatorPlugin');
class negotiators_DOMDocumentPlugin extends negotiators_DataNegotiatorPlugin {

	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function negotiators_DOMDocumentPlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);


	}

	function __init()
	{
		parent::__init();
		if(isset($this->source)) {
			$this->xpath = new DOMXPath($this->source);
		}

	}

	function setDoc($domDocument)
	{
		$this->source = $domDocument;
		$this->xpath = new DOMXPath($this->source);
	}

	function preProcess()
	{
		$aNodes = $this->source->getElementsByTagName('a');
		for($i = 0; $i < $aNodes->length; $i++) {
			$this->addSubNegotiator('negotiators_ANodePlugin', array('source' => $aNodes->item($i)) ) ;
		}

	}

}
?>



