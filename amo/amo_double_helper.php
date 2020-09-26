<?php
/**
 * Функции для проверки контакта на дубли по последним 10 цифрам телефона
 */

/**
 * Возвращает контакт по телефону, если он существует в amoCRM
 *
 * @param string $phone
 * @return array|false
 */
function getContact($phone)
{
	global $contacts_list_link;
	
	$parameters = array(
		'query' => phoneClear($phone)
	);
	$parameters = http_build_query($parameters);
	
	$response = ApiSendGetQuery($contacts_list_link . '?' . $parameters);
	
	if (!$response || !isset($response['response']['contacts']) || count($response['response']['contacts']) <= 0) {
        return false;
    }
	
	$contacts = $response['response']['contacts'];
	
    if (count($contacts) == 1) {
        return $contacts[0]; // конечно не факт и надо бы тоже по доп. полю проверить, но так быстрее
    } elseif (count($contacts) > 1) {
        $phoneInputNoraml = phoneClear($phone);

        foreach ($contacts as $contact) {
            // пробегаемся по всем доп. полям, что являются телефонами
            if (isset($contact['custom_fields'])) {
                foreach ($contact['custom_fields'] as $field) {
                    if (isset($field['code']) &&
                        $field['code'] == 'PHONE' &&
                        $phoneInputNoraml == phoneClear($field['values'][0]['value'])
                    ) {
                        return $contact;
                    }
                }
            }
        }
    }

    return false;
}

/**
 * Возвращает сделки связанные с контактом контакт по телефону, если он существует в amoCRM
 *
 * @param integer|array $id
 * @param integer|array $status - id статусов сделок, которые стоит подцепить
 * @param string $query
 * @return array|false
 */
function getLeadsByContacts($id, $status = array(), $query = null)
{
	$links = getContactsLinks(null, null, !is_array($id)?array($id):$id, 1);
    $leadIds = array();

    if (!$links) {
        return false;
    }

    foreach ($links as $link) {
        $leadIds[] = $link['lead_id'];
    }

    if (empty($leadIds)) {
        return false;
    }

    $leads = getLeadsList(null, null, $leadIds, null, null, null);

    if ($leads && isset($leads['response']['leads']) && count($leads['response']['leads']) > 0) {
        // Так как если есть параметр id в запросе, все остальные игнорируются
        // добавляем свои проверки

        // Проверка соответсвия статусам
        if (!empty($status)) {
            $filterLeads = array();
            $status = !is_array($status)?array($status):$status;

            foreach ($leads['response']['leads'] as $lead) {
                if (in_array($lead['status_id'], $status)) {
                    $filterLeads[] = $lead;
                }
            }

            $leads['response']['leads'] = $filterLeads;
        }

        // Проверка есть ли подстрока в доп полях
        if ($query) {
            $filterLeads = array();

            foreach ($leads['response']['leads'] as $lead) {
                foreach ($lead['custom_fields'] as $custom_field) {
                    foreach ($custom_field['values'] as $values) {
                        if (stripos($values['value'], $query) !== false) {
                            $filterLeads[] = $lead;
                        }
                    }
                }
            }

            $leads['response']['leads'] = $filterLeads;
        }

        if (count($leads['response']['leads']) > 0) {
            return $leads['response']['leads'];
        }
    }

    return false;
}

/**
 * Get Contacts Links
 * @param int $limitRows
 * @param int $limitOffset
 * @param mixed $ids
 * @param integer $elementType - тип элемента id которых переданы (1 - контакт, 2 - сделка)
 * @param DateTime $dateModified
 * @return array
 * @access public
 */
function getContactsLinks(
    $limitRows = null,
    $limitOffset = null,
    $ids = null,
    $elementType = null,
    \DateTime $dateModified = null
) {
	global $contacts_links_link;
	
    $headers = null;
    if (is_null($dateModified) === false) {
        $headers = array('if-modified-since: ' . $dateModified->format('D, d M Y H:i:s'));
    }

    $parameters = array();
    if (is_null($limitRows) === false) {
        $parameters['limit_rows'] = $limitRows;
        if (is_null($limitRows) === false) {
            $parameters['limit_offset'] = $limitOffset;
        }
    }

    if (is_null($ids) === false) {
        if ($elementType == 1) {
            $parameters['contacts_link'] = $ids;
        } else {
            $parameters['deals_link'] = $ids;
        }
    }
	
	$response = ApiSendGetQuery($contacts_links_link . '?' . (count($parameters) > 0 ? http_build_query($parameters) : null));
	
	if ($response && isset($response['response']['links']) && count($response['response']['links']) > 0) {
        return $response['response']['links'];
    }
    
    return false;
}

