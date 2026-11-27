<?php
// Les Gardiens de Lili : classement partagé entre tous les téléphones.
// POST (JSON) : {uid, name, av, team:[{g,l,f,m}], rows:[{diff, prog, kills, bosses, best:{monde:vagues}}]}
//   → enregistre le meilleur de chaque joueur, ses gardiens (niveau, forme) et sa progression dans chaque monde.
// GET ?diff=1|2|3&by=prog|kills : les 100 meilleurs du niveau, avec leur fiche (gardiens, mondes).
// prog = monde × 100 + vagues réussies dans ce monde (ex. 527 = monde 5, 27 vagues ; 450 = monde 4 réussi).
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$AV=['princesse','chevalier','fee','sorcier','astronaute','pirate','heros','ninja','licorne','chaton','chiot','renard','panda','lapin','grenouille','dragon'];
function out($x,$code=200){http_response_code($code);echo json_encode($x,JSON_UNESCAPED_UNICODE);exit;}
try{
  $dir=__DIR__.'/data';if(!is_dir($dir))mkdir($dir,0755);
  if(!file_exists($dir.'/.htaccess'))file_put_contents($dir.'/.htaccess',"Require all denied\n");
  $db=new PDO('sqlite:'.$dir.'/scores.sqlite');$db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  $db->exec('CREATE TABLE IF NOT EXISTS scores(uid TEXT,diff INTEGER,name TEXT,av TEXT,prog INTEGER,kills INTEGER,bosses INTEGER,updated INTEGER,PRIMARY KEY(uid,diff))');
  $cols=array_column($db->query('PRAGMA table_info(scores)')->fetchAll(PDO::FETCH_ASSOC),'name');
  if(!in_array('team',$cols))$db->exec('ALTER TABLE scores ADD COLUMN team TEXT');
  if(!in_array('best',$cols))$db->exec('ALTER TABLE scores ADD COLUMN best TEXT');
  // Remise à zéro de joueurs (triche) : leurs lignes sont effacées et leur téléphone efface la partie
  // à sa prochaine connexion (réponse reset:true, puis accusé de réception ack:1).
  $db->exec('CREATE TABLE IF NOT EXISTS resets(uid TEXT PRIMARY KEY,name TEXT,at INTEGER)');
  $RESET_NAMES=['hardy07'];   // prénoms à remettre à zéro (une seule fois chacun)
  foreach($RESET_NAMES as $rn){
    $mk=$dir.'/reset-'.preg_replace('/[^a-z0-9]/','',strtolower($rn)).'.done';
    if(file_exists($mk))continue;
    $q=$db->prepare('SELECT DISTINCT uid,name FROM scores WHERE lower(name)=lower(?)');$q->execute([$rn]);
    foreach($q->fetchAll(PDO::FETCH_ASSOC) as $u){
      $db->prepare('INSERT OR REPLACE INTO resets(uid,name,at) VALUES(?,?,?)')->execute([$u['uid'],$u['name'],time()]);
      $db->prepare('DELETE FROM scores WHERE uid=?')->execute([$u['uid']]);
    }
    file_put_contents($mk,date('c'));
  }
}catch(Exception $e){out(['error'=>'db'],500);}
if($_SERVER['REQUEST_METHOD']==='POST'){
  $in=json_decode(file_get_contents('php://input',false,null,0,8000),true);
  if(!is_array($in))out(['error'=>'json'],400);
  $uid=$in['uid']??'';if(!preg_match('/^[a-z0-9]{8,24}$/',$uid))out(['error'=>'uid'],400);
  $rs=$db->prepare('SELECT 1 FROM resets WHERE uid=?');$rs->execute([$uid]);
  if($rs->fetchColumn()){
    if(!empty($in['ack'])){$db->prepare('DELETE FROM resets WHERE uid=?')->execute([$uid]);out(['ok'=>true]);}
    out(['reset'=>true]);
  }
  $name=trim(preg_replace('/[\x00-\x1F<>]/u','',(string)($in['name']??'')));
  $name=mb_substr($name,0,14);if($name==='')$name='Joueur';
  $av=in_array($in['av']??'',$AV,true)?$in['av']:'princesse';
  $st=$db->prepare('INSERT INTO scores(uid,diff,name,av,prog,kills,bosses,updated) VALUES(?,?,?,?,?,?,?,?)
    ON CONFLICT(uid,diff) DO UPDATE SET name=excluded.name,av=excluded.av,prog=MAX(prog,excluded.prog),
    kills=MAX(kills,excluded.kills),bosses=MAX(bosses,excluded.bosses),updated=excluded.updated');
  // gardiens du joueur (communs à tous ses niveaux)
  $team=[];
  foreach(array_slice((array)($in['team']??[]),0,24) as $t){
    $g=(string)($t['g']??'');if(!preg_match('/^[a-z]{3,12}$/',$g))continue;
    $x=['g'=>$g,'l'=>max(0,min(999,(int)($t['l']??0))),'f'=>max(1,min(3,(int)($t['f']??1)))];
    $m=(string)($t['m']??'');if(in_array($m,['base','plante','glace','feu','poison'],true))$x['m']=$m;
    $team[]=$x;
  }
  $teamJ=json_encode($team);
  $db->prepare('UPDATE scores SET name=?,av=?,team=? WHERE uid=?')->execute([$name,$av,$teamJ,$uid]);
  $stB=$db->prepare('UPDATE scores SET best=?,team=? WHERE uid=? AND diff=?');
  foreach(array_slice((array)($in['rows']??[]),0,3) as $r){
    $d=(int)($r['diff']??0);if($d<1||$d>3)continue;
    $prog=max(0,min(950,(int)($r['prog']??0)));
    $best=[];foreach((array)($r['best']??[]) as $w=>$v){$w=(int)$w;if($w>=1&&$w<=9)$best[$w]=max(0,min(50,(int)$v));}
    $kills=max(0,min(50000000,(int)($r['kills']??0)));
    $bosses=max(0,min(10000,(int)($r['bosses']??0)));
    if($prog+$kills+$bosses===0)continue;
    $st->execute([$uid,$d,$name,$av,$prog,$kills,$bosses,time()]);
    $stB->execute([json_encode((object)$best),$teamJ,$uid,$d]);
  }
  out(['ok'=>true]);
}
$d=(int)($_GET['diff']??2);if($d<1||$d>3)$d=2;
$by=($_GET['by']??'')==='kills'?'kills DESC,prog DESC':'prog DESC,kills DESC';
$me=(string)($_GET['me']??'');
$q=$db->prepare("SELECT uid,name,av,prog,kills,bosses,team,best FROM scores WHERE diff=? ORDER BY $by LIMIT 100");
$q->execute([$d]);
$rows=$q->fetchAll(PDO::FETCH_ASSOC);
foreach($rows as &$r){$r['prog']=(int)$r['prog'];$r['kills']=(int)$r['kills'];$r['bosses']=(int)$r['bosses'];$r['me']=($me!==''&&$r['uid']===$me);unset($r['uid']);
  $r['team']=json_decode($r['team']??'[]',true)?:[];$r['best']=json_decode($r['best']??'{}',true)?:(object)[];}
out(['diff'=>$d,'rows'=>$rows]);
