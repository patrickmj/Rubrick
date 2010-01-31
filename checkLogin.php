<?php //checkLogin.php

session_start();

if( isset($_SESSION['userURI'] ) ) {
	$loggedIn = true;	
	$userURI = $_SESSION['userURI'];
	if ( isset($_GET['returnInfo'])) {
		header('Content-type: application/json');
		echo "{ status: 'loggedIn', userURI: '" . $_SESSION['userURI'] . "' , nick: '" . $_SESSION['nick'] . "' , message:'You are logged in as " . $_SESSION['nick'] . "'  }";
	}

//	echo "{ loggedin : true , message:'You are already logged in.' }";
} else {
	$loggedIn = false;
	if ( isset($_GET['returnInfo'])) {
		header('Content-type: application/json');
		echo " {status:'noUser', message:'You must be logged in to do that.' }";
	}
	
}

?>
