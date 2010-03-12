<?php

require_once('Constructor.php');


class ContextConstructor extends Constructor {


	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {

		case 'byURI':
			$queryStr .= "

CONSTRUCT 
{
<$this->uri> a r:Context ;   
   sioc:name ?cName ; 
   r:description ?cDesc . 

}
WHERE
{
<$this->uri> a r:Context ;    
   sioc:name ?cName .
   
   OPTIONAL {
	<$this->uri> r:description ?cDesc ;
   }
   
}
			";

		break;

		}


		$this->query = $queryStr;
		
	}



}

?>
