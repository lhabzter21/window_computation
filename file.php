<?php
    $method = $_POST['method'];
    $updatedData = $_POST['newData'];

    if($method === 'saveSettings') {
        file_put_contents('data/settings.json', $updatedData);
    }

    if($method === 'addWindow') {
        $data = file_get_contents('data/data.json');
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

    if($method === 'deleteWindow') {

        $data = file_get_contents('data/data.json');
        $json = json_decode($data, true);
        $id = json_decode($updatedData);

        unset($json[$id->id]);
    
        $json = json_encode($json, JSON_PRETTY_PRINT);
        file_put_contents('data/data.json', $json);
    }

    if($method === 'updateWindow') {
        $jsonString = file_get_contents('data/data.json');
        $data = json_decode($jsonString, true);
        $request = json_decode($updatedData, true);

        foreach ($data as $key => $entry) {
            if ($entry['id'] == $request['id']) {
                $data[$key]['id'] = $entry['id'];
                $data[$key]['height'] = $request['height'];
                $data[$key]['width'] = $request['width'];
                $data[$key]['color'] = $request['color'];
                $data[$key]['floor'] = $request['floor'];
                $data[$key]['location'] = $request['location'];
                $data[$key]['laminated'] = $request['laminated'];
                $data[$key]['type'] = $request['type'];
                $data[$key]['quantity'] = $request['quantity'];
                $data[$key]['amount'] = $request['amount'];
            }
        }

        $newJsonString = json_encode($data);
        file_put_contents('data/data.json', $newJsonString);
    }
        
?>