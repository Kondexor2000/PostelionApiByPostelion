module.exports=
{
    start(app,pool)
    {
        const module="services";

        app.get('/'+module+'/'+'get', async (req, res) => {
           
                let temp = await pool.query("select * from services");

                res.contentType('application/json');
                res.status(200).json(temp.rows);
        });
    }
}