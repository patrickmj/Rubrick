<?php

require_once('Constructor.php');


class RecordingConstructor extends Constructor {




	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {

		case 'byContext':
			$queryStr .= "
				CONSTRUCT {
				
					<$this->cURI> r:hasRecording ?rec . 
					?rec a r:Recording ; 
						r:hasLineValue ?recLineVal ;
						r:hasRubric ?rubric ; 
						r:hasPage ?page . 
				}			
				
				WHERE {
					<$this->cURI> r:hasRecording ?rec . 
					?rec r:hasLineValue ?recLineVal ;
						r:hasRubric ?rubric ; 
						r:hasPage ?page . 
				}


			";


		break;

		case 'byContextRubric':
			$queryStr .= "
				CONSTRUCT {
				
					<$this->cURI> r:hasRecording ?rec . 
					?rec a r:Recording ; 
						r:hasLineValue ?recLineVal ;
						r:hasRubric <$this->rubricURI> ; 
						r:hasPage ?page . 
				}			
				
				WHERE {
					<$this->cURI> r:hasRecording ?rec . 
					?rec r:hasLineValue ?recLineVal ;
						r:hasRubric <$this->rubricURI> ; 
						r:hasPage ?page . 
				}


			";			
			
		break;

		case 'byURI':
	
		break;


		default:

		break;

		}


		$this->query = $queryStr;
	}


}






?>
