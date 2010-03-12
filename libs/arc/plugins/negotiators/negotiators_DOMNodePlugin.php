<?php

ARC2::inc('negotiators_DataNegotiatorPlugin');



class negotiators_DOMNodePlugin extends negotiators_DataNegotiatorPlugin {


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

		$this->xpath = $this->a['xpath'];

	}

}


?>
