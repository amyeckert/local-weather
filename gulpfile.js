
var gulp = require('gulp');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var jshint_stylish = require('jshint-stylish');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-bulk-import');
var neat = require('node-neat').includePaths;
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

function logError(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task(
    'scripts',
    function() {
        var bundler = browserify('js/dev/app.js');
        bundler.transform("babelify", {presets: ["es2015", "react"]});
        return bundler.bundle()
            .on('error', logError)
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest('js/dist'));
    }
);

// off by default
gulp.task(
    'lint',
    function() {
        return gulp.src('js/*.js')
            .pipe(jshint())
            .on('error', logError)
            .pipe(jshint.reporter('jshint-stylish'));
    }
);

gulp.task(
    'sass',
    function() {
        var plugins = [
            autoprefixer({ grid: true })
        ];

        return gulp.src('css/scss/*.scss')
            .pipe(sourcemaps.init())
            .pipe(bulkSass())
            .pipe(
                sass({
                    includePaths: ['sass'].concat(neat)
                })
            ).on('error', sass.logError)
            .pipe(postcss(plugins))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('css/dist'));
    }
);

gulp.task(
    'watch',
    function() {
        gulp.watch('js/dev/*.js', gulp.series('scripts'));
        gulp.watch('js/dev/**/*.js', gulp.series('scripts'));
        gulp.watch('css/scss/*.scss', gulp.series('sass'));
        gulp.watch('css/scss/**/*.scss', gulp.series('sass'));
    }
);

gulp.task('default', gulp.series('lint', 'scripts', 'sass', 'watch', function(done) {
    done();
}));


