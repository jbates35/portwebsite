<?php
	include "config.php";
	include "header.html";

	session_start();
	unset($_SESSION['user_id']);
	header("Location:login.php");

	include "footer.html";

?>
