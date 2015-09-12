<?php

class DB extends SQLite3
{
    function __construct()
    {
        $this->open('films.db');
    }

    function getFilms() {
      return $this->fetchResults(
        $this->query("SELECT * FROM films")
      );
    }

    private function bindFilm($query, $film) {
      $stm = $this->prepare($query);
      $stm->bindValue(':device', $film->device, SQLITE3_INTEGER);
      $stm->bindValue(':name', $film->name, SQLITE3_TEXT);
      $stm->bindValue(':seen', $film->seen, SQLITE3_TEXT);
      if(property_exists($film, 'id'))
        $stm->bindValue(':id',$film->id, SQLITE3_INTEGER);
      return $stm;
    }

    function addFilm($film) {
      $query = "INSERT INTO films (name, device) VALUES (:name, :device)";
      $stm = $this->bindFilm($query, $film);
      $stm->execute();
      return $this->lastInsertRowID();
    }

    function updateFilm($film) {
      $query = "UPDATE films SET name = :name,  device = :device, seen = :seen WHERE id = :id";
      $stm = $this->bindFilm($query, $film);
      $stm->execute();
    }

    function removeFilm($film) {
      $query = "DELETE FROM films WHERE id = :id";
      $stm = $this->bindFilm($query, $film);
      $stm->execute();
    }

    function getDevices() {
      return $this->fetchResults(
        $this->query("SELECT * FROM devices")
      );
    }

    private function bindDevice($query, $device) {
      $stm = $this->prepare($query);
      $stm->bindValue(':type', $device->type, SQLITE3_TEXT);
      $stm->bindValue(':name', $device->name, SQLITE3_TEXT);
      if(property_exists($device, 'id'))
        $stm->bindValue(':id',$device->id, SQLITE3_INTEGER);
      return $stm;
    }

    function addDevice($device) {
      $query = "INSERT INTO devices (name, type) VALUES (:name, :type)";
      $stm = $this->bindDevice($query, $device);
      $stm->execute();
      return $this->lastInsertRowID();
    }

    function updateDevice($device) {
      $query = "UPDATE devices SET name = :name, type = :type WHERE id = :id";
      $stm = $this->bindDevice($query, $device);
      $stm->execute();
    }

    function removeDevice($device) {
      $query = "DELETE FROM devices WHERE id = :id";
      $stm = $this->bindDevice($query, $device);
      $stm->execute();
    }

    private function fetchResults($results) {
      $rows = array();
      while($r = $results->fetchArray(SQLITE3_ASSOC)) {
        $rows[] = $r;
      }
      return $rows;
    }
}

$postData = json_decode(file_get_contents("php://input"));

$db = new DB();

switch ($_GET['action']) {
  case 'films':
    echo json_encode($db->getFilms());
    break;
  case 'addFilm':
    $id = $db->addFilm($postData->film);
    echo json_encode($id);
    break;
  case 'updateFilm':
    $db->updateFilm($postData->film);
    break;
  case 'removeFilm':
    $db->removeFilm($postData->film);
    break;

  case 'devices':
    echo json_encode($db->getDevices());
    break;
  case 'addDevice':
    $id = $db->addDevice($postData->device);
    echo json_encode($id);
    break;
  case 'updateDevice':
    $db->updateDevice($postData->device);
    break;
  case 'removeDevice':
    $db->removeDevice($postData->device);
    break;

  default:
    break;
}
