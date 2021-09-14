const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
//import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'Adriana',
            email: 'adriana@gmail.com',
            password: 'cookies',

            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Bobby',
            email: 'bobby@gmail.com',
            password: 'banana',

            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '789',
            hash: '',
            email: 'adriana@gmail.com'
        }
    ]
}

app.get('/', (request, response) => {
    response.send(database.users);
})

app.post('/signin', (request, response) => {
    /* bcrypt.compare("banana", '$2a$10$q8HwY7.evx0Rtl6fSSgtO.PfSPU63E0zZEIpJc4KHIKmUt/tqxYUe', function (error, response) {
        console.log('first guess', response);
    });
    bcrypt.compare("password", '$2a$10$q8HwY7.evx0Rtl6fSSgtO.PfSPU63E0zZEIpJc4KHIKmUt/tqxYUe', function (error, response) {
        console.log('second guess', response);
    }); */
    if (request.body.email === database.users[0].email &&
        request.body.password === database.users[0].password) {
        response.json('success')
    } else {
        response.status(400).json('error logging in');
    }
})

app.post('/register', (request, response) => {
    const { email, name, password } = request.body;
    console.log(email, name, password)
    /*  bcrypt.hash(password, null, null, function (error, hash) {
         console.log(hash); */
    //});
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    response.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (request, response) => {
    const { id } = request.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return response.json(user);
        }
    })
    if (!found) {
        response.status(400).json('not found');
    }
})

app.post('/image', (request, response) => {
    const { id } = request.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return response.json(user.entries);
        }
    })
    if (!found) {
        response.status(400).json('not found');
    }
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

