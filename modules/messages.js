const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('',async (req, res) => {
        const result =  await db('messages as m').select('s1.name as sender').select('s2.name as send_to').select('m.value').select('m.date')
        .select(db.raw("case when s2.token ='"+req.headers['authorization'].split(' ')[1]+"' then true else false end as received"))
            .leftJoin('users as s1','s1.id','m.sender_id')
            .leftJoin('users as s2','s2.id','m.send_to')
            .where('s2.token',req.headers['authorization'].split(' ')[1])
            .orWhere('s1.token',req.headers['authorization'].split(' ')[1]).orderBy('m.date');

        

        res.status(200);
        res.json(result);



});

router.post('/send',async (req, res) => {
    try{
        const sender_id = await db('users').select('id').select('name').select('last_logged')
        .where('users.token',req.headers['authorization'].split(' ')[1]).catch(error=>{res.status(500);res.send("Error")});

        const result = await db.insert({
            sender_id:sender_id[0].id,
            value:req.body.value,
            send_to:2
        })
        .into('messages').catch(error=>{res.status(500);res.send('Error')})

        res.status(200);
        res.send('success');
    }
    catch{}
    
});

module.exports = router;