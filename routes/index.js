var express = require('express');
var router = express.Router();
var fs = require('fs');
var qs = require("qs")
// var pdf = require('html-pdf');
var phantom = require('phantom');
    
let { vitaeConf } = require("../conf/vitaeConf.js")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/html2pdf', function(req, res, next) {
  /**
   * html-ptf
   */
  // var html = fs.readFileSync('../../js/banner.html', 'utf8');
  // var options = { format: 'Letter' };

  // pdf.create(html, options).toFile('./bannerHtml2Pdf.pdf', function(err, response) {
  //   if (err) return console.log(err,"error");
  //   // res
  //   console.log(response,"success"); // { filename: '/app/businesscard.pdf' }
  // });
  /**
   * phantom
   */
  let urlParam = {
    fileName: req.query.fileName?req.query.fileName:"vitae",
    pageParam: req.query.pageParam
  }
  let url = vitaeConf.vitaeUrl+'/vitae?vitaeParam='+urlParam.pageParam;
  console.log(url,"url");
  (async ()=>{
    phantom.outputEncoding="gb2312";
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function(requestData) {
      console.info('Requesting', requestData.url);
    });

    await page.property('viewportSize', { width: 325, height: 'auto' });
    const status = await page.open(url);
    console.log(`Page opened with status [${status}].`);
    // await page.render('vitae.pdf');
    // console.log('page.render [vitae.pdf]')
    // await instance.exit();
    setTimeout(async ()=>{
      if(status=='success') {
        // fs.access('vitae.pdf', fs.constants.F_OK, (err) => {
        //   console.log(`vitae.pdf${err ? 'no' : 'yes'}`);
        //   if(!err) {
        //     fs.unlink('vitae.pdf', (err) => {
        //       if (err) throw err;
        //       console.log('vitae.pdf 文件已删除');
        //     });
        //   }
        // });
        await page.render('vitae.pdf');
        console.log('page.render [vitae.pdf]')
        await instance.exit();
        setTimeout(()=>{
          console.log("attachment;filename="+urlParam.fileName+".pdf",'dasd')
          realName = encodeURI(urlParam.fileName,"GBK")
          realName = realName.toString('iso8859-1')
          res.set({
            "Content-type":"application/octet-stream",
            "Content-Disposition":"attachment;filename="+realName+".pdf"
          })
          fs.readFile("./vitae.pdf",function(err,data){
            if(err) {
              console.log(err)
            }else {
              res.send(data)
            }
          })
        },2000)
      }else{
        console.log('page open fail')
        await instance.exit();
      }
    },1000)
    
    
  })();
});

module.exports = router;
