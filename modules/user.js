const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('',async (req, res) => {

    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'users_read');
    if(credential)
    {
        const result = await db('users').select('id').select('name').select('last_logged');

        res.status(200);
        res.send(result);
    }
});
router.get('/current',async (req, res) => {

    const result = await db('users').select('id').select('name').select('last_logged')
        .where('users.token',req.headers['authorization'].split(' ')[1]);

    res.status(200);
    res.json(result);
    
});
router.get('/:userId',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'users_read');
    if(credential)
    {
        const result = await  db('users').select('id').select('name').select('last_logged')
            .where('users.id',req.params.userId)

        res.status(200);
        res.json(result)
    }
});


module.exports = router;