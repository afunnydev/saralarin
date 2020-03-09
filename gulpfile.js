const gulp = require('gulp');
const imageresize = require('gulp-image-resize');
var exec = require('child_process').exec;
var newer = require('gulp-newer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

// image resizing variables
const imagexl = 2620;
const imagefull = 1920;
const imagehalf = 1024;
const imagequart = 600;
const imageport = 300;
const imagethumb = 80;
const jsFiles = [
  'themes/saralarin/assets/js/theme/jquery.js',
  'themes/saralarin/assets/js/theme/modernizr.js',
  'themes/saralarin/assets/js/theme/bootstrap.min.js',
  'themes/saralarin/assets/js/theme/jquery.easing.1.3.js',
  'themes/saralarin/assets/js/theme/skrollr.min.js',
  'themes/saralarin/assets/js/theme/smooth-scroll.js',
  'themes/saralarin/assets/js/theme/jquery.appear.js',
  'themes/saralarin/assets/js/theme/bootsnav.js',
  'themes/saralarin/assets/js/theme/jquery.nav.js',
  'themes/saralarin/assets/js/theme/wow.min.js',
  'themes/saralarin/assets/js/theme/page-scroll.js',
  'themes/saralarin/assets/js/theme/swiper.min.js',
  'themes/saralarin/assets/js/theme/jquery.count-to.js',
  'themes/saralarin/assets/js/theme/jquery.stellar.js',
  'themes/saralarin/assets/js/theme/jquery.magnific-popup.min.js',
  'themes/saralarin/assets/js/theme/isotope.pkgd.min.js',
  'themes/saralarin/assets/js/theme/imagesloaded.pkgd.min.js',
  'themes/saralarin/assets/js/theme/classie.js',
  'themes/saralarin/assets/js/theme/hamburger-menu.js',
  'themes/saralarin/assets/js/theme/counter.js',
  'themes/saralarin/assets/js/theme/jquery.fitvids.js',
  'themes/saralarin/assets/js/theme/equalize.min.js',
  'themes/saralarin/assets/js/theme/skill.bars.jquery.js',
  'themes/saralarin/assets/js/theme/justified-gallery.min.js',
  'themes/saralarin/assets/js/theme/jquery.easypiechart.min.js',
  'themes/saralarin/assets/js/theme/instafeed.min.js',
  'themes/saralarin/assets/js/theme/retina.min.js',
  'themes/saralarin/assets/js/revolution/jquery.themepunch.tools.min.js',
  'themes/saralarin/assets/js/revolution/jquery.themepunch.revolution.min.js',
  'themes/saralarin/assets/js/theme/main.js',
  'themes/saralarin/assets/js/main.js'
];
const jsDest = 'themes/saralarin/static/js';
 
// resize and optimize images
gulp.task("image-resize", () => {
  return gulp.src("themes/saralarin/source-images/*.{jpg,png,jpeg}")
    .pipe(newer("themes/saralarin/static/img"))
    .pipe(imageresize({ width: imagexl}))
    .pipe(gulp.dest("themes/saralarin/static/xl/img"))
    .pipe(imageresize({ width: imagefull }))
    .pipe(gulp.dest("themes/saralarin/static/img"))
    .pipe(imageresize({ width: imagehalf }))
    .pipe(gulp.dest("themes/saralarin/static/half/img"))
    .pipe(imageresize({ width: imagequart }))
    .pipe(gulp.dest("themes/saralarin/static/quart/img"))
    .pipe(imageresize({ width: imageport }))
    .pipe(gulp.dest("themes/saralarin/static/portfolio/img"))
    .pipe(imageresize({ width: imagethumb }))
    .pipe(gulp.dest("themes/saralarin/static/thumb/img"));
});

// hugo production call
gulp.task("hugo", (cb) => {
  exec('hugo --cleanDestinationDir', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('sass', () => {
  return gulp.src('themes/saralarin/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('themes/saralarin/static/css'));
});

gulp.task('scripts', () => {
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(jsDest));
});

// watching
gulp.task("watch", () => {
  // browserSync.init({
  //     proxy: "http://localhost:1313/"
  // });

  gulp.watch('themes/saralarin/source-images/*.{jpg,png,jpeg,gif}', ['image-resize'] );
  gulp.watch('themes/saralarin/assets/scss/**/*.scss', ['sass']);
  gulp.watch('themes/saralarin/assets/js/**/*.js', ['scripts']);
});

// watching images and resizing
gulp.task("dev",  gulp.series('image-resize', 'watch'));

// optimizing images and calling hugo for production
gulp.task("prod",  gulp.series('image-resize', 'sass', 'hugo'));
