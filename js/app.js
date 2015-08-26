var $newFilmForm = $('#new-film :input');
var $newDeviceForm = $('#new-device :input');

angular.module('angular-toArrayFilter', []);

var app = angular.module('g2FilmsApp', ['xeditable', 'angular-toArrayFilter']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

app.controller('FilmsCtrl', function ($scope, $http) {
  var url = '/ajax.php';

  $http({
    url: url,
    method: 'GET',
    params: {action: 'films'}
  }).then(function(response) {
    $scope.films = response.data;
  });

  $http({
    url: url,
    method: 'GET',
    params: {action: 'devices'}
  }).then(function(response) {
    $scope.devices = {};
    _.each(response.data, function(d){
      $scope.devices[d.id] = d;
    });
  });

  $scope.newFilm = {};
  $scope.newDevice = {};
  $scope.deviceTypes = {
    'default':'grigio',
    'primary':'blu',
    'success':'verde',
    'info':'azzurro',
    'warning':'giallo',
    'danger':'rosso'
  };

  $scope.resetNewFilm = function() { $scope.newFilm = {}; }
  $scope.addFilm = function() {
    if(! ($scope.newFilm.hasOwnProperty('name') && $scope.newFilm.hasOwnProperty('device')) ) return;

    $newFilmForm.attr("disabled", true);
    $http({
      url: url,
      method: 'POST',
      params: {action: 'addFilm'},
      data: {film: $scope.newFilm}
    }).then(function(response) {
      var nf = angular.copy($scope.newFilm);
      nf.id = response.data;
      $scope.films[nf.id] = nf;
      $scope.resetNewFilm();
      $newFilmForm.attr("disabled", false);
    })
  }
  $scope.updateFilm = function(film) {
    $http({
      url: url,
      method: 'POST',
      params: {action: 'updateFilm'},
      data: {film: film}
    })
  }
  $scope.removeFilm = function(film) {
    $http({
      url: url,
      method: 'POST',
      params: {action: 'removeFilm'},
      data: {film: film}
    })
    delete $scope.films[film.id];
  }

  $scope.resetNewDevice = function() { $scope.newDevice = {}; }
  $scope.addDevice = function() {
    if(! ($scope.newDevice.hasOwnProperty('name') && $scope.newDevice.hasOwnProperty('type')) ) return;

    $newDeviceForm.attr("disabled", true);
    $http({
      url: url,
      method: 'POST',
      params: {action: 'addDevice'},
      data: {device: $scope.newDevice}
    }).then(function(response) {
      var nd = angular.copy($scope.newDevice);
      nd.id = response.data;
      $scope.devices[nd.id] = nd;
      $scope.resetNewDevice();
      $newDeviceForm.attr("disabled", false);
    })
  }
  $scope.updateDevice = function(device) {
    $http({
      url: url,
      method: 'POST',
      params: {action: 'updateDevice'},
      data: {device: device}
    })
  }
  $scope.removeDevice = function(device) {
    $http({
      url: url,
      method: 'POST',
      params: {action: 'removeDevice'},
      data: {device: device}
    })
    delete $scope.devices[device.id];
  }

});
