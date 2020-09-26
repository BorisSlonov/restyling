<?php
if($email['enable']) {
	require_once('serv/php/lib/phpmailer.php');
	$rcpt = explode(',', $email['to']);

	// mail
	$mail = new PHPMailer();
    //$mail->Sender = 'no-reply@'.$_SERVER['HTTP_HOST'];
    $mail->From = 'no-reply@'.$_SERVER['HTTP_HOST'];
    $mail->FromName =  $email['from'];
    foreach ($rcpt as $adr) {
    	$mail->AddAddress(trim($adr));
    }
    $mail->Subject = $email['subject'];
    $mail->MsgHTML($email['msg']);
   
	if (!$mail->Send()) {
		return false;
	} 
}