var COLS = 10, ROWS = 20;   //横10・縦20のマス
var board = [];            //盤面情報
var lose;                 //勝負
var interval;            //ゲームタイマー
var current;             //動くブロックの形
var currentX, currentY; //ブロックの位置

//ブロックのパターン
var shapes = [
  [1, 1, 1, 1], //
  
  [1, 1, 1, 0, 
  1],
  
  [1, 1, 1, 0,
   0, 0, 1],
  
  [1, 1, 0, 0,
   1, 1],
  
  [1, 1, 0, 0,
   0, 1, 1],
  
  [0, 1, 1, 0,
   1, 1],
  
  [0, 1, 0, 0,
   1, 1, 1]
];

var colors
=["cyan", "orange", "blue", "yellow", "red", "green", "purple"];

//shapesからランダムにブロックパターンを選ぶ
function newShape(){
  var id = Math.floor(Math.random()*shapes.length); //乱数でindexを作る
  var shape = shapes[id];
  current=[];
  for(var y=0; y<4; ++y){ //current[y][x]は 4×４のブロックとする
    current[y]=[];
    for(var x=0; x<4; ++x){
      var i=4*y+x;
      if(typeof shape[i] != 'undefined' && shape[i]){
        current[y][x] = id + 1;  //色セット
      }
      else{
        current[y][x]=0; //空マス
      }
    }
  }
  //currentブロック(4×4)を盤面X=5, Y=0に置く
  currentX=5;
  currentY=0;
}

//盤面のクリア
function init(){
  for(var y = 0; y<ROWS; ++y){
    board[y]=[];
    for(var x=0; x<COLS; ++x){
      board[y][x]=0;
    }
  }
}

//250m秒タイマー setInterval(tick,250)で呼び出される関数
function tick(){
  if( valid(0,1) ){     //valid()はその方向へ移動可能かチェック
    ++currentY;
  }
  else{
    freeze();            //currentブロックを盤面に固定
    clearLines();        //1行消去処理
    if(lose){            //ゲームオーバーなら最初に戻る
      newGame();
      return false;
    }
    newShape();          //新しいcurrentブロックをセット
  }
}

//操作ブロックを盤面にセットする
function freeze(){
  for(var y=0; y<4; ++y){
    for(var x=0; x<4; ++x){
      if(current[y][x]){
        board[ y + currentY][ x + currentX]=current[y][x];
      }
    }
  }
}

//1行がそろっていたらクリア
function clearLines(){
  for(var y=ROWS-1; y>=0; --y){
    var rowFilled = true;
    //１行が揃っているかチェック
    for(var x=0; x<COLS; ++x){
      if(board[y][x] ==0){
        rowFilled=false;
        break;
      }
    }
    
    if(rowFilled){
      //盤面を1行下に下げる
      for(var yy=y; yy>0; --yy){
        for(var x=0; x<COLS; ++x){
          board[yy][x]=board[yy-1][x];
        }
      }
      y++; //1行落としたのでチェック処理を1つ下へ下げる
    }
  }
}

//指定方向にブロックを動かせるかチェックする、　ゲームオーバー判断
function valid(offsetX, offsetY, newCurrent){
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  for(var y=0; y<4; ++y){
    for(var x=0; x<4; ++x){
      if(newCurrent[y][x]){
        if( typeof board[y+offsetY] == "undefined"              //ブロックが底を過ぎた
           || typeof board[y+offsetY][x+offsetX] == "undefined" //ブロックがない
           || board[y+offsetY][x+offsetX]                       //ブロックがすでにある
           || x + offsetX < 0                                   //左方向に行けない
           || y + offsetY >= ROWS                               //下方向にもう行けない
           || x + offsetX >=COLS ){                             //左方向に行けない
                   if(offsetY == 1 && offsetX-currentX == 0 && offsetY - currentY ==1){
                     console.log("game over");
                     lose = true;
                   }
          return false;
        }
      }
    }
  }
  return true;
}

//この関数はプログラムの最下段に置く
function newGame(){
  clearInterval(interval);
  init();
  newShape();
  lose=false;
  interval=setInterval(tick,800);
}

newGame();
