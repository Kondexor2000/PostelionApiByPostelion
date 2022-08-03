function checkCredentials(token,knex,credentials,res,success)
{
    try{
        knex('user_credentials')
        .leftJoin('users','user_credentials.userId','=','users.id')
        .leftJoin('credentials','user_credentials.credentialID','=','credentials.id')
        .where('users.token',token)
        .andWhere('credentials.module',credentials)
        .count('credentials.module')
        .then((data)=>{
            if(data[0].count>0)
            {
                success();
            }
            else 
            {
                res.status(401);
                res.send('NoAuth');
            }

        });
    }
    catch{
        res.status(500);
        res.send('Error');
    }
}

module.exports.checkCredentials = checkCredentials;