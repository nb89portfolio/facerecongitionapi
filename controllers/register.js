const handleRegister = (dbServe, bcrypt) => (req, res) => {
    const {email, username, password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    //let found = false;
    /*
    db.users.forEach(user => {
        if(user.username === username || user.email === email){
            found = true;
            return res.status(400).json('Authentication: Failed.');
        }
    })
    */
    dbServe.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: username,
                email: loginEmail[0],
                joined: new Date() 
            }).then(user => {
                res.json(user[0]);
            })
        }).then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json('cannot rgister'));
}

module.exports = {
    handleRegister: handleRegister
};