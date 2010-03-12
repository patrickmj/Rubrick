<?php
//error_reporting(E_ALL);
include('config.php');
include_once('checkLogin.php');
include(ARC_DIR . 'ARC2.php');
include_once(CLASSES_DIR . 'RubrickBuilder.php');
include_once(CLASSES_DIR . 'Rubric.php');
include_once(CLASSES_DIR . 'Context.php');
include_once(CLASSES_DIR . 'RubricLine.php');
include_once(CLASSES_DIR . 'RubricLineValue.php');
include_once(CLASSES_DIR . 'Tagging.php');
header("Content-type: application/json");

$store = ARC2::getStore($config);
//$jsonStr = '{"rubricLines":[{"action":"create","fields":[{"Name":["line%201"]},{"Description":["Describe%20the%20skills%20that%20this%20line%20evaluates"]},{"Tags":["Add%20a%20tag"]},{"Public":[1]},{"order":["0"]},{"v5":["Describe%20the%20Rubric%20Value%20here."],"score":1},{"v4":["Describe%20the%20Rubric%20Value%20here."],"score":2},{"v3":["Describe%20the%20Rubric%20Value%20here."],"score":3},{"v2":["Describe%20the%20Rubric%20Value%20here."],"score":4},{"v1":["Describe%20the%20Rubric%20Value%20here."],"score":5}]},{"action":"create","fields":[{"Name":["line%202"]},{"Description":["Describe%20the%20skills%20that%20this%20line%20evaluates"]},{"Tags":["line%20tag"]},{"Public":[1]},{"order":["1"]},{"v5":["Describe%20the%20Rubric%20Value%20here."],"score":1},{"v4":["Describe%20the%20Rubric%20Value%20here."],"score":2},{"v3":["Describe%20the%20Rubric%20Value%20here."],"score":3},{"v2":["Describe%20the%20Rubric%20Value%20here."],"score":4},{"v1":["Describe%20the%20Rubric%20Value%20here."],"score":5}]}],"rubricMeta":{"name":{"rName":["Rubric%20Name"]},"desc":{"rDesc":["Rubric%20Description"]},"tags":{"rTags":["t1","t2"]},"pub":{"rPublic":[1]},"contexts":{"rContexts":["http%3A%2F%2Fdata.rubrick-jetpack.org%2FContext%2F7af867eb16d35a749874fb71a62ecea2714c14b0"]}}}';
$jsonStr = ' {   "literals" : [ { "p" : "tagging:tagging" , "o" : "test tag" } ,

							{ "p" : "tagging:tagging" , "o" : "stuff" } ]} ';

$jsonObj = json_decode($jsonStr);

$init = array('post'=>$jsonObj);
$bigGraph = ARC2::getComponent('PMJ_ResourceGraphPlugin', $graphConfig);
$newRes = new Tagging(false, $init);
$newRes->buildAddGraph();

//echo count($newRes->aggregates);
//$ag = $newRes->aggregates[0];

//echo $ag->getRevTriple();
//echo $ag->revResourceURI;

$bigGraph->mergeResourceGraph($newRes->addGraph);
foreach($newRes->aggregates as $ag) {
	$bigGraph->mergeResourceGraph($ag->addGraph);
}

echo json_encode($bigGraph->toRDFJSON(true) );
//echo count($newRes->aggregates);

?>
