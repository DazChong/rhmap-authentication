var fh = require("fh-mbaas-api");

module.exports = function (auth, spec) {

    return function protect (request, response, next) {
        var params = {
        }
        if (spec != undefined) {
            if (spec.groups) {
                params.groups = spec.groups
            }
        }
        fh.service({
            "guid": auth.AuthProjId,
            "path": "/session/valid",
            "method": "POST",
            "params": params,
            "headers": {
                'Authorization': request.headers.authorization
            }
        }, function(err, body, service_res) {
            if (err) {
                // An error occurred
                console.log('Service call failed: ', err);
                return err;
            } else {
                if (service_res.statusCode == 200) {
                    var authorization = service_res.headers.authorization;
                    if (authorization != undefined) {
                        request.headers.authorization = authorization;
                    }
                    return next();
                } else {
                    return response.status(service_res.statusCode).send(body);
                }  
            }
        });
    }
};
