const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')


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

app.post('/signin', (request, response) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', request.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(request.body.password, data[0].hash);
            console.log(isValid);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', request.body.email)
                    .then(user => {
                        console.log(user);
                        response.json(user[0])
                    })
                    .catch(error => response.status(400).json('unable to get user'))
            } else {
                response.satus(400).json('wrong credentials')
            }
        })
        .catch(error => response.status(400).json('wrong credentials'))
})

app.post('/register', (request, response) => {
    const { email, name, password } = request.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        response.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(error => response.status(400).json('unable to register'))

})

app.get('/profile/:id', (request, response) => {
    const { id } = request.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                response.json(user[0])
            } else {
                response.status(400).json('Not found')
            }

        })
        .catch(error => response.status(400).json('error getting user'))
    /*  if (!found) {
         response.status(400).json('not found');
     } */
})

app.put('/image', (request, response) => {
    const { id } = request.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            response.json(entries[0]);
        })
        .catch(error => response.status(400).json('Unable to get entries'))
})



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