/**
 * Получаем список сделок
 * 
 * @param int $limitRows
 * @param int $limitOffset
 * @param mixed $ids
 * @param string $query
 * @param string $responsible
 * @param mixed $status
 * @param DateTime $dateModified
 * @return array
 * @access public
 */
function getLeadsList(
    $limitRows = null,
    $limitOffset = null,
    $ids = null,
    $query = null,
    $responsible = null,
    $status = null,
    \DateTime $dateModified = null,
    \DateTime $dateCreateFrom = null,
    \DateTime $dateCreateTo = null
) {
	global $leads_list_link;
	
    $headers = null;
    if (is_null($dateModified) === false) {
        $headers = array('if-modified-since: ' . $dateModified->format('D, d M Y H:i:s'));
    }

    $parameters = array();
    if (is_null($limitRows) === false) {
        $parameters['limit_rows'] = $limitRows;
        if (is_null($limitRows) === false) {
            $parameters['limit_offset'] = $limitOffset;
        }
    }

    if (is_null($ids) === false) {
        $parameters['id'] = $ids;
    }

    if (is_null($query) === false) {
        $parameters['query'] = $query;
    }

    if (is_null($responsible) === false) {
        $parameters['responsible_user_id'] = $responsible;
    }

    if (is_null($status) === false) {
        $parameters['status'] = $status;
    }

    if (is_null($dateCreateFrom) === false) {
        $parameters['date_create[from]'] = $dateCreateFrom->format('U');
    }

    if (is_null($dateCreateTo) === false) {
        $parameters['date_create[to]'] = $dateCreateTo->format('U');
    }
	
	$response = ApiSendGetQuery($leads_list_link . '?' . (count($parameters) > 0 ? http_build_query($parameters) : null));
	
    if ($response && isset($response['response']['leads']) && count($response['response']['leads']) > 0) {
        return $response;
    }
    
    return false;
}

/**
 * Преобразует номер телефона к единому формату
 *
 * 89051234578 -> 79051234567
 * +7 905 123-45-78 -> 79051234567
 * +33 (123) 213 23 3 -> 33123213233
 * 123 4567 -> 1234567
 */
function phoneClear($phone)
{
    //проверяем на наличие чего-то явно не телефонного и пустой строки
    if (preg_match('/[^( +)\-\d]/', $phone) || !strlen(trim($phone)) || strlen(trim($phone)) <= 7) {
        return $phone;
    }

    //убираем пробелы и дефисы со скобками
    $trimmed = preg_replace("/ |-|[(]|[)]/", "", $phone);

    //если номер городской, то добавляем префикс как город по умолчанию спб
    if (strlen($trimmed) == 7) {
        $trimmed = '7812' . $trimmed;
    }

    //берем 'основной' номер (7 цифр с конца)
    preg_match('/.{7}$/', $trimmed, $main);
    if (array_key_exists(0, $main)) {
        $main = $main[0];
    } else {
        return $phone;
    }

    //получаем префиксы
    $prefix = substr($trimmed, 0, strpos($trimmed, $main));

    //выделяем среди префиксов код города
    preg_match('/\d{3}$/', $prefix, $cityCode);

    if (array_key_exists(0, $cityCode)) {
        $cityCode = $cityCode[0];
    } else {
        return $phone;
    }

    //если кроме кода города в префиксе что-то есть, то это код страны
    if (strlen($prefix) - strlen($cityCode)) {
        $countryCode = substr($prefix, 0, strpos($prefix, $cityCode));
        $countryCode = ($countryCode == 8) ? '+7' : $countryCode;
        if (preg_match('/^[+]/', $countryCode) && strlen($countryCode)) {
            $countryCode = preg_replace('/^[+]/', '', $countryCode);
        }
    } else {
        $countryCode = '7';
    }

    $cityCode = preg_replace('/[()]/', '', $cityCode);
    return $cityCode . $main;
}

