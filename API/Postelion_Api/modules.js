const Security= require('../../Security/Security');

module.exports=
{
    start(app,pool)
    {
        const module="modules";

        app.get('/'+module+'/'+'get', async (req, res) => {
            Security.checkToken(pool,req.query.token? req.query.token:"",module,async ()=>{
                let temp = await pool.query("select m.*  from credentials c\
                left join user_credentials uc on uc.credential =c.id \
                left join users u on u.id = uc.user_id \
                left join modules m on c.submodule::integer = m.id \
                where c.module ='module' \
                and u.token ='"+req.query.token+"' and \
                uc.show=true");

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