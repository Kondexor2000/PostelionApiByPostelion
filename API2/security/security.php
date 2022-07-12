<?PHP 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: content-type");
header("Content-Type: application/json");


$name = $_GET["name"];
//Pobieranie Danych
$body = json_decode(file_get_contents('php://input'), true)["body"];


$conn = pg_connect("host=46.242.242.123 dbname=35627810_postelion_app user=35627810_postelion_app password=pUN2HgAd");

switch($name)
{
    case "cv_display":
        $result = pg_query($conn, "select case when count(*)>0 then 'allow' else 'decline' end as result from users u 
        left join user_credentials uc on uc.user_id  = u.id 
        left join credentials c on c.id = uc.credential 
        where c.module = 'cv_display' and u.token = '".$body["token"]."'");
        $rs = pg_fetch_all($result);
        echo json_encode($rs);
    break;
}



?>