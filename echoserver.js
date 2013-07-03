function getPort() {
  var argv = process.argv;
  for (var i = 0; i < argv.length; i++) {
    if (argv[i] == '--port') {
      return parseInt(argv[i+1]);
    }
  }
  return 9000;
}

// From http://javascript.crockford.com/remedial.html
function typeOf(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (value instanceof Array) {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}

// Parse the response options from the request.
function getOptions(request) {

  // Helper function to see if a string starts with a given string.
  var startsWith = function(source, str) {
    return (source.match("^"+str) == str);
  };

  // Retrieves the HTTP status code from the request path.
  var getStatus = function(u) {
    var status = parseInt(u.pathname.substring(1));
    if (isNaN(status)) {
      status = 200;
    }
    return status;
  };


  var u = require('url').parse(request.url);
  var qs = require('querystring').parse(u.query);
  var options = {};

  if (qs.json) {
    options = JSON.parse(qs.json);
  }

  // If this is an array, all details must be in the array.
  if (typeOf(options) == 'array') {
    for (var i = 0; i < options.length; i++) {
      // Set certain defaults on each object.
      options[i].condition = getCondition(options[i].condition);
      options[i].statusCode = options[i].statusCode || getStatus(u);
    }
    return options;
  }

  // Load any options that are in the query string
  for (var name in qs) {
    if (!qs.hasOwnProperty(name) || name == 'json') {
      continue;
    }
    var headerValue = qs[name];
    var splitName = name.split('.');
    var part = options;
    for (var i = 0; i < splitName.length; i++) {
      var partName = splitName[i];
      if (i == splitName.length - 1) {
        // We're at the last element, set the value.
        part[partName] = headerValue;
      } else {
        if (!part[partName]) {
          part[partName] = {};
        }
        part = part[partName];
      }
    }
  }

  // Add the status code to the response.
  options.statusCode = getStatus(u);

  options.condition = getCondition(options.condition);

  return [options];
}

function getDefaultOptions() {
  return {'statusCode': 200};
}

function getHeadersAsString(headers) {
  var body = '';
  if (headers) {
    for (var name in headers) {
      if (!headers.hasOwnProperty(name)) {
        continue;
      }
      var val = headers[name];
      body += name + ': ' + val + '\r\n';
    }
  }
  return body;
}

function getBody(request, response, options) {
  var separator = '====================';
  var body = separator + '\r\nREQUEST\r\n\r\n';
  body += request.method + ' ' + request.url + '\r\n'+separator;
  body += getHeadersAsString(request.headers);

  return body;
}

function createResponse(request, response, options) {
  options.reasonPhrase = options.reasonPhrase || HTTP_STATUS_MESSAGES[options.statusCode];
  options.headers = options.headers || {};
  options.headers['Content-Type'] = options.headers['Content-Type'] || 'text/plain';
  options.headers['Cache-Control'] = options.headers['Cache-Control'] || 'no-cache';
  options.body = options.body || getBody(request, response, options);
  options.headers['Content-Length'] = options.body.length;
}

var port = getPort();


console.log('Server running at http://127.0.0.1:' + port + '/');
