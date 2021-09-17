const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        /*  port: 3306, */
        user: 'postgres',
        password: '15109',
        database: 'smart-brain'
    }
});

/* db.select('*').from('users').then(data => {

}); */

const app = express();
app.use(bodyParser.json());
app.use(cors())


/* app.get('/', (request, response) => {
    response.send(database.users);
}) */

app.post('/signin', (request, response) => { signin.handleSignin(request, response, db, bcrypt) })
app.post('/register', (request, response) => { register.handleRegister(request, response, db, bcrypt) })
app.get('/profile/:id', (request, response) => { profile.handleProfileGet(request, response, db) })
app.put('/image', (request, response) => { image.handleImage(request, response, db) })
app.post('/imageurl', (request, response) => { image.handleApiCall(request, response) })




// bcrypt.compare("password", hash, function (error, response) { });

// bcrypt.compare("password", hash, function (error, response) { });



app.listen(3030, () => {
    console.log('app is running');
})

/*
/--> res =this is working
/signin ==> POST =succes/fail
/register --> POST= user
/profile/:userId --> GET= user
/image --> PUT --> user
*/

