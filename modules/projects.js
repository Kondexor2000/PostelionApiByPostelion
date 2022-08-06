const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'projects_read',res);
    if(credential)
    {
        const result =  await db('projects').select('*').orderBy('order');
        res.status(200);
        res.json(result);
    }
});


module.exports = router;