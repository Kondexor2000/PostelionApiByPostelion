<?PHP 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods:  POST');
header("Access-Control-Allow-Headers: content-type");
header("Content-Type: application/json");


$action = $_GET["action"];
//Pobieranie Danych
$body = json_decode(file_get_contents('php://input'), true)["body"];


$conn = pg_connect("host=46.242.242.123 dbname=35627810_postelion_app user=35627810_postelion_app password=pUN2HgAd");

switch($action)
{
    case "get_specific":
        $result = pg_query($conn, "select * from users where token ='". $body["token"]."'");
        $rs = pg_fetch_all($result);
        echo json_encode($rs);
    break;
    case "set_name":
        $value = $_GET["value"];
        $result = pg_query($conn, "update users set name = '".$value."' where token ='". $body["token"]."'");
    break;
}



?>