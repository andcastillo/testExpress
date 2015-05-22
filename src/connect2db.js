'use strict';

var hds = require('hds');
var Entry = hds.Entry;
var servers = require('./mongo.json');

hds.init({
    database: servers[0]
}).then(search);

function search() {

    Entry.findOne('project', {
        name: 'diagnosisX'
    }).exec().then(function (exp) {

        if (exp) {
            return exp.getChildren({kind: 'entity'});
        }

    }).then(function (children) {

        console.log(children);
    });

}
