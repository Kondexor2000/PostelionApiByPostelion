const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('/default',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'cv_read',res);
    if(credential)
    {

        const data =  await db('cv').select(db.raw('get_default_cv()'))
        const additionalData = await db('users').select('id').select('name').select('last_logged')
        .where('users.token',req.headers['authorization'].split(' ')[1]).catch(error=>{res.status(500);res.send("Error")});
        const result = JSON.parse(data[0].get_default_cv);
        result.push(additionalData);
        

        res.status(200);
        res.json(result);
    }
});


module.exports = router;