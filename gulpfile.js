'use strict';

// see server.js for server params.

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    path = require('path'),
    ls = require('gulp-live-server'),
    util = plugins.util,
    del = require('del'),
    argv = process.argv,
    server;

/* Helper Functions
 **********************************************/

// rudamentary method checking
// if array contains a given element.
function contains(arr, val){
    if(!(val instanceof Array))
        return arr.indexOf(val) !== -1;
    var match;
    val.forEach(function (v) {
        if(match !== true)
            match = contains(arr, v);
    });
    return match;
}

// object of globs by type.
var globs = {
    src: ['./src/**/*.js'],
    dist: ['./dist/js/**/*.js'],
    css: ['./dist/css/**/*.css'],
    html: ['./dist/index.html','./dist/views/**/*.html']
};

var watched = globs.css.concat(globs.html).concat(globs.src);

// object containing arrays
// for switching on linting.
var deps = {
    serve: ['clean', 'copy'],
    prod:   ['clean', 'prod']
};

// checks if serving in dev or prodcution mode.
var isDev = contains(argv, ['serve', 'server']);
var isProd = contains(argv, 'prod');
var isLint = contains(argv, ['-l', '--lint']);

// define preprocess dependencies
// for our primary task.
var pre = deps.serve;
if(isProd)
   pre = deps.prod;

// if lint flag add to
// preprocess dependencies.
if(isLint)
    pre.push('lint');


/* Gulp Tasks
**********************************************/

// clean js directory.
gulp.task('clean', function (cb) {
    del(globs.dist, cb);
});

// copy source to dist
gulp.task('copy', ['clean'], function () {
    gulp.src(globs.src)
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('prod', ['clean'], function () {
    gulp.src(globs.src)
        .pipe(gulp.dest('./dist/js'));
});

// lint the project.
gulp.task('lint', function () {
    return gulp.src(globs.dist)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('reload', pre,  function () {
    gulp.src(watched)
        .pipe(server.notify());
});

// run the web server.
gulp.task('serve', pre, function () {
    server = ls.new('./server.js');
    //ls.static('dist');
    server.start();
    // watch for file changes.
    var watch = gulp.watch(watched, ['reload']);
    watch.on('change', function (changed) {
        changed = path.relative(process.cwd(), changed.path);
        util.log('Watched:', changed);
    });
});

// because I want to type "r"
gulp.task('server', ['serve']);

// bump project version
gulp.task('bump', function () {
    return gulp.src('./package.json')
        .pipe(plugins.bump())
        .pipe(gulp.dest('./'));
});


// default task run web server.
//gulp.task('default', ['serve']);