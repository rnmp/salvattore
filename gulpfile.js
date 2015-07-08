var gulp = require('gulp'),
    umd = require('gulp-umd'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    stylish = require('jshint-stylish'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    package = require('./package.json'),
    size = require('gulp-size'),
    banner = [
        '/*!',
        ' * Salvattore <%= pkg.version %> by @rnmp and @ppold',
        ' * <%= pkg.repository.url %>',
        ' */\n'
    ].join('\n');

gulp.task('default', function() {
    return gulp.src(['src/polyfills/matchMedia.js',
                    'src/polyfills/matchMedia.addListener.js',
                    'src/polyfills/requestAnimationFrame.js',
                    'src/polyfills/customEvent.js',
                    'src/*.js'])
        .pipe(jshint({
            laxcomma: true,
            strict: true
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(concat(package.name + '.js'))
        .pipe(umd({
            exports: function(file) {
                return package.name;
            },
            namespace: function(file) {
                return package.name;
            }
        }))
        .pipe(header(banner, {pkg: package}))
        .pipe(gulp.dest('dist/'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(size({showFiles: true, gzip: true}))
        .pipe(gulp.dest('dist/'));
});
