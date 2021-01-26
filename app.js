var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
	console.log('get /');
});

app.get('/payload', function (req, res) {
    res.sendStatus(200);
	console.log('get /payload');
});

app.post('/payload', function (req, res) {
	//verify that the payload is a push from the correct repo
	//verify repository.name == 'wackcoon-device' or repository.full_name = 'DanielEgan/wackcoon-device'
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);

	console.log('pulling code from GitHub...');

	// reset any changes that have been made locally
	exec('fuser -k 19570/tcp && git -C /home/leo/GitHub-webhooks-integrations-example reset --hard && git -C /home/leo/GitHub-webhooks-integrations-example pull -f && chmod 744 /home/leo/GitHub-webhooks-integrations-example/mvnw && mvn -f /home/leo/GitHub-webhooks-integrations-example/pom.xml spring-boot:run', execCallback);
});

app.listen(19569, function () {
	console.log('listening on port 19569')
});
function execCallback(err, stdout, stderr) {
	if(stdout) console.log(stdout);
	if(stderr) console.log(stderr);
}
