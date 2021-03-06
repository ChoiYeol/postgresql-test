const express = require('express'),
      bodyParser = require('body-parser'),  //post 쓰려고
      cors = require('cors'),  //요청한 데이터를 브라우저에서 보안목적으로 차단하는데 이요청을 허가해주는 nodejs 의 미들웨어
      app = express(); //앱에 적용
const port = 5000;
// postgresql 에서 db 값을 가져오기위한 데이터
//const Pool = require('pg-pool');
const { Pool } = require('pg');


const config = {
  user: 'yeol',
  password:'038100',
  host: '192.168.142.132',
  port: 5432,
  database: 'tunneldata',
};
let pool = new Pool(config);
 app.use(cors());  // 외부와의 연결 허용

//바디 파서 ->  post 값 받기 위해 사용
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

function add_zero(num){
  if(num<10)return '0'+num.toString();
  return num.toString();
}

    //이벤트 테이블
    // insert into eventtable (ev_id, ev_class , ev_source , ev_st, ev_et, ev_cause, ev_robot_m, ev_sms, ev_file) values ('2','alert', '로봇카메라', '20.07.14 00:00:01', '20.07.14 00:00:03', '화재', 'y', 'y','다운로드파일');

let temp_rand;
let temp_max =32;
let temp_min= 22;
let ts_m=0;
let ts_h=0;
let fbg_sql;

app.get('/a' ,(req, res) =>{

    pool.connect((err, client, release) => {

        if (err)return console.error('Error acquiring client', err.stack);

        for(let i=0; i<1440; i++){
            temp_rand = Math.floor( Math.random()*(temp_max -temp_min)+temp_min );

            if(ts_m ==60){
              ts_m=0;
              ts_h+=1;
            }

              fbg_sql =`insert into fbgtable (fbg_ts, fbg_temp) values(\'2020.07.14 ${add_zero(ts_h)}:${add_zero(ts_m)}:00\' , \'${temp_rand}\')`;
              client.query(fbg_sql, (err, result) => {
                  if (err)return console.error('Error executing query', err.stack);
                  console.log(result.rows);

              })
              ts_m+=1;
            }
             release();
           })

})

app.listen(port , ()=>{
  console.log(`start server port:${port}`)
})
