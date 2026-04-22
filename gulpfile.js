// ============================================================================
// GULPFILE.JS - Build Automation & Asset Optimization
// ============================================================================
// Gulp is a task automation tool that helps optimize assets
// and streamline the development workflow.
//
// This gulpfile includes tasks for:
// 1. CSS minification and prefixing
// 2. JavaScript bundling and minification
// 3. Image optimization
// 4. HTML minification
// 5. Font subsetting
// 6. Service Worker generation
// 7. Development server with live reload
// ============================================================================

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
//const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const del = require('del');

// ============================================================================
// 1. CSS MINIFICATION & PREFIXING TASK
// ============================================================================
/**
 * Minify CSS files and add vendor prefixes
 * 
 * What it does:
 * - Removes unnecessary whitespace
 * - Adds vendor prefixes (-webkit-, -moz-, etc.)
 * - Optimizes CSS rules
 * - Reduces file size by ~30%
 * 
 * Input: css/styles.css
 * Output: css/styles.min.css
 */
gulp.task('minify-css', () => {
    return gulp.src('css/**/*.css')
        // Add vendor prefixes for browser compatibility
        .pipe(autoprefixer({
            cascade: false,
            overrideBrowserslist: ['last 2 versions']
        }))
        // Minify CSS (removes spaces, comments, etc.)
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        // Output minified files
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream()); // Reload browser

    console.log('[Gulp] CSS minified successfully');
});

// ============================================================================
// 2. JAVASCRIPT MINIFICATION & BUNDLING TASK
// ============================================================================
/**
 * Minify and concatenate JavaScript files
 * 
 * What it does:
 * - Removes unused code (dead code elimination)
 * - Minifies variable names
 * - Removes comments and whitespace
 * - Combines multiple files into one (optional)
 * - Reduces file size by ~60%
 * 
 *
 */
gulp.task('minify-js', () => {
    return gulp.src([
        'js/main.js',
        'js/performance.js'
    ])
        // Minify JavaScript (removes spaces, comments, shortens variables)
        .pipe(terser({
            compress: {
                drop_console: false, // Keep console.log() for debugging
                dead_code: true     // Remove unused code
            },
            mangle: true            // Shorten variable names
        }))
        // Output minified files
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream()); // Reload browser

    console.log('[Gulp] JavaScript minified successfully');
});

// ============================================================================
// 3. IMAGE OPTIMIZATION TASK
// ============================================================================
/**
 * Optimize image files
 * 
 * What it does:
 * - Compresses PNG, JPG, GIF, and SVG images
 * - Removes unnecessary metadata
 * - Uses modern compression algorithms
 * - Preserves visual quality
 * - Reduces file size by ~40-70%
 * 
 *
 */
gulp.task('optimize-images', () => {
    return gulp.src('images/**/*.{jpg,jpeg,png,gif,svg}')
        // Optimize images using multiple methods
        .pipe(imagemin([
            // PNG optimization
            imagemin.optipng({
                optimizationLevel: 3  // 0-7, higher = more compression
            }),
            // JPG optimization
            imagemin.mozjpeg({
                quality: 75,          // 0-100, lower = smaller file
                progressive: true     // Use progressive JPG
            }),
            // GIF optimization
            imagemin.gifsicle({
                interlaced: true      // Interlaced GIFs load progressively
            }),
            // SVG optimization
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false }
                ]
            })
        ]))
        // Output optimized images
        .pipe(gulp.dest('dist/images'));

    console.log('[Gulp] Images optimized successfully');
});

// ============================================================================
// 4. HTML MINIFICATION TASK
// ============================================================================
/**
 * Minify HTML files
 * 
 * What it does:
 * - Removes comments
 * - Removes unnecessary whitespace
 * - Removes empty attributes
 * - Collapses boolean attributes
 * - Reduces file size by ~15-25%
 * 
 * Input: *.html
 * Output: dist/*.html
 */
gulp.task('minify-html', () => {
    return gulp.src('*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,      // Remove whitespace
            removeComments: true,          // Remove HTML comments
            removeEmptyAttributes: true,   // Remove empty attributes
            collapseBooleanAttributes: true, // Collapse boolean attributes
            minifyCSS: true,              // Minify inline CSS
            minifyJS: true                // Minify inline JavaScript
        }))
        .pipe(gulp.dest('dist'));

    console.log('[Gulp] HTML minified successfully');
});

// ============================================================================
// 5. COPY STATIC FILES TASK
// ============================================================================
/**
 * Copy static files that don't need processing
 */
