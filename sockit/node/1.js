const http = require("http");
const socket = require('socket.io');
const url = require("url")
const mysql = require("mysql");
const fs = require("fs");

let db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'db_mytest'
});
let httpServer =http.createServer((req,res)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
  let {pathname,query} = url.parse(req.url,true);
  if(pathname=="/reg"){//注册
    let {user, pass}=query;
    db.query(`insert into user(username,password,online) values ('${user}','${pass}',1);`,err=>{
      if(err){
      	console.log(err);
         res.write(JSON.stringify({code: 1, msg: '数据库有错'}));
         res.end();
       }else{
         res.write(JSON.stringify({code: 0, msg: '注册成功'}));
         res.end();
       }
    })
  }

})
httpServer.listen(8080);
