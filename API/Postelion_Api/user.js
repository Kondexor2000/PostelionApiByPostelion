
module.exports=
{
    start(app,pool)
    {
        const module="user";

        app.get('/'+module+'/'+'get', async (req, res) => {
                let resp = await pool.query("select * from users where token = '"+req.query.token+"'");
                res.contentType('application/json');
                res.status(200).json(resp.rows[0]);
        });

        app.post('/'+module+'/'+'admin', async (req, res) => {
                let pass = await pool.query("select c.value_string  from config c where c.name = 'secret_code'");
                try{
                    if(pass.rows[0]['value_string']==req.body.password)
                    {
                        res.contentType('application/json');
                        res.status(200).json({status:'ok'});
                    }
                    else {
                        res.contentType('application/json');
                        res.status(403).json({status:'no auth'});
                    }
                }
                catch (e)
                {
                    res.contentType('application/json');
                    res.status(500).json({status:'error'}); 
                }
        });

        app.get('/'+module+'/'+'admin/access', async (req, res) => {
                let resp = await pool.query("select bool_get_admin_success('"+req.query.token+"') as result");
                res.contentType('application/json');
                res.status(200).json(resp.rows[0]);
        });
        app.get('/'+module+'/'+'admin/config', async (req, res) => {
            let resp = await pool.query("select * from config where (select bool_get_admin_success('"+req.query.token+"')) = true");
            res.contentType('application/json');
            res.status(200).json(resp.rows);
    });


    }
}