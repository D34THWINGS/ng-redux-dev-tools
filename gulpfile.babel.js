import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import watch from 'gulp-watch';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import csso from 'gulp-csso';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import browserifyShim from 'browserify-shim';
import babelify from 'babelify';
import stringify from 'stringify';
import ngAnnotate from 'browserify-ngannotate';
import watchify from 'watchify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import browserSync from 'browser-sync';
import sequence from 'run-sequence';
import del from 'del';
import merge2 from 'merge2';

import {Server as KarmaServer} from 'karma';

function logAndEndStream(err) {
  gutil.log(gutil.colors.red(`Error (ng-redux-dev-tools):${err.message}`));
  this.emit('end');
}

function browserifyInit(options = {}) {
  const browserifyOptions = Object.assign({}, options, {
    entries: ['src/index.js'],
    standalone: 'ngReduxDevTools',
    plugin: ['browserify-derequire']
  });

  return browserify(browserifyOptions)
    .transform(babelify)
    .transform(stringify({
      extensions: ['.html']
    }))
    .transform(browserifyShim)
    .transform(ngAnnotate)
    .external(['angular', 'ng-redux']);
}

gulp.task('clean', function () {
  return del(['dist']);
});

// ================ DIST ================

gulp.task('scripts', function () {
  return browserifyInit()
    .bundle()
    .on('error', logAndEndStream)
    .pipe(source('ng-redux-dev-tools.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
  return gulp
    .src('src/index.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(rename('ng-redux-dev-tools.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('min', function () {
  return gulp
    .src('dist/ng-redux-dev-tools.js')
    .pipe(uglify())
    .pipe(rename('ng-redux-dev-tools.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (done) {
  return sequence(
    'clean',
    [
      'scripts',
      'styles'
    ],
    'min',
    done
  );
});

// ================ DEV ================

function bundleUp(bundler) {
  return bundler
    .bundle()
    .on('error', logAndEndStream)
    .pipe(source('ng-redux-dev-tools.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
}

gulp.task('serve:scripts', function () {
  const options = Object.assign({}, watchify.args, {
    detectGlobals: true,
    debug: true
  });

  const bundler = browserifyInit(options);
  const watcher = watchify(bundler, {verbose: true});

  watcher.on('update', function () {
    return bundleUp(bundler)
      .pipe(browserSync.stream());
  });

  return bundleUp(watcher);
});

gulp.task('serve:styles', function () {
  return gulp
    .src('src/index.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber(logAndEndStream))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename('ng-redux-dev-tools.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('bs:create', function () {
  browserSync.create();
});

gulp.task('bs:init', function () {
  browserSync.init({
    server: {
      baseDir: 'example',
      routes: {
        '/dist': 'dist',
        '/node_modules': 'node_modules'
      }
    }
  });
});

gulp.task('watch', function () {
  const watchStylesStream = watch(['src/**/*.scss'], function () {
    gulp.start('serve:styles');
  });

  const watchExampleStream = watch(['example/**/*'], function () {
    browserSync.reload();
  });

  return merge2([watchStylesStream, watchExampleStream]);
});

gulp.task('serve', function (done) {
  return sequence(
    'bs:create',
    'serve:styles',
    'serve:scripts',
    'bs:init',
    'watch',
    done
  );
});

// ================ TEST ================

function karmaServerCallback(done) {
  return exitCode => {
    done();
    process.exit(exitCode); // eslint-disable-line no-process-exit
  };
}

gulp.task('test', function (done) {
  return new KarmaServer({
    configFile: `${process.cwd()}/karma.conf.js`,
    singleRun: true
  }, karmaServerCallback(done)).start();
});

gulp.task('test:watch', function (done) {
  return new KarmaServer({
    configFile: `${process.cwd()}/karma.conf.js`,
    autoWatch: true,
    singleRun: false
  }, karmaServerCallback(done)).start();
});
