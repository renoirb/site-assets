<?php
$c[] = microtime(true);

$i = 1;
do {
  $str = NULL;

  $m3 = is_int($i/3);
  $m5 = is_int($i/5);
  $str .= ($m3)?'Fizz':NULL;
  $str .= ($m5)?'Buzz':NULL;
  $str .= (!$m3 && !$m5)?$i:NULL;
  #$str .= ($i % 3 === 0)?'Fizz':NULL;
  #$str .= ($i % 5 === 0)?'Buzz':NULL;
  #$str .= ($i % 5 !== 0 && $i % 3 !== 0)?$i:null;
  //$str .= ' ('. ($i % 5) .') ';
  
  $str .= ' '.($i % 2);

  echo $str.PHP_EOL; $i++;
} while($i < 101);

$c[] = microtime(true);

foreach($c as $clock){
  $exploded_time = explode('.',$clock);
}

$time = $exploded_time[1][1] - $exploded_time[0][1];
var_dump($c);

echo PHP_EOL.'time: '. $time . 'ms'.PHP_EOL;
