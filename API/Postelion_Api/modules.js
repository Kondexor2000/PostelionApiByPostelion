const config = require('../../Config/config');

module.exports=
{
    start(app,pool)
    {
        const module="modules";

        app.get('/'+module+'/'+'get', (req, res) => {
                pool.query("select m.*  from credentials c\
                left join user_credentials uc on uc.credential =c.id \
                left join users u on u.id = uc.user_id \
                left join modules m on c.submodule::integer = m.id \
                where c.module ='module' \
                and u.token ='"+req.query.token+"' and \
                uc.show=true",(err,response)=>{
                    res.contentType('application/json');
                    res.status(200).json(response.rows);
                });

          
        });

        app.get('/'+module+'/'+'admin', async (req, res) => {

                if(await GetModuleSpecificAccess(req.query.token,'/admin',pool))
                {
                    res.contentType('application/json');
                    res.status(200).json({status:'Auth'});  
                }
                else 
                {
                    res.contentType('application/json');
                    res.status(403).json({status:'no auth'}); 
                }
        });
    }
}

async function GetModuleSpecificAccess(token,value,pool)
{

    let temp = await pool.query("select case when (select uc.show  from user_credentials uc \
        left join credentials c on c.submodule::integer = uc.credential \
        left join users u on u.id  = uc.user_id \
        left join modules m on c.submodule::integer = m.id  \
        where c.module ='module' \
        and m.value  = '"+value+"'\
        and u.token ='"+token+"') is not null then 'Access'\
        else 'NoAuth'\
        end as result");
        if(temp.rows[0]['result']=='Access') return true;
        else return false;
}