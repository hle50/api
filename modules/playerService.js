/**
 * New node file
 */
exports.meta = function (model, response) {

    model.find().lean().exec(function (error, result) {
        if (error) {
            console.error(error);
            return null;
        }
        if (response !== null) {
        	var meta = [];
        	console.log(result.length);
        	for (var int = 0; int < result.length; int++) {
				var object = result[int];
				delete object['details'];
				delete object['history'];
				delete object['status'];
			}
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(result));
        }
        return JSON.stringify(result);
    });
};
exports.detail = function (model, response,id) {

    model.findById(id, function (error, result) {
        if (error) {
            console.error(error);
            return null;
        }
        if (response !== null) {
            console.log(JSON.stringify(result));
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(result));
        }
        return JSON.stringify(result);
    });
};
exports.create = function (model, requestBody, response) {
    var player = toPlayer(requestBody, model);
    var name = requestBody.meta.name;
    player.save(function (error) {
        if (!error) {
            player.save();
            response.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            response.end('Created');
        } else {
        	 response.writeHead(500, {
                 'Content-Type': 'text/plain'
             });
        	 response.end('error');
        }
    });
};
function toPlayer(body, Player) {
    return new Player({
        meta: body.meta,
        details: body.details,
        status: body.status,
        history: body.history
    });
};