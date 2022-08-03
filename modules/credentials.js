const security = require('./security');

function startApi(app,knex,module)
{
    initGet(app,knex,module);
    initPost(app,knex,module);
}
function initGet(app,knex,module)
{
    app.get(module+'', (req, res) => {
        security.checkCredentials(req.headers['authorization'].split(' ')[1],knex,'credentials_read',res,
        ()=>{
            knex('credentials')
                .select('id')
                .select('module')
                .select('submodule')
                .select('description')
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
    app.get(module+'/:userId', (req, res) => {
        security.checkCredentials(req.headers['authorization'].split(' ')[1],knex,'users_read',res,
        ()=>{
            knex('credentials')
                .select('id')
                .select('module')
                .select('submodule')
                .select('description')
                .where('credentials.id',req.params.userId)
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
}
function initPost(app,knex,module)
{
    app.post(module+'', (req, res) => {
        security.checkCredentials(req.headers['authorization'].split(' ')[1],knex,'credentials_write',res,
        ()=>{
            knex.insert({
                module:req.body.module,
                submodule:req.body.submodule,
                description:req.body.description
            })
            .into('credentials')
            .then(data=>{
                res.status(200)
                res.send('Success')
            })
            .catch(error=>{
                res.status(500)
                res.send('Error')
            })
        }
    )});
    app.post(module+'/remove/:credentialId', (req, res) => {
        security.checkCredentials(req.headers['authorization'].split(' ')[1],knex,'credentials_write',res,
        ()=>{
            knex('credentials')
            .where('credentials.id',req.params.credentialId)
            .del()
            .then(data=>{
                res.status(200)
                res.send('Success')
            })
            .catch(error=>{
                res.status(500)
                res.send('Error')
            })
        }
    )});
}

module.exports.startApi = startApi;