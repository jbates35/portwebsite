<?php

	header('Content-Type: application/json');

	include "./config.php";
	
	$smst_projects=$connection->prepare("SELECT * FROM projects ORDER BY date DESC");
	$smst_projects->execute();
			$projects_arr = $smst_projects->fetchAll(PDO::FETCH_ASSOC);

	$projects_arr_size = 0;

	foreach($projects_arr as $type) {
		$projects_arr_size += count($type);
	}

	$projects_arr_columns = sizeof($projects_arr[0]);
	$rows = $projects_arr_size/$projects_arr_columns;

	$project_entry_arr = array();

// for each row, sort out the array, unset imagedesc, make the array of imagedesc, and then encode it into a json object
	for($i=0; $i<$rows; $i++) {	
		$id = $projects_arr[$i]['id'];
		$imgcount = $projects_arr[$i]['imgfilesuploaded'];

		$filecount = array();
		$filecount['filecount'] = 0; 


		for($k=1; $k<=3; $k++) {
			if(!empty($projects_arr[$i]['olink'.$k])) $filecount['filecount']++;
		}

		$imgdesc = array();

		for($j=1; $j<=$imgcount; $j++) {
			$smst_imgdesc=$connection->prepare("SELECT imgdesc[".$j."] FROM projects WHERE id=:id");
				$smst_imgdesc->execute(['id'=>$id]);
				$smst_imgdesc_fetch = $smst_imgdesc->fetch();

			$imgdesc["imgdesc_".$j] = $smst_imgdesc_fetch[0];
		}

		unset($projects_arr[$i]['imgdesc']);

		$project_entry_arr[$i] = array_merge($projects_arr[$i], $imgdesc, $filecount);
	}

	$json = json_encode($project_entry_arr);
	echo $json;

?>
