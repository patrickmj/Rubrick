<?php

include_once(ARC_DIR . 'ARC2.php');

$store = ARC2::getStore($config);

class PermissionsManager {

	public $perms = array();
	public $userURI = '';
	public $store;





	function __construct() {
		global $prefixes;
		global $store;
		$this->store = $store;
		$this->userURI = isset($_SESSION['userURI']) ? $_SESSION['userURI'] : 'http://data.rubrick-org/Users/Anonymous';
		$this->prefixes = $prefixes;
	
		//base query digs up all the permissions that are based on direct relationships (predicates) on a context
		// e.g. r_d:Context sioc:has_creator r_d:Me

		$baseQuery = $this->prefixes;
		$baseQuery .= "SELECT DISTINCT ?pName ?context

					WHERE {
					 ?context r:hasPermissioning ?ping ;
						?ePred <$this->userURI> . 
					 ?ping r:hasPermission ?perm ;
						r:allow ?ent .
					 ?ent r:entityPredicate ?ePred . 
					 ?perm r:permissionName ?pName . 
					}";

		$allQ = $this->prefixes;
		
		$allQ .= "SELECT DISTINCT ?pName ?context

			 WHERE {
			?context r:hasPermissioning ?perming .
			?perming r:allow r:all ;
                  r:hasPermission ?perm . 
			?perm r:permissionName ?pName . 
		}
		
		";
		$this->queries['baseQuery'] = $baseQuery;	
		$this->queries['all'] = $allQ;
		
	}

	function doQueries() {
		foreach($this->queries as $key=>$q) {

			//merge result sets of queries into perms
			$rs = $this->store->query($q);
			if(is_array($rs['result'])) {
				foreach($rs['result']['rows'] as $row) {
					$permName = $row['pName'];
					$this->perms[$row['context']][] =  $permName;
				}
			}
		}
	}

}

/*
rd:newContext r:hasPermissioning rd:newPing1, rd:newPing2, rd:newPing3 ; 
   sioc:has_creator rd:currUser .

rd:newPing1 r:allow r_i:creator ;
   r:hasPermission r_i:record . 

rd:newPing2 r:allow r_i:creator ;
   r:hasPermission r_i:viewRecordings . 

rd:newPing3 r:allow r_i:creator ;
   r:hasPermission r_i:viewRecordDetails . 




r:record a r:Permission ; 
   r:permissionName "record" .

r:viewRecordings a r:Permission ; 
	r:permissionName "viewRecordings" .

r:getReport a r:Permission ; 
	r:permissionName "getReport" .

r:creator a r:Entity ; 
	r:entityPredicate sioc:has_creator .

r:addRubric a r:Permission ; 
	r:permissionName "addRubric"  . 

r:all a r:Entity .

r:Context1 a r:Context ;
	r:name "Demo" ;
    r:description "Just a demo"; 
	r:hasPermissioning r:allRecordPermissioning ; 
	r:hasPermissioning r:allViewRecordingsPermissioning ; 
	r:hasPermissioning r:allGetReportPermissioning ;
	r:hasPermissioning r:allAddRubric . 

r:allAddRubric a r:Permissioning ;
	r:hasPermission r:addRubric ; 
	r:allow r:all . 

r:allRecordPermissioning a r:Permissioning ; 
	r:hasPermission r:record ;
    r:allow r:all . 

r:allViewRecordingsPermissioning  a r:Permissioning ; 
	r:hasPermission r:viewRecordings ;
    r:allow r:all . 

r:allGetReportPermissioning  a r:Permissioning ; 
	r:hasPermission r:getReport ;
    r:allow r:all . 



*/

?>
