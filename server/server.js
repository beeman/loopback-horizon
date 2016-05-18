var loopback = require('loopback');
var boot = require('loopback-boot');
var horizon = require('@horizon/server');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    var loopbackServer = app.start();
    var horizonOptions = {
      auto_create_collection: true,
      auto_create_index: true,
      project_name: 'loopback',
      permissions: false, // waiting for additions to permission system atm
      auth: {
        allow_anonymous: true,
        allow_unauthenticated: true,
        token_secret: 'Tok3n53cr37',
      }
    }
    app.horizon = horizon(loopbackServer, horizonOptions);
  }

});
