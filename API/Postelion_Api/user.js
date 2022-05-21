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

        app.get('/'+module+'/'+'admin', async (req, res) => {
            Security.checkToken(pool,req.query.token? req.query.token:"",module,async ()=>{
                let pass = await pool.query("select c.value_string  from config c where c.name = 'secret_code'");
                if(pass.rows[0]['value_string']==req.query.password)
                {
                    let config = await pool.query("select * from config");
                    let cv = await pool.query("select * from cv");
                    let cv_data = await pool.query("select * from cv_data");
                    let cv_experience = await pool.query("select * from cv_experience");
                    let cv_languages = await pool.query("select * from cv_languages");
                    res.contentType('application/json');
                    res.status(200).json({data:'ok'});
                }
                else {
                    res.contentType('application/json');
                    res.status(403).json({status:'no auth'});
                }
            },()=>{
                res.contentType('application/json');
                res.status(403).json({status:'no auth'});
            });
        });
    }
}