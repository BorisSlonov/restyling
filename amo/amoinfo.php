<?
header('Content-Type: text/html; charset=utf-8');

require_once 'amo_settings.php'; #Настройки аккаунта amocrm к которому идет подключение
require_once 'amo_query_helper.php';

//# Авторизация
$auth_params=array(
	'USER_LOGIN'=>$user_login, 
	'USER_HASH'=>$api_hash
);

$Response = ApiSendJsonQuery($auth_link, $auth_params);


if(!isset($Response['response']['auth'])) #Флаг авторизации доступен в свойстве "auth"
{
	die('2');//die('Ошибка при авторизации');
}

 #Запрос данных по текущему аккаунту
$Response = ApiSendJsonQuery($accounts_current_link, Array());
$account = $Response['response']['account'];
file_put_contents('account.txt', 'Data: ' . var_export($account, true));
?>

Аккаунт: <?=$account['name'];?><br>
ID: <?=$account['id'];?><br>
Pipeline_id: <?=$pipeline = key($account['pipelines']);?> 
<br>
Статусы сделок:
<table>
<tr style="background-color: #eee"><th>name</th><th>id</th><th>editable</th></tr>
<?foreach($account['leads_statuses'] as $status):?>
<tr style="background-color:<?=$status['color'];?>"><td><?=$status['name'];?></td><td><?=$status['id'];?></td><td><?=$status['editable'];?></td></tr>
<?endforeach;?>
</table>
<br>



Доп. поля сущностей:<br>
<?foreach($account['custom_fields'] as $group_key => $fields_group):?>
Сущность: <?=$group_key;?>
	<table>
	<tr style="background-color: #eee"><th>name</th><th>id</th><th>code</th><th>multiple</th><th>type_id</th><th>enums</th></tr>
		<?foreach($fields_group as $field):?>
			<tr style="background-color: #DBE4FF">
			<td><?=$field['name'];?></td>
			<td><?=$field['id'];?></td>
			<td><?=$field['code'];?></td>
			<td><?=$field['multiple'];?></td>
			<td><?=$field['type_id'];?></td>
			<td>
				<?print_r($field['enums']);?>
			</td>
			</tr>
		<?endforeach;?>
	</table>
	<br>
<?endforeach;?>

Типы задач:<br>
<table>
<tr style="background-color: #eee"><th>name</th><th>id</th><th>code</th></tr>
<?foreach($account['task_types'] as $task_type):?>


			<tr style="background-color: #DBE4FF">
			<td><?=$task_type['name'];?></td>
			<td><?=$task_type['id'];?></td>
			<td><?=$task_type['code'];?></td>
			</tr>
<?endforeach;?>
</table>

Юзеры:
<table>
<tr style="background-color: #eee"><th>user</th><th>id</th></tr>
<?foreach($account['users'] as $id):?>
	<tr style="background-color: #DBE4FF">
	<td><?=$id['name'];?></td>
	<td><?=$id['id'];?></td>
	</tr>
<?endforeach;?>


<table>


