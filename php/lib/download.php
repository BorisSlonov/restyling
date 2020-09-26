<?php
$post = json_decode(file_get_contents("php://input"),true);
$file = $post['pdf'];
$title = $post['title'];
//echo $_SERVER['DOCUMENT_ROOT'].'/'.$file;
output_file($_SERVER['DOCUMENT_ROOT'].'/'.$file,$title.'.pdf');

function output_file($file,$name) {
	 //do something on download abort/finish
	 //register_shutdown_function( 'function_name'  );
	if(!file_exists($file))  die('Ошибка загрузки файла');
	
	$size = filesize($file);
	$name = rawurldecode($name);
	 
	if (ereg('Opera(/| )([0-9].[0-9]{1,2})', $_SERVER['HTTP_USER_AGENT']))
		$UserBrowser = "Opera";
	elseif (ereg('MSIE ([0-9].[0-9]{1,2})', $_SERVER['HTTP_USER_AGENT']))
		$UserBrowser = "IE";
	else
		$UserBrowser = '';
	 
	/// important for download im most browser
	$mime_type = ($UserBrowser == 'IE' || $UserBrowser == 'Opera') ?
	  'application/pdf' : 'application/pdf';
	@ob_end_clean(); /// decrease cpu usage extreme
	
	header('Content-Type: ' . $mime_type);
	header('Content-Disposition: attachment; filename="'.$name.'"');
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header('Accept-Ranges: bytes');
	header("Cache-control: private");
	header('Pragma: private');
	
	/////  multipart-download and resume-download
	if(isset($_SERVER['HTTP_RANGE']))	{
		list($a, $range) = explode("=",$_SERVER['HTTP_RANGE']);
	 	str_replace($range, "-", $range);
	 	$size2 = $size-1;
	 	$new_length = $size-$range;
	 	header("HTTP/1.1 206 Partial Content");
	 	header("Content-Length: $new_length");
	 	header("Content-Range: bytes $range$size2/$size");
	} else {
	 	$size2=$size-1;
	 	header("Content-Length: ".$size);
	}
	
	$chunksize = 1*(1024*1024);
	$bytes_send = 0;
	
	if ($file = fopen($file, 'r')) {
	 	if(isset($_SERVER['HTTP_RANGE']))
	 	fseek($file, $range);
	 	while(!feof($file) and (connection_status()==0)) {
	 		$buffer = fread($file, $chunksize);
	 		print($buffer);//echo($buffer); // is also possible
	 		flush();
	 		$bytes_send += strlen($buffer);
	 		//sleep(1);//// decrease download speed
	 	}
	 	fclose($file);
	 }
	 else die('Ошибка загрузки файла');
	 if(isset($new_length))
	 $size = $new_length;
	 die();

	// location('/thanks.html');
 }
?>