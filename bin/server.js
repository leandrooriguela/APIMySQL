const app = require('../src/app');
var config = require('./config.json');

app.listen(config.port, function () {
    console.log(`app listening on port ${config.port}`)
})
