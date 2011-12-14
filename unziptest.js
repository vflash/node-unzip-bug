'use strict';

var UNZIP_OFF = false;















var HTTP = require('http');
var HTTPS = require('http');
var parseURL = require('url').parse;
var zlib = require('zlib');





HTTP.globalAgent.maxSockets = 100;


function get(p) {
	if (!p || !p.src || typeof p.end !== 'function') {
		return;
	};

	_get({
		time: p.time||+new Date(),
		src: p.src,
		url: p.src,
		redirect: 0,
		error: p.error,
		end: p.end,
		step: 1,
		http_lastModified: p.httpLastModified || null,
		http_etag: p.httpEtag || null
	});
};

function _get_request(p) {
	//console.log(' -- get_request -- '+p.src)

	var src = parseURL(p.src), x;

	if (!src.host || !src.protocol) {
		x = p.src_object;
		if (!x) {
			(p.error)('invalid url', src);
			return false;
		};

		if (!src.host) src.host = x.host;
		if (!src.port) src.port = x.port;
		if (!src.protocol) src.protocol = x.protocol;
	};


	p.src_object = src;

	var headers = {
		//'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
		'Accept': 'application/rss+xml;q=1,application/atom+xml;q=1,application/xml;q=0.7,text/xml;q=0.6,text/html;q=0.2',
		'Accept-Encoding': 'gzip, deflate',
		'User-Agent': 'nodejs bot', //'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:8.0) Gecko/20100101 Firefox/8.0',
		'Host': src.host
	};

	if (p.http_etag) {
		headers['If-None-Match'] = p.http_etag;
	};

	if (p.http_lastModified) {
		headers['If-Modified-Since'] = p.http_lastModified;
	};

	var query = {
		method:'GET',
		headers: headers,

		host: src.host,
		port: src.port, 
		path: src.path
	};
	
	var request = src.protocol === 'https:' ? HTTPS.request(query) : HTTP.request(query);

	if (request) {
		request.agent.maxSockets = 24;
	} else {
		(p.error)('request null', src);
		request = false;
	};

	return request;
};

function _resp_headers(p, headers) {
	if (!headers['content-type']) { // error
		(p.error)('content-type');
		return false;
	};


	var u, v
	, m = (headers['content-type']||'').split(';')
	, i = m.length
	;

	p.httpEtag = headers['etag'] || null;
	p.httpLastModified = headers['last-modified'] || null;
	p.httpExpires = headers['expires'] || null;
	
	
	switch(v = headers['content-encoding']) {
		case 'deflate': p.zip = 'deflate'; break;
		case'gzip': p.zip = 'gzip'; break;
		default: 
			if (v) {
				(p.error)('content-encoding', v);
				return false;
			};
			p.zip = false;
			
	};


	p.type = null;
	p.charset = null;


	while(i--) {
		v = m[i].trim();

		switch(v) {
			case 'application/rss+xml':
				p.type = 'rss';
				continue;

			case 'application/atom+xml':
				p.type = 'atom';
				continue;

			case 'text/xml':
			case 'application/xml':
				p.type = 'xml';
				continue;

			case 'text/html':
				p.type = 'html';
				continue;
			
			case 'charset=UTF-8':
			case 'charset=utf-8':
			case 'charset=utf8':
				p.charset = 'utf-8';
				continue;

			case 'charset=windows-1251':
				p.charset = 'windows-1251';
				continue;
		};

		if (v.indexOf('charset=') === 0) {
			p.charset = v.substr(8, 30).toLocaleString();
			continue;
		};
	};
	
};

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

function _get(p) {
	var request = _get_request(p);
	var is_complite = false;

	if (request === false) {
		is_complite = true;
		return;
	};
	
	
	

	request.on('error', function(e) {
		if (is_complite) return;
		is_complite = true;


		(p.error)('connect', e);
	});


	request.on('response', function(response) {
		if (is_complite) return;

		if (_resp_headers(p, response.headers) === false) {
			is_complite = true;
			return;
		};

		var u, x, body = [];
		

		response.on('data', function(chunk) {
			if (is_complite) return;
			body.push(chunk);
		});

		response.on('end', function() {
			if (is_complite) return;
			is_complite = true;


			if (p.zip && !UNZIP_OFF) {
				zlib.unzip(BufferJoin(body), function(error, buffer) {
					if (error) {
						(p.error)('unzip');
					} else {
						;(p.end)(false);
					};
				});

			} else {
				body = BufferJoin(body);
				;(p.end)(false);
			};

			body = request = null;
		}); 

		
	});

	request.end();
};










new function(){

	var list = [
		//, 'http://blog.chromium.org/feeds/posts/default'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
		, 'http://www.burdafashion.com/ru/rss'
	];
	
	// http://3dnews.feedsportal.com/c/32330/f/441322/index.rss



	var works = 0;

	function end() {
		if (--works || works<0) return;
		console.log('*********************************');
		if (typeof gc == 'function') gc();
	};


	setInterval(function() {
		if (works > 0) return;

		var i = list.length;
		works = i - 1;
		

		while(i--) if (list[i]) next(list[i]);
	}, 50)



	var pasteTime = +new Date();
	
	function next(src) {
		get({
			src: src,

			error: function(msg) {
				console.log('-- error load -- ' + src);
				end();
			},

			end: function(e) {
				console.log('-- end load -- ' + src);
				end();
			}
		}) 
	};
};
