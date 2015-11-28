'use strict'

var request = require("supertest");
 var   app = require("../api.js").getApp;

describe('GET /',function(){
    it('expects HTTP response 200',function(done){
        request(app)
            .get('/')
            .expect(200,done);
    });
});