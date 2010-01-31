<?php

session_start();

$uid = isset($_POST['uid']) ? $_POST['uid'] : $_SESSION['uid'];
$pwd = isset($_POST['pwd']) ? $_POST['pwd'] : $_SESSION['pwd'];

if(!isset($uid) ) {
	?>  <!DOCTYPE html PUBLIC "-//W3C/DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title> Please Log In for Access </title>
    <meta http-equiv="Content-Type"
      content="text/html; charset=iso-8859-1" />
  </head>
  <body>
  <h1> Login Required </h1>
  <p>You must log in to access this area of the site. If you are
     not a registered user, <a href="signup.php">click here</a>
     to sign up for instant access!</p>
  <p><form method="post" action="<?=$_SERVER['PHP_SELF']?>">
    User ID: <input type="text" name="uid" size="8" /><br />
    Password: <input type="password" name="pwd" SIZE="8" /><br />
    <input type="submit" value="Log in" />
  </form></p>
  </body>
  </html>
<?php  exit;
	//login message
	//die() ?
}

$_SESSION['uid'] = $uid;
$_SESSION['pwd'] = $pwd;
	
//ASK if uid and pwd are there
if(true) {
	$_SESSION['userURI'] = 'http://user';
	
			
		if(isset($_GET['logout'])) {
			
		$_SESSION = array();

		// If it's desired to kill the session, also delete the session cookie.
		// Note: This will destroy the session, and not just the session data!
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}

		// Finally, destroy the session.
		session_destroy();	
		exit;
		
		}
	print_r($_SESSION);
} else {
	
}


?>