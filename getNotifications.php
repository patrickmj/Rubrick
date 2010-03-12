<?php

include('config.php');
include(ARC_DIR . 'ARC2.php');
include_once(BASE_DIR . 'checkLogin.php');

//$lastCheckDate = $_GET['lastCheckDate'];

$lastCheckDate = '2010-02-10T12:03:50-05:00';
$userURI = 'http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17';

$newSubmissionsQuery = "$prefixes

SELECT DISTINCT ?c ?sub ?subDate ?sCreatorName ?page ?pTitle

WHERE {

?c sioc:has_creator <$userURI> ;
   r:hasSubmission ?sub . 

?sub dcterms:created ?subDate ;
   sioc:has_creator ?sCreator ; 
   r:hasPage ?page .

?sCreator sioc:name ?sCreatorName .

   OPTIONAL {
    ?page dc:title ?pTitle . 
   }

FILTER (?subDate > '$lastCheckDate' )

}

ORDER BY ASC (?subDate)
";

$store = ARC2::getStore($config);
$rs = $store->query($newSubmissionsQuery);
print_r($rs);


?>
