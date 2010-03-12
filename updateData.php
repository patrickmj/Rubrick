<?php
include('config.php');
include(ARC_DIR . 'ARC2.php');

$store = ARC2::getStore($config);

$q = $prefixes;
$q .= " SELECT DISTINCT ?perming ?context ?perm
	
WHERE {
	?perming a r:Permissioning .
	?context a r:Context ;
        ?perm ?perming . 
FILTER (?perm != r:hasPermissioning )
}

";
//echo htmlspecialchars($q);
//die();
$rs = $store->query($q);

$triples = " ";
foreach($rs['result']['rows'] as $row) {

	$perm = $row['perm'];
	$perming = $row['perming'];
	$context = $row['context'];
	$permName = $perm = substr($row['perm'], 38, -13);
echo $permName ; 
echo "</br>";
	$triples .= " <$context> r:hasPermissioning <$perming> .  ";
	$triples .= " <$perming> r:hasPermission <http://code.rubrick-jetpack.org/vocab/individuals/Permissions/$permName> . ";
	$triples .= " <http://code.rubrick-jetpack.org/vocab/individuals/Permissions/$permName> r:permissionName \"$permName\" . ";
}


$q = $prefixes;
$q .= " INSERT INTO <> { ";
$q .= $triples ; 
$q .= " } " ; 

//echo htmlspecialchars($q);
//die();
$rs = $store->query($q);
print_r($rs);

/*

DELETE { ?c ?cPred ?ping }
WHERE {
  ?c a r:Context ;
    ?cPred ?ping .
  ?ping a r:Permissioning 
FILTER (?cPred != r:hasPermissioning)
  
}
*/
?>


