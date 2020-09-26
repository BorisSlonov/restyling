<?php

	$post = json_decode(file_get_contents("php://input"),true);
	$post_map = array(
		'ltype' => 'Тип формы',
		'phone' => 'Телефон',
		'name'	=> 'Имя',
		'date' => 'Дата',
		'time' => 'Время',
		'other' => 'Дополнительно',
		'topic' => 'Примечание',
		'specialis' => 'Cотрудник',
		'complex' => 'Комплекс'
	);

	if($post['phone']){

		//include 'serv/php/lib/post_prepare.php';
		if (count($post) > 0) {
		  $html = '<table><tbody>';
		  foreach ($post as $key=>$val){
		    if(!array_key_exists($key, $post_map) || !$val) continue;
		    if($key == 'complex') {
		    	$tmp = '';
		    	foreach ($val as $key => $value) {
		    		$tmp .= $key.': '.implode(',', $value).'<br>';
		    	}
		    	$val = $tmp;
		    }
		    if($val!=''){
		    	$html .='<tr><th style="text-align:left;">'.$post_map[$key].': </th><td>'.$val.'</td></tr>';
		    }
		  }
		  $html .= '</tbody></table>';
		}

		$title = 'Заявка с сайта restyling.ru';

		$msg = 'Заявка с restyling.ru: ';
		$msg .= $post['name'] ? $post['name'].' - ' : '';
		$msg .= $post['phone'] ? $post['phone'].' - ' : '';
		$msg .= $post['date'] ? $post['date'].' - ' : '';
		$msg = mb_substr($msg, 0, -3);

		// SMS
		$sms = array(
			'enable' 	=> true,
			'login'		=> 'ses@zolle.ru',
			'pass'		=> md5('smsc'),
			'to' 		=> '+79816862638',
			'msg' 		=> $msg
		);

		if($sms['enable']) {
		    $curl = curl_init();
		    curl_setopt ($curl, CURLOPT_URL, "https://smsc.ru/sys/send.php?login=".$sms['login']."&psw=".$sms['pass']."&phones=".$sms['to']."&mes=".$sms['msg']."&sender=ZolleMA&charset=utf-8");
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		    $state = curl_exec ($curl);
		    curl_close ($curl);
		}

		// E-MAIL
		$email = array(
			'enable' 	=> true,
			'from' 		=> 'restyling.ru',
			'to'		=> 'restyling.zolle@gmail.com',
			'subject'	=> $title,
			'msg'		=> $html,
		);

		$status = true;

		if($email['enable']) {
			require_once('lib/phpmailer.php');
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
				$status = false;
			}
		}

	}

echo json_encode(array(
  'state'=>$state,
  'status'=>$status,
  'html'=>$html
));
?>
