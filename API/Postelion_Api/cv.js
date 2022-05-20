const Security= require('../../Security/Security');

module.exports=
{
    start(app,pool)
    {
        const module="cv";

        app.get('/'+module+'/'+'default', async (req, res) => {
            console.log(req.headers);
            Security.checkToken(pool,'UM1StkjgILGW5Trtfir2cD1E',module,async ()=>{
                let temp ;
                let response ={};
                //Get Base Data
                temp = await pool.query("select * from cv_data cd where cd.cv_id  = (select c.value_int from config c where c.name='default_cv');");
                for (let index = 0; index < temp.rowCount; index++) {
                    response[temp.rows[index].name]= temp.rows[index].value;
                }

                //Get School
                temp = await pool.query("select * from cv_school cs  where cs.cv_id  = (select c.value_int from config c where c.name='default_cv');");
                response['schools'] =[];
                for (let index = 0; index < temp.rowCount; index++) {
                    response['schools'].push({name:temp.rows[index].name,as:temp.rows[index].as,date:temp.rows[index].date});
                }

                //Get Experience
                temp = await pool.query("select * from cv_experience ce  where ce.cv_id  = (select c.value_int from config c where c.name='default_cv');");
                response['experience'] =[];
                for (let index = 0; index < temp.rowCount; index++) {
                    response['experience'].push({name:temp.rows[index].name,description:temp.rows[index].description,date:temp.rows[index].date});
                }

                //Get Skills
                temp = await pool.query("select * from cv_skills cs  where cs.cv_id  = (select c.value_int from config c where c.name='default_cv');");
                response['skills'] =[];
                for (let index = 0; index < temp.rowCount; index++) {
                    response['skills'].push({name:temp.rows[index].name,level:temp.rows[index].level,date:temp.rows[index].date});
                }

                //Get Languages
                temp = await pool.query("select * from cv_languages cl  where cl.cv_id  = (select c.value_int from config c where c.name='default_cv');");
                response['languages'] =[];
                for (let index = 0; index < temp.rowCount; index++) {
                    response['languages'].push({name:temp.rows[index].name,level:temp.rows[index].level,date:temp.rows[index].date});
                }

                //Get Meta Data
                temp = await pool.query("select * from cv c2  where c2.id  = (select c.value_int from config c where c.name='default_cv');");
                let resp = {name:temp.rows[0].name,template:temp.rows[0].template,data:response};


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
