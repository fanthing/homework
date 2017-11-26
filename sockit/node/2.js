const http = require("http");
const socket = require('socket.io');
const url = require("url")
const mysql = require("mysql");

let db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'db_mytest'
});
let httpServer = http.createServer((req, res) => {

})
let socketServer = socket.listen(httpServer);
let aSock = [];
socketServer.on("connection", sock => {
	console.log("sock已连接");
	aSock.push(sock);
	let cur_username = '';
	let cur_userID = 0;
	sock.on("reg", (user, pass) => {
		db.query(`select id from user where username='${user}'`, (err, data) => {
			if(err) {
				console.log(err);
				sock.emit('reg_ret', 1, '数据库有错');
			} else {
				if(data.length > 0) {
					sock.emit('reg_ret', 1, '注册失败，用户名重复');
				} else {
					db.query(`insert into user(username,password,online) values ('${user}','${pass}',0);`, err => {
						if(err) {
							console.log(err);
							sock.emit('reg_ret', 1, '数据库有错');
						} else {
							sock.emit('reg_ret', 0, '注册成功');
						}
					})
				}
			}
		})
	})
	sock.on("login", (user, pass) => {
		db.query(`select id,password from user where username='${user}'`, (err, data) => {
			if(err) {
				console.log(err);
				sock.emit('login_ret', 1, '数据库有错');
			} else {
				if(data.length == 0) {
					console.log(err);
					sock.emit('login_ret', 1, '用户不存在');
				} else if(data[0].password != pass) {
					sock.emit('login_ret', 1, '密码不对');
				} else {
					db.query(`update user set online = 1 where id='${data[0].id}'`, err => {
						if(err) {
							console.log(err);
							sock.emit('login_ret', 1, '数据库有错');
						} else {
							sock.emit('login_ret', 0, '登陆成功');
							cur_username = user;
							cur_userID = data[0].id;
							console.log(cur_userID);
						}
					})
				}
			}
		})
	})

	sock.on('msg', function(msg) {
		sock.emit("msg_ret", 0, "发送成功");
		aSock.forEach(osock => {
			if(osock != sock) {
				osock.emit("msg", cur_username, msg);
			}
		})
	});

	//离线
	sock.on('disconnect', function() {
		console.log('sock已断开');
		if(cur_userID != 0) {
			db.query(`UPDATE user SET online=0 WHERE id=${cur_userID}`, err => {
				if(err) {
					console.log('数据库有错', err);
				}
			});
		}
		cur_username = '';
		cur_userID = 0;
		aSock = aSock.filter(item => item != sock);
	});
});
httpServer.listen(8080);