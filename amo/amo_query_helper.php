<?
require_once 'amo_double_helper.php';
function SayHTTPError($httpErrorCode)
{
	$sapi_type = php_sapi_name();
	if ($sapi_type=="cgi")
		header("Status: ".$httpErrorCode);
	else
	   header("HTTP/1.1 ".$httpErrorCode." Not Found");
	@define("ERROR_".$httpErrorCode,"Y");
	die($httpErrorCode.'. Bad request.');
}

function SayBadRequest()
{
	SayHTTPError('400');
}

function SayInternalServerError()
{
	SayHTTPError('500');
}

function CheckCurlResponse($code, $out, $queryLog)
{
	$code=(int)$code;
	$errors=array(
		301=>'Moved permanently',
		400=>'Bad request',
		401=>'Unauthorized',
		403=>'Forbidden',
		404=>'Not found',
		500=>'Internal server error',
		502=>'Bad gateway',
		503=>'Service unavailable'
	);
	//try
	//{
		#Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
		if($code!=200 && $code!=204)
		{
			$msg = isset($errors[$code]) ? $errors[$code] : 'Undescribed error';
			if(isset($out)){ $msg = $msg.', Request: '.$queryLog.', Response: '.$out;}
			throw new Exception($msg,$code);
		}
	//}
	//catch(Exception $E)
	//{
		//die('Ошибка: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
	//}
}

function ApiSendGetQuery($link)
{
	return ApiSendGetQueryWithHeaders($link, array());
}

function ApiSendGetQueryWithHeaders($link, $headers)
{
	return ApiSendJsonQueryWithHeaders($link, array(), $headers);
}

function ApiSendJsonQuery($link, $params)
{
	return ApiSendJsonQueryWithHeaders($link, $params, array());
}

function ApiSendJsonQueryWithHeaders($link, $params, $headers)
{
	$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
	#Устанавливаем необходимые опции для сеанса cURL
	curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
	curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
	curl_setopt($curl,CURLOPT_URL,$link);

	$queryLog = 'Link: '.$link;

	if(!empty($params))
	{
		$queryLog .= ' Params: '.json_encode($params);
		curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
		curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($params));
		curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
	}

	if(!empty($headers))
	{
		curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
	}

	curl_setopt($curl,CURLOPT_HEADER,false);
	curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/amocookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/amocookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
	curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);

	$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
	$code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
	curl_close($curl); #Заверашем сеанс cURL
	CheckCurlResponse($code, $out, $queryLog);
	$Response=json_decode($out,true);
	return $Response;
}

function PostCustomQuery($url, $params, &$error)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
	curl_setopt($ch, CURLOPT_URL, $url);
	$result = curl_exec($ch);

	$error = false;
	if ( curl_errno($ch) ) {
		$error = 'ERROR -> ' . curl_errno($ch) . ': ' . curl_error($ch);
	} else {
		$returnCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
		switch($returnCode){
			case 200:
				break;
			default:
				$error = 'HTTP ERROR -> ' . $returnCode;
				break;
		}
	}

	//Close the handle
	curl_close($ch);

	return $result;
}



	/**
	 * ищем самого свободного от сделок пользователя
	 * @param array $users - массив пользователей от запроса по API amo данных об аккаунте, либо просто массив id пользоватлей, среди которы нужно отбирать, но тогда $group бесполезен
	 * @param integer|array $group - если необходимо отбирать пользователей из конкретной группы или нескольких групп (тогда id будут в массиве)
	 * @param array $status - массив id статусов, которые нужно учитывать при отборе
	 * @param boolean $arrayReturn - форма возврата: true - возврат отсортированного по занятости массива пользователей, false - один id самого свободного
	 * @return integer|array|false - id самого свободного или false, если пользователей не нашлось
	 */
	function getUserFreest(array $users, array $status = null, $group = null, $arrayReturn = false)
	{
		if (empty($users)) return false;

		// if (isset($users[0]['group_id'])) {
		// 	$tmp = $users; $users = [];
		// 	foreach ($tmp as $u)
		// 		if (
		// 			// если указанна группа или массив груп, то отфильтровали пользователей оттуда
		// 			($group && (is_array($group)?in_array($u['group_id'], $group):$u['group_id'] == $group)) ||
		// 			!$group
		// 		)
		// 			$users[] = $u['id'];
		// }

		if (empty($users)) return false;

		// попытаемся отобрать самого свободного (у кого меньше всего Сделок в работе)
		$count = array_fill_keys($users, 0);
		// получаем Сделки людей выше с определёнными статусами
		// $leads = $this->amoRestApi->getLeadsList(null, null, null, null, $users, $status);
		$leads = getLeadsList(null, null, null, null, $users, $status);

		if ($leads) {
			foreach ($leads['response']['leads'] as $lead) 
				$count[$lead['responsible_user_id']]++;

			asort($count);
			file_put_contents('count-aqh.txt', 'Data: ' . var_export($count, true));

		}





		return $arrayReturn?$count:current(array_keys($count));
	}


?>
