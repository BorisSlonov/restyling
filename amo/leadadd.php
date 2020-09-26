<?

 file_put_contents('leadadd-from-lead-docs.txt', 'Data: ' . var_export($_POST, true));
header('Content-Type: text/html; charset=utf-8');
file_put_contents('pixel-log-get.txt', 'Data: ' . var_export($_GET, true)); 
ini_set('log_errors', 'On');
ini_set('error_log', $_SERVER['DOCUMENT_ROOT'].'/amo/php_errors.log');

 $file=fopen("leadadd-log.txt","w");
    fwrite($file,print_r($_POST, 1));
    fclose($file);


require_once 'amo_settings.php'; #Настройки аккаунта amocrm к которому идет подключение
require_once 'amo_query_helper.php';
require_once 'amo_double_helper.php'; //Для предотвращения дублей

$date = date('w');
$hour = date('G');
$minutes = date('i');



	// Делаем это так как при указании списка Access-Control-Allow-Origin через пробелы - некоторые браузеры (в чстности хром) не понимают
	// В запросе пришел origin
	if(isset($_SERVER['HTTP_ORIGIN'])) {
	  // Белый лист, для cros-site query
	  $allowed = array();

	  // Проверяем наличие Origin в белом списке.
	  if(in_array($_SERVER['HTTP_ORIGIN'], $allowed) ){
	    $filtered_url = filter_input(INPUT_SERVER, 'HTTP_ORIGIN', FILTER_SANITIZE_URL);
	    $send_header  = 'Access-Control-Allow-Origin: '.$filtered_url;
	    header($send_header);
	  }
	}

	header('Access-Control-Allow-Headers: origin, x-requested-with, content-type');
	header('Access-Control-Allow-Methods: POST, OPTIONS');

	function JsonResponseError($result_code)
	{
		return json_encode(array('code' => $result_code));
	}

	function JsonResponseSuccess($resultArr)
	{
		$codeArr = array('code' => 0);
		$arrJson = array_merge($codeArr, $resultArr);
		return json_encode($arrJson);
	}



	//# Получаем параметры запроса
	//Для случаев когда массив заполняется в родительском скрипте,
	if(!isset($data) || empty($data))
	{
		$data = array(		
	   		'phone' => isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '',
	    	'cid' => isset($_POST['cid']) ? htmlspecialchars($_POST['cid']) : '',
	    	'ltype' => isset($_POST['ltype']) ? htmlspecialchars($_POST['ltype']) : 'Новый лид',
	    	'rec' => isset($_POST['rec']) ? htmlspecialchars($_POST['rec']) : '',
	    	'duration' => isset($_POST['duration']) ? htmlspecialchars($_POST['duration']) : '',
	    	'call_id' => isset($_POST['call_id']) ? htmlspecialchars($_POST['call_id']) : '',
	    	'token_alloka' => isset($_POST['token_alloka']) ? htmlspecialchars($_POST['token_alloka']) : '',

	    	'tags' => isset($_POST['tags']) ? htmlspecialchars($_POST['tags']) : '',
	    	'name' => isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '',
	    	'skype' => isset($_POST['skype']) ? htmlspecialchars($_POST['skype']) : '',
	    	'email' => isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '',

	    	'calc' => isset($_POST['calc']) ? htmlspecialchars($_POST['calc']) : '',
	    	'marka' => isset($_POST['marka']) ? htmlspecialchars($_POST['marka']) : '',
	    	'model' => isset($_POST['model']) ? htmlspecialchars($_POST['model']) : '',

	    	
	    	'utm_source' => isset($_POST['utm_source']) ? htmlspecialchars($_POST['utm_source']) : '',
	    	'utm_campaign' => isset($_POST['utm_campaign']) ? htmlspecialchars($_POST['utm_campaign']) : '',
	    	'utm_term' => isset($_POST['utm_term']) ? htmlspecialchars($_POST['utm_term']) : '',
	    	'utm_content' => isset($_POST['utm_content']) ? htmlspecialchars($_POST['utm_content']) : '',

		);
	}
	//file_put_contents('config.txt', 'Data: ' . var_export($data['config'], true));

	$noteText = "Клиент оставил заявку в форме - " . $data['ltype'] . "\n";
	if ($data['utm_source'] || $data['utm_term']) {
		$noteText = $noteText . " Источник трафика - " . $data['utm_source'] . "\n" . "   Рекламная кампания - " . $data['utm_campaign'] . "\n" . " Ключевое слово - " . $data['utm_term'] . "\n";
	}

	if ($data['calc']) {
		$noteText .= $data['calc'];
	}

	
	// if(empty($data['phone']))
	// {
	// 	echo JsonResponseError(1);
	// 	return; //die('Не заполнен телефон или email контакта');
	// }
	//

	//# Авторизация
	$auth_params=array(
		'USER_LOGIN'=>$user_login,
		'USER_HASH'=>$api_hash
	);

	$Response = ApiSendJsonQuery($auth_link, $auth_params);

	if(!isset($Response['response']['auth'])) #Флаг авторизации доступен в свойстве "auth"
	{
		echo JsonResponseError(2);
		return; //die('Ошибка при авторизации');
	}



	// Создаём переменные для id сущностей
	$contactId = null;
	$newleadid = null;
	// Переменная для понимания того сами создали сделку или она ранее была
	$leadFound = false;

	$responsible_user_id = getUserFreest($users, $lead_active_statuses, $arrayReturn = false);
	file_put_contents('responsible_user_id.txt', 'Data: ' . var_export($responsible_user_id, true));


	// Проверка на дубли по последним 10 цифрам телефона
	$contact = getContact($data['phone']);

	if ($contact) {
	    $contactId = $contact['id'];
	    $responsible_user_id = $contact['responsible_user_id'];
	    
	    // Получаем все активные сделки и выбираем первую для создания задачи
	    $leads = getLeadsByContacts($contact['id'], $lead_active_statuses);
	    
	    // В случае, если сделку не нашли, то как обычно ниже мы её создадим,
	    // а после этого если $contactId не null, то там уже добавим задачу про дубль
	    if ($leads && count($leads)) {
	        $newleadid = $leads[0]['id'];
	        $responsible_user_id = $leads[0]['responsible_user_id'];
	        $leadFound = true;
	    }
	}

	file_put_contents('contact.txt', 'Data: ' . var_export($contact, true));
	//file_put_contents('leads.txt', 'Data: ' . var_export($leads, true));
	file_put_contents('lead_active_statuses.txt', 'Data: ' . var_export($lead_active_statuses, true));
	file_put_contents('newleadid.txt', 'Data: ' . var_export($newleadid, true));
	file_put_contents('contactId.txt', 'Data: ' . var_export($contactId, true));

	// Создадим контакт, если ранее не смогли его найти
	if (!$newleadid) {
		//# Добавляем новый лид
		$lead=array(
					'name'=> $data['ltype'],
					'tags' => $data['tags'],
					'status_id' => $lead_status_id_new,
					'custom_fields'=>array(), 
				);

		// Ответственный пользователь
		if(isset($responsible_user_id) && !empty($responsible_user_id))
		{
			$lead['responsible_user_id'] = $responsible_user_id;
		}

		$lead['custom_fields'][] = addLeadCustomFields($cid_id, $data['cid']);
		$lead['custom_fields'][] = addLeadCustomFields($auto_id, $data['marka'] . ' ' .  $data['model']);
		$lead['custom_fields'][] = addLeadCustomFields($utm_source_id, $data['utm_source']);
		$lead['custom_fields'][] = addLeadCustomFields($utm_campaign_id, $data['utm_campaign']);
		$lead['custom_fields'][] = addLeadCustomFields($utm_term_id, $data['utm_term']);

			
		$lead_params=Array();
		$lead_params['request']['leads']['add'][]=$lead;
		$Response = ApiSendJsonQuery($leads_set_link, $lead_params);

		if(empty($Response['response']['leads']) && empty($Response['response']['leads']['add']))
		{
			echo JsonResponseError(3);
			return; //die('Ошибка добавления лида');
		}

		$newleadid = $Response['response']['leads']['add'][0]['id'];
	}


	// Если контакт уже был ранее найден, то в сделку (найденную или созданную) добавим 
	// задачу и добави в контакт новую сделку, если до этого их не было
	if ($contactId) {
	    $create_lead_tasks = array(
			array('task_type' => '16500', 'text' => 'Повторная заявка ' .$_POST['ltype'] )
			);
	    			if(isset($create_lead_tasks))
			{
				foreach($create_lead_tasks as $task)
				{
					if(isset($task['task_type']) && isset($task['text']))
					{
						//addTask($newleadid, $task['task_type'], $task['text'], $responsible_user_id, $date, $hour, $minutes);
						addTextNote($newleadid, 'Клиент оставил заявку повторно'); 
					}
				}
			}
					
	    if (!$leadFound) {
	        // logger('if $leadFound');
	        // Связываем контакт с ранее созданной сделкой, но так чтобы не перетереть существующие,
	        // т.к. они могут быть закрыты (существующие), потому мы и создали новую.
	        $linked_leads_id = array();
	        if (isset($contact['linked_leads_id']) && $contact['linked_leads_id']) {
	            $linked_leads_id = $contact['linked_leads_id'];
	        }

	        $linked_leads_id = array_merge($linked_leads_id, array($newleadid));
	        $date_time_zone = new DateTimeZone('Europe/Moscow'); //Europe/Moscow
	        $last_modified = new DateTime('now', $date_time_zone);
	        $contact_params = array();
	        $contact_params['request']['contacts']['update'][] = array(
	            'id' => $contact['id'],
	            'last_modified' => $last_modified->format('U'),
	            'linked_leads_id' => $linked_leads_id,
	        );
	        $Response = ApiSendJsonQuery($contacts_set_link, $contact_params);
	        
	        if (empty($Response['response']['contacts']) && empty($Response['response']['contacts']['update'])) {
	            echo JsonResponseError(4);
	            return;
	        }
	    }
	} else 
		{
		    // logger('else');
		    //# В противном случае добавляем новый контакт как обычно

			//# Добавляем новый контакт
			$contact=array(
						'name'=> $data['ltype'],
						'custom_fields'=>array()
					);
			
			// Ответственный пользователь
			if(isset($responsible_user_id) && !empty($responsible_user_id))
			{
				$contact['responsible_user_id'] = $responsible_user_id;
			}

			

			//ДОбавляем поля
			$contact['custom_fields'][] = addContactCustomFields($phone_id, $data['phone'], 'OTHER');
			$contact['custom_fields'][] = addContactCustomFields($email_id, $data['email'], 'OTHER');

			//Связываем контакт с ранее созданной сделкой
			$contact['linked_leads_id'] = array($newleadid);

			$contact_params=Array();
			$contact_params['request']['contacts']['add'][]=$contact;
			$Response = ApiSendJsonQuery($contacts_set_link, $contact_params);

			if(empty($Response['response']['contacts']) && empty($Response['response']['contacts']['add']))
			{
				echo JsonResponseError(4);
				return; //die('Ошибка добавления контакта'); # Ошибка добавления контакта
				$file=fopen("people.txt","w");
				fwrite($file,'Ошибка добавления контакта');
				fclose($file);
			}
		}

