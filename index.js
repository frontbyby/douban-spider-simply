'use strict'
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
// var url = 'https://book.douban.com/';
var app = express();
app.use(express.static(__dirname));
app.use(express.static("spider_man"))
var port = process.port || 3000;
function formatChildren(s, children) {
    var obj = {};
    children.map((o) => {
        var curr = o.split("-");
        if(curr.length === 3) {
            obj[curr[0]] = curr[2] === "text" ? s.find(curr[1]).text():
            s.find(curr[1]).attr(curr[2]);
        } else {
            obj[curr[0]] = curr[1] === "text" ? s.text:
            s.attr(curr[1]);
        }
    })
    return obj;
}
app.get("/spider", function(req, res, next) {
    var url = req.query.url,
        mainClass = req.query.cln,
        children = req.query.children;
    superagent.get(url).end(function(err, response) {
        if (err) {
            return next(err);
        }
        var $ = cheerio.load(response.text);
        var items = []
        $(mainClass).each(function(i, elem) {
            var s = $(elem)
            items.push(
            //     {
            //     title: s.attr('title'),
            //     link: s.attr('href'),
            //     pic: s.find("img").attr("src")
            // }
            formatChildren(s, children)
        )
        })
        res.send(items)
    })
});

app.listen(port, function(){
    console.log(`app is listening at ${port}`)
})