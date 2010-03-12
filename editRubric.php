<?php
    include('config.php');
    include_once('checkLogin.php');
    include_once(CLASSES_DIR . 'PermissionsManager.php');
    include_once(CLASSES_DIR . 'RubricConstructor.php');
	
include(CLASSES_DIR . 'RubricLineConstructor.php');
include(CLASSES_DIR . 'RubricLineValueConstructor.php');

?>

<!DOCTYPE html SYSTEM "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>RubricMaker</title>
        

<?php    
    if( ! $loggedIn ):    
?>    
    </head>
    <body>
        <p>You must be logged in to build a rubric. . . </p>    
    </body>
    </html>
    <?php exit; endif;     
    
?>


<html>
<head>
<script type="application/javascript"  src="./js/jquery/jquery.js"></script>
<script type="application/javascript"  src="./js/uiClasses.js"></script>
<link rel="stylesheet" type="text/css" href="./css/default.css"></link>
<link rel="stylesheet" type="text/css" href="./css/rubrickmaker.css"></link>

<script type="application/javascript" >
<?php

$bigGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
$pm = new PermissionsManager();
$pm->doQueries();
$obj->perms = $pm->perms;
$obj = new stdClass();


$rubricURI = $_GET['uri'];
//$rubricURI = 'http://data.rubrick-jetpack.org/Rubric/375fc5437c3f1b47f50fb7803ba956cfa761c51e';
$rubric = new RubricConstructor(array('uri'=>$rubricURI, 'by'=>'byURI'));
$bigGraph->mergeResourceGraph($rubric->graph);

$lineURIs = $rubric->graph->getObjectsForResourcePred($rubricURI, 'r:hasLine');


foreach($lineURIs as $lURI) {
	$lConst = new RubricLineConstructor(array('uri'=>$lURI));
	
	$bigGraph->mergeResourceGraph($lConst->graph);	
}


   echo "var retJSONStr=" . json_encode($bigGraph->toRDFJSON() );
   
   
?> 

var retJSON = eval('(' + retJSONStr + ')');
var rGraph = new Graph(retJSON);
var rURI = rGraph.getSubjectURIs()[0];
r = new RubricContainer(rURI, rGraph);

if(r.graph.subjectsCount() == 1 ) {
	r.addRubricLine();

}
to = window.setTimeout(finish, 250)

function finish() {
	r.show();
	window.clearTimeout(to);
}

</script>

<style>
table {
	border: 1px solid black;
}

.editable {
	cursor: cell;
}
.done-button {
	cursor: default;
}
</style>

</head>

<body>
<body>
    
    <div id="wrapper">
	</div>
	


<div id="data">
</div>
</body>



</html>
