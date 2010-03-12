<?php
date_default_timezone_set('America/New_York');
session_set_cookie_params(60 * 60 * 24 * 14);

$domain = $_SERVER['HTTP_HOST'];

if ($domain == 'localhost') {


		$config = array(
		  /* db */
		  'db_host' => 'localhost', /* optional, default is localhost */
		  'db_name' => 'rubrick',
		  'db_user' => 'rubrick',
		  'db_pwd' => 'rubrick',


		  /* store name */
		  'store_name' => '',
		
		
				
		  /* endpoint */
		  'endpoint_features' => array(
			'select', 'construct', 'ask', 'describe', 
			'load', 'insert', 'delete', 
			'dump' /* dump is a special command for streaming SPOG export */
		  ),
		  'endpoint_timeout' => 60, /* not implemented in ARC2 preview */
		  'endpoint_read_key' => 'readkey', /* optional */
		  'endpoint_write_key' => 'writekey', /* optional */		
		);
	
	} else {

		$config = array(
		  /* db */
		  'db_host' => 'localhost', /* optional, default is localhost */
		  'db_pwd' => 'rubr1ck',
		 'db_name' => 'patrickg_arcbrick',   
		  'db_user' => 'patrickg_rubrick', 

		  /* store name */
		  'store_name' => '',
		

			/* endpoint */
			'endpoint_features' => array(
			'select', 'construct', 'ask', 'describe', 
			'load', 'insert', 'delete', 
			'dump' /* dump is a special command for streaming SPOG export */
			),
			'endpoint_timeout' => 60, /* not implemented in ARC2 preview */
			'endpoint_read_key' => 'readkey', /* optional */
			'endpoint_write_key' => 'writekey', /* optional */
		
		);
				
		
}
	
	
$graphConfig = array(
  'ns' => array(
	'rdf' => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	'rdfs' => 'http://www.w3.org/2000/01/rdf-schema#',
	'dbpedia' => 'http://dbpedia.org/ontology/',
	'foaf' => 'http://xmlns.com/foaf/0.1/',
	'xsd' => 'http://www.w3.org/2001/XMLSchema#',
	'dcterms' => 'http://purl.org/dc/terms/',
	'tagging' => 'http://www.holygoat.co.uk/owl/redwood/0.1/tags/',
	'dc' => 'http://purl.org/dc/elements/1.1/' , 
	'sioc' => 'http://rdfs.org/sioc/ns#' ,
	'xsd' => 'http://www.w3.org/2001/XMLSchema#',
	'r' => 'http://code.rubrick-jetpack.org/vocab/',
	'r_d' => 'http://data.rubrick-jetpack.org/',
	'r_i' => 'http://code.rubrick-jetpack.org/vocab/individuals/'
  )
);	

$config['ns'] = $graphConfig['ns'];

$prefixes = "PREFIX r: <http://code.rubrick-jetpack.org/vocab/>
PREFIX r_i: <http://code.rubrick-jetpack.org/vocab/individuals/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX sioc: <http://rdfs.org/sioc/ns#> 
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX tagging: <http://www.holygoat.co.uk/owl/redwood/0.1/tags/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
" ;

define('BASE_DIR', dirname(__FILE__) . '/');
define('ARC_DIR', BASE_DIR . '/libs/arc/');
define('CLASSES_DIR', BASE_DIR . '/classes/');
define('PREFIXES', $prefixes);


	
?>
