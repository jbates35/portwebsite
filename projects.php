<?php

	include "config.php";
	include "header.html";

	session_start();


	
//Original file listing
	echo '		
	<link rel="stylesheet" href="css/projects.css">
	';

//if admin, need dat css page yo
	if(isset($_SESSION['user_id'])) {
		if($_SESSION['user_id']==1) {
			echo '
	<link rel="stylesheet" href="css/projects_admin.css">
			';
		}
	}

	echo '
	<div id="contentbody">		
		<div id="contentbg2">
			<div id="contentbg1">
				<div class="container-1" id="mainListingCont_id">
				</div>
			</div>
		</div>
	</div>
	';


//Project popup section:
	echo '
	<div class="project-container-outer" id="project-container-outer_id">
		<div class="project-background-1" id="project-background-1_id" onclick="popupProject()"></div>
		<div class="project-container-close" id="project-container-close-id"><a href="#" id="close-link-id" title="Click to go back to project overlay" onclick="popupProject()">Close &#9746;</a></div>
	</div>

	<div class="project-container-inner" id="project-container-inner_id">
		<div class="project-whole project-container-overlay" id="project-container-overlay_id">
			<div class="project-container-title" id="projContTitle_id"></div>
			<div class="project-container-ylink" id="projContYou_id"></div>
			<div class="project-container-imggal">
				<a href="#" id="filesLinkDown_id" title="Click to expand files" onclick="fileDown()"><h3 id="filesarrow">Files &#9656;</h3></a>
				<div id="fileContainer_id" class="file-container"></div>
				<hr class="linebreak">
				<a href="#" title="Click to expand images" id="imgLinkDown" onclick="imageDown()"><h3 id="imagesarrow">Images &#9656;</h3></a>
				<div class="imgPanel">
					<div id="imgError"></div>
					<div id="image-container-id" class="image-container">
						<div class="image-preview-bar">
							<div class="image-preview-div" onclick="changeImage(1)" id="img-prev-div_1"><img src="" class="image-preview-img" id="img-prev-src_1"></div>
							<div class="image-preview-div" onclick="changeImage(2)" id="img-prev-div_2"><img src="" class="image-preview-img" id="img-prev-src_2"></div>
							<div class="image-preview-div" onclick="changeImage(3)" id="img-prev-div_3"><img src="" class="image-preview-img" id="img-prev-src_3"></div>
							<div class="image-preview-div" onclick="changeImage(4)" id="img-prev-div_4"><img src="" class="image-preview-img" id="img-prev-src_4"></div>
							<div class="image-preview-div" onclick="changeImage(5)" id="img-prev-div_5"><img src="" class="image-preview-img" id="img-prev-src_5"></div>
							<div class="image-preview-div" onclick="changeImage(6)" id="img-prev-div_6"><img src="" class="image-preview-img" id="img-prev-src_6"></div>
						</div>
						<div class="image-holder-div" id="image-holder-div-id">
							<img class="image-holder-img" id="image-holder-img-id" src="">
						</div>
						<div class="image-left" onclick="prevImage()"><div class="childArrow noSelect">&#8678;</div></div>
						<div class="image-right" onclick="nextImage()"><div class="childArrow noSelect">&#8680;</div></div>
						<div class="img-desc" id="img-desc_id"></div>
					</div>
				</div>
			</div>
			<div class="project-container-content" id="prj-cont-desc_id"></div>
			<div class="project-container-back" onclick="nextProject()">&#8592;Next project</div>
			<div class="project-container-footer"></div>
			<div class="project-container-next" onclick="prevProject()">Previous project&#8594;</div>
		</div>	
	</div>
	';


	if(isset($_SESSION['user_id'])) {
		if($_SESSION['user_id']==1) {
			echo '
			<script src="js/projects_admin.js"></script>
			';
		} else {
			echo '	
			<script src="js/projects.js"></script>
			';
		}
	} else {
		echo '	
		<script src="js/projects.js"></script>
		';
	}

	include 'admin.php';
	include "footer.html";
?>

