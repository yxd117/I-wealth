'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});
mongoose.connection.on('error', function(err) {
	console.error(chalk.red('MongoDB connection error: ' + err));
	process.exit(-1);
	}
);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

require('./config/notification')();

// Start the app by listening on <port>
app.listen(config.port);

// var server = require('http').Server(app);
// var io = require('socket.io')(server);

// server.listen(config.port);

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' , numNotification: 1});
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
//   socket.on('event1', function (data) {
//     console.log(data);
//   });
// });

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('--');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db.uri));
if (process.env.NODE_ENV === 'secure') {
	console.log(chalk.green('HTTPs:\t\t\t\ton'));
}
console.log('--');
