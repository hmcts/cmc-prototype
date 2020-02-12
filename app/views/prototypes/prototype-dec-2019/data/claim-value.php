<?php

if ( $objData = json_decode( file_get_contents("php://input"), true ) ) {

	$fp = fopen('request.log', 'w');
	fwrite($fp, print_r( $$objData->case_details->case_data->claimValueHigher, true ));
	fclose($fp);

} 

?>