<?php

	include "config.php";
	session_start();

	include "header.html";

	echo '

	<link href="css/videos.css" rel="stylesheet">
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
	';

	//template part

	echo ''; ?>
						<div class="childContainer" id="childContainer_id">			
							<div class="gridContainer" id="gridContainer_id">
								<div class="titleDiv" id="titleDiv_id">
									<h3>(Math) Question about Two Pith balls</h3>
								</div>
								<div class="youtubeDiv" id="youtubeDiv_id">
									<iframe id="ytframe_id" class="ytframe" src="https://www.youtube.com/embed/69xLvKD9C8U" allowfullscreen>
									</iframe>
								</div>
								<div class="courseDiv" id="courseDiv_id">
									<label>Course:</label> 2143<br>
									<label>Chapter:</label> 1<br>
									<label>Question:</label> 8<br>
								</div>
								<div class="descriptionDiv" id="descriptionDiv_id">
									Description is the pattern of narrative development that aims to make vivid a place, object, character, or group. Description is one of four rhetorical modes, along with exposition, argumentation, and narration. In practice it would be difficult to write literature that drew on just one of the four basic modes. Wikipedia
								<br><br>
									Description is the pattern of narrative development that aims to make vivid a place, object, character, or group. Description is one of four rhetorical modes, along with exposition, argumentation, and narration. In practice it would be difficult to write literature that drew on just one of the four basic modes. Wikipedia
								</div>
							</div>
						</div>


<?php // ';			

	echo '
					</div>
				</div>
			</div>
		</div> 
	</div>

	<script src="js/videos.js"></script>
	';

	include 'admin.php';
	include "footer.html";

?>
