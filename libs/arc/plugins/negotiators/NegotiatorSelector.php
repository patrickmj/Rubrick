
<?php

//Singleton class

final class NegotiatorSelector {

	protected static $_instance;

	public $negotiators = array();

	protected function __construct() 
	{
		$this->setNegotiators();
	}

    public static function getInstance() 
    {
      if( self::$_instance === NULL ) {
        self::$_instance = new self();
      }
      return self::$_instance;
    }


	public function setNegotiators() 
	{
		if ($handle = opendir('./')) {
			while (false !== ($file = readdir($handle))) {

				if ( substr($file, 0, 12 ) == 'negotiators_' && ($file != 'negotiators_DataNegotiatorPlugin')&& (substr($file, -1) != '~') ) {
					ARC2::inc(rtrim($file, '.php'));
					$this->negotiators[] = rtrim($file, '.php');			
				}
			}
			closedir($handle);
		}		
	}

	public function applyTestOnNegotiator($n, $val)
	{
		try {
			$result =  call_user_func(array($n, 'applyTest'), $val);
		} catch (Exception $e) {
			$result = false;
		}
		return $result;
	}

	/**
	 * @return array names of negotiators that passed the test
	*/


	public function applyTestOnNegotiators($val, $nArray = false) 
	{
		$retArray = array();
		$nArray = $nArray ? $nArray : $this->negotiators;
		foreach($nArray as $n) {
			if($this->applyTestOnNegotiator($n, $val)) {
				$retArray[] = $n;
			}
		}
		return $retArray;
	}

}


?>
