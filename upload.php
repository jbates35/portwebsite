<?php 

include 'config.php';
include 'header.html';
session_start();

if(isset($_SESSION['user_id'])) {
	if($_SESSION['user_id']==1) {
	echo '
	<link rel="stylesheet" href="css/upload.css">

	<form method="post" action="uploading.php" name="upload-form" id="upload-form" runat="server" enctype="multipart/form-data">
	<div id="contentbody">	
	<div class="form-element">
		<label>Type of upload</label>
		<select id="formuploadtype" name="uploadtype">
			<option value="project" selected>Project</option>
			<option value="video">Video</option>
		</select>
	</div>
	<div class="form-element">
		<label>Title</label>
		<input maxlength="80" type="text" name="title" required />
	</div>
	<div class="form-element">
		<label>Date</label>
		<input type="date" name="date" required />
	</div>
	<div class="form-element">
		<label>Creators</label>
		<input maxlength="80" type="text" name="creator" required />
	</div>
	<div class="form-element">
		<label>Youtube link</label>
		<input maxlength="80" type="text" name="ylink" />
	</div>
	<div class="form-element projectc" id="fileupdiv">
		<label>Project files to upload</label>
		<br><span class="tab"><label>File description</label><input type="text" name="filedesc[]"><input type="file" id="fileUp_id_1" class="filec" name="file[]" multiple="multiple" /><button id="emptyFile_id_1" class="emptyForm">&#10062;</button></span>
		<br><span class="tab"><label>File description</label><input type="text" name="filedesc[]"><input type="file" id="fileUp_id_2" class="filec" name="file[]" multiple="multiple" /><button id="emptyFile_id_2" class="emptyForm">&#10062;</button></span>
		<br><span class="tab"><label>File description</label><input type="text" name="filedesc[]"><input type="file" id="fileUp_id_3" class="filec" name="file[]" multiple="multiple" /><button id="emptyFile_id_3" class="emptyForm">&#10062;</button></span>
	</div>
	<div class="form-element">
		<label>Image preview upload</label>
		<br><span class="tab"><input type="file" class="filec" id="imgfileid" name="dispimgfile" multiple="multiple" accept="image/*"><button id="emptyDispImg_id" class="emptyForm">&#10062;</button></span>
		<br><div id="preview"><span class="tab"><img id="previewimg" alt="Placeholder" src="img/transspec.png" class="previewimgs"></span></div>
	</div>
	<div class="form-element projectc" id="imagesupdiv">
		<label>Project images to upload</label><br>
		<table width="100%">
			<tr>
				<td width="34%">
				1.)<input type="file" class="iup filec" id="image1" name="fileimage[]" size="10" multiple="multiple" accept="image/*">
				<br><img id="preview1" alt="Placeholder" src="img/transspec.png" class="previewfimgs"><span style="line-height: 50px; vertical-align:top"><button id="emptyImage_id_1" class="emptyForm">&#10062;</button></span>
				<br><input maxlength="144" type="text" name="imgdesc[]" class="idsc" />
				</td>
				<td width="33%">
				2.)<input type="file" class="iup filec" id="image2" name="fileimage[]" multiple="multiple" accept="image/*">
				<br><img id="preview2" alt="Placeholder" src="img/transspec.png" class="previewfimgs"><span style="line-height: 50px; vertical-align:top"><button id="emptyImage_id_2" class="emptyForm">&#10062;</button></span>
				<br><input maxlength="144" type="text" name="imgdesc[]" class="idsc" />
				</td>
				<td width="33%">
				3.)<input type="file" class="iup filec" id="image3" name="fileimage[]" multiple="multiple" accept="image/*">
				<br><img id="preview3" alt="Placeholder" src="img/transspec.png" class="previewfimgs"><span style="line-height: 50px; vertical-align:top"><button id="emptyImage_id_3" class="emptyForm">&#10062;</button>
				<br><input maxlength="144" type="text" name="imgdesc[]" class="idsc" />
				</td>
			</tr>
			<tr>
				<td width="34%">
				4.)<input type="file" class="iup filec" id="image4" name="fileimage[]" multiple="multiple" accept="image/*">
				<br><img id="preview4" alt="Placeholder" src="img/transspec.png" class="previewfimgs"><span style="line-height: 50px; vertical-align:top"><button id="emptyImage_id_4" class="emptyForm">&#10062;</button></span>
				<br><input maxlength="144" type="text" name="imgdesc[]" class="idsc" />
				</td>
				<td width="33%">
				5.)<input type="file" class="iup filec" id="image5" name="fileimage[]" multiple="multiple" accept="image/*">
				<br><img id="preview5" alt="Placeholder" src="img/transspec.png" class="previewfimgs"><span style="line-height: 50px; vertical-align:top"><button id="emptyImage_id_5" class="emptyForm">&#10062;</button></span>
				<br><input maxlength="144" type="text" name="imgdesc[]" class="idsc" />
				</td>
				<td width="33%">
				6.)<input type="file" class="iup filec" id="image6" name="fileimage[]" multiple="multiple" accept="image/*">
				<br><img id="preview6" alt="Placeholder" src="img/transspec.png" class="previewfimgs"><span style="line-height: 50px; vertical-align:top"><button id="emptyImage_id_6" class="emptyForm">&#10062;</button></span>
				<br><input maxlength="144" type="text" name="imgdesc[]" class="idsc" />
				</td>
			</tr>
		</table>
	</div>
	<div class="form-element">
		<label>Description</label>
		<br><span class="tab"><textarea rows="12" cols="110" name="description" form="upload-form"></textarea></span>
	</div>
	<div class="form-element projectc" id="plangdiv">
		<label>Programming Languages</label>
		<input maxlength="80" type="text" name="planguage" />
	</div>
	<div class="form-element videoc" id="vsubject">
		<label>Subject</label>
		<select id="formsubject" name="subject">
			<option value="1">Physics</option>
			<option value="2">Math/Calculus</option>
			<option value="3">Circuit Analysis</option>
			<option value="4">Digital Techniques</option>
		</select>
	</div>
	<div class="form-element videoc" id="vcourse">
		<label>Course</label>
		<input maxlength="12" pattern= "^[0–9]$" type="number" name="course">
	</div>
	<div class="form-element videoc" id="vchapter">
		<label>Chapter</label>
		<input maxlength="12" pattern= "^[0–9]$" type="number" name="chapter">
	</div>
	<div class="form-element videoc" id="vquestion">
		<label>Question</label>
		<input maxlength="12" pattern= "^[0–9]$" type="number" name="question">
	</div>
	<div class="form-element" id="err"></div>
	<div style="text-align:right" class="form-element">
		<input type="submit" value="Post!" name="submit">
	</div>
	</div>
	<script src="js/upload.js"></script>
	';
	} else {
		echo "ACCESS FORBIDDEN";
	}
} else {
	header('Location: login.php');
	exit;
}

include 'admin.php';
include 'footer.html';

?>
