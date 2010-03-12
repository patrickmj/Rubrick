<?php //login.php
header('Content-type: application/json');

include_once('config.php');
include_once(ARC_DIR . 'ARC2.php');

$store = ARC2::getStore($config);
session_start();

/*
$nick = isset($_POST['nick']) ? $_POST['nick'] : $_SESSION['nick'];
$pwd = isset($_POST['pwd']) ? $_POST['pwd'] : $_SESSION['pwd'];
$pwdHash = md5($_POST['pwd']);
*/

$nick = 'pmj';
$pwd = 'pmj';
$pwdHash = md5('pmj');


if(isset($nick) && isset($pwdHash) ) {
	$q = "SELECT DISTINCT ?userURI
			 WHERE {

				?userURI a sioc:User ;
						r:pwd '"  .  $pwdHash . "' ;
						sioc:name '"  .  $nick . "' 

			}";
			
	$rs = $store->query($q);

//	print_r($rs);
	if( isset($rs['result']['rows'][0] ) ) {
		
		$_SESSION['userURI'] = $rs['result']['rows'][0]['userURI'];
		$_SESSION['nick'] = $nick;
		//success message
	echo "{ nick : '" . $_SESSION['nick'] .  "' , status: 'loggedIn', userURI :  '" . $_SESSION['userURI'] .  "' ,  message : 'Successfully logged in as " . $_SESSION['nick'] .  "'  }";
	} else {
		
		//fail message
	echo "{ status: 'fail', message : 'Something is amiss. Check your username and password. And, try closing all but one FF window first. '  }";
	}
	
	
}


?>
