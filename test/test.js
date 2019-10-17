const mongoose = require('mongoose');
const loki = require('lokijs');
const testCase = require('mocha').describe;
const pre = require('mocha').before;
const assertions = require('mocha').it;
const assert = require('assert');
const chalk = require('chalk');
const log = console.log;

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const done = chai.done;
const expect = chai.expect;
let db = new loki('db.json');
chai.use(chaiHttp);

//function to generate random usernames
function generateuserName(length) {
    let name = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < length; i++)
        name += possible.charAt(Math.floor(Math.random() * possible.length));

    return name;
}

//check if the server is up
testCase('GET', ()=> {
    it('it should check the server if its running', function(done) {
        chai.request('http://localhost:3000')
            .get('/')
            .end((err, res)=> {
                // const logger = createLogger('FeatureName');
                // Combine styled and normal strings
                log(chalk.blue('Server is running'));
                res.should.have.status(200);
                done();
            });
    })
});



//create a user public api
testCase('POST', () => {
    it('create a user using public api', (done) => {
        chai.request('http://localhost:3000')
            .post('/users/register')
            .send({username: generateuserName(5), password: 'mesnty234'})
            .then(function (res) {
                expect(res).to.have.status(200);
                done();
            })
            .catch(function (err) {
                throw err;
            });
    })
});


//authenticate user and get jwt token for future private api requests
testCase('POST', ()=> {
    it('get jwt token for future private api requests', (done)=> {
        chai.request('http://localhost:3000')
            .post('/users/authenticate')
            .send({ username: 'menty', password: 'menty44' })
            .then(function (res) {
                //in-memory data store
                let children = db.addCollection('auth');
                children.insert({token: res.body.data.token});
                // console.log('fetch token', children.get(1));
                expect(res).to.have.status(200);
                done();
            })
            .catch(function (err) {
                throw err;
            });
    })
});

//access the private api using the generated token
testCase('GET', ()=> {
    it('it should return registered profiles using private api signed with jwt', (done)=> {
        //in-memory data fetch
        let children = db.addCollection('auth');
        let auth = children.get(1);
        chai.request('http://localhost:3000')
            .get('/api/profiles')
            .set('Authorization', auth.token)
            .end((err, res)=> {
                // console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    })
    });

//do patching api using the generated token
testCase('POST', ()=> {
    it('it should return updated json using patch library', (done)=> {
        //in-memory data fetch
        let children = db.addCollection('auth');
        let auth = children.get(1);
        chai.request('http://localhost:3000')
            .post('/api/patch')
            .set('Authorization', auth.token)
            .send({ title: 'menty', message: 'menty44' })
            .then(function (res) {
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                done();
            })
            .catch(function (err) {
                throw err;
            });
    })
});



