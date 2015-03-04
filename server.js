var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
	
	switch (req.url) {
		case '/':		
			res.setHeader("Content-Type", "text/html");
			fs.createReadStream('index.html').pipe(res);
			break;
		case '/styles.css':
			res.setHeader("Content-Type", "text/css");
			fs.createReadStream('styles.css').pipe(res);	
			break;
        case '/reset.css':
            res.setHeader("Content-Type", "text/css");
            fs.createReadStream('styles.css').pipe(res);
            break;
		case '/scripts.js':
			res.setHeader("Content-Type", "application/javascript");
			fs.createReadStream('scripts.js').pipe(res);
            break;
        default:
            res.end();
	}
});

server.listen(3000, function(){
	console.log('Server listening om port ' + 3000);
});