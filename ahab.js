let express = require('express');
let app = express();

let controller = require('./controller');

let routes = Object.keys(controller);

routes.forEach(route => {
    let routeConfig = controller[route];

    let httpMethod = typeof routeConfig.method==='string'?routeConfig.method.toLowerCase():'get';

    app[httpMethod](route, async (req, res) => {

       try {
           let response = await routeConfig.go(req.params, req.url);

           if (typeof response === 'string') {
               res.end(response)
           }
           else if (typeof response === 'object') {
               res.end(JSON.stringify(response, null, 3));
           }
           else {
               res.end('');
           }
       }
       catch(e) {
           res.statusCode = 500;
           res.end(JSON.stringify({
               code :500,
               error : e.message,
               stack : e.stack
           }, null, 3))
       }
   });
});

let port = process.env.PORT || 20000;

app.listen(port);

module.exports = {port};