/* eslint-disable */
'use strict';

const loki = require('lokijs');
const testCase = require('mocha').describe;
const chalk = require('chalk');
const log = console.log;

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
/* eslint-disable new-cap */
let db = new loki('db.json');
chai.use(chaiHttp);

let tokens = '';
/*eslint indent: ["error", "tab"]*/
/*eslint max-len: ["error", { "code": 180 }]*/
/*global it:true*/
// /*eslint no-undef: it*/
// function to generate random usernames
function generateuserName(length) {
    let name = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < length; i++)
        name += possible.charAt(Math.floor(Math.random() * possible.length));

    return name;
}


// check if the server is up
testCase('GET', () => {
    it('it should check the server if its running', function(done) {
        chai.request('http://localhost:3000')
            .get('/')
            .end(function(err, res) {
                log(chalk.blue('Server is running'));
                log(chalk.green(JSON.stringify(res.body)));
                expect(res).to.have.status(200);
                done();// <= Call done to signal callback end
            });
    });
});


// create a user public api
testCase('POST', () => {
    it('create a user using public api', (done) => {
        chai.request('http://localhost:3000')
            .post('/users/register')
            .send({
                username: generateuserName(5),
                password: 'mesnty234',
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                done();
            })
            .catch(function(err) {
                throw err;
            });
    });
});


// authenticate user and get jwt token for future private api requests
testCase('POST', () => {
    it('get jwt token for future private api requests', (done) => {
        chai.request('http://localhost:3000')
            .post('/users/authenticate')
            .send({
                username: 'menty44',
                password: 'menty44',
            })
            .then(function(res) {
                // in-memory data store
                let children = db.addCollection('auth');
                children.insert({
                    token: res.body.data.token,
                });
                tokens = res.body.data.token;
                // console.log('fetch token', children.get(1));
                expect(res).to.have.status(200);
                done();
            })
            .catch(function(err) {
                throw err;
            });
    });
});

// do patching api using the generated token
testCase('POST', () => {
    it('it should return updated json using patch library', (done) => {
        // in-memory data fetch
        let children = db.addCollection('auth');
        let auth = children.get(1);
        chai.request('http://localhost:3000')
            .post('/api/patch')
            .set('x-access-token', auth.token)
            .send({
                title: 'menty', message: 'menty44',
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                // res.body.should.be.a('object');
                done();
            }).catch(function(err) {
            throw err;
        });
    });
});

// access the private api using the generated token
testCase('GET', () => {
    it('it should return registered profiles using private api signed with jwt', (done) => {
        try{
            // in-memory data fetch
            chai.request('http://localhost:3000')
                .get('/api/profiles')
                .set('x-access-token', tokens)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.should.be.json);
                    expect(res.body.should.be.a('array'));
                    res.body[0].should.have.property('_id');
                    done();
                });
        }catch (e) {
            console.log(level, e);
        }

    });
});

// do return success upon resizing the image to 50 by 50 dimension
testCase('POST', () => {
    it('it should return success upon resizing the image to 50 by 50 dimension', (done) => {
        // in-memory data fetch
        let children = db.addCollection('auth');
        let auth = children.get(1);
        chai.request('http://localhost:3000')
            .get('/api/thumbnail')
            .set('x-access-token', auth.token)
            .then(function(err,res) {
                log(chalk.blue(JSON.stringify(res)));
                expect(res).to.have.status(200);
                // res.body.should.be.a('object');
                // log();
                // log(chalk.blue('End of tests'));
                done();
            })
            // .catch(function(err) {
            //     throw err;
            // });

    });

});
