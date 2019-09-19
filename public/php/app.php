<?php

require_once("db.php");


if ( !empty($_POST) ) {
    // adds a record
    if ( $_POST["action"] === "add" ) {
        $name = $_POST["name"];
        $email = $_POST["email"];
        $message = $_POST["message"];

        $name = mysqli_real_escape_string($link, $name);
        $email = mysqli_real_escape_string($link, $email);
        $message = mysqli_real_escape_string($link, $message);

        $query = "INSERT INTO Guest_book(Name, Email, Message) VALUES('" . $name . "', '" . $email . "', '" . $message . "')";

        if ( mysqli_query($link, $query) ) {
            echo json_encode( array("response_success" => $name . ", Ваше сообщение отправлено!") );
        }
    }
}
