<?php

include './config.php';
include './header.html';

session_start();

echo '
	<link rel="stylesheet" href="css/delete.css">
	<div id="contentbody">
';

if(isset($_SESSION['user_id'])) {
	if($_SESSION['user_id']==1) {

		include './deldirfunction.php';

		if(isset($_GET['id']) && isset($_GET['type'])) {	
			$id = $_GET['id'];
			$type = $_GET['type'];

			$smst_item=$connection->prepare("SELECT * FROM ".$type."s WHERE id=:id");
			$smst_item->execute(['id' => $id]);
			$item=$smst_item->fetch();
			
			$show=$item['show'];
			if($show==true) {
				$showOption = "Hide";
				$showNext = false;
			} else {
				$showOption = "Show";
				$showNext = true;
			}

			if(isset($_POST['delOption'])) {
				if($_POST['delOption'] == 1) { //show or hide

					$queryUpdate = "UPDATE ".$type."s SET show=:show WHERE id=:id";
					$smstUpdate = $connection->prepare($queryUpdate);
						$smstUpdate->bindParam(':show', $showNext, PDO::PARAM_BOOL);
						$smstUpdate->bindParam(':id', $id, PDO::PARAM_INT);
					if($smstUpdate->execute()) {
						echo $type." entry ID ".$id." successfully changed status.";
						header("refresh: 2; url=./".$type."s.php");
					} else {
						echo "Something went wrong.";
					}

				} elseif ($_POST['delOption']==2) { // delete directly

					delete_files('./uploads/'.$type.'/'.$id.'/');

					$queryDelete = "DELETE FROM ".$type."s WHERE id=:id";
					$smstDelete = $connection->prepare($queryDelete);
						$smstDelete->bindParam(':id', $id, PDO::PARAM_INT);
					if($smstDelete->execute()) {
						echo $type." entry ID ".$id." successfully deleted.";
						header("refresh: 2; url=./".$type."s.php");
					} else {
						echo "Something went wrong.";
					}
				
				} elseif ($_POST['delOption']==0) { // cancel and go back to page
					echo 'Redirecting to '.$type.'s';
					header("refresh:1; url=./".$type."s.php");
				} else {
					echo "Error with delOption.";
				}
			} else {
				echo '
		Would you like to hide or delete the post?<br>
		<form method="post" action="" name="delOptionForm" id="delOptionForm_id">
			<span class="tab">
				<button type="submit" name="delOption" value=1>'.$showOption.'</button>
				<button type="submit" name="delOption" onclick="submitClick(event, \''.$item['title'].'\')" class="redButton" value=2>Delete</button>
				<button type="submit" name="delOption" value=0>Cancel</button>
			</span>
		</form>
			<br>
				';

				if($type=="video") {
					echo '
			<div class="vidContentContainer" id="vidContentContainer_id">
					';

					echo '
			</div>
			<script>
				$(document).ready(function() {
					listVideo('.$id.');
				});	
			</script>
					';
				} elseif($type=="project") {
					echo '
			<div class="projContentContainer" id="projContentContainer_id">
			</div>
			<script>
				$(document).ready(function() {
					listProject('.$id.');
				});	
			</script>
			';
				}
			echo '
			<script src="js/delete.js"></script>
			';
			}

		} else {
			echo 'Parameters not set. Redirecting you to homepage.';
			header("refresh:2; url=./");
		}
	} else {
	       	echo "FORBIDDEN";
		header("refresh:1; url=./");
	}
} else {
	echo "FORBIDDEN";
	header("refresh:1; url=./");
}
 
echo '
	</div>
';

include 'admin.php';
include 'footer.html';

?>