//Примечания
function addTextNote($newleadid, $noteText)
{
	$note=array(
				'element_id'=>$newleadid,
				'element_type'=>2, //привязка к сделке
				'note_type'=> 4, //обычное примечание
				'text'=> $noteText, //$noteText,

			);

	$note_params=Array();
	$note_params['request']['notes']['add'][]=$note;
	$Response = ApiSendJsonQuery($GLOBALS['notes_set_link'], $note_params);
}
addTextNote($newleadid, $noteText); // обычное примечание

//задачи
function addTask($newleadid, $task_type, $task_text, $user_id, $date, $hour, $minutes)
{	

	$complete_till = strtotime("now + 15 minutes"); 
	
	$task_new=array(
				'element_id'=>$newleadid,
				'element_type'=>2, //привязка к сделке
				'task_type'=>$task_type,
				'text'=> $task_text,
				'complete_till' => $complete_till

			);
	if(isset($user_id))
	{
		$task_new['responsible_user_id'] = $user_id;
	}

	$task_params=Array();
	$task_params['request']['tasks']['add'][]=$task_new;
	$Response = ApiSendJsonQuery($GLOBALS['tasks_set_link'], $task_params);

}

//Примечания для звонков
function addNoteCall($newleadid, $data, $responsible_user_id)
{
		
		list($hours, $mins, $secs) = explode(':', $data['duration']); //преобразовываем в секунды 
 		$duration=($hours * 3600 ) + ($mins * 60 ) + $secs;
		$text_arr = array (
		      	'UNIQ' => $data['call_id'],
		        'LINK' => $data['rec'] . $data['token_alloka'],
				'PHONE' => $data['phone'], //$data['phone'], //номер входящего 
				'DURATION' => $duration, //длительность разговора
				'SRC' => 'asterisk', 
				'call_status' => '3', //статус звонка
				'call_result' => '' //результат разговора
		      );
		$text = json_encode($text_arr);
		$note = array (
		  'add' => 
		  array (
		    0 => 
		    array (
		      'element_id' => $newleadid,
		      'element_type' => '2',
		      'note_type' => '10',
		      'responsible_user_id' => $responsible_user_id,
		      'created_user_id' => $responsible_user_id,
		      'text' => $text,
		    ),
		  ),
		);


	//$note_params=Array();
	//$note_params['request']['notes']['add'][]=$note;
	$note_params['request']['notes'] = $note;
	$Response = ApiSendJsonQuery($GLOBALS['notes_set_link'], $note_params);
}

