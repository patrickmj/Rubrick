<?php



class negotiators_TestPlugin extends negotiators_DataNegotiatorPlugin{

	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function negotiators_TestPlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);

		$this->currURI = isset($this->a['currURI']) ? $this->a['currURI'] : $caller->currURI;

		$this->revURI = isset($this->a['revURI']) ? $this->a['revURI'] : $caller->currURI;

	}

	function __init()
	{
		parent::__init();
		$this->ns['test'] = 'http://example.org/testNS/';


	}

	static function applyTest($testVal)
	{
		if($testVal == 'skipme') return false;

		return true;

	}




}



?>
