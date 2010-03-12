<?php

require_once('Constructor.php');


class RubricConstructor extends Constructor {


	public function setQuery()
	{
		$queryStr = $this->prefixes;

		switch($this->by) {

		case 'byURIMini' :
			$queryStr .= "
			
			CONSTRUCT {

				<$this->uri> a r:Rubric ; 
							sioc:name ?name ; 
							r:description ?desc . 
			}
			
			
			WHERE {
				<$this->uri> a r:Rubric ; 
							sioc:name ?name ; 
							r:description ?desc .
							
			}
							
			";			
			
			
		break;

		case 'byURI':
			$queryStr .= "
			
			CONSTRUCT {

				<$this->uri> a r:Rubric ; 
							sioc:name ?name ; 
							r:description ?desc ;
							r:hasLine ?rLineURI . 
				?rLineURI r:order ?lOrder . 
			}
			
			
			WHERE {
				<$this->uri> a r:Rubric ; 
							sioc:name ?name ; 
							r:description ?desc ;
							r:hasLine ?rLineURI . 
				?rLineURI r:order ?lOrder . 
			}
			ORDER BY ASC (?lOrder)
			";
		break;


		case 'byURIFull':
			$queryStr .= "

				CONSTRUCT 
				{
				
				<$this->uri> a r:Rubric ; 
				   sioc:name ?rName ;
				   r:description ?rDesc ; 
				   r:hasLine ?rLine . 
				
				?rLine a r:RubricLine ; 
				   sioc:name ?rlName ; 
				   r:description ?rlDesc ;
				   r:hasLineValue ?rlValue ; 
				   r:order ?rlOrder . 
				
				?rlValue a r:RubricLineValue ;
					r:description ?rlvDesc ; 
				   r:score ?rlvScore . 
				}
				
				WHERE
				{
				<$this->uri> a r:Rubric ; 
					   sioc:name ?rName ;
					   r:description ?rDesc ; 
					   r:hasLine ?rLine . 
					
					?rLine a r:RubricLine ; 
					   sioc:name ?rlName ; 
					   r:description ?rlDesc ;
					   r:hasLineValue ?rlValue ; 
					   r:order ?rlOrder . 
					
					?rlValue a r:RubricLineValue ;
						r:description ?rlvDesc ; 
					   r:score ?rlvScore . 
					
				}
				ORDER BY ASC(?rlOrder) DESC(?rlvScore)
				
			";	
		break;




	
		case 'byCreatorURI':
			$queryStr .= "
			
			CONSTRUCT {

				?rubric a r:Rubric ;
						sioc:has_creator <$this->creatorURI> ;
						sioc:name ?name ; 
						r:description ?desc ;
						r:hasLine ?rLineURI . 
				?rLineURI r:order ?lOrder . 
			}
			
			
			WHERE {
				?rubric a r:Rubric ; 
						sioc:name ?name ;
						sioc:has_creator <$this->creatorURI> ;
						r:description ?desc .
						
				OPTIONAL {
				?rubric dcterms:creator <$this->creatorURI> ;
						r:hasLine ?rLineURI . 
				?rLineURI r:order ?lOrder . 				
				}

			}
			ORDER BY ASC (?lOrder)
			";			
			
			
		break;
		
		case 'byContextURI':
			$queryStr .= "

				CONSTRUCT 
				{
				<$this->contextURI> a r:Context ; 
				   r:hasRubric ?rubric .
				
				?rubric a r:Rubric ; 
				   sioc:name ?rName ;
				   r:description ?rDesc .
				}
				WHERE
				{
				<$this->contextURI> a r:Context ; 
				   r:hasRubric ?rubric .

					?rubric a r:Rubric ; 
					   sioc:name ?rName ;
					   r:description ?rDesc .
				}
			";		
			
		break;
		case 'byContextURIFull':
			$queryStr .= "

				CONSTRUCT 
				{
				<$this->contextURI> a r:Context ; 
				   r:hasRubric ?rubric .
				
				?rubric a r:Rubric ; 
				   sioc:name ?rName ;
				   r:description ?rDesc ; 
				   r:hasLine ?rLine . 
				
				?rLine a r:RubricLine ; 
				   sioc:name ?rlName ; 
				   r:description ?rlDesc ;
				   r:hasLineValue ?rlValue ; 
				   r:order ?rlOrder . 
				
				?rlValue a r:RubricLineValue ;
					r:description ?rlvDesc ; 
				   r:score ?rlvScore . 
				}
				
				WHERE
				{
				<$this->contextURI> a r:Context ; 
				   r:hasRubric ?rubric .

					?rubric a r:Rubric ; 
					   sioc:name ?rName ;
					   r:description ?rDesc ; 
					   r:hasLine ?rLine . 
					
					?rLine a r:RubricLine ; 
					   sioc:name ?rlName ; 
					   r:description ?rlDesc ;
					   r:hasLineValue ?rlValue ; 
					   r:order ?rlOrder . 
					
					?rlValue a r:RubricLineValue ;
						r:description ?rlvDesc ; 
					   r:score ?rlvScore . 
					
				}
				ORDER BY ASC(?rlOrder)
			";	
		break;

		}


		$this->query = $queryStr;
	}


}

?>
