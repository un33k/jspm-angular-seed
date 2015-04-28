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
import uiRouter from 'angular-ui/ui-router';

/*
 * Config Block
 * configure the application injecting
 * needed providers for defining routes
 * and setting html5Mode to true instead
 * of using hash.
 */
function config($locationProvider, $stateProvider, $urlRouterProvider){

    // set to html5mode
    $locationProvider.html5Mode(true);

    var router = $stateProvider;
    router.otherwise = $urlRouterProvider.otherwise;

    // add states.
    var states = {
        'home': { url: '/', templateUrl: '/views/example/home.html' },
        'option': { url: '/option', templateUrl: '/views/example/option.html' },
        'resource': { url: '/resource', templateUrl: '/views/example/resource.html' },
        'otherwise': '/'
    };

    // iterate and add routes to router.
    Object.keys(states).forEach((k) => {
        let state = [k, states[k]];
        if(k === 'otherwise'){
            router.otherwise(state[1]);
        } else {
            router.state.apply(null, state);
        }
    });
}
config.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

/*
 * Run Block
 * this runs after providers have been
 * configured and the app is ready to
 * route.
 */
function run($rootScope){

    //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams){
    //});
    //
    //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams){
    //
    //});

}
run.$inject = ['$rootScope'];

/*
 * Base controller.
 */
function BaseCtrl() {
    this.appName = 'jspm-angular-seed';
    this.tagline = 'JSPM, AngularJS, SystemJS & ES6';
    this.companyName = 'Origin1 Technologies';
}

/*
 * Instantiate Module
 * instantiate the angular module then
 * add the defined code and run blocks
 * from above.
 */
angular.module('app', ['ui.router'])
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
