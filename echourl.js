 var http=require("http");
 http.createServer(function(request,response){
 	response.writeHead(200,{"Content-Type" : "text/plain"});
 	response.write("GET : "+request.url);
 	response.end();
 }).listen(9000);
 console.log("Listening on 9000");