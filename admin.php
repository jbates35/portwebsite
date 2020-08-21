<?php

if(isset($_SESSION['user_id'])) {
	if($_SESSION['user_id']==1) {

		echo '				<link rel="stylesheet" href="css/admin.css">
				<div class="adminlinks" id="adminlinks_id">
					<a href="upload.php">Upload project or video</a> | <a href="logout.php">Logout</a>
				</div>
		';
	}
}

?>
