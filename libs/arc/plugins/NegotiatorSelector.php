
<?php

class NegotiatorSelector {

	public $negotiators = array();

	public function NegotiatorSelector() 
	{
		$this->setNegotiators();		
	}

	public function setNegotiators() 
	{
		if ($handle = opendir('./')) {
			while (false !== ($file = readdir($handle))) {

				if ( substr($file, 0, 11 ) == 'negotiators_' && (substr($file, -1) != '~') ) {
					include_once($file);
					$this->negotiators[] = rtrim($file, '.php');			
				}
			}
			closedir($handle);
		}		
	}

	public function applyTestOnNegotiator($n, $val)
	{
		return call_user_func(array($n, 'applyTest'), $val);
	}

	public function getNegotiators($val, $nArray = false) 
	{

		$retArray = array();
		$nArray = ($nArray) ? $nArray : $this->negotiators;

		foreach($this->negotiators as $n) {
			if($this->applyTestOnNegotiator($n, $val)) {
				$retArray[] = ARC2::getComponent($n);
			}
		}
	}

}

$ns = new NegotiatorSelector();
echo $ns->applyTests();

?>
