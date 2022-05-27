
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
                catch
                {
                    res.contentType('application/json');
                    res.status(500).json({status:'error'}); 
                }
        });

        app.get('/'+module+'/'+'get/admin/access', async (req, res) => {
                let resp = await pool.query("select case when al.time_to_use is null then 'Access' else \
                case when (select al.id  from admin_log al where al.logged + (al.time_to_use  ||' minutes')::interval >= now() and al.token = '"+req.query.token+"') is null then 'NoAuth'\
                else 'Auth' end \
                end as result from admin_log al where al.token = '"+req.query.token+"'");
                res.contentType('application/json');
                res.status(200).json(resp.rows[0]);
        });
    }
}