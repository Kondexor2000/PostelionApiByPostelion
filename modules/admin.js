const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('',async (req, res) => {
    const credential = await security.asyncCheckAdmin(req.headers['authorization'],db,res);
    if(credential)
    {
        // const result =  await db('projects').select('*').orderBy('order');
        res.status(200);
        res.send('qwe');
    }
});


module.exports = router;