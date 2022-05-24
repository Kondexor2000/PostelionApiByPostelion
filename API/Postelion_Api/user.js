const Security= require('../../Security/Security');

module.exports=
{
    start(app,pool)
    {
        const module="user";

        app.get('/'+module+'/'+'get', async (req, res) => {
            Security.checkToken(pool,req.query.token? req.query.token:"",module,async ()=>{
                let resp = await pool.query("select * from users where token = '"+req.query.token+"'");
                res.contentType('application/json');
                res.status(200).json(resp.rows[0]);
            },()=>{
                res.contentType('application/json');
                res.status(403).json({status:'no auth'});
            });
        });

        app.post('/'+module+'/'+'admin', async (req, res) => {
            Security.checkToken(pool,req.body.token? req.body.token:"",module,async ()=>{
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
            },()=>{
                res.contentType('application/json');
                res.status(403).json({status:'no auth'});
            });
        });
    }
}