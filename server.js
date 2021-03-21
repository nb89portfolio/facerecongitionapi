const express = require('express');
const  bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = {
    users: [
        {
            id: "1",
            username: "john1234",
            email: "fake1@email.com",
            password: "Password1!",
            entries: 10,
            joined: new Date()
        },
        {
            id: "2",
            username: "jane1234",
            email: "fake2@email.com",
            password: "password1",
            entries: 0,
            joined: new Date()
        }
    ]
};

app.get('/', (req, res) => {
    res.send('Index: Working');
});


app.post('/register', (req, res) => {
    const {email, username, password} = req.body;

    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(password, salt);

    let found = false;

    db.users.forEach(user => {
        if(user.username === username || user.email === email){
            found = true;
            return res.status(400).json('Authentication: Failed.');
        }
    })

    if(found === false){
        db.users.push({
            id: db.users.length + 1,
            username: username,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        });

        return res.json({username: username, email: email});
    }
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    let found = false;

    db.users.forEach(user => {
        if(user.email === email && user.password === password){
            found = !found;
            return res.json(user);
        }
    })

    if(!found){
        res.status(400).json('Authentication: Failed.');
    }
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;

    let found = false;

    db.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
        
    if(!found){
        res.status(404).json('No User!');
    }
});

app.put('/image', (req, res) => {
    const {id} = req.body;

    let found = false;

    db.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
        
    if(!found){
        res.status(404).json('No User!');
    }
});


bcrypt.hash

app.listen(3001, () => {
    console.log('Port 3000: Working');
})


/*
req + spec:
1.  root
2.  sign in
    post = pass/fail
3.  register
    post = user data
4.  profile/:userId
    get = user data
5.  image
    put = user data
*/