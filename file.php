<?php
    $method = $_POST['method'];
    $updatedData = $_POST['newData'];

    if($method === 'saveSettings') {
        file_put_contents('data/settings.json', $updatedData);
    }

    if($method === 'addWindow') {
        $data = file_get_contents('data.json');
        $tempData1 = json_decode($data);
        $tempData2 = json_decode($updatedData);

        if(is_array($tempData1)) {
            array_push($tempData1, $tempData2);
        } else {
            $tempData1 = $tempData2;
        }

        if(is_object($tempData1)) {
            $tempData1 = json_encode($tempData1);
            $object[] = json_decode($tempData1);
            file_put_contents('data/data.json', json_encode($object));
        } else {
            file_put_contents('data/data.json', json_encode($tempData1));
        }
    }
        
?>