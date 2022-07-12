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
    case "get":
        $result = pg_query($conn, "select m.*  from credentials c
        left join user_credentials uc on uc.credential =c.id 
        left join users u on u.id = uc.user_id 
        left join modules m on c.submodule::integer = m.id 
        where c.module ='module' 
        and u.token ='".$body["token"]."' and 
        uc.show=true order by m.id ");

        $rs = pg_fetch_all($result);
        echo json_encode($rs);
    break;
}



?>