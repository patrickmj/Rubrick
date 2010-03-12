<?php //getReport.php
include_once('config.php');
include_once('checkLogin.php');
include(CLASSES_DIR . 'PermissionsManager.php');
include(CLASSES_DIR . 'ContextReporter.php');

$contextURI = $_GET['contextURI'];
//$contextURI = 'http://code.rubrick-jetpack.org/vocab/Context1';


$pm = new PermissionsManager();
$pm->doQueries();

//if(isset($pm->perms[$contextURI]) && in_array('getReport', $pm->perms[$contextURI])) {
if($pm->hasPermission($contextURI, 'r:getReport')) {
	header('Content-type: text/csv; charset=utf-8');
	$reporter = new ContextReporter($contextURI);
	$reporter->doQuery();
	$csv = $reporter->templateRSasCSV();
	echo $csv;

} else {
echo "<p>Sorry, you don't have permission for that.</p>";
}


?>
