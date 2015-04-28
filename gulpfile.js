'use strict';

// see server.js for server params.

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    path = require('path'),
    ls = require('gulp-live-server'),
    util = plugins.util,
    del = require('del'),
    Builder = require('systemjs-builder'),
    argv = process.argv,
    pkg = require('./package.json'),
    jspm = pkg.jspm,
    bldrconf = pkg.builder,
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

// plumber util
function plumber() {
    return plugins.plumber({errorHandler: plugins.notify.onError()});
}

// notification for jshint
// enable in the "lint" task
// here for completeness.
function hintify() {
    return plugins.notify(function(file) {
        if (file.jshint.success)
            return false;
        var errors = file.jshint.results.map(function (data) {
            return data.error ? '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason : '';
        }).join('\n');
        return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
    });
}

/* Globs & Dependencies
**********************************************/

// destination for gulp.
var dest = './dist';

// object of globs by type.
var globs = {
    // NOTE: the double asterisks before folder names

    copy:   ['./src/**/css/**/*.css', './src/**/views/**/*.html',
             './src/**/jspm_packages/**/*.*', './src/config.js',
             './src/index.html', './src/**/js/**/*.js'],
    clean:  ['./dist/css', './dist/js',
             './dist/views', './dist/jspm_packages',
             './dist/index.html', './dist/config.js'],
    lint:   ['./src/js/**/*.js']
};
var watched = globs.copy;

// object containing arrays
// for switching on linting.
var deps = {
    common: ['clean'],
    lint:   ['clean'],
    bundle: ['clean', 'copy'],
    serve:  ['clean', 'copy']
};

/* Flags & Tasks
***************************************************/

// running npm test.
var isTest = contains(argv, ['test', 'test-bundle']);

// development server task called.
var isServ = contains(argv, ['serve']);

// serve without clean/copy/bundle.
var isServOnly = contains(argv, ['serve-only']);

// production bundle task called.
var isBundle = contains(argv, 'bundle');

// lint task called.
var isLint = contains(argv, 'lint');

// lint flag provided with bundle or serve.
var isLintFlag = contains(argv, ['-l', '--lint']);

// lint flag provided with bundle or serve.
var isBundleFlag = contains(argv, ['-b', '--bundle']);

// self executing production task requested.
var isSFX = contains(argv, ['-s', '--sfx']);

// serve without building.
var isServOnlyFlag = contains(argv, ['-n', '--nobuild']);

// set serve dependencies to empty array.
if(isServOnly || isServOnlyFlag)
    deps.serve = [];

// if bundling change copy to "copyb"
if(isBundle || isBundleFlag)
    globs.copy.pop();

// if lint add preprocess dependencies.
if(isLintFlag && isServ){

    // add copy to lint dependencies.
    deps.lint.push('copy');

    // add lint to serve dependencies.
    deps.serve.push('lint');

}

// add lint to bundle dependencies.
if(isBundleFlag || isBundle && isLintFlag)
    deps.bundle.push('lint');

// add serve to serve-bundle dependencies.
if(isBundleFlag && isServ && !isServOnly && !isServOnlyFlag){
    deps.serve.push('bundle');
}

/* Gulp Tasks
**********************************************/

// clean dist directories
gulp.task('clean', function (cb) {
   return del(globs.clean, cb);
});

// copy source to dist
gulp.task('copy', deps.common, function () {
    return gulp.src(globs.copy)
        .pipe(gulp.dest(dest));
});

// lint the project.
gulp.task('lint', deps.lint, function () {
    return gulp.src(globs.lint)
        .pipe(plumber())
        .pipe(plugins.cached('jshint'))
        .pipe(plugins.jshint())
        // enable for screen notifications.
        //.pipe(hintify())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// bundle using systemjs-builder
gulp.task('bundle', deps.bundle, function (cb) {
    var builder = new Builder();
    var buildType = 'build';
    var configFile = path.join(jspm.directories.baseURL, (jspm.configFile || 'config.js'));
    if(isSFX)
        buildType = 'buildSFX';
    builder.loadConfig(configFile)
        .then(function() {
            builder.config({baseURL: path.resolve(jspm.directories.baseURL)});
            builder[buildType](bldrconf.expression, bldrconf.outFile, bldrconf.options)
                .then(function() {
                    return cb();
                })
                .catch(function(ex) {
                    util.log(util.colors.red('Builder Bundle:'), ex.message);
                    return cb();
                });
        })
        .catch(function(ex) {
            util.log(util.colors.red('Builder Config:'), ex.message);
            return cb();
        });
});

gulp.task('reload', deps.serve,  function () {
    return gulp.src(watched)
        .pipe(server.notify());
});

// run the web server.
gulp.task('serve', deps.serve, function (cb) {
    server = ls.new('./server.js');
    var state =server.start();
    // watch for file changes.
    if(!isTest){
        var watch = gulp.watch(watched, ['reload']);
        watch.on('change', function (changed) {
            changed = path.relative(process.cwd(), changed.path);
            util.log('Watched:', changed);
        });
    } else {
        if(state.pending)
            process.exit(0);
    }
    return cb();
});

// serve current dist without cleaning or building.
gulp.task('serve-only', ['serve']);

// bump project version
gulp.task('bump', function () {
    return gulp.src('./package.json')
        .pipe(plugins.bump())
        .pipe(gulp.dest('./'));
});

// default task run web server.
gulp.task('default', ['serve']);

// test tasks
gulp.task('test-bundle', ['bundle'], function () {
    util.log(util.colors.green('Success:'), 'succesfully bundled application.');
    process.exit(0);
});
gulp.task('test', ['serve'], function () {
    util.log(util.colors.green('Success:'), 'succesfully built and served application.');
    process.exit(0);
});