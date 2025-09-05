const security = require('./security');
const express = require('express');
const {db} = require('../index');
const e = require('express');
router = express.Router();

router.get('',async (req, res) => {

    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'users_read',res);
    if(credential)
    {
        const result = await db('users').select('id').select('name').select('last_logged').catch(error=>{res.status(500);res.send("Error")});

        res.status(200);
        res.send(result);
    }
});
router.get('/current',async (req, res) => {

    const result = await db('users').select('id').select('name').select('last_logged')
        .where('users.token',await security.getCookie(req)).catch(error=>{res.status(500);res.send("Error")});

    res.status(200);
    res.json(result);
    
});
router.get('/login',async (req,res)=>{
    const result = await db('users').select('*')
    .where('users.token',await security.getCookie(req)).catch(error=>{res.status(500);res.send(error)});
    if(result.length>0)
    {
        res.status(200);
        res.send("token_ok");
    }
    else
    {
        res.status(401);
        res.send("token_bad");
    }
});
router.get('/:userId',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'users_read',res);
    if(credential)
    {
        const result = await  db('users').select('id').select('name').select('last_logged')
            .where('users.id',req.params.userId).catch(error=>{res.status(500);res.send("Error")});

        res.status(200);
        res.json(result);
    }
});

router.post('/current',async (req,res)=>{

    if(req.body.name !=null)
    {
        if(req.body.name.trim().length >0)
        {
            const result = await db('users')
            .where({ token: req.headers['authorization'].split(' ')[1] })
            .update({name: req.body.name, thisKeyIsSkipped: undefined})
            .catch(error=>{res.status(500);res.send("Error")});

            res.status(200);
            res.send("Success");
        }
        else 
        {
            res.status(500);
            res.send("No data: name");
        }
    }
    else 
    {
        res.status(500);
        res.send("No data: name");
    }
});


module.exports = router;