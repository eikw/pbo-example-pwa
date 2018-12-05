import * as restify from 'restify';
import * as dvb from 'dvbjs';

async function searchStation(req, res: restify.Response, next) {
  try {
    const stations = await dvb.findStop(req.params.query);
    
    if (stations) {
      res.send(stations);
    } 
  } catch (err) {
    console.log(err);
    res.send(500,'Server error');
  }
  next();
}

async function getPlanFor(req: restify.Request, res: restify.Response, next: restify.Next) {
  
  try {
    const plan = await dvb.monitor(req.params.id, 0, 10);
    
    if (plan) {
      res.send(plan);
    } 
  } catch (err) {
    console.log(err);
    res.send(500,'Server error');
  }
  next();
}

var server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// routes

// dvb-routes
server.get('/search/:query', searchStation);
server.get('/plan/:id', getPlanFor);
// static content
server.get('/*', restify.plugins.serveStatic({
  directory: './public',
  default: 'index.html'
}))

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});