<?php
if($sms['enable']) {
    $curl = curl_init();
    curl_setopt ($curl, CURLOPT_URL, "https://smsc.ru/sys/send.php?login=".$sms['login']."&psw=".$sms['pass']."&phones=".$sms['to']."&mes=".$sms['msg']."&sender=ZolleMA&charset=utf-8");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $state = curl_exec ($curl);
    curl_close ($curl);	  
}
?>