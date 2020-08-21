<?php

	define('USER', '');
	define('PASSWORD', '');
	define('HOST', '');
	define('DATABASE', '');

try {
	$connection = new PDO("pgsql:host=".HOST.";dbname=".DATABASE, USER, PASSWORD);
} catch (PDOException $e) {
	exit("Error: " . $e->getMessage());
}
?>
