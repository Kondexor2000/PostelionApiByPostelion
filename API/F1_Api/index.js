const Security= require('../../Security/Security');

module.exports=
{
    start(app,pool)
    {
        const module="cv";

        app.get('/'+module+'/'+'default', async (req, res) => {
            Security.checkToken(pool,req.query.token? req.query.token:"",module,async ()=>{


                
                res.contentType('application/json');
                res.status(200).json(resp);
        },()=>
        {
            res.contentType('application/json');
            res.status(403).json({status:'no auth'});
        });
        });
    }
}
