const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('/get',async (req, res) => {
        const result = await db('meets').select('date').select('city').select('street').select('remarks').select('confirm_status').select('client_decline')
        .leftJoin('users','users.id','meets.user_id')
        .where('users.token',req.headers['authorization'].split(' ')[1]).catch(error=>{res.status(500);res.send('error')});
        res.status(200);
        res.json(result);
});

router.get('/decline',async (req, res) => {
    const result = await db('meets').select('date').select('city').select('street').select('remarks').select('confirm_status').select('client_decline')
    .leftJoin('users','users.id','meets.user_id')
    .where('users.token',req.headers['authorization'].split(' ')[1]).catch(error=>{res.status(500);res.send('error')});
    res.status(200);
    res.json(result);
});


module.exports = router;