<?PHP 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: content-type");
header("Content-Type: application/json");


$action = $_GET["action"];
//Pobieranie Danych
$body = json_decode(file_get_contents('php://input'), true)["body"];


$conn = pg_connect("host=46.242.242.123 dbname=35627810_postelion_app user=35627810_postelion_app password=pUN2HgAd");

switch($action)
{
    case "get_default":
        $return = array();
        $result = pg_query($conn, "select * from cv_data cd where cd.cv_id  = (select c.value_int from config c where c.name='default_cv');");
        $rs = pg_fetch_all($result);
        array_push($return,$rs);

        $result = pg_query($conn, "select * from cv_school cs  where cs.cv_id  = (select c.value_int from config c where c.name='default_cv');");
        $rs = pg_fetch_all($result);
        array_push($return,$rs);

        $result = pg_query($conn, "select * from cv_experience ce  where ce.cv_id  = (select c.value_int from config c where c.name='default_cv');");
        $rs = pg_fetch_all($result);
        array_push($return,$rs);

        $result = pg_query($conn, "select * from cv_skills cs  where cs.cv_id  = (select c.value_int from config c where c.name='default_cv');");
        $rs = pg_fetch_all($result);
        array_push($return,$rs);

        $result = pg_query($conn, "select * from cv_languages cl  where cl.cv_id  = (select c.value_int from config c where c.name='default_cv');");
        $rs = pg_fetch_all($result);
        array_push($return,$rs);

        $result = pg_query($conn, "select * from cv c2  where c2.id  = (select c.value_int from config c where c.name='default_cv');");
        $rs = pg_fetch_all($result);
        array_push($return,$rs);

        $result = pg_query($conn, "select * from users where token ='".$body["token"]."'");
        $rs = pg_fetch_all($result);
        array_push($return,$rs);

        echo json_encode($return);
    break;
}



?>