<?php
if (count($post) > 0) {
  $html = '<table><tbody>';
  foreach ($post as $key=>$val){ 
    if(!array_key_exists($key, $post_map)) continue;
    $html .='<tr><th>'.$post_map[$key].'</th><td>'.$val.'</td></tr>';
  }
  $html .= '</tbody></table>';
} 

?>