const http= require("http");
const fs= require("fs");
var requests = require('requests');

const homeFile=fs.readFileSync("Home.html","utf-8");


//https://api.openweathermap.org/data/2.5/weather?q=Bhopal&appid=808ca0bf3a74da9c2855e17cf500369d

const replaceVal=(tempval,orgval)=>{
let temperature= tempval.replace("{%tempval%}",(orgval.main.temp-273.15).toFixed(2));
temperature= temperature.replace("{%tempmin%}",(orgval.main.temp_min-273.15).toFixed(2));
temperature= temperature.replace("{%tempmax%}",(orgval.main.temp_max-273.15).toFixed(2));
temperature= temperature.replace("{%location%}",orgval.name);
temperature= temperature.replace("{%country%}",orgval.sys.country);

return temperature;
}
const server= http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=09d10f1acae349831ab6e3d371860055")
        .on('data',  (chunk) => {
        const objdata=JSON.parse(chunk);
        const arrData =[objdata];
        console.log(arrData[0].main.temp);
        const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
        res.write(realTimeData);
        // console.log(realTimeData);
        })
        .on('end',  (err) => {
          if (err) return console.log('connection closed due to errors', err);
         
        res.end();
        });

    }
});


server.listen(8000,"127.0.0.1");