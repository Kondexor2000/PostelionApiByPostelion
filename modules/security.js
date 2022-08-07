async function asyncCheckCredentials(token,knex,credentials,res)
{
    const result = await knex('user_credentials')
        .leftJoin('users','user_credentials.userId','=','users.id')
        .leftJoin('credentials','user_credentials.credentialID','=','credentials.id')
        .where('users.token',token.split(' ')[1])
        .andWhere('credentials.module',credentials)
        .count('credentials.module')
        .catch(error=>{});
        try{
            if(result[0].count>0)
            {
                return true;
            }
            else
            {
                res.status(401);
                res.send('NoAuth');
                return false;
            }
        }
        catch{
            res.status(500);
            res.send('Error');
            return false;
        }
}


async function asyncCheckIsAdmin(token,knex,res)
{
    const result = await knex('users')
        .leftJoin('config','users.id','=','config.value_int')
        .where('config.name','admin')
        .andWhere('users.token',token.split(' ')[1])
        .count('users.*')
        .catch(error=>{console.log(error)});
        try{
            if(result[0].count>0)
            {
                return true;
            }
            else
            {
                res.status(401);
                res.send('NoAuth');
                return false;
            }
        }
        catch (e){
            res.status(500);
            res.send(e.message);
            return false;
        }
}

module.exports.asyncCheckCredentials = asyncCheckCredentials;
module.exports.asyncCheckAdmin = asyncCheckIsAdmin;