<?php

define("MYSQL_SERVER", "localhost");
define("MYSQL_USER", "fb7903g3_pool");
define("MYSQL_PASSWORD", "*YNayEl2");
define("MYSQL_DB", "fb7903g3_pool");

function db_connect() {
    $link = mysqli_connect(MYSQL_SERVER, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB)
        or die( "Error: " . mysqli_error($link) );
    if (!mysqli_set_charset($link, "utf8")) {
        printf( "Error: " . mysqli_error($link) );
    }

    return $link;
}

$link = db_connect();
