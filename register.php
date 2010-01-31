<?php //register.php
header('Content-type: application/json');
include_once('config.php');
include_once(ARC_DIR . 'ARC2.php');


if( isset($_SESSION['userURI'] ) ) {

	echo "{status:'loggedIn', message:'Looks like you are logged in as someone'}";
	exit;
}


$store = ARC2::getStore($config);



$nick = $_POST['nick'] ; 
$pwdHash = md5($_POST['pwd']) ;
$email = $_POST['email'] ; 


//ASK if email is already registered
$q = " ASK  {

  ?u a sioc:User ;
		sioc:email '" . $email ."' . 
}
";

$result = $store->query($q, 'raw');


if( (bool) $result ) {

	//fail message
	echo "{ message : 'Looks like a user with that email is already registered.' }";

} else {

	//mint user URI
	
	$userURI = 'http://data.rubrick-jetpack.org/Users/' . sha1( $email );
	
	$q = " INSERT INTO <http://data.rubrick-jetpack.org/Users>  {

		<$userURI> a sioc:User ;
			sioc:email '$email' ;
			sioc:name '$nick' ;
			r:pwd '$pwdHash' . 


	}"; 
	
	$rs = $store->query($q);
	$_SESSION['userURI'] = $userURI;
	
	
	echo "{ message: 'Successfully registered!' }";
	
}





?>
