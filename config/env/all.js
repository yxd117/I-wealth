'use strict';

module.exports = {
	app: {
		title: 'I-Wealth',
		description: 'Your personal Wealth Management guru',
		keywords: 'wealth, management, financial, tool'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'MEAN',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null,
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/ngWYSIWYG/css/editor.css'	
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/n3-line-chart/build/line-chart.min.js',
				'public/lib/d3/d3.js',
				'public/lib/nvd3/nv.d3.js',
				'public/lib/angular-nvd3/dist/angular-nvd3.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/ng-file-upload-shim/ng-file-upload-shim.min.js',
				'public/lib/ng-file-upload-shim/ng-file-upload.min.js',
				'public/lib/angular-date-dropdowns/directive.js',
				'public/lib/Chart.js/Chart.min.js',
				'public/lib/angular-chart.js/dist/angular-chart.js',
				'public/lib/angular-toArrayFilter/toArrayFilter.js',
				'public/lib/angular-tooltips/src/js/angular-tooltips.js',
				'public/lib/angular-route/angular-route.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-socket-io/socket.js',
				'public/lib/ngWYSIWYG/js/wysiwyg.js',
				'public/lib/angular-pdf/dist/angular-pdf.min.js'
			]
		},
		css: [
			'public/css/style.css',
			'public/lib/angular-chart.js/dist/angular-chart.css',
			'public/lib/font-awesome/css/font-awesome.min.css',
			'public/lib/angular-tooltips/src/css/angular-tooltips.css',
			'public/lib/nvd3/nv.d3.css',
			'public/lib/ngWYSIWYG/css/editor.css'	
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
