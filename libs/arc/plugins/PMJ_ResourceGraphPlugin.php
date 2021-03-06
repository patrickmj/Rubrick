<?php



ARC2::inc('Class');
/*
 *	class:	PMJ_ResourceGraphPlugin
 *	
 *
*/

class PMJ_ResourceGraphPlugin extends ARC2_Class
{
	function __construct($a = '', &$caller) 
	{
		parent::__construct($a, $caller);
	}

	function PMJ_ResourceGraphPlugin ($a = '', &$caller) 
	{
		$this->__construct($a, $caller);
	}

	function __init() 
	{
		parent::__init();
		$this->resources = array();
	}


	/**
	 * toIndex
	 * @return array
	*/

	public function toIndex()
	{
		$index = array();
		foreach ($this->resources as $res ) {
			$index = ARC2::getMergedIndex($index, $res->index);
		}
		return $index;
	}


	function toNTriples() {
		
		$index = $this->toIndex();
		$ser = ARC2::getNTriplesSerializer(array('ns' => $this->ns));
		return $ser->getSerializedIndex($index);
	}

	function toTurtle() {

		$index = $this->toIndex();
		$ser = ARC2::getTurtleSerializer(array('ns' => $this->ns));
		return $ser->getSerializedIndex($index);
	}

	function toRDFXML() {
		$index = $this->toIndex();
		$ser = ARC2::getRDFXMLSerializer(array('ns' => $this->ns));
		return $ser->getSerializedIndex($index);
	}

	function toRDFJSON($asObject = false) {

		$index = $this->toIndex();
		$ser = ARC2::getRDFJSONSerializer(array('ns' => $this->ns));
		if($asObject) {
			return json_decode($ser->getSerializedIndex($index) );
		}
		return $ser->getSerializedIndex($index);
	}

	function toExhibitJSON() {
		$index = $this->toIndex();
		$ser = ARC2::getComponent('ARC2_ExhibitJsonSerializerPlugin', array('ns'=>$this->ns));
		return $ser->getSerializedIndex($index);
	}


	/**
	 * resourceCount

	 * @return integer
	*/

	public function resourceCount()
	{
		return count($this->resources);
	}


	public function getObjectsForResourcePred($rURI, $pURI)
	{
		$resource = $this->getResource($rURI);
		$pURI = $this->expandPName($pURI);
		
		return $resource->getFlattenedProps($pURI);
	}

	/**
	 * triplesCount
	 * @return integer
	*/

	public function triplesCount()
	{
		$count = 0;
		foreach( $this->resources as $res) {
			$count = $count + $res->triplesCount();

		}
		return $count;
	}


	/**
	 * mergeResourceGraph
	 * @param PMJ_ResourceGraphPlugin $g
	*/

	public function mergeResourceGraph($g)
	{
		foreach ($g->resources as $resource)
		{
			if ($resource->triplesCount() != 0 ) {
				$this->addResource($resource);
			}

		}



		foreach($g->ns as $prefix=>$uri) {
			$this->addPrefix($prefix, $uri);
		}
	}


	/**
	 * mergeIndex
	 * @param array $index
	*/

	public function mergeIndex($index)
	{
		foreach ($index as $sURI => $pArray)
		{
			$newRes = ARC2::getComponent('PMJ_ResourcePlusPlugin', array('ns'=>$this->ns));
			$newRes->setURI($sURI);
			$newRes->setProps($pArray);
			$this->addResource($newRes);
		}
	}

	/**
	 * addPrefix
	 * @param string $prefix
	 * @param string $uri
	*/

	public function addPrefix($prefix, $uri)
	{
		if ( ! array_key_exists($prefix, $this->ns)) {
			$this->ns[$prefix] = $uri;
		}
	}
	/**
	 * removeResource
	 * @param mixed $res
	*/

	public function removeResource($res)
	{

		if(is_string($res)) {
			$uri = $res;
		} else {
			$uri = $res->uri;
		}

		if(array_key_exists($uri, $this->resources)) {
			unset($this->resources[$uri]);
		}
	}



	/**
	 * addResource
	 * @param mixed $res
	*/

