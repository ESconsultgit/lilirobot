<?php
header('Content-Type: application/json');
$d=__DIR__.'/data';
if(!is_dir($d))@mkdir($d,0755);
$ok=@file_put_contents($d.'/ping.txt',date('c'))!==false;
echo json_encode(['php'=>PHP_VERSION,'write'=>$ok,'sqlite'=>class_exists('PDO')?in_array('sqlite',PDO::getAvailableDrivers()):false]);
