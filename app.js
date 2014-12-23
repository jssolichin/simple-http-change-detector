var http = require('http');
var fs = require('fs');
var nodemailer = require('nodemailer');
var lastKnownSize = 'response.txt'; //a local file which stores the size of the target, and is used to compare change/

var host = 'registrar.ucla.edu'; 
var path = '/schedule/detselect.aspx?termsel=15W&subareasel=PHYSICS&idxcrs=0006C+++';

//set up email sender
var transporter = nodemailer.createTransport({
    service: 'Gmail', //refer to nodemailer for available common email services (https://github.com/andris9/nodemailer-wellknown#supported-services)
    auth: {
        user: 'username@gmail.com',
        pass: 'password'
    }
});

//Send an email to notify of the page change
var sendOption = {
		from: 'username@gmail.com',
		to: '5555555555@tmomail.net', //to send to txt message, look for it's domain gateway (http://www.emailtextmessages.com/)
		subject: 'Change detected',
		text: host + path //provide a link so we can easily access the page that we are detecting from notification
	}

//change detection: ping header to get smallest size information (page size) as to limit disruption server.
//if file size not change, (probably) page has changed. If not, then page (probably) has not changed. 

//ping the header of the web page
var options = {method: 'HEAD', host: host, port: 80, path: path};
var req = http.request(options, function(res) {
	content = res.headers;

	//read the local file to compare results to
	fs.readFile(lastKnownSize, 'utf8', function read(err, data) {
	    if (err) throw err; 

	    //compare the content-length stored in the local file, with the one from the new header
	    if(parseFloat(data) !== parseFloat(content['content-length'])){
	    	
	    	//if it's not the same, write to the local file, the latest webpage size
		    fs.writeFile(lastKnownSize, content['content-length'], function (err) {
				if (err) throw err;
				
				//and send an email as per the options set
			    transporter.sendMail(sendOption, function (err, info){
					
					//kill the process once it's done
					req.end();
					process.exit();
			    });
			});
	    }
	    else {

	    	//page size hasn't changed. no change in webpage. kill the process. 
	    	req.end();
	    	process.exit(); 
	    }
	});   
});
