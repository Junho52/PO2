const logger      = require('morgan'),
    cors          = require('cors'), 
    http          = require('http'),  
    express       = require('express'),
    errorhandler  = require('errorhandler'),
    dotenv        = require('dotenv'), 
    bodyParser    = require('body-parser');
    connect       = require('./mongoose.js')

const app = express();

connect();

dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use(function(err, req, res, next) { 
  if (err.name === 'StatusError') {    
    res.send(err.status, err.message); 
  } else {
    next(err); //?
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));                    
  app.use(errorhandler())                   
}

app.use(require('./routers/protected-routes'));  
app.use(require('./routers/createuser-routes'));
app.use(require('./routers/page-routes'));

const port = process.env.PORT || 3002;  

http.createServer(app).listen(port, function (err) { 
  console.log('listening in http://localhost:' + port);
});