async function asyncCheckCredentials(token,knex,credentials,res)
{
    const result = await knex('user_credentials')
        .leftJoin('users','user_credentials.userId','=','users.id')
        .leftJoin('credentials','user_credentials.credentialID','=','credentials.id')
        .where('users.token',token.split(' ')[1])
        .andWhere('credentials.module',credentials)
        .count('credentials.module');
    if(result[0].count>0)
    {
        return true;
    }
    else
    {
        res.status(401);
        res.send('NoAuth');
    }
}

module.exports.asyncCheckCredentials = asyncCheckCredentials;