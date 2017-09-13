var fh = require("fh-mbaas-api");

module.exports = function (auth, spec) {

    return function protect (request, response, next) {
        console.log("Protect with spec:",spec);
        var params = {
        }
        if (spec != undefined) {
            if (spec.groups) {
                params.groups = spec.groups
            }
        }
        fh.service({
            "guid": auth.LDAPAuthProjId,
            "path": "/ldap/auth",
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
                console.log('response auth ok', body);
                if (service_res.statusCode == 200) {
                    return next();
                } else {
                    return response.status(service_res.statusCode).send(body);
                }
                
                
            }
        });
    }
};
