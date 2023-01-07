'use strict';

// ファイルからデータを読み取る
// 2010 年と 2015 年のデータを選ぶ
// 都道府県ごとの変化率を計算する
// 変化率ごとに並べる
// 並べられたものを表示する

const fs =require('fs');
const readline =require('readline');
//requireはモジュール読み込みの関数。上ではfsにfsというモジュールを読み込み、readlineにreadlineを読み込んでいる

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({input: rs});
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', lineString => {
//     console.log(lineString);
//   });
//rlというオブジェクトでlineイベントが発生したら、この関数を呼んでください
const columns = lineString.split(',');
//lineStringで与えられた情報をカンマで区切り、columnsに配列として入れる
const year = parseInt(columns[0]);
const prefecture = columns[1];
const popu = parseInt(columns[3]);
//配列ないのカラムを指定して(0,1,2,3) （集計年,都道府県名,10〜14歳の人口,15〜19歳の人口）各変数に入れ込む
//parseIntは文字列を数列に変換する関数（集計年と人口は文字列ではないため、ここで変換）
// if (year === 2010 || year === 2015) {
//   console.log(year);
//   console.log(prefecture);
//   console.log(popu);
//   //集計年が2010もしくは2015の場合に出力する
// }
let value = null;
if (prefectureDataMap.has(prefecture)) {
//もし対象のprefectureがすでにmap内にあれば、↓でそれをvalueに代入する
  value = prefectureDataMap.get(prefecture);
} else {//なかった場合。下記で初期値を代入
  value = {
    popu10: 0,
    popu15: 0,
    change: null
  };
}
//以下でmapになかったprefectureの実際の数値を取得代入
if (year === 2010) {
  value.popu10 = popu;
}
if (year === 2015) {
  value.popu15 = popu;
}
prefectureDataMap.set(prefecture, value);
});

rl.on('close', () => {
    for (const [key, value] of prefectureDataMap) {
    //for of構文 ofの前に書かれた変数にKeyと値が代入される。ここでいうとconstのkeyにキー（prefectureでvalueに配列）map関数に対して使いとforのようにループする
        value.change = value.popu15 / value.popu10;//全てのキーにてループ処理
      }
    // console.log(prefectureDataMap);
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        //Array.from(prefectureDataMap)で連想配列を普通の配列にする（なる。Mapが連想配列で、Arrayが配列か）
        //pair1の0に都道府県名、1に集計データオブジェクト
        return pair2[1].change - pair1[1].change;//pair2のchange-pair1のchangeをして、outputが負ならpair1が前、正ならpair2が前、0なら変わらない
      });//
      //console.log(rankingArray);
      const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key}: ${value.popu10}=>${value.popu15} 変化率: ${value.change}`;
      });//配列.map(関数)の時のmapは連想配列を作るものとは異なる関数。key,valueをその後ろの関数に代入するを配列全てに適用するよ！という意味
      //ここでいうとrankingArrayに含まれるkey全てに対して適用する（return以下は一つの文字列。$は文字列と合わせる時に使うシンプルなやつ
      console.log(rankingStrings);
  });
//全てのprefectureの処理が終わった後に、走る。