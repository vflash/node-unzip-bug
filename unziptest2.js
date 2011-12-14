﻿'use strict';

var UNZIP_OFF = false;





//'http://www.burdafashion.com/ru/rss'

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
			test(arr)
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

	return buff;
};

function nulfunc(error, buffer){};

function test(arr) {
	var zlib = require('zlib');
	
	setInterval(function() {
		if (UNZIP_OFF) {
			BufferJoin(arr);
		} else {
			zlib.unzip(BufferJoin(arr), nulfunc);
		};

		if (typeof gc == 'function') gc();
	}, 20)

	setInterval(function() {
		console.log(process.memoryUsage());
	}, 400);

};

