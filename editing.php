<?php 

include 'include/class.upload.php';

include './config.php';
include './header.html';

echo "<div id='contentbody'>";

session_start();

if(isset($_SESSION['user_id'])) {
	if($_SESSION['user_id']==1) {

        if(isset($_POST['submit'])) {

            $id = $_POST['id'];
            $uploadtype = $_POST["uploadtype"];
            $filepath = "uploads/".$uploadtype."/".$id."/";

            //first off - update the common variables between videos and projects
            $title = htmlspecialchars($_POST["title"], ENT_QUOTES, 'UTF-8');
            $date = $_POST["date"];
            $creator = htmlspecialchars($_POST["creator"], ENT_QUOTES, 'UTF-8');
            $ylink = $_POST["ylink"];
            $description = htmlspecialchars($_POST["description"], ENT_QUOTES, 'UTF-8');

            $updateQuery1 = "UPDATE ".$uploadtype."s SET title=?, date=?, creator=?, ylink=?, description=? WHERE id=?";
                $updateStmt = $connection->prepare($updateQuery1);
                $updateStmt->execute([$title, $date, $creator, $ylink, $description, $id]);         

            echo "<b>".$uploadtype ."</b> id <b>".$id."</b> titled <i>\"" . $title . "\"</i> has been edited in database <b>".$uploadtype."s</b>.";
            
            //secondly - update the display picture that is common between the two

            $ySiphon = $_POST['siphonYoutube'];
                
                $tempDispExists = false;
                $fileToBeUp = false;
                $tempHeadExists = false;
                $errMessage="";

                if(!empty($ySiphon) && !empty($ylink)) {

                    $youtubeImg = "https://img.youtube.com/vi/".$ylink."/maxresdefault.jpg";
					copy($youtubeImg, "temp/".$ylink."_temp.jpg");
                    $dispimgup = new \Verot\Upload\Upload("temp/".$ylink."_temp.jpg");
                    $fileToBeUp = true;
                                      
                } elseif((empty($ySiphon) || empty($ylink)) && !empty($_FILES['dispimgfile']['tmp_name'])) {

                    $dispimgfile = array();
					$dispimgfile = $_FILES['dispimgfile'];
                    $dispimgup = new \Verot\Upload\Upload($dispimgfile);
                    $fileToBeUp = true;

                }

                if($fileToBeUp==true) {
                
                    if(file_exists($filepath."displaypic.jpg")) {
                        copy($filepath."displaypic.jpg", "./temp/displaypic_temp.jpg"); 
                        $tempDispExists = true;
                        unlink($filepath."displaypic.jpg");
                    }

                    if(empty($ylink)) {
                        
                        if(file_exists($filepath."headerpic.jpg")) {
                            copy($filepath."headerpic.jpg", "./temp/headerpic_temp.jpg"); 
                            $tempHeadExists = true;
                            unlink($filepath."headerpic.jpg");
                        }
                            $dispimgup->file_new_name_body = 'headerpic';
                            $dispimgup->image_convert='jpg';
                            $dispimgup->image_resize=true;
                            $dispimgup->image_ratio_y=true;
                            $dispimgup->image_x=1000;
                            $dispimgup->Process($filepath);
                    }
                    $dispimgup->file_new_name_body = 'displaypic';
					$dispimgup->image_resize = true;
					$dispimgup->image_ratio_crop = true;
					$dispimgup->image_y = 300;
					$dispimgup->image_x = 300;
					$dispimgup->image_convert = 'jpg';
                    $dispimgup->Process($filepath);

                    if($dispimgup->processed) {
                        $dispimgup->clean();
                        $errMessage = "";
                    } else {
                        $errMessage = '<br><br>Error : ' . $dispimgup->error;
                        if($tempHeadExists==true) {
                            copy("./temp/headerpic_temp.jpg", $filepath."headerpic.jpg");
                            unlink("./temp/headerpic_temp.jpg");
                            $tempDispExists==false;
                        }
                        if($tempDispExists==true) {
                            copy("./temp/displaypic_temp.jpg", $filepath."displaypic.jpg");
                            unlink("./temp/displaypic_temp.jpg");
                            $tempDispExists==false;
                        }
                    } 
                }

            if($uploadtype == "project") { 

            //NORMAL FILE UPLOADS
            echo "<br>";

            //SORT OUT VARIABLES
            $oLinkArray = array ('olink1', 'olink2', 'olink3');
            $oLinkDescArray = array ('olinkdesc1', 'olinkdesc2', 'olinkdesc3');
            $fileDelete = array ($_POST['fileDelete_1'], $_POST['fileDelete_2'], $_POST['fileDelete_3']);
            $fileDesc = array($_POST['filedesc_1'], $_POST['filedesc_2'], $_POST['filedesc_3']);
            $fileName = array($_FILES['file_1']['name'], $_FILES['file_2']['name'], $_FILES['file_3']['name']);
            $tmpFileName = array($_FILES['file_1']['tmp_name'], $_FILES['file_2']['tmp_name'], $_FILES['file_3']['tmp_name']);

            $planguage = $_POST['planguage'];
            
            $query_oLinkRead = "SELECT olink1, olink2, olink3 FROM projects WHERE id=:id";
            $smst_oLink=$connection->prepare($query_oLinkRead);
                $smst_oLink->bindParam(':id', $id);
                $smst_oLink->execute();
            $oLinks = $smst_oLink->fetch();

            for($i=0; $i<3; $i++) {
                //Check to see if file must be deleted
                if(!empty($fileDelete[$i])) {
                    unlink($filepath.$oLinks[$i]);
                    $fileNameUp = "";
                    $fileDescUp = "";
                }

                //Check to see if file exists in that place
                if(!empty($tmpFileName[$i])) { 
                    $fileNameUp = ($i+1)."_".$fileName[$i];
                    if(!empty($fileDesc[$i])) $fileDescUp = $fileDesc[$i];
                    else $fileDescUp = $fileNameUp;
                    $target_path = $filepath.$fileNameUp;
                    move_uploaded_file($tmpFileName[$i], $target_path);
                }

                if(!empty($fileDelete[$i]) || !empty($tmpFileName[$i])) {
                    $query_fileDescUp = "UPDATE ".$uploadtype."s SET ".$oLinkArray[$i]."=?, ".$oLinkDescArray[$i]."=? WHERE id=?";
                        $query_fileDescUp=$connection->prepare($query_fileDescUp);
                        $query_fileDescUp->execute([$fileNameUp, $fileDescUp, $id]);
                }
            }

            //IMAGE FILE UPLOADS

                //sort out array, create an array from image descriptions

                $imgFileDelete = array ( "", //just to start this array on entry 1
                    $_POST['imgFileDelete_1'], $_POST['imgFileDelete_2'], $_POST['imgFileDelete_3'],
                    $_POST['imgFileDelete_4'], $_POST['imgFileDelete_5'], $_POST['imgFileDelete_6']
                );

                $imgFilesTmpUp = array ( "",
                    $_FILES['fileimage']['tmp_name'][0], $_FILES['fileimage']['tmp_name'][1], $_FILES['fileimage']['tmp_name'][2],
                    $_FILES['fileimage']['tmp_name'][3], $_FILES['fileimage']['tmp_name'][4], $_FILES['fileimage']['tmp_name'][5]
                );
                $imgDescsUp = array ( "",
                    $_POST['imgdesc'][0], $_POST['imgdesc'][1], $_POST['imgdesc'][2], 
                    $_POST['imgdesc'][3], $_POST['imgdesc'][4], $_POST['imgdesc'][5]
                ); 

                $imgFilesKeep = array();
                $imgFilesKeep = $_FILES['fileimage'];

                $smst_projects=$connection->prepare("SELECT imgfilesuploaded FROM projects WHERE id=:id");
                    $smst_projects->bindParam(':id', $id);
                    $smst_projects->execute();
                    $imgCount = $smst_projects->fetchColumn();
                
                $imgDesc = array();
                $newImgDesc = array();
                $newImgCount = 1;

                $imgPathS = $filepath."img/small/";
                $imgPathL = $filepath."img/large/";

                $imgFormClear_flag = array(0, 0, 0, 0, 0, 0, 0);

                for($i=1; $i<=6; $i++) {
                    if(file_exists($imgPathS."/".$i.".jpg") && empty($imgFileDelete[$i])) {
                        $imgFormClear_flag[$i] = 1;
                    }
                    if(!empty($imgFileDelete[$i])) {
                        fileDelete($id, $i);    
                    }
                }

                for($j=1; $j<=$imgCount; $j++) {

                    $oldImgPathS = $imgPathS.$j.".jpg";
                    $newImgPathS = $imgPathS.$newImgCount.".jpg";
                    $oldImgPathL = $imgPathL.$j.".jpg";
                    $newImgPathL = $imgPathL.$newImgCount.".jpg";

                    //grab image description
                    $smst_imgdesc=$connection->prepare("SELECT imgdesc[".$j."] FROM projects WHERE id=:id");
                        $smst_imgdesc->execute(['id'=>$id]);
                        $smst_imgdesc_fetch = $smst_imgdesc->fetch();
                        $imgDesc[$j] = $smst_imgdesc_fetch[0];
                    
                    //sort out old files
                    if(empty($imgFileDelete[$j])) {
                        
                        $newImgDesc[$newImgCount]=$imgDesc[$j];
                        
                        if($newImgPathS != $oldImgPathS) {
                            if(rename($oldImgPathS, $newImgPathS)) 
                                echo "<br><br><b>Success</b>File ".$oldImgPathS." has been renamed to ".$newImgPathS;
                        }
                        if($newImgPathL != $oldImgPathL) {
                            if(rename($oldImgPathL, $newImgPathL)) 
                                echo "<br><b>Success</b>File ".$oldImgPathL." has been renamed to ".$newImgPathL;
                        }
                                              
                        $newImgCount++;
                    }
                }

                //make new folders if necessary
                if(!empty(implode($imgFilesTmpUp)) && !file_exists($filepath."img/")) {
                    mkdir($filepath."img");
                    mkdir($filepath."img/large");
                    mkdir($filepath."img/small");
                }

                $imgfiles = array();
                $arrayCount=0;

                //break up image upload array
                foreach($_FILES['fileimage'] as $k => $l) {
                    foreach($l as $m => $v) {
                        if(!array_key_exists($m, $imgfiles)) $imgfiles[$m] = array();			
                        $imgfiles[$m][$k] = $v; 
                    }
                }

                foreach($imgfiles as $imgfile) {
                    
                    $arrayCount++;

                    if(empty($imgFormClear_flag[$arrayCount])) {

                        //img desc
                        $newImgDesc[$newImgCount]=$imgDescsUp[$arrayCount];

                        //img upload
                        $imgfileup = new \Verot\Upload\Upload($imgfile);
                        if($imgfileup->uploaded) {
                            $imgfileup->file_new_name_body=$newImgCount;
                            $imgfileup->image_convert='jpg';
                            $imgfileup->image_resize=true;
                            $imgfileup->image_ratio_y=true;
                            $imgfileup->image_x=1200;
                            $imgfileup->Process($imgPathL);
        
                            $imgfileup->file_new_name_body=$newImgCount;
                            $imgfileup->image_convert = 'jpg';
                            $imgfileup->image_resize = true;
                            $imgfileup->image_ratio_crop = true;
                            $imgfileup->image_y = 135;
                            $imgfileup->image_x = 135;
                            $imgfileup->Process($imgPathS);
                            if($imgfileup->processed) {
                                echo '<br><b>Success:</b> File '.$newImgCount.'.jpg put in form box '.$arrayCount.' uploaded successfully.';
                                $imgfileup->clean();
                                $newImgCount++;
                            } else echo '<br><b>Error</b>: ' . $imgfileup->error;
                        }
                    }
                }

                $imgdescarray = array();
                $imgdescarray = array_map('htmlspecialchars', $newImgDesc);

                end($imgdescarray);
                $lastimgdesckey = key($imgdescarray);

                $imgdesc = '{ ';
                foreach($imgdescarray as $i => $value) {
                    $imgdesc .= '"'.$value.'"';
                    if($i != $lastimgdesckey) $imgdesc .= ', ';
                }
                unset($value);
                $imgdesc .= ' }';

                $imgTotal = $newImgCount-1;

                $query_imgdesc = $connection->prepare("UPDATE projects SET imgdesc=:imgdesc, imgfilesuploaded=:imgfilesuploaded, planguage=:planguage WHERE id=:id");
                    $query_imgdesc->bindParam("imgfilesuploaded", $imgTotal, PDO::PARAM_INT);
                    $query_imgdesc->bindParam("imgdesc", $imgdesc, PDO::PARAM_STR);
                    $query_imgdesc->bindParam("planguage", $planguage, PDO::PARAM_STR);
                    $query_imgdesc->bindParam("id", $id, PDO::PARAM_INT);
                    $query_imgdesc->execute();

            } elseif($uploadtype == "video") {

                $subject = intval($_POST['subject']);
                $course = intval($_POST['course']);
                $chapter = intval($_POST['chapter']);
                $question = intval($_POST['question']);

                $query_videos = $connection->prepare("UPDATE videos SET subject=?, course=?, chapter=?, question=? WHERE id=?");
                    $query_videos->execute([$subject, $course, $chapter, $question, $id]);
                
            }

            echo "<br><br>Wait 10 seconds to be taken to ./" . $uploadtype ."s";

            if(!empty($errMessage))
                echo "<br><br><hr><br><b>Error message</b>: ".$errMessage;

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
                    </script>
                    ";

        } else {
            echo 'Error.';
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

function fileDelete($idCurrent, $fileName) {
    $fileS = "uploads/project/".$idCurrent."/img/small/".$fileName.".jpg";
    $fileL = "uploads/project/".$idCurrent."/img/large/".$fileName.".jpg";

    if(is_file($fileS) && @unlink($fileS)) {
        echo "<br><br><b>Success:</b> File small/".$fileName.".jpg was deleted.";
    } elseif (is_file($fileS)) {
        echo "<br><br><b>Error:</b> File small/".$fileName.".jpg <b>could not</b> be deleted.";
    } else {
        echo "<br><br><b>Warning:</b> File does not exist";
    }

    if(is_file($fileL) && @unlink($fileL)) {
        echo "<br><b>Success:</b> File large/".$fileName.".jpg was deleted.";
    } elseif (is_file($fileL)) {
        echo "<br><b>Error:</b> File large/".$fileName.".jpg <b>could not</b> be deleted.";
    } else {
        echo "<br><b>Warning:</b> File does not exist";
    }
}

include 'admin.php';
include 'footer.html';

?>