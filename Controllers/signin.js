
const handleSignin = (request, response, db, bcrypt) => {
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
}

module.exports = {
    handleSignin: handleSignin
}