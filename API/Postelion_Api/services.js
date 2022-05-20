const Security= require('../../Security/Security');

module.exports=
{
    start(app,pool)
    {
        const module="services";

        app.get('/'+module+'/'+'get', async (req, res) => {
            Security.checkToken(pool,req.query.token? req.query.token:"",module,async ()=>{
                temp = await pool.query("select * from services");

                res.contentType('application/json');
                res.status(200).json(temp.rows);
        },()=>
        {
            res.contentType('application/json');
            res.status(403).json({status:'no auth'});
        });
        });
    }
}