	public function addResource($res)
	{ 

		if ($res->triplesCount() == 0 ) {
			return false;
		}

		if (array_key_exists($res->uri, $this->resources)) {
			$this->resources[$res->uri]->mergeResource($res);
		} else {
			$this->resources[$res->uri] = $res;
		}


		foreach($res->ns as $prefix=>$uri) {
			$this->addPrefix($prefix, $uri);
		}
	}


	/**
	 * getResource
	 * @param string $resURI
	 * @return PMJ_ResourcePlusPlugin
	*/

	public function getResource($resURI)
	{
		$resURI = $this->expandPName($resURI);
		return $this->resources[$resURI];
	}



	/**
	 * getResourcesByType
	 * @param string $type
	 * @return array
	*/

	public function getResourcesByType($type, $urisOnly = false)
	{

		$resArray = $this->getResourcesBy('type', $type);

		if($urisOnly) {
			return $this->resArrayToURIArray($resArray);
		}
		return $resArray;

	}

	public function getResourcesGraphByType($type) {
		$retGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $this->ns);
		$resArray = $this->getResourcesByType($type);
		foreach ($resArray as $res) {
			$retGraph->addResource($res);			
		}
		return $retGraph;
	}

	/**
	 * getResourcesByTypes
	 * @param array $typesArray
	 * @return array
	*/

	public function getResourcesByTypes($typesArray, $urisOnly = false)
	{
		$retArray = array();
		foreach($typesArray as $type) {
			$retArray[$type] = $this->getResourcesByType($type, $urisOnly);
		}
		return $retArray;
	}


	/**
	 * getResourcesWithProp
	 * @param string $p
	 * @return array
	*/

	public function getResourcesWithProp($p, $urisOnly = false)
	{

		$resArray = $this->getResourcesBy('prop', $p);

		if($urisOnly) {
			return $this->resArrayToURIArray($resArray);
		}
		return $resArray;

	}


	/**
	 * getResourcesWithPropValue
	 * @param type name
	 * @return array
	*/

	public function getResourcesWithPropValue($p, $v, $urisOnly = false)
	{

		$resArray = $this->getResourcesBy('propValue', $p, $v);

		if($urisOnly) {
			return $this->resArrayToURIArray($resArray);
		}
		return $resArray;

	}




	/**
	 * getResourcesWithPropLang
	 * @param type name
	 * @return array
	*/

	public function getResourcesWithPropLang($p, $l, $urisOnly = false)
	{

		$resArray = $this->getResourcesBy('propLang', $p, $l);

		if($urisOnly) {
			return $this->resArrayToURIArray($resArray);
		}
		return $resArray;

	}


	/**
	 * getResourcesWithPropDatatype
	 * @param type name
	 * @return array
	*/

	public function getResourcesWithPropDatatype($p, $dt, $urisOnly = false)
	{

		$resArray = $this->getResourcesBy('propDatatype', $p, $dt);

		if($urisOnly) {
			return $this->resArrayToURIArray($resArray);
		}
		return $resArray;

	}
	/**
	 * getResourcesByNamespace
	 * @param string $ns
	 * @return array
	*/

	public function getResourcesByNamespace($ns, $urisOnly = false)
	{

		$resArray = $this->getResourcesBy('ns', $ns);

		if($urisOnly) {
			return $this->resArrayToURIArray($resArray);
		}
		return $resArray;

	}

	/**
	 * Generalize all those get methods
	 * @return array
	*/

	public function getResourcesBy($att, $val1, $val2 = null)
	{
		$retArray = array();
		foreach($this->resources as $res) {
			$add = false;
			switch ($att) {
				case 'ns':
					$add = $res->hasNamespace($val1);
				break;

				case 'prop':
					$add = $res->hasProp($val1);
				break;
				case 'type':
					$add = $res->hasType($val1);
				break;

				case 'propValue':
					$add = $res->hasPropValue($val1, $val2);
				break;

				case 'propDatatype':
					$add = $res->hasPropDatatype($val1, $val2);

				break;

				case 'propLang':
					$add = $res->hasPropLang($val1, $val2);
				break;


			}
			if($add) $retArray[] = $res;



		}
		return $retArray;
	}


	/**
	 * resArrayToURIArray
	 * @param array $resArray
	 * @return array
	*/

	public function resArrayToURIArray($resArray)
	{
		$retArray = array();
		foreach($resArray as $res) {
			$retArray[] = $res->uri;
		}
		return $retArray;
	}

	/**
	 * removeResourcesByType
	 * @param string $type
	*/

	public function removeResourcesByType($type)
	{
		$this->removeResourcesBy('type' , $type);
	}



	/**
	 * removeResourcesByTypes
	 * @param array $typesArray
	*/

	public function removeResourcesByTypes($typesArray)
	{
		foreach($typesArray as $type) {
			$this->removeResourcesByType($type);
		}
	}


	/**
	 * removeResourcesWithProp
	 * @param string $prop
	 * @return
	*/

	public function removeResourcesWithProp($prop)
	{
		$this->removeResourcesBy('prop', $prop);
	}


	/**
	 * removeResourcesByNamespace
	 * @param string $ns
	*/

	public function removeResourcesByNamespace($ns)
	{
		$this->removeResourcesBy('ns', $ns);
	}



	/**
	 * removeResourcesByPropValue
	 * @param string $p
	 * @param string $v
	*/

	public function removeResourcesWithPropValue($p, $v)	
	{
		$this->removeResourcesBy('propValue', $p, $v);
	}

	/**
	 * Generalize all those remove methods with a switch
	 *
	*/

	public function removeResourcesBy($att, $val1, $val2 = null) {

		foreach($this->resources as $res) {
			$unset = false;
			switch ($att) {
				case 'ns':
					$unset = $res->hasNamespace($val1);
				break;

				case 'prop':
					$unset = $res->hasProp($val1);
				break;
				case 'type':
					$unset = $res->hasType($val1);
				break;
				case 'propValue':

					$unset = $res->hasPropValue($val1, $val2);
				break;

			}
			if($unset) $this->removeResource($res);

		}
	}

	/**
	 * removePropsByNamespace
	 * @param string $ns
	*/

	public function removePropsByNamespace($ns)
	{
		foreach($this->resources as $res) {
			$res->removePropsByNamespace($ns);
		}
	}





	/**
	 * removeValuesWithLang
	 * @param string $l
	*/

	public function removeValuesWithLang($l)
	{
		foreach($this->resources as $res) {
			$res->removeValuesWithLang($l);
		}
	}


	/**
	 * removeValuesWithoutLang
	 * @param string $l
	*/

	public function removeValuesWithoutLang($l)
	{
		foreach($this->resources as $res) {
			$res->removeValuesWithoutLang($l);
		}
	}


	/**
	 * removeProp
	 * @param string $p
	*/

	public function removeProp($p)
	{
		foreach($this->resources as $res) {
			$res->removeProp($p);
		}		
	}



	/**
	 * removeProps
	 * @param array $pArray
	*/

	public function removeProps($pArray)
	{
		foreach($pArray as $p) {
			$this->removeProp($p);
		}
	}


	/**
	 * hasTriple
	 * @param string $sURI

	 * @return
	*/

	public function hasTriple($sURI, $prop, $val)
	{
		$prop = $this->expandPName($prop);
		if(  isset($this->resources[$sURI]) ) {
			return (boolean) $this->resources[$sURI]->hasPropValue($prop, $val);			
		} else {
			return false ; 
		}

	
	}
	
	public function getResourceURIs() {
		$uris = array();
		foreach ($this->resources as $res) {
			$uris[] = $res->uri;
		}
		return $uris;
	}
	
	public function extractResourceObjectsArrayAroundProp($pURI) {
		$retArray = array();
		foreach($this->resources as $res) {
			if($res->hasProp($pURI)) {
				$retArray[$res->uri] = $res->getProp($pURI);
			}
		}
		return $retArray;
	}
	
	public function extractGraphAroundProp($pURI) {
		global $graphConfig;
		$pURI = $this->expandPName($pURI);
		$index = array();
		foreach($this->resources as $res) {
			if($res->hasProp($pURI)) {
				$index[$res->uri] = array();
				
				$index[$res->uri][$pURI][] = $res->getProp($pURI);
			}
		}
		$retGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
		$retGraph->mergeIndex($index);
		return $retGraph;
	}

}




?>
