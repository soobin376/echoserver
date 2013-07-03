var restify=require('restify');
function send(req,res,next){
	res.send('echo : '+req.params.name);
	return next();
}
var server=restify.createServer();
server.get('/echo/:name',send);
server.listen(9000,function(){
	console.log('%s start ', server.name);
});