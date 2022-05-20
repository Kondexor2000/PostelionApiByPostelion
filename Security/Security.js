module.exports=
{
    async checkToken(pool,token,modules,success,error)
    {
        let tokens = await pool.query("select name,token from users ");
        for (let index = 0; index < tokens.rowCount; index++) {
            if(token==tokens.rows[index].token) 
            {
                success();
                return null;
            }
        }
        error();
    }
}