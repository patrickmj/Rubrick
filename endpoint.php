<?php

/* ARC2 static class inclusion */ 
include_once('config.php');
include_once(ARC_DIR . 'ARC2.php');


/* instantiation */
$ep = ARC2::getStoreEndpoint($config);

if (!$ep->isSetUp()) {
  $ep->setUp(); /* create MySQL tables */
}

/* request handling */
$ep->go();




?>
