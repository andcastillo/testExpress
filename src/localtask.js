/**
 * Created by acastillo on 5/22/15.
 */

'use strict';

var onInit = function(parameters){

}

var execute = function(parameters){
    return parameters.host.name+"="+parameters.query
}

var catResponses = function(response1, response2){
    return response1+" "+response2;
}

exports.onInit = onInit;
exports.execute = execute;
exports.catResponses = catResponses;