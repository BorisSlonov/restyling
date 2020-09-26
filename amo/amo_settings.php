<?
// #Здесь все настройки специфичные для аккаунта
$user_login = 'amorestyling@mail.ru';// #Ваш логин (электронная почта)
$api_hash = '6837a92614e4cd80423ad7c688b6d8d43c3914f7';// #Хэш для доступа к API (смотрите в профиле пользователя)
$sub_domain='restylingspb';// #Наш аккаунт - поддомен


// Пока просто чтобы не делать запросы, прописываем это в настройках
// #Коды полей контактов в указанном аккаунте AMO
$cid_id = '140551';
$utm_source_id = '140543';
$utm_campaign_id = '140547';
$utm_medium_id = '140545';
$utm_term_id = '140549';

$time_id = '';
$date_id = '';
$marka_id = '';
$model_id = '';
$gift_id = '';
$auto_id = '140663';

$phone_id = '134419';
$email_id = '134421';


// Назчить ответственному лицу задачи связанные со сделкой
// Задаем массив задач task_type - идентификатор типа задачи в AMOCRM
// text - текст задачи
// Все задачи из данного массива будут созданы
// 16500 - кастомный тип задачи "Действие"
$create_lead_tasks = array(
	array('task_type' => '16500', 'text' => ' Связаться с клиентом, заполнить чек-лист потребности, сменить этап' )
);



$users = array(
	//Ответсветнные пользователи. список через запятую, последний id без запятой в конце!
	3039811 //Алексей

);

// Cтатусы сделок находящихся в активной стадии (не закрыты)
$lead_active_statuses = array(
	23682982,
	23682985,
	23682988,
	23682988,
	23697931,
	23697934
);



//ID статуса сделки
$lead_status_id_new = '23682982'; //Сюда кладем новый лид
$lead_status_id_success = '142'; //Успешно реализовано
//$lead_statuses_id = '75745';


// #urls
$auth_link = 			'https://'.$sub_domain.'.amocrm.ru/private/api/auth.php?type=json';
$contacts_set_link =	'https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/contacts/set';
$contacts_list_link =	'https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/contacts/list';
$leads_set_link =		'https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/leads/set';
$leads_list_link=		'https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/leads/list';
$accounts_current_link ='https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/accounts/current';
$notes_set_link =	'https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/notes/set';
$contacts_links_link =	'https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/contacts/links'; //Запрос связей лидов и сделок
$tasks_set_link =	'https://'.$sub_domain.'.amocrm.ru/private/api/v2/json/tasks/set';

//Настройки информирования по EMail
$notify_by_email = true;
$email_from = 'noreply@'.$sub_domain.'.amocrm.ru';
$email_to = "el@zolle.ru";

?>
