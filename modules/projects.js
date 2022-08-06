const security = require('./security');
const express = require('express');
const {db} = require('../index');
router = express.Router();

router.get('',async (req, res) => {
    const credential = await security.asyncCheckCredentials(req.headers['authorization'],db,'projects_read',res);
    if(credential)
    {
        const result =[];
        const projects =  await db('projects').select('*');


        for(let i=0;i<projects.length;i++)
        {
            result.push(projects[i]);
            result[i].additionalData =  await db('projects_additional_data').select('name').select('value').where('id_project',projects[i].id);
        }
        res.status(200);
        res.json(result);
    }
});


module.exports = router;