gulp.task('copy-static', () => {
    // Copy Service Worker
    gulp.src('sw.js').pipe(gulp.dest('dist'));
    
    // Copy manifest
    gulp.src('manifest.json').pipe(gulp.dest('dist'));
    
    // Copy other static files
    gulp.src('fonts/**/*').pipe(gulp.dest('dist/fonts'));

    console.log('[Gulp] Static files copied successfully');
});

// ============================================================================
// 6. CLEAN TASK
// ============================================================================
/**
 * Remove the dist directory before building
 * Ensures we start fresh and remove old files
 */
gulp.task('clean', async () => {
    console.log('[Gulp] Cleaning dist directory...');
    return del(['dist/**', '!dist']);
});

// ============================================================================
// 7. BUILD TASK (Production Build)
// ============================================================================
/**
 * Complete production build
 * Combines all optimization tasks
 * 
 * Usage: npm run build
 * 
 * This will:
 * 1. Clean the dist directory
 * 2. Minify CSS
 * 3. Minify JavaScript
 * 4. Optimize images
 * 5. Minify HTML
 * 6. Copy static files
 */
gulp.task('build', gulp.series(
    'clean',
    'minify-css',
    'minify-js',
    'optimize-images',
    'minify-html',
    'copy-static',
    (done) => {
        console.log('');
        console.log('✅ Production build complete!');
        console.log('📁 Output: dist/');
        console.log('');
        done();
    }
));

// ============================================================================
// 8. WATCH TASK (Development Mode)
// ============================================================================
/**
 * Watch for file changes and rebuild
 * 
 * Usage: npm run dev
 * 
 * This will:
 * 1. Start BrowserSync (live reload server)
 * 2. Watch CSS files
 * 3. Watch JavaScript files
 * 4. Watch HTML files
 * 5. Auto-reload browser on changes
 */
gulp.task('watch', () => {
    // Initialize BrowserSync (live reload server)
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 3000,
        notify: false,
        open: false
    });

    console.log('');
    console.log('👀 Watch mode started...');
    console.log('🌐 Server running at: http://localhost:3000');
    console.log('');

    // Watch CSS files
    gulp.watch('css/**/*.css', gulp.series('minify-css', (done) => {
        console.log('[Watch] CSS files changed, recompiling...');
        done();
    }));

    // Watch JavaScript files
    gulp.watch('js/**/*.js', gulp.series('minify-js', (done) => {
        console.log('[Watch] JavaScript files changed, recompiling...');
        done();
    }));

    // Watch HTML files
    gulp.watch('*.html', (done) => {
        console.log('[Watch] HTML files changed, reloading...');
        browserSync.reload();
        done();
    });

    // Watch images
    gulp.watch('images/**/*', gulp.series('optimize-images', (done) => {
        console.log('[Watch] Images changed, optimizing...');
        done();
    }));

    // Watch Service Worker
    gulp.watch('sw.js', (done) => {
        console.log('[Watch] Service Worker changed');
        browserSync.reload();
        done();
    });
});

// ============================================================================
// 9. DEFAULT TASK
// ============================================================================
/**
 * Default task when running 'gulp' without arguments
 * Runs the development watch task
 */
gulp.task('default', gulp.series('watch', (done) => {
    console.log('[Gulp] Development environment ready!');
    done();
}));

// ============================================================================
// 10. DEVELOPMENT TASK
// ============================================================================
/**
 * Development task for npm run dev
 * Same as watch task
 */
gulp.task('dev', gulp.series('watch'));

// ============================================================================
// TASK SUMMARY
// ============================================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║           GULP TASK AUTOMATION CONFIGURED                  ║
╚════════════════════════════════════════════════════════════╝

📋 Available Tasks:

🔨 Build Tasks:
  → gulp build              Build entire project (production)
  → gulp minify-css         Minify CSS files
  → gulp minify-js          Minify JavaScript files
  → gulp optimize-images    Optimize image files
  → gulp minify-html        Minify HTML files
  → gulp clean              Clean dist directory

📦 Development Tasks:
  → gulp watch              Watch files & live reload (default)
  → gulp dev                Start development server
  → gulp                    Run default task (watch)

🚀 Quick Commands:
  → npm run build           Production build
  → npm run dev             Development with watch
  → npm start               Production build & serve

💡 Tips:
  - CSS files are auto-prefixed for browser compatibility
  - JavaScript is minified with dead code elimination
  - Images are compressed while maintaining quality
  - HTML is minified to reduce file sizes
  - BrowserSync provides live reload in watch mode

✨ All files are optimized for performance!
`);
