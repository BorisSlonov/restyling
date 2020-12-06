<?php

/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define( 'DB_NAME', "ce43373_newmove" );


/** Имя пользователя MySQL */
define( 'DB_USER', "ce43373_newmove" );


/** Пароль к базе данных MySQL */
define( 'DB_PASSWORD', "Movehome2020" );


/** Имя сервера MySQL */
define( 'DB_HOST', "localhost" );


/** Кодировка базы данных для создания таблиц. */
define( 'DB_CHARSET', 'utf8mb4' );


/** Схема сопоставления. Не меняйте, если не уверены. */
define( 'DB_COLLATE', '' );

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         ')`$Qo05x5#s4QAi8BFz+Tn.9Itg}<e99lSwkn]]xnXJYVbo<mdJ`/?F-g*W6D[zQ' );

define( 'SECURE_AUTH_KEY',  '[BB.;BL}f>SylgD$)(C+U9$~{];%XwMT$+W?#*;t`A4t@?=+KD$_pnMDEV}i9z_[' );

define( 'LOGGED_IN_KEY',    '`<W}m&)9/rbTH}mKkbd60dd6bv#@o=@*6pk=NKA7F`ZZZ (yDNQH!?$rMmkT=2S~' );

define( 'NONCE_KEY',        ':);Kv,RqsN(s.C7LK^y.ob<JBjqY0|DYo;H}t|wf~r>oI`<0N(?gF8^)xUrY_w>T' );

define( 'AUTH_SALT',        'QYyt4o|?jy<l]B[>,h41%%Pv_]t-B=h>k<8 7Q%)7Sa?qqb%L@OR*flHK+&xq}D<' );

define( 'SECURE_AUTH_SALT', 'l~/?Q;]-.Ix[ki,@3?f(mb)GxK&7R.O4jV0g~K|/4);9g!+3ZuSf({{MR;NaFP94' );

define( 'LOGGED_IN_SALT',   ';RsSWIk%x`4_]i&-b/kr(k BU1M`#^}Vm3@eI/>s]B2ZEvC&;.0A*WX*u/gS30Iw' );

define( 'NONCE_SALT',       'S?Ez6-yViYH2oZ5;3 qnxrxsQQ4F*a>C Rol{JRZJlC6Bq_]`.?S}YS:BmKyEph5' );


/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix = 'wp_';


/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 *
 * Информацию о других отладочных константах можно найти в Кодексе.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', true );

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Инициализирует переменные WordPress и подключает файлы. */
require_once( ABSPATH . 'wp-settings.php' );
