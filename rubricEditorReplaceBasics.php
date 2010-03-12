<?php
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
include(CLASSES_DIR . 'Updater.php');
//header("Content-type: application/json");

//$POST['new'] = '{"http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v2":{"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"value":"http://code.rubrick-jetpack.org/vocab/RubricLineValue","type":"uri"},null],"http://code.rubrick-jetpack.org/vocab/score":[{"value":"4","type":"literal"},null],"http://code.rubrick-jetpack.org/vocab/description":[{"value":"val 2","type":"literal"},null]},"http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067":{"http://rdfs.org/sioc/ns#name":[{"value":"asdf","type":"literal"},null],"http://code.rubrick-jetpack.org/vocab/description":[{"value":"line","type":"literal"},null]}}';

$store = ARC2::getStore($config);
$jsonStr = $_POST['new'];
$jsonStr = str_replace(',null', '', $jsonStr);
$createIndex = json_decode($jsonStr , true);

$newGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
$newGraph->mergeIndex($createIndex);
echo $newGraph->toNTriples();



foreach($createIndex as $sURI=>$pArray) {

	$q = buildDeleteQuery($sURI, $pArray);
	$store->query($q);
	if( count($store->getErrors() ) != 0 ) {
print_r($store->getErrors());
die();
	}
}

$q = " INSERT INTO <> {" . $newGraph->toNTriples() . " }";
$store->query($q);
die();


foreach($createIndex as $sURI=>$pArray) {

	$q = buildAddQuery($sURI, $pArray);
	$store->query($q);
	if( count($store->getErrors() ) != 0 ) {
print_r($store->getErrors());

die();
	}
	//echo $q;
}




function buildAddQuery($sURI, $pArray) {
	
	$addQuery = PREFIXES ;
	$addClause = '';
	foreach ($pArray as $pURI=>$objArray) {
		
		foreach($objArray as $oIndex=>$obj) {
			
				$val = $obj['value'];
				echo $val ;
				if($val != '') {
					$addClause .= " <$sURI> <$pURI> '$val' . " ;	
				}				
			

			
		}
		
	}
	$addQuery .= "INSERT INTO <> { $addClause } ";
	return $addQuery;
}

function buildDeleteQuery($sURI, $pArray) {
	$allowedPreds = array("http://code.rubrick-jetpack.org/vocab/description", "http://rdfs.org/sioc/ns#name");
	$deleteQuery = PREFIXES ;
	
	$delClause = '';
	foreach($pArray as $pURI=>$objs) {
		if(in_array($pURI, $allowedPreds)) {
			$delClause .= " <$sURI> <$pURI> ?o . ";			
		}

				
	}
	$deleteQuery .= "DELETE { "  . $delClause . "  }   " ;
	$deleteQuery .= "WHERE { "  . $delClause . "  }   " ;
	
	return $deleteQuery;
}

?>