<?php

var_dump( decbin( E_ALL ) );

echo PHP_EOL;

var_dump( decbin(E_NOTICE) );

echo PHP_EOL.'Flipping bits'.PHP_EOL;

var_dump( decbin(E_ALL & ~E_NOTICE ) );

echo PHP_EOL.'StrLen stuff'.PHP_EOL;

echo strlen('php');

$strlen = array('ab','c');

echo strlen($strlen);

echo PHP_EOL.'Array operators'.PHP_EOL;

$a = array('one','two','three');
$b = array('one','two','three');

var_dump($b <> $a);

echo PHP_EOL.'Type switching'.PHP_EOL;

echo 'Should be true?';

var_dump(123 == 0123);

echo PHP_EOL.'no, because 123 is stored as '.decoct(123).', and 0123 as: '.decoct(0123).PHP_EOL;

echo PHP_EOL.'count and strlen'.PHP_EOL;

echo strlen('http://php.net');

echo PHP_EOL;

var_dump( 4 ^ 8 );
