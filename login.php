<?php

include "config.php";
session_start();

include "header.html";

echo "<div id='contentbody'>";

if(isset($_SESSION['user_id'])) {

	$user_id = $_SESSION['user_id'];

	$query = $connection->prepare("SELECT * FROM users WHERE id=:user_id");
	$query->bindParam("user_id", $user_id, PDO::PARAM_INT);
	$query->execute();

	$result = $query->fetch(PDO::FETCH_ASSOC);

	$username = $result['username'];
	
	echo "You are logged in as ".$username;

} else {

	if(isset($_POST['login'])) {

		$username = $_POST['username'];
		$password = $_POST['password'];

		$query = $connection->prepare("SELECT * FROM users WHERE USERNAME=:username");
		$query->bindParam("username", $username, PDO::PARAM_STR);
		$query->execute();

		$result = $query->fetch(PDO::FETCH_ASSOC);

		if(!$result) {
			echo '<p class="error">Username password combination is incorrect ya dummy</p>';
		} else {
			if(password_verify($password, $result['password'])) {
				$_SESSION['user_id'] = $result['id'];
				echo 'Login successful, redirecting in 2 seconds.';
				header("refresh:2; url = upload.php");
				exit;
			} else { 
				echo '<p class="error">Username password combination is incorrect ya dummy</p>';
			}
		}
	}
	
echo "	<form method='post' action='' name='signin-form'>
		<div class='form-element'>
			<label>Username</label>
			<input type='text' name='username' pattern='[a-zA-Z0-9]+' required />
		</div>
		<div class='form-element'>
			<label>Password</label>
			<input type='password' name='password' required />
		</div>
		<button type='submit' name='login' value='login'>Login</button>
	</form>
	</div>
";

}

include "admin.php";
include "footer.html";

?>
