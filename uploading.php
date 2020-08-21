<?php 

require_once('include/class.upload.php');

include './config.php';
include './header.html';
echo "	<div id='contentbody'>";

session_start();

if(isset($_SESSION['user_id'])) {
	if($_SESSION['user_id']==1) {


	if(!isset($_POST['submit'])) {
		header('location: upload.php');
	}

// Declaring variables and what notarray_walk_recursive
		$uploadtype = $_POST["uploadtype"];

		$title = htmlspecialchars($_POST["title"], ENT_QUOTES, 'UTF-8');
		$date = $_POST["date"];
		$creator = htmlspecialchars($_POST["creator"], ENT_QUOTES, 'UTF-8');
		$ylink = $_POST["ylink"];
		$description = htmlspecialchars($_POST["description"], ENT_QUOTES, 'UTF-8');
		$planguage = htmlspecialchars($_POST["planguage"], ENT_QUOTES, 'UTF-8');
		$subject = $_POST["subject"];
		$course = intval($_POST["course"]);
		$chapter = intval($_POST["chapter"]);
		$question = intval($_POST["question"]);

		date_default_timezone_set('America/Vancouver');
		$uploaddate = date('Y-m-d H:i:s');

		$author = $_SESSION['user_id'];

// First database entry - without the file info
		if($uploadtype == "project") {
			$query = $connection->prepare("INSERT INTO projects(title, date, creator, ylink, description, planguage, uploaddate, author) VALUES (:title, :date, :creator, :ylink, :description, :planguage, :uploaddate, :author)");
			$query->bindParam("planguage", $planguage, PDO::PARAM_STR);
		} elseif ($uploadtype == "video") {
			$query = $connection->prepare("INSERT INTO videos(title, date, creator, ylink, description, uploaddate, author, subject, course, chapter, question) VALUES (:title, :date, :creator, :ylink, :description, :uploaddate, :author, :subject, :course, :chapter, :question)");
			$query->bindParam("subject", $subject, PDO::PARAM_INT);
			$query->bindParam("course", $course, PDO::PARAM_INT);
			$query->bindParam("chapter", $chapter, PDO::PARAM_INT);
			$query->bindParam("question", $question, PDO::PARAM_INT);
		}
			$query->bindParam("title", $title, PDO::PARAM_STR);
			$query->bindParam("date", $date, PDO::PARAM_STR);
			$query->bindParam("creator", $creator, PDO::PARAM_STR);
			$query->bindParam("ylink", $ylink, PDO::PARAM_STR);
			$query->bindParam("description", $description, PDO::PARAM_STR);
			$query->bindParam("uploaddate", $uploaddate, PDO::PARAM_STR);
			$query->bindParam("author", $author, PDO::PARAM_INT);
			$result=$query->execute();

// Acquire ID of new row in order to create file structure
		$query_id = $connection->query("SELECT id FROM ".$uploadtype."s ORDER BY id DESC LIMIT 1");
		$id = $query_id->fetchColumn();

// Make target directory
		$target_dir_root="uploads/".$uploadtype."/";
		mkdir($target_dir_root.$id);
		$target_dir = $target_dir_root.$id."/";

// Upload files (if project)
		if($uploadtype=="project") {
				

			$filecount = count($_FILES['file']['name']);

			for($i = 0; $i < $filecount; $i++) {
				$tmpFilePath = $_FILES['file']['tmp_name'][$i];

				if($tmpFilePath != "") {
					$j = $i+1;
					$newFileName = $j."_".$_FILES['file']['name'][$i];
					$newFilePath = $target_dir.$newFileName;

					if(move_uploaded_file($tmpFilePath, $newFilePath)) {
						if(empty($_POST['filedesc'][$i])) {
							$newFileDesc = htmlspecialchars($newFileName);
						} else {
							$newFileDesc = htmlspecialchars($_POST['filedesc'][$i], ENT_QUOTES, 'UTF-8');
						}
						
						$query_file = $connection->prepare("UPDATE projects SET olink".$j."=:newFileName, olinkdesc".$j."=:newFileDesc WHERE id=:id");
						$query_file->bindParam("newFileName", $newFileName, PDO::PARAM_STR);	
						$query_file->bindParam("newFileDesc", $newFileDesc, PDO::PARAM_STR);
						$query_file->bindParam("id", $id, PDO::PARAM_INT);
						$result_file=$query_file->execute();			
					}
				}
			}
		}

// Upload project images and description
		if($uploadtype=="project") {

	// Upload the image files 
			if(!empty($_FILES['fileimage'])) {
				mkdir($target_dir."img");
				mkdir($target_dir."img/large");
				mkdir($target_dir."img/small");
				$img_target_dir_large = $target_dir."img/large/";
				$img_target_dir_small = $target_dir."img/small/";

			}

			$imgfilesuploaded = 0;

			$imgfiles = array();
			foreach($_FILES['fileimage'] as $k => $l) {
				foreach($l as $m => $v) {
					if(!array_key_exists($m, $imgfiles)) $imgfiles[$m] = array();			
					$imgfiles[$m][$k] = $v; 
				}
			}
			foreach($imgfiles as $imgfile) {
				$imgfileup = new \Verot\Upload\Upload($imgfile);
				if($imgfileup->uploaded) {
					$imgfilesuploaded++;
					$imgfileup->file_new_name_body=$imgfilesuploaded;
					$imgfileup->image_convert='jpg';
					$imgfileup->image_resize=true;
					$imgfileup->image_ratio_y=true;
					$imgfileup->image_x=1200;
					$imgfileup->Process($img_target_dir_large);

					$imgfileup->file_new_name_body=$imgfilesuploaded;
					$imgfileup->image_convert = 'jpg';
					$imgfileup->image_resize = true;
					$imgfileup->image_ratio_crop = true;
					$imgfileup->image_y = 135;
					$imgfileup->image_x = 135;
					$imgfileup->Process($img_target_dir_small);
					if($imgfileup->processed) {
						$imgfileup->clean();
					} else echo '<br><br>Error : ' . $imgfileup->error;
				}
			}

	// Update SQL with image file descriptions
			$query_imgup = $connection->prepare("UPDATE projects SET imgfilesuploaded=:imgfilesuploaded WHERE id=:id");
			$query_imgup->bindParam("imgfilesuploaded", $imgfilesuploaded, PDO::PARAM_INT);

			$query_imgup->bindParam("id", $id, PDO::PARAM_INT);
			$result_imgup=$query_imgup->execute();

			$imgdescarray = array();
			$imgdescarray = array_map('htmlspecialchars', $_POST['imgdesc']);

			foreach($_FILES['fileimage']['tmp_name'] as $i => $value) {
				if(empty($value)) {
					unset($imgdescarray[$i]); 
				}
			}

			end($imgdescarray);
			$lastimgdesckey = key($imgdescarray);

			$imgdesc = '{ ';
			foreach($imgdescarray as $i => $value) {
				$imgdesc .= '"'.$value.'"';
				if($i != $lastimgdesckey) $imgdesc .= ', ';
			}
			unset($value);
			$imgdesc .= ' }';

			$query_imgdesc = $connection->prepare("UPDATE projects SET imgdesc=:imgdesc WHERE id=:id");
			$query_imgdesc->bindParam("imgdesc", $imgdesc, PDO::PARAM_STR);
			$query_imgdesc->bindParam("id", $id, PDO::PARAM_INT);
			$query_imgdesc->execute();

		}

// Upload prof image
		if(!empty($_FILES['dispimgfile']['tmp_name']) || !empty($ylink)) {

			$youtubeImg = "https://img.youtube.com/vi/".$ylink."/maxresdefault.jpg";

			if(!empty($_FILES['dispimgfile']['tmp_name']) || @fopen($youtubeImg)) {

				if(!empty($_FILES['dispimgfile']['tmp_name'])) {
					$dispimgfile = array();
					$dispimgfile = $_FILES['dispimgfile'];

					$dispimgup = new \Verot\Upload\Upload($dispimgfile);

				 } else {
					copy($youtubeImg, "temp/".$ylink."_temp.jpg");
					$dispimgup = new \Verot\Upload\Upload("temp/".$ylink."_temp.jpg");
				 } 

				if(empty($ylink)) {
					$dispimgup->file_new_name_body = 'headerpic';
					$dispimgup->image_convert='jpg';
					$dispimgup->image_resize=true;
					$dispimgup->image_ratio_y=true;
					$dispimgup->image_x=1200;
					$dispimgup->Process($target_dir);
				}

					$dispimgup->file_new_name_body = 'displaypic';
					$dispimgup->image_resize = true;
					$dispimgup->image_ratio_crop = true;
					$dispimgup->image_y = 300;
					$dispimgup->image_x = 300;
					$dispimgup->image_convert = 'jpg';
					$dispimgup->Process($target_dir);

				if($dispimgup->processed) {
					$dispimgup->clean();
					$errMessage = "";
				} else {
					$errMessage = '<br><br>Error : ' . $dispimgup->error;
				} 

			} else {
				$errMessage = "<br><br>Youtube picture not available for entry ID ".$id." therefore hidden picture must be used instead.";
			}

		} else {
			
			$show=false;	
			$queryUpdate = "UPDATE ".$uploadtype."s SET show=:show WHERE id=:id";
			$smstUpdate = $connection->prepare($queryUpdate);
				$smstUpdate->bindParam(':show', $show, PDO::PARAM_BOOL);
				$smstUpdate->bindParam(':id', $id, PDO::PARAM_INT);
			if($smstUpdate->execute()) {
				$errMessage = "<br><br>".$uploadtype." entry ID ".$id." had no available display picture and therefore was set to hidden.";
			} else {
				$errMessage="<br><br><b>WARNING:</b> ".$uploadtype." entry ID ".$id." had no available display picture and was <b>not able to be</b> set to hidden.";
			}

		}
// Exit script
		echo $uploadtype . " id <b>".$id."</b> titled <i>\"" . $title . "\"</i> has been uploaded to database <b>".$uploadtype."s</b>.<br><br>Wait 10 seconds to be taken to ./" . $uploadtype ."s";

		echo $errMessage;


		echo "
				<script>
					setTimeout(function() {
						window.location.href='" . $uploadtype ."s.php';
					}, 10000);

					window.onbeforeunload = function() {
						window.setTimeout(function() { 
							window.location = '" . $uploadtype ."s.php';
						}, 0);
						window.onbeforeunload = null;
					}

					if(window.history.replacestate) {
						window.history.replaceState(null, null, window.location.href);
					}
				</script>";
 	} else {
		echo "ACCESS FORBIDDEN";
	}
} else {
	header('Location: login.php');
	exit;
}

echo "</div>";
include './admin.php';
include './footer.html';

?>
