var server;

	server = (function () {

		var http, fs, server;

		http = require( 'http' );

		fs = require( 'fs' );

			server = http.createServer( function ( $req, $res ) {

				fs.readFile( 'echohtml.html', function ( $err, $data ) {

				$res.writeHead( 200, { 'Content-Type': 'text/html' } ); 

				$res.end( $data );
			});

		}).listen( process.env.C9_PORT, process.env.C9_IP );

		return server;

	})();

	(function ( $server ) {

	var io, socketio;

	socketio = require( 'socket.io' );

	io = socketio.listen( $server );

	io.set( 'log level', 2 );

		io.sockets.on( 'connection', function( $socket ) { 

			$socket.on( 'clientMsg', function( $data ) {

			var id;

			id = $socket.id;

			console.log( '클라이언트 %s님이 데이타를 보냈습니다. Data=', id, $data );

			io.sockets.emit( 'serverMsg', '[' + id + ']' + $data );

		});

	});

})( server );