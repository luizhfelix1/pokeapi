<?php

$pokemon = $_POST['nome'];

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://pokeapi.co/api/v2/pokemon/'.$pokemon,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = curl_exec($curl);

curl_close($curl);
// header('Content-Type: application/json');
//transforma em objeto
$response=json_decode($response);
//exibe o objeto que foi transformado
//var_dump($response);
