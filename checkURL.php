<?php



//echo "Lookin at " . $_GET['url']  ;
$resp = new stdClass();
$resp->message = "Hi there";
$resp->url = $_GET['url'];
$resp->role = $_GET['role'];
$resp->context = $_GET['context'];
$resp->user = $_GET['user'];

echo json_encode($resp);



?>