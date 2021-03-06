
<?php


ARC2::inc('Resource');


class PMJ_ResourcePlus extends ARC2_Resource
{
	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function PMJ_ResourcePlusPlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);
	}

	function __init() 
	{
		parent::__init();
	}




	/**
	 * function  mergeResource
	 * @param PMJ_ResourcePlus $res
	*/

	public function mergeResource($res)
	{
		if($res-uri != $this->uri) {
			$this->addError('Resource uris must match');
			return false;
		}
		$this->index = ARC2::getMergedIndex($res->index, $this->index);
	}


	/**
	 * function getClasses
	 * get all the classes the resource belongs to
	 * @return Array
	*/

	public function getClasses()
	{
		return $this->getProp('rdfs:type');
	}

	/**
	 * function addPO
	 * add a predicate and object to the resource
	 * @param string $p the property
	 * @param mixed $o the object. either an array in the usual form, or just a string either literal or uri
	 * @param string $type type object type defaults to uri
	 * @param string $dt the datatype (optional)
	 * @param string $l the languae for a literal (optional)
	*/

	public function addPO($p, $o, $type = 'uri', $dt = null, $l = null)
	{
		//TODO: expand everything
		if( ! is_array($o) ) {
			$o = array('value' => $o, 'type' => $type );
		}

		if ($dt != null ) {
			$o['datatype'] = $dt;
		}

		if ($l != null ) {
			$o['lang'] = $l;
		}

		if (! isset($this->index[$this->uri][$p])) {
			$this->index[$this->uri][$p] = array();
		}

		$this->index[$this->uri][$p][] = $o;

	}
		
	/**
	 * function removeProp
	 * @param string $p
	 * 
	*/
	
	public function removeProp($p)
	{
		unset($this->index[$this->uri][$p]);
	}


	/**
	 * function removePO
	 * @param string $p the property
	 * @param string $o the value of the object
	 * @param string $l optional -- the language of the value
	 * @return
	*/

	public function removePO($p, $o, $l)
	{
		if ( ! isset($this->index[$this->uri][$p])) {
			return false;
		}
		foreach ($this->index[$this->uri][$p] as $i=>$object) {
			if($object['value'] == $o ) {
				if( ! $l ) {
			 		unset($this->index[$this->uri][$p][$i]) ; 
				} else if ($l == $object['lang']) {
					unset($this->index[$this->uri][$p][$i]) ; 
				}
			}
		}
	}



}


?>
