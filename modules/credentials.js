const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('',async (req, res) => {

    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'credentials_read');
    if(credential)
    {
        const result = await db('credentials').select('id').select('module').select('submodule').select('description');

        res.status(200);
        res.json(result);
    }
});
router.get('/:credentialId',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'credentials_read');
    if(credential)
    {
        const result = await db('credentials').select('id').select('module').select('submodule').select('description')
            .where('credentials.id',req.params.credentialId);

        res.status(200);
        res.json(result);
    }

});
router.post('',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'credentials_write');
    if(credential)
    {
        const result = await db.insert({
            module:req.body.module,
            submodule:req.body.submodule,
            description:req.body.description
        })
        .into('credentials')

        res.status(200);
        res.send('Success');
    }
});
router.post('/remove/:credentialId',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'credentials_write');
    if(credential)
    {
        const result = await db('credentials').where('credentials.id',req.params.credentialId).del()
            .where('credentials.id',req.params.credentialId);

        res.status(200);
        res.json(result);
    }
});


module.exports = router;