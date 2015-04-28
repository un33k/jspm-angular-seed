'use strict';

/**
 * jspm-angular-seed
 * An example es6 application
 * using jspm, systemjs and
 * es6-module-loader.
 * @author Origin1 Technologies <origin1tech@gmail.com>
 * @license see LICENSE.md
 */

/*
 * Import Dependencies
 * jspm sorts our for us whether the
 * import is a global, amd or commonjs
 * module. for exampel ngRoute is
 * merely imported to expose it to
 * Angular as we're not using it
 * directly.
 */
import angular from 'angular';
import ngRoute from 'angular-route';

/*
 * Config Block
 * configure the application injecting
 * needed providers for defining routes
 * and setting html5Mode to true instead
 * of using hash.
 */
function config($locationProvider, $routeProvider){

  // set to html5mode
  $locationProvider.html5Mode(true);

  var router = $routeProvider;

  // add your routes.
  var routes = {
    '/': { templateUrl: '/views/home.html'},
    'otherwise': { redirectTo: '/'}
  };

  // iterate and add routes to router.
  Object.keys(routes).forEach((k) => {
    let route = [k, routes[k]];
    if(k === 'otherwise'){
      router.otherwise(route);
    } else {
      router.when.apply(router, route);
    }
  });

}
config.$inject = ['$locationProvider', '$routeProvider'];

/*
 * Run Block
 * this runs after providers have been
 * configured and the app is ready to
 * route.
 */
function run($rootScope){

  // Uncomment to listen to route change start events.
  //$rootScope.$on('$routeChangeStart', function (event, next, current){
  //
  //});

  // Uncomment to listen to route change success events.
  //$rootScope.$on('$routeChangeSuccess', function (event, next, current){
  //
  //});

}
run.$inject = ['$rootScope'];

/*
 * Base controller.
 */
function BaseCtrl() {
  this.appName = 'jspm-angular-seed';
  this.tagline = 'Company Tagline';
  this.companyName = 'Company Name';
}

/*
 * Instantiate Module
 * instantiate the angular module then
 * add the defined code and run blocks
 * from above.
 */
angular.module('app', ['ngRoute'])
    .config(config)
    .run(run)
    .controller('BaseCtrl', BaseCtrl);

/*
 * Bootstrap Angular
 * bootstrap the app once the dom is
 * loaded .
 */
angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});
