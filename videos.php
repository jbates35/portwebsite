<?php

	include "config.php";
	session_start();

	include "header.html";

	echo '
	<link href="css/videos.css" rel="stylesheet">';

	if(!empty($_SESSION['user_id'])) {
		if($_SESSION['user_id']==1) {
			echo '
	<link href="css/videos_admin.css" rel="stylesheet">';
		}
	}

	echo '
	<div id="contentbody">
		<div class="contentbg2" id="contentbg2_id">
			<div class="contentbg1" id="contentbg2_id">
				<div class="preContainer" id="preContainer_id">
					<div class="subjectContainer" id="subjectContainer_id">
						<b>Subjects:</b>
							<button class="courseButtons courseSelected" id="allSubjects_id">All</button> |
							<button class="courseButtons" id="physics_id">Physics</button> |
							<button class="courseButtons" id="math_id">Math/Calculus</button> |
							<button class="courseButtons" id="circuits_id">Circuit Analysis</button> |
							<button class="courseButtons" id="digi_id">Digital Techniques</button>
					</div>
					<div class="mainContainer" id="mainContainer_id">
					</div>
				</div>
			</div>
		</div> 
	</div>
	';

	if(!empty($_SESSION['user_id'])) {
		if($_SESSION['user_id']) {
			echo '
	<script src="js/videos_admin.js"></script>
			';
		} else {
				echo '
		<script src="js/videos.js"></script>
				';
		}
	} else {
			echo '
	<script src="js/videos.js"></script>
			';
	}

	include 'admin.php';
	include "footer.html";


	// RECREATE div to include the 3 sections, so when transition happens you can just close it
?>
