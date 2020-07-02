<?php

if ( $objData = json_decode( file_get_contents("php://input"), true ) ) {

	$intHigherValue = $objData['case_details']['case_data']['amountHigherValue'];
	$strClaimantName = $objData['case_details']['case_data']['Applicants']['partyDetail']['firstName'] . ' ' . $objData['case_details']['case_data']['Applicants']['partyDetail']['lastName'];
	$strDefendantName = $objData['case_details']['case_data']['Respondents']['partyDetail']['firstName'] . ' ' . $objData['case_details']['case_data']['Respondents']['partyDetail']['lastName'];

	$intClaimFee = 1000000;
	if ( $intHigherValue > 20000000 ) {
		$intClaimFee = 1000000;
	} else if ( $intHigherValue > 1000000 ) {
		$intClaimFee = $intHigherValue * 0.05;
	} else if ( $intHigherValue > 500000 ) {
		$intClaimFee = 45500;
	} else if ( $intHigherValue > 300000 ) {
		$intClaimFee = 20500;
	} else if ( $intHigherValue > 150000 ) {
		$intClaimFee = 11500;
	} else if ( $intHigherValue > 100000 ) {
		$intClaimFee = 8000;
	} else if ( $intHigherValue > 50000 ) {
		$intClaimFee = 7000;
	} else if ( $intHigherValue > 30000 ) {
		$intClaimFee = 5000;
	} else if ( $intHigherValue < 30000 && $intHigherValue > 0 ) {
		$intClaimFee = 3500;
	}


	$fp = fopen('request.log', 'w');
	fwrite($fp, print_r( $objData, true ) .  '\nCLaim fee:' . $intClaimFee );

	fclose($fp);

}

header('Content-Type: application/json');

?>{
    "data": {
    	"feeAmountInPennies": "<?php echo $intClaimFee ?>",
    	"claimantName": "<?php echo $strClaimantName ?>".
    	"defendantName": "<?php echo $strDefendantName ?>".
    	"caseName": "<?php echo $strClaimantName . ' vs ' . $strDefendantName ?>"
    	},
    "errors": [],
    "warnings": []
}