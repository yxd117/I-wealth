'use strict';

module.exports = {
	db: {
		//uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
		uri: 'mongodb://admin:poppop123@ds031893.mongolab.com:31893/hexastg',
		options: {
			user: '',
			pass: ''
		}
	},
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
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
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
				'public/lib/ngWYSIWYG/js/wysiwyg.js'
				
			]
		},
		css: [
			'public/dist/application.min.css',
			'https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic',
			'public/lib/angular-chart.js/dist/angular-chart.css',
			'public/lib/font-awesome/css/font-awesome.min.css',
			'public/lib/angular-tooltips/src/css/angular-tooltips.css',
			'public/lib/nvd3/nv.d3.css',
			'public/lib/ngWYSIWYG/css/editor.css'			
		],
		js: 'public/dist/application.min.js'
		// css: [
		// 	'public/css/style.css',
		// 	'public/lib/angular-chart.js/dist/angular-chart.css',
		// 	'public/lib/font-awesome/css/font-awesome.min.css',
		// 	'public/lib/angular-tooltips/src/css/angular-tooltips.css'
		// ],
		// js: [
		// 	'public/config.js',
		// 	'public/application.js',
		// 	'public/modules/*/*.js',
		// 	'public/modules/*/*[!tests]*/*.js'
		// ]
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1464075907220309',
		clientSecret: process.env.FACEBOOK_SECRET || '2be347071da8cc9fcec4555e148d8354',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '75kvrgrxscckmu',
		clientSecret: process.env.LINKEDIN_SECRET || 'PveCzY2Hu1bWvjoO',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'Team Hexa',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Mailgun',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'postmaster@sandboxdad2828e8f974d8d81e5c44e1e625e8b.mailgun.org',
				pass: process.env.MAILER_PASSWORD || 'f2272633e6dce022d863e5dc992fbc5a'
			}
		}
	}
};
