//开启服务器

//引入核心模块:http
var http = require("http");
//引入核心模块：fs
var fs = require("fs");
//引入第三方模块
var template = require("art-template");//下次上课给讲解NodeJS中模块的加载规则
//引入 moment模块
var moment = require("moment");

//创建一个服务器对象
var server = http.createServer();

//开启服务器
server.on("request",function(req,res){
    console.log("有请求连接上来的");
    //当我们访问网站根据目录时，我需要将当前网站所有文件的路径读取出来，并且展示在页面上
    //判断用户是否访问了根目录
    var url = req.url;
    if(url == "/") {
        //将目录页面的静态文件读取出来以后返回
        fs.readFile("./veiws/index.html",function(err,data){
            if(err) {
                console.log("读取失败");
            }
            //得到当前网站的所有的路径，并且将遍历将数据添加到index.html中，最后才将数据返回
            fs.readdir("./",function(err, files){
                //将带有模板语法的字符串交给有compile方法，得到返回的函数对象
            
                //区分文件与文件夹
                var dirArr = [];
                var fileArr = [];
                for(var i = 0 ; i < files.length; i ++) {//5
                    (function(i){
                        fs.stat(files[i],function(err,stat){
                            if(err) {
                                return console.log("异常");
                            }
                            if(stat.isFile()) {
                                fileArr.push({
                                    type: "file",//路径的类型
                                    size: stat.size,//文件的大小
                                    time: moment(stat.ctime).format("YYYY-MM-DD hh:mm:ss"),//文件的创建时间
                                    name: files[i]//文件的名称
                                });
                            } else {
                                dirArr.push({
                                    type: "dir",//路径的类型
                                    time: moment(stat.ctime).format("YYYY-MM-DD hh:mm:ss"),//文件的创建时间
                                    name: files[i]//文件的名称
                                });
                            }
                            if(i == files.length - 1) {
                                //将两个数组合并为一个数组
                                var arr = dirArr.concat(fileArr);
                                var render = template.compile(data.toString());
                                console.log(arr);
                                 //调用方法，传入数据
                                 var html = render({
                                     files: arr
                                 });
                                 //结束请求
                                 res.end(html);
                             }
                        });
                    })(i);
                }
            });
        });
    } 
});
//开启监听
server.listen(3000,function(){
    console.log("running");
});