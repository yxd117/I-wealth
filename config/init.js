'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
	chalk = require('chalk');

/**
 * Module init function.
 */
module.exports = function() {
	/**
	 * Before we begin, lets set the environment variable
	 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
	 */
	glob('./config/env/' + process.env.NODE_ENV + '.js', {
		sync: true
	}, function(err, environmentFiles) {
		if (!environmentFiles.length) {
			if (process.env.NODE_ENV) {
				console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
			} else {
				console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
			}

			process.env.NODE_ENV = 'development';
			process.env.AWS_ACCESS_KEY = 'AKIAJHM7JD2AHUEJYAVQ';
			process.env.AWS_SECRET_KEY = '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';
			process.env.S3_BUCKET = 'nodeup';
			//shiqi
			// process.env.AWS_ACCESS_KEY = 'AKIAJ3CE2YJZPPQSHZKQ';
			// process.env.AWS_SECRET_KEY = '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';
			// process.env.S3_BUCKET = 'hexapic';
		}
	});

};
