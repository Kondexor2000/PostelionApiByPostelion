const security = require('./security');

function startApi(app,knex,module)
{
    initGet(app,knex,module);
    initPost(app,knex,module);
}
function initGet(app,knex,module)
{
    app.get(module+'', (req, res) => {
        security.checkCredentials(req.headers['authorization'].split(' ')[1],knex,'modules_read',res,
        ()=>{
            knex('modules')
                .select('id')
                .select('name')
                .select('value')
                .select('icon')
                .then((data)=>{
                    res.status(200)
                    res.json(data)
                })
                .catch(error=>{
                    res.status(500)
                    res.send('Error')
                });
        }
    )});
    app.get(module+'/current', (req, res) => {
            knex('user_credentials')
                .select('modules.id')
                .select('modules.name')
                .select('modules.value')
                .select('modules.icon')
                .leftJoin('credentials','credentials.id','user_credentials.credentialID')
                .leftJoin('users','users.id','user_credentials.userId')
                .leftJoin(knex.raw("modules on modules.id = credentials.submodule::integer"))
                .where('credentials.module','module')
                .andWhere('users.token',req.headers['authorization'].split(' ')[1])
                .then((data)=>{
                    res.status(200)
                    res.json(data)
                })
                .catch(error=>{
                    res.status(500)
                    res.send(error)
                });
        });
}
function initPost(app,knex,module)
{
   
}

module.exports.startApi = startApi;