<?php
// Les Gardiens de Lili : classement partagé entre tous les téléphones.
// POST (JSON) : {uid, name, av, rows:[{diff, prog, kills, bosses}]} → enregistre le meilleur de chaque joueur.
// GET ?diff=1|2|3 : les 100 meilleurs du niveau.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$AV=['👧','👸','🧚','🦄','🐱','🐶','🦊','🐼','🐰','🐸','🌸','⭐'];
function out($x,$code=200){http_response_code($code);echo json_encode($x,JSON_UNESCAPED_UNICODE);exit;}
try{
  $dir=__DIR__.'/data';if(!is_dir($dir))mkdir($dir,0755);
  if(!file_exists($dir.'/.htaccess'))file_put_contents($dir.'/.htaccess',"Require all denied\n");
  $db=new PDO('sqlite:'.$dir.'/scores.sqlite');$db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  $db->exec('CREATE TABLE IF NOT EXISTS scores(uid TEXT,diff INTEGER,name TEXT,av TEXT,prog INTEGER,kills INTEGER,bosses INTEGER,updated INTEGER,PRIMARY KEY(uid,diff))');
}catch(Exception $e){out(['error'=>'db'],500);}
if($_SERVER['REQUEST_METHOD']==='POST'){
  $in=json_decode(file_get_contents('php://input',false,null,0,4000),true);
  if(!is_array($in))out(['error'=>'json'],400);
  $uid=$in['uid']??'';if(!preg_match('/^[a-z0-9]{8,24}$/',$uid))out(['error'=>'uid'],400);
  $name=trim(preg_replace('/[\x00-\x1F<>]/u','',(string)($in['name']??'')));
  $name=mb_substr($name,0,14);if($name==='')$name='Joueur';
  $av=in_array($in['av']??'',$AV,true)?$in['av']:'⭐';
  $st=$db->prepare('INSERT INTO scores(uid,diff,name,av,prog,kills,bosses,updated) VALUES(?,?,?,?,?,?,?,?)
    ON CONFLICT(uid,diff) DO UPDATE SET name=excluded.name,av=excluded.av,prog=MAX(prog,excluded.prog),
    kills=MAX(kills,excluded.kills),bosses=MAX(bosses,excluded.bosses),updated=excluded.updated');
  $db->prepare('UPDATE scores SET name=?,av=? WHERE uid=?')->execute([$name,$av,$uid]);
  foreach(array_slice((array)($in['rows']??[]),0,3) as $r){
    $d=(int)($r['diff']??0);if($d<1||$d>3)continue;
    $prog=max(0,min(450,(int)($r['prog']??0)));
    $kills=max(0,min(50000000,(int)($r['kills']??0)));
    $bosses=max(0,min(10000,(int)($r['bosses']??0)));
    if($prog+$kills+$bosses===0)continue;
    $st->execute([$uid,$d,$name,$av,$prog,$kills,$bosses,time()]);
  }
  out(['ok'=>true]);
}
$d=(int)($_GET['diff']??2);if($d<1||$d>3)$d=2;
$by=($_GET['by']??'')==='kills'?'kills DESC,prog DESC':'prog DESC,kills DESC';
$me=(string)($_GET['me']??'');
$q=$db->prepare("SELECT uid,name,av,prog,kills,bosses FROM scores WHERE diff=? ORDER BY $by LIMIT 100");
$q->execute([$d]);
$rows=$q->fetchAll(PDO::FETCH_ASSOC);
foreach($rows as &$r){$r['prog']=(int)$r['prog'];$r['kills']=(int)$r['kills'];$r['bosses']=(int)$r['bosses'];$r['me']=($me!==''&&$r['uid']===$me);unset($r['uid']);}
out(['diff'=>$d,'rows'=>$rows]);
