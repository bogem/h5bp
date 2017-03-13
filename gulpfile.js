var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean', function (done) {
    require('del')([
        dirs.dist + "/layouts/",
        dirs.dist + "/static/",
        dirs.dist + "/LICENSE.md",
        dirs.dist + "/theme.toml"
    ]).then(function () {
        done();
    });
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/static/css/*',
        '!' + dirs.src + '/static/js/*'

    ], {

        // Exclude hidden files
        dot: false

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('css:concat', function() {
    return gulp.src([
               dirs.src + '/static/css/normalize.css',
               dirs.src + '/static/css/main.css'
               ])
               .pipe(plugins.concat('main.css'))
               .pipe(plugins.autoprefixer({
                   browsers: ['ie >= 8', '> 1%'],
                   cascade: false
               }))
               .pipe(gulp.dest(dirs.dist + '/static/css/'));
});

gulp.task('css:minify', ['css:concat'], function() {
    var banner = '/*! H5BP v' + pkg.version +
                    ' | ' + pkg.license.type + ' License' +
                    ' | ' + pkg.homepage + ' */\n';

    return gulp.src(dirs.dist + '/static/css/main.css')
               .pipe(plugins.cssnano())
               .pipe(plugins.header(banner))
               .pipe(gulp.dest(dirs.dist + '/static/css/'));
});


gulp.task('js:concat', function() {
    return gulp.src([
                'node_modules/jquery/dist/jquery.min.js',
                dirs.src + '/static/js/plugins.js'
                ])
                .pipe(plugins.concat('main.js'))
                .pipe(gulp.dest(dirs.dist + '/static/js/'));
});

gulp.task('js:uglify', ['js:concat'], function() {
    return gulp.src(dirs.dist + '/static/js/main.js')
               .pipe(plugins.uglify())
               .pipe(gulp.dest(dirs.dist + '/static/js/'));
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', [
    'clean',
    'copy:misc',
    'css:concat',
    'css:minify',
    'js:concat',
    'js:uglify'

]);

gulp.task('default', ['build']);
