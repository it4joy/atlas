<?php

require_once("db.php");

$errArray = array(
    "emptyFields" => "Заполните, пожалуйста, поле: ",
    "invalidEmail" => "Email необходимо ввести в формате (пример): example@domain.com (без пробелов).",
    "notANumber" => "Пожалуйста, введите числа.",
    "requestFailure" => "Произошла ошибка, попробуйте отправить запись позже.",
    "noRecords" => "Нет записей для отображения",
);

// regExps
$numberRegExp = "/^\d\d+\d$/";
$emailRegExp = "/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i";

$userIP = $_SERVER['REMOTE_ADDR'];

if ( !empty($_POST) ) {
    // adds a record
    if ( $_POST["action"] === "add_record" ) {
        $fullname = $_POST["fullname"];
        $email = $_POST["email"];
        $birthday = $_POST["birthday"];
        $gender = $_POST["gender"];
        $docType = $_POST["doc-type"];
        $docNumber = $_POST["doc-number"];
        $rights = $_POST['rights'];
        $browser = $_POST['browser'];

        if ( empty($fullname) ) {
            echo json_encode( $errArray["emptyFields"] . "ФИО.");
        } else if ( empty($email) ) {
            echo json_encode( $errArray["emptyFields"] . "Email.");
        } else if ( preg_match($emailRegExp, $email) !== 1 ) {
            echo json_encode( $errArray["invalidEmail"] );
        } else if ( empty($birthday) ) {
            echo json_encode( $errArray["emptyFields"] . "Дата рождения.");
        }
        
        if ( !empty($docNumber) ) {
            if ( preg_match($numberRegExp, $docNumber) !== 1 ) {
                echo json_encode( $errArray["notANumber"] );
            }
        }

        // trims spaces
        $fullname = trim($fullname);
        $docType = trim($docType);

        // converts to string
        $rightsConverted = implode(", ", $rights);
        print_r($rightsConverted); // test

        // provides safety
        $fullname = mysqli_real_escape_string($link, $fullname);
        $email = mysqli_real_escape_string($link, $email);
        $birthday = mysqli_real_escape_string($link, $birthday);
        $gender = mysqli_real_escape_string($link, $gender);
        $docType = mysqli_real_escape_string($link, $docType);
        $docNumber = mysqli_real_escape_string($link, $docNumber);
        $rightsConverted = mysqli_real_escape_string($link, $rightsConverted);

        $query = "INSERT INTO Users(Full_Name, Email, Birthday, Gender, Doc_Type, Doc_Number, Rights, User_IP, Browser) VALUES('$fullname', '$email', '$birthday', '$gender', '$docType', '$docNumber', '$rightsConverted', '$userIP', '$browser')";

        if ( mysqli_query($link, $query) ) {
            echo json_encode("Запись добавлена!");
        } else {
            echo json_encode( $errArray["requestFailure"] );
        }
    } else if ( $_POST["action"] === "get_records" ) {
        $query = "SELECT * FROM Users ORDER BY Time_Stamp DESC";

        if ( $result = mysqli_query($link, $query) ) {
            $records = array();

            while ( $row = mysqli_fetch_assoc($result) ) {
                $records[] = $row;
            }

            echo json_encode($records);
        } else {
            echo json_encode( $errArray["noRecords"] );
        }
    }
}