if ($data['rec']) { //Если есть запись звонка - создаем примечание
	addNoteCall($newleadid,$data, $responsible_user_id);
}



function addLeadCustomFields ($id, $value)
{
	$field_lead = array(
		'id' => $id,  
		'values' => array(
			array('value' => $value)
		)
	);
	return $field_lead;
}

function addContactCustomFields ($id,$value, $enam)
{
	$field_contact = array(
		'id'=>$id, 
		'values'=>array(
			array(
				'value'=>$value,
				'enum'=> $enam
			)
		)
	);
	return $field_contact;
}

$result_arr = array('id' => $newleadid);
$amoCRMLeadUrl = 'https://'.$sub_domain.'.amocrm.ru/private/deals/edit.php?ID='.$newleadid;

//Оповещаем на email
if($notify_by_email && isset($email_from) && isset($email_to))
{
    $fromSiteName = !empty($data['sender'])?$data['sender']:"AmoCRM";
	$title = $fromSiteName.": Лига";
	$mess =  'В AmoCRM добавлена новая сделка: <a href="'.$amoCRMLeadUrl.'">'.$amoCRMLeadUrl.'</a>';
	//$mess .= "<br>".$dop_info."<br>";
	$headers  = "Content-type: text/html; charset=utf-8 \r\n";
	$headers .= "From: ".$fromSiteName." <".$email_from.">\r\n";

	@mail($email_to, $title, $mess, $headers);
}

//Возвращаем id нового лида
echo JsonResponseSuccess($result_arr);
return;

?>