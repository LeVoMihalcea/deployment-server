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
	exec('pwd && git -C /home/leo/GitHub-webhooks-integrations-example reset --hard', execCallback);

	// and ditch any files that have been added locally too
	//exec('git -C ~/projects/wackcoon-device clean -df', execCallback);

	// now pull down the latest
	exec('pwd && git -C /home/leo/GitHub-webhooks-integrations-example pull -f', execCallback);
	
	// run
	exec('pwd && chmod 744 /home/leo/GitHub-webhooks-integrations-example/mvnw');
	exec('cd /home/leo/GitHub-webhooks-integrations-example');
	exec('pwd && ./mvnw spring-boot:run', execCallback);

});

app.listen(19569, function () {
	console.log('listening on port 19569')
});
function execCallback(err, stdout, stderr) {
	if(stdout) console.log(stdout);
	if(stderr) console.log(stderr);
}
