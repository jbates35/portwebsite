<?php

include './config.php';
include './header.html';

session_start();

echo '
	<link rel="stylesheet" href="css/edit.css">
	<div id="contentbody">
';

if(isset($_SESSION['user_id'])) {
	if($_SESSION['user_id']==1) {

		if(isset($_GET['id']) && isset($_GET['type'])) {	
			$id = $_GET['id'];
			$type = $_GET['type'];

			$smst_item=$connection->prepare("SELECT * FROM ".$type."s WHERE id=:id");
			$smst_item->execute(['id' => $id]);
            $item=$smst_item->fetch();

                $iTitle=$item['title'];
                $iDate=$item['date'];
                $iCreators=$item['creator'];
                $iYLink=$item['ylink'];
                $iDescription=$item['description'];
                if($type=="project") {
                    $oLink1=$item['olink1'];
                    $oLink2=$item['olink2'];
                    $oLink3=$item['olink3'];
                    $oLinkDesc1=$item['olinkdesc1'];
                    $oLinkDesc2=$item['olinkdesc2'];
                    $oLinkDesc3=$item['olinkdesc3'];
                    $pLanguage=$item['planguage'];
                    $imgFilesUploaded=$item['imgfilesuploaded'];
                } elseif($type="video") {
                    $iSubject=$item['subject'];
                    $iCourse=$item['course'];
                    $iChapter=$item['chapter'];
                    $iQuestion=$item['question'];
                }

                
            if(!isset($_POST['submit'])) {

                echo '
                <form method="post" action="editing.php" name="edit-form" id="editForm_id" runat="server" enctype="multipart/form-data">
                <div class="form-element">
                    <label>Title</label>
                    <input maxlength="80" type="text" name="title" value="'.$iTitle.'" required />
                </div>
                <div class="form-element">
                    <label>Date</label>
                    <input type="date" name="date" value="'.$iDate.'" required />
                </div>
                <div class="form-element">
                    <label>Creators</label>
                    <input maxlength="80" type="text" name="creator" value="'.$iCreators.'" required />
                </div>
                <div class="form-element">
                    <label>Youtube link</label>
                    <input maxlength="80" type="text" value="'.$iYLink.'" name="ylink" />
                    <br><span class="tab"><i>Siphon disp pic from youtube?</i></span>
                    <select id="siphonYoutube" name="siphonYoutube">
                        <option value="0" selected>No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
                <div class="form-element">
                    <label>Image preview upload</label>
                    <br><span class="tab"><input type="file" class="filec" id="imgfileid" name="dispimgfile" multiple="multiple" accept="image/*"><button id="emptyDispImg_id" class="emptyForm">&#10062;</button></span>
                    <br><div id="preview"><span class="tab"><img id="previewimg" alt="Placeholder" src="img/transspec.png" class="previewimgs"></span></div>
                </div>
                ';

                if($type=="project") {

                        //file upload part
                    if(strlen($oLink1)>30) $oLinkRn1 = substr($oLink1, 0, 20)."...".substr($oLink1, (strlen($oLink1)-5), 5); else $oLinkRn1 = $oLink1;
                    if(strlen($oLink2)>30) $oLinkRn2 = substr($oLink2, 0, 20)."...".substr($oLink2, (strlen($oLink2)-5), 5); else $oLinkRn2 = $oLink2;
                    if(strlen($oLink3)>30) $oLinkRn3 = substr($oLink3, 0, 20)."...".substr($oLink3, (strlen($oLink3)-5), 5); else $oLinkRn3 = $oLink3;

                        echo '	
                        <div class="form-element projectc" id="fileupdiv">
                            <label>Project files to upload</label>
                            <div class="fileFlex">
                                    <div class="fileChild" id="file1OccDiv_id"><button class="fileDelButton" id="fileDelButton1_id">Delete file &#10062;</button> <label>File 1 uploaded</label> '.$oLinkRn1.' <button class="fileUndoButton noShow" id="fileUndoButton1_id">Undo</button></div>
                                    <div class="fileChild" id="file1UpDiv_id"><label>File 1 description</label><input type="text" name="filedesc_1"><input type="file" id="fileUp_id_1" class="filec" name="file_1" multiple="multiple" /><button id="emptyFile_id_1" class="emptyForm">&#10062;</button></div>
                                    <div class="fileChild" id="file2OccDiv_id"><button class="fileDelButton" id="fileDelButton2_id">Delete file &#10062;</button> <label>File 2 uploaded</label> '.$oLinkRn2.' <button class="fileUndoButton noShow" id="fileUndoButton2_id">Undo</button></div>
                                    <div class="fileChild" id="file2UpDiv_id"><label>File 2 description</label><input type="text" name="filedesc_2"><input type="file" id="fileUp_id_2" class="filec" name="file_2" multiple="multiple" /><button id="emptyFile_id_2" class="emptyForm">&#10062;</button></div>
                                    <div class="fileChild" id="file3OccDiv_id"><button class="fileDelButton" id="fileDelButton3_id">Delete file &#10062;</button> <label>File 3 uploaded</label> '.$oLinkRn3.' <button class="fileUndoButton noShow" id="fileUndoButton3_id">Undo</button></div>
                                    <div class="fileChild" id="file3UpDiv_id"><label>File 3 description</label><input type="text" name="filedesc_3"><input type="file" id="fileUp_id_3" class="filec" name="file_3" multiple="multiple" /><button id="emptyFile_id_3" class="emptyForm">&#10062;</button></div>
                            </div>
                        </div><br>
                        ';  
   
                        echo '	
                        <div class="form-element projectc" id="imagesupdiv"><label>Image files to upload</label>
                        ';

                        //image file part- first gallery and then upload form
                        if($imgFilesUploaded>0) {
                            echo '
                            <div class="prevImgParent">
                            ';
                            
                            for($x=1;$x<=$imgFilesUploaded;$x++) {
                                echo '
                                <div class="childPrevDiv" id="childBoxOverlay'.$x.'_id">
                                    <div class="childImgButtonDiv" id="childImgDelDiv'.$x.'_id"><button class="fileDelButton" id="childDelButton'.$x.'_id">Delete img &#10062;</button></div>
                                    <div class="childImgButtonDiv" id="childImgUndoDiv'.$x.'_id"><button class="fileUndoButton noShow" id="childUndoButton'.$x.'_id">Undo</button></div>
                                    <div class="childOverlayDiv noShow" id="childOverlayDiv'.$x.'_id"></div>
                                    <div class="childImgDiv"><img class="childImg" src="./uploads/project/'.$id.'/img/small/'.$x.'.jpg"></div>
                                </div>
                                ';
                            }

                            echo '
                            </div>
                            ';
                        }

                        //img upload form
                        echo '
                        <div class="imgParent-1">
                        ';
                        for($x = 1; $x <= 6; $x++){
                            echo '
                            <div class="childBox-1" id="childImgBox'.$x.'_id">
                                '.$x.': <input type="file" class="iup filec" id="image'.$x.'" name="fileimage[]" multiple="multiple" accept="image/*"><br>
                                <img id="preview'.$x.'" alt="Placeholder" src="img/transspec.png" class="previewfimgs"><span style="line-height: 50px; vertical-align:top">
                                <button id="emptyImage_id_'.$x.'" class="emptyForm">&#10062;</button></span><br>
                                <input maxlength="144" type="text" name="imgdesc[]" class="idsc" width="20" />
                            </div>';
                        
                        }
                        echo '
                            </div>
                        ';
                    
                }
                
                echo '
                <div class="form-element">
                <label>Description</label>
                    <br><span class="tab"><textarea rows="12" cols="110" name="description">'.$iDescription.'</textarea></span>
                </div>
                ';

                if($type=="project") {
                    echo '
                    <div class="form-element projectc" id="plangdiv">
                        <br><label>Programming Languages</label>
                        <input maxlength="80" type="text" name="planguage" value="'.$pLanguage.'" />
                    </div>
                    ';

                    //hidden project divs
                    echo ' 
                    <div class="form-element noShow" id="hiddenProjValues_id"> 
                        <input type="text" id="fileDelete_1_id" name="fileDelete_1" value="0"><br>
                        <input type="text" id="fileDelete_2_id" name="fileDelete_2" value="0"><br>
                        <input type="text" id="fileDelete_3_id" name="fileDelete_3" value="0"><br>
                        <input type="text" id="imgFileDelete_1_id" name="imgFileDelete_1" value="0"><br>
                        <input type="text" id="imgFileDelete_2_id" name="imgFileDelete_2" value="0"><br>
                        <input type="text" id="imgFileDelete_3_id" name="imgFileDelete_3" value="0"><br>
                        <input type="text" id="imgFileDelete_4_id" name="imgFileDelete_4" value="0"><br>
                        <input type="text" id="imgFileDelete_5_id" name="imgFileDelete_5" value="0"><br>
                        <input type="text" id="imgFileDelete_6_id" name="imgFileDelete_6" value="0"><br>
                    </div>
                    ';
                }
                
                if($type=="video") {

                    $select1=""; $select2=""; $select3=""; $select4="";

                    switch($iSubject) {
                        case 1: $select1="selected"; break;
                        case 2: $select2="selected"; break;
                        case 3: $select3="selected"; break;
                        case 4: $select4="selected"; break;
                    }

                    echo '
                    <div class="form-element" id="vsubject">
                        <label>Subject</label>
                        <select id="formsubject" name="subject">
                            <option value="1" '.$select1.' >Physics</option>
                            <option value="2" '.$select2.' >Math/Calculus</option>
                            <option value="3" '.$select3.' >Circuit Analysis</option>
                            <option value="4" '.$select4.' >Digital Techniques</option>
                        </select>
                    </div>
                    <div class="form-element" id="vcourse">
                        <label>Course</label>
                        <input maxlength="12" pattern= "^[0–9]$" type="number" name="course" value="'.$iCourse.'">
                    </div>
                    <div class="form-element" id="vchapter">
                        <label>Chapter</label>
                        <input maxlength="12" pattern= "^[0–9]$" type="number" name="chapter" value="'.$iChapter.'">
                    </div>
                    <div class="form-element" id="vquestion">
                        <label>Question</label>
                        <input maxlength="12" pattern= "^[0–9]$" type="number" name="question" value="'.$iQuestion.'">
                    </div>
                    ';
                }                

                echo '
                <div class="form-element noShow" id="hiddenValues_id">
                    <input type="text" id="id_id" name="id" value="'.$id.'"><br>
                    <input type="text" id="uploadtype_id" name="uploadtype" value="'.$type.'"><br> 
                </div>
                <div class="form-element" id="err">
                    <div style="text-align:right" class="form-element">
                        <button class="" name="submit" id="formSubmit_id" type="submit">Submit form</button>
                    </div>
                </div>

                </form>

                ';

                //PHP and interaction with JS for fileupload forms
                if($type=="project") {
                    if(empty($oLink1)) $fileHidden1 = '#file1OccDiv_id';
                    else $fileHidden1 = '#file1UpDiv_id';
                    if(empty($oLink2)) $fileHidden2 = '#file2OccDiv_id';
                    else $fileHidden2 = '#file2UpDiv_id';
                    if(empty($oLink3)) $fileHidden3 = '#file3OccDiv_id';
                    else $fileHidden3 = '#file3UpDiv_id';    
                    
                    echo '
                    <script>
                        $("'.$fileHidden1.'").addClass("noShow");
                        $("'.$fileHidden2.'").addClass("noShow");
                        $("'.$fileHidden3.'").addClass("noShow");
                        var imgFilesCount = '.$imgFilesUploaded.'
                    </script>
                    ';

                    //PHP and interaction with JS for image preview upload forms
                    echo '
                    <script>
                    ';
                    for($x=1; $x<=6; $x++) {
                        if($x<=$imgFilesUploaded) {
                            echo '
                            var imgFileUploaded_'.$x.' = true;
                            ';
                        } else {
                            echo '
                            var imgFileUploaded_'.$x.' = false;
                            ';
                        }
                    }
                    echo '
                    </script>
                    ';
                }
                
                //other variables
                echo '
                <script>
                    var id='.$id.';
                    var uploadtype="'.$type.'";
                </script>
                <script src="js/edit.js"></script>';

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