angular.module('angular-toArrayFilter', [])

.filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
      });
    }
  };
});

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
    $scope.devices = response.data;
  });

  $scope.deviceTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

  $scope.addFilm = function() {
    $http({
      url: url,
      method: 'POST',
      params: {action: 'addFilm'},
      data: {film: $scope.newFilm}
    }).then(function(response) {
      var nf = angular.copy($scope.newFilm);
      nf.id = response.data;
      $scope.films[nf.id] = nf;
      $scope.newFilm = {}
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

  $scope.addDevice = function() {
    $http({
      url: url,
      method: 'POST',
      params: {action: 'addDevice'},
      data: {device: $scope.newDevice}
    }).then(function(response) {
      var nd = angular.copy($scope.newDevice);
      nd.id = response.data;
      $scope.devices[nd.id] = nd;
      $scope.newDevice = {}
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
