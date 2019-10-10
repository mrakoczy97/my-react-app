<?php
 header('Content-Type: text/html; charset=utf-8');
/*Definiowanie zmiennych z danymi niezbędnymi do połączenia z bazą danych*/
$serwer = 'localhost';
$uzytkownik = 'admin';
$haslo = 'admin';
$nazwa_bazy = 'cms';
  
/*Połączenie z bazą*/
$db = mysqli_connect($serwer, $uzytkownik, $haslo, $nazwa_bazy);
 
/*Komunikat o błędzie w przypadku problemów z połączeniem*/
if (mysqli_connect_errno()) 
{
    echo 'Błąd';
    exit;   
}
else {
}
//funkcje
function filtrowanie($zmienna) 
{
 // $zmienna = substr($zmienna, 0, 50); // Ograniczenie ciągu do pierwszych 50 znaków
  $zmienna = trim($zmienna);
  $zmienna = stripslashes($zmienna);
  $zmienna = htmlspecialchars($zmienna); 
  return $zmienna; 
}


//bez tego wypierdala krzaczki zamiast polskich znaków
 mysqli_query($db,"SET NAMES utf8");
?>