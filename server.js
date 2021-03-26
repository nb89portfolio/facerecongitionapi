const express = require('express');
const  bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const knex = require('knex');
const register = require('./controllers/register.js');
const Clarifai = require('clarifai');

app.use(express.json());
app.use(cors());

const dbServe = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '262560',
        database: 'facerec'
    }
});

const ApiCaller = new Clarifai.App({
    apiKey: '79d9196056e24c35a8bee192e245acf6'
});

//app.post('./register', (req, res) => {register.handleregister(req, res, dbServe, bcrypt)})
app.post('./register', register.handleRegister(dbServe, bcrypt))

app.post('/login', (req, res) => {
    dbServe.select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const check = bcrypt.compareSync(req.body.password, data[0].hash);

            if(check){
                return dbServe.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0]);
                }).catch(err => res.status(400).json("cannot find user"));
            } else {
                res.status(400).json("Could not sign in");
            }
        }).catch(err => res.status(400).json("Wrong credentials"));
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;

    dbServe.select('*').from('users').where('email', id).then(user => {
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(404).json('No User!');
        }   
    }).catch(err => {
        res.status(404).json('error geting user!');
    })
});

app.post('/url', (req, res) => {
    ApiCaller.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        req.body.input
    ).then(data => {
        res.json(data);
    }).catch(err => res.status(400).json("Api error"));
});

app.put('/image', (req, res) => {
    const {email} = req.body;

    dbServe('users')
    .where('email', '=', email)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    }).catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3001, () => {
    console.log('Port 3001: Working');
})