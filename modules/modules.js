const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();


router.get('',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'modules_read');

    if(credential)
    {
        const result = await db('modules').select('id').select('name').select('value').select('icon');

        res.status(200);
        res.json(result);
    }
});
router.get('/current',async (req, res) => {

    const result = await db('user_credentials').select('modules.id').select('modules.name').select('modules.value').select('modules.icon')
                .leftJoin('credentials','credentials.id','user_credentials.credentialID')
                .leftJoin('users','users.id','user_credentials.userId')
                .leftJoin(db.raw("modules on modules.id = credentials.submodule::integer"))
                .where('credentials.module','module').andWhere('users.token',req.headers['authorization'].split(' ')[1]?req.headers['authorization'].split(' ')[1]:'');
    res.status(200);
    res.json(result);
                
});


module.exports = router;