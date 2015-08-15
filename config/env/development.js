'use strict';

module.exports = {
	db: {
		//uri: 'mongodb://localhost/mean-stg',
		//uri: 'mongodb://izz:popPOP12345@ds053312.mongolab.com:53312/fyphexa',
		mongodb:'//admin:poppop123@ds031893.mongolab.com:31893/hexastg',
		options: {
			user: '',
			pass: ''
		}
	},
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			//stream: 'access.log'
		}
	},
	app: {
		title: 'I-Wealth'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1464075907220309',
		clientSecret: process.env.FACEBOOK_SECRET || '2be347071da8cc9fcec4555e148d8354',
		callbackURL: '/auth/facebook/callback'
		//callbackURL: 'http://localhost:3000/oauth/facebook/callback'
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
