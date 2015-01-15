'use strict';
var should = require('should');
var request = require('supertest');

module.exports = function(options){
  describe('resources actions', function(){
    var baseUrl, ids;
    beforeEach(function(){
      baseUrl = options.baseUrl;
      ids = options.ids;
    });
    it('should be able to define custom action on resource', function(done){
      request(baseUrl).post('/people/' + ids.people[0] + '/reset-password')
        .set('content-type', 'application/json')
        .send(JSON.stringify({}))
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          res.text.should.equal('ok');
          done();
        });
    });
    it('should run custom action when receives action url request matching specified method', function(done){
      request(baseUrl).post('/people/' + ids.people[0] + '/reset-password')
        .set('content-type', 'application/json')
        .send(JSON.stringify({password: 'new password'}))
        .expect(200)
        .expect('reset-password', 'new password')
        .end(function(err, res){
          should.not.exist(err);
          res.text.should.equal('ok');
          done();
        });
    });
    it('should provide custom action with resolved resource', function(done){
      request(baseUrl).post('/people/' + ids.people[0] + '/reset-password')
        .set('content-type', 'application/json')
        .send(JSON.stringify({password: 'new password'}))
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          res.text.should.equal('ok');
          res.headers['reset-password-resource'].should.equal(ids.people[0]);
          done();
        });
    });
    it('should run regular hooks for accessed resource', function(done){
      request(baseUrl).post('/people/' + ids.people[0] + '/reset-password')
        .set('content-type', 'application/json')
        .send(JSON.stringify({password: 'new password'}))
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          res.text.should.equal('ok');
          //Nickname is generated dynamically by before and after hooks
          res.headers['reset-password-nickname'].should.equal('Super Dilbert!');
          done();
        });
    });
    it('should provide means of configuration through configurable function', function(done){
      request(baseUrl).post('/people/' + ids.people[0] + '/reset-password')
        .set('content-type', 'application/json')
        .send(JSON.stringify({password: 'new password'}))
        .expect(200)
        .expect('reset-password-conf', 'set from init function')
        .end(function(err, res){
          should.not.exist(err);
          res.text.should.equal('ok');
          res.headers['reset-password-nickname'].should.equal('Super Dilbert!');
          done();
        });
    });
  });
};