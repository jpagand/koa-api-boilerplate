require('babel-core/register')()
require('babel-polyfill')
if (module.hot) {
    module.hot.accept()
}

var api = require('./api').default
var config = require('./config').default

// start server
api.listen(config.port, config.host, function () {
    console.log('Server started on ' + config.host + ':' + config.port)
})
