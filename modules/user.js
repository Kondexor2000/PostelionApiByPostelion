const security = require('./security');

function startApi(app,knex,module)
{
    initGet(app,knex,module);
}
function initGet(app,knex,module)
{
    app.get(module+'', (req, res) => {
        security.checkCredentials(req.headers['authorization'].split(' ')[1],knex,'users_read',res,
        ()=>{
            knex('users')
                .select('id')
                .select('name')
                .select('last_logged')
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
        knex('users')
            .select('id')
            .select('name')
            .select('last_logged')
            .where('users.token',req.headers['authorization'].split(' ')[1])
            .then((data)=>{
                res.status(200)
                res.json(data)
            })
            .catch(error=>{
                 res.status(500)
                res.send('Error')
            });
    });
    app.get(module+'/:userId', (req, res) => {
        security.checkCredentials(req.headers['authorization'].split(' ')[1],knex,'users_read',res,
        ()=>{
            knex('users')
                .select('id')
                .select('name')
                .select('last_logged')
                .where('users.id',req.params.userId)
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

module.exports.startApi = startApi;