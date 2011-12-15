// node --expose-gc unziptest.js

'use strict';

var query = {
	method:'GET',
	headers: {
		'Accept': 'application/rss+xml;q=1,application/atom+xml;q=1,application/xml;q=0.7,text/xml;q=0.6,text/html;q=0.2',
		'Accept-Encoding': 'gzip, deflate',
		'User-Agent': 'nodejs bot', //'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:8.0) Gecko/20100101 Firefox/8.0',
		'Host': 'www.burdafashion.com'
	},

	host: 'www.burdafashion.com',
	port: 80, 
	path: '/ru/rss'
};

var request = require('http').request(query);

request.on('response', function(response) {
		var arr = [];
		response.on('data', function(chunk) {
			arr.push(chunk);
		});

		response.on('end', function() {
			buff = BufferJoin(arr);
		}); 
});

request.end();

function BufferJoin(m) {
	var i = 0, l = m.length, size=0, p = 0;

	for (i = 0; i<l; i++) {
		size += m[i].length;
	};
	
	var buff = new Buffer(size);
	
	for (i = 0; i<l; i++) {
		m[i].copy(buff, p);
		p += m[i].length;
	};
	m.length = 0;

	return buff;
};


var buff = null;
var zlib = require('zlib');
var timmer = false;
var tm = +new Date();

var zzz = [];

function nulfunc(error, buffer){};

function test() {
	timmer = false;

	zlib.unzip(buff, nulfunc); // text unzip
	//zzz.push(BufferJoin([buff])); // intentional leak
	//var x = BufferJoin([buff]); // normal code
};


setInterval(function() {
	if (!buff || timmer) return;
	console.log(process.memoryUsage());

	

	var x = +new Date();
	if ((x-tm) > 5000) {
		tm = x;

		console.log('********* pause 2sec *********');
		if (typeof gc == 'function') gc();

		timmer = !!setTimeout(test, 2000);
		
	} else {
		timmer = !!setTimeout(test, 10); 
		
	};
}, 10)





