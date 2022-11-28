var gulp = require('gulp');
var gulpless = require('gulp-less');
//Creating a Style task that convert LESS to CSS

gulp.task('styles', function () {
    var srcfile = 'css/weatherapp.less';
    var temp = 'target/css';
    return gulp
        .src(srcfile)
        .pipe(gulpless())
        .pipe(gulp.dest(temp));
});