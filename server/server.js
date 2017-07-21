let app = require('./app');
let server = app.listen(config.server.port, () => {
  console.log(`Server listening on ${server.address().address} @ ${server.address().port}`);
});
