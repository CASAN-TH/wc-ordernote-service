'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Ordernote = mongoose.model('Ordernote');

var credentials,
    token,
    mockup;

describe('Ordernote CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            author: "system",
            note: "Order ok!!!",
            customer_note: false,

        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Ordernote get use token', (done) => {
        request(app)
            .get('/api/ordernotes')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Ordernote get by id', function (done) {

        request(app)
            .post('/api/ordernotes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/ordernotes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.author, mockup.author);
                        assert.equal(resp.data.note, mockup.note);
                        assert.equal(resp.data.customer_note, mockup.customer_note);

                        done();
                    });
            });

    });

    it('should be Ordernote post use token', (done) => {
        request(app)
            .post('/api/ordernotes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.author, mockup.author);
                assert.equal(resp.data.note, mockup.note);
                assert.equal(resp.data.customer_note, mockup.customer_note);
                done();
            });
    });

    it('should be ordernote put use token', function (done) {

        request(app)
            .post('/api/ordernotes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    author: "system",
                    note: "Order ok!!!",
                    customer_note: true,
                }
                request(app)
                    .put('/api/ordernotes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.author, update.author);
                        assert.equal(resp.data.note, update.note);
                        assert.equal(resp.data.customer_note, update.customer_note);
                        done();
                    });
            });

    });

    it('should be ordernote delete use token', function (done) {

        request(app)
            .post('/api/ordernotes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/ordernotes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be ordernote get not use token', (done) => {
        request(app)
            .get('/api/ordernotes')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be ordernote post not use token', function (done) {

        request(app)
            .post('/api/ordernotes')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be ordernote put not use token', function (done) {

        request(app)
            .post('/api/ordernotes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    author: "author update",
                    note: "note update ",
                    customer_note: "customer_note update",
                }
                request(app)
                    .put('/api/ordernotes/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    
                    .end(done);
            });

    });

    it('should be ordernote delete not use token', function (done) {

        request(app)
            .post('/api/ordernotes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/ordernotes/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Ordernote.remove().exec(done);
    });

});