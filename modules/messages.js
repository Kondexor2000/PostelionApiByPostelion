const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('',async (req, res) => {
        const result =  await db('messages as m').select('m.id').select('s1.name as sender').select('s2.name as send_to').select('m.value').select('m.date')
        .select(db.raw("case when s2.token ='"+req.headers['authorization'].split(' ')[1]+"' then true else false end as received"))
            .leftJoin('users as s1','s1.id','m.sender_id')
            .leftJoin('users as s2','s2.id','m.send_to')
            .where('s2.token',req.headers['authorization'].split(' ')[1])
            .orWhere('s1.token',req.headers['authorization'].split(' ')[1]).orderBy('m.date');

        const addMeet = await db('messages_custom as mc').select('*')
            .leftJoin(db.raw('meets on meets.id =CAST(mc.custom_value as integer)'))
            .leftJoin('users as u','u.id','meets.user_id')
            .where('u.token',req.headers['authorization'].split(' ')[1])
            .andWhere('mc.custom_name','meet');

        result.map(function(e){
         for(let i =0;i<addMeet.length;i++)
         {
            if(addMeet[i].message_id==e.id)
            {
                e['meet_info'] = addMeet[i];
               return e;
            }
         }
        });

        

        res.status(200);
        res.json(result);



});

router.post('/send',async (req, res) => {
    try{
        if(req.body.value != undefined)
        {
            if(req.body.value.length>0)
            {
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
            else {res.status(500); res.send('message is empty')}
        }
        else {res.status(500); res.send('message is empty')}
    }
    catch (e){ console.log(e)}
    
});

router.post('/send/meet',async (req, res) => {
    try{
        const sender_id = await db('users').select('id').select('name').select('last_logged')
        .where('users.token',req.headers['authorization'].split(' ')[1]).catch(error=>{res.status(500);res.send("Error")});

        const result = await db.insert({
            sender_id:sender_id[0].id,
            value:'message_custom_meet',
            send_to:2
        })
        .into('messages').returning('*').catch(error=>{res.status(500);res.send('Error')})

        const result2 = await db.insert({
            user_id:sender_id[0].id,
            date:req.body.date,
            city:req.body.city,
            street:req.body.street,
            remarks:req.body.remarks
        })
        .into('meets').returning('*').catch(error=>{res.status(500);res.send('Error')})

        const connection = await db.insert({
            message_id:result[0].id,
            custom_name:'meet',
            custom_value: result2[0].id

        })
        .into('messages_custom').catch(error=>{res.status(500);res.send('Error')})

        res.status(200);
        res.send('success');
    }
    catch{}
    
});

module.exports = router;