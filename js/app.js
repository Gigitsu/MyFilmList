Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var $newFilmForm = $('#new-film :input');
var $newDeviceForm = $('#new-device :input');

angular.module('showDuplicatesUnseenFilter', []).filter('showDuplicatesUnseen', function () {
  return function (input, toggleDups, toggleUnseen) {
    if(toggleDups || toggleUnseen) {
      return _.chain(input).
        filter(function(item){ return !toggleUnseen || item.seen == 0; }).
        groupBy('name').
        filter(function(item){ return !toggleDups || item.length > 1; }).
        flatten().
        value();
    } else {
      return input;
    }
  };
});

angular.module('filmsFilter', []).filter('films', function () {
  return function (input, devices, query) {
    if(query) {
      query = query.toLowerCase();
      var posId = _.chain(devices).
        filter(function(d) { return d.name.indexOf(query) != -1; }).
        map(function(d) { return d.id; }).value();

      return _.chain(input).
        filter(function(f) { return f.name.toLowerCase().indexOf(query) + posId.indexOf(f.device) != -2; } ).
        value();
    }
    return input;
  };
});

var app = angular.module('g2FilmsApp', ['xeditable', 'showDuplicatesUnseenFilter', 'filmsFilter']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

app.controller('FilmsCtrl', function ($scope, $http) {
  var url = 'ajax.php';

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
  $scope.showOnlyDups = false;
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
    $scope.newFilm.seen = 0;
    $http({
      url: url,
      method: 'POST',
      params: {action: 'addFilm'},
      data: {film: $scope.newFilm}
    }).then(function(response) {
      var nf = angular.copy($scope.newFilm);
      nf.id = response.data;
      nf.device = parseInt(nf.device);
      $scope.films.push(nf);
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
    $scope.films.remove(film);
  }
  $scope.toggleSeen = function(film) {
    if(film.seen == 0) film.seen = 1;
    else film.seen = 0;

    $scope.updateFilm(film);
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
      nd.id = parseInt(response.data);
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
    $scope.devices.remove(device);
  }

});
