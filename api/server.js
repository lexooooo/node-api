require("dotenv").config
const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")
const app = express()

app.use(express.json())
app.use(bodyparser.urlencoded({extended: false}))
app.use(cors())

const stream = fs.createWriteStream('./data.txt')

var chunk = []

app.get('/', (req, res)=>{
 res.send("--------------------------------------")
})


app.get('/side', async (req, res)=>{

 axios.get("https://stalkermod.ru/").
 then( async response => {
  var html = await response.data;
  var $ = cheerio.load(html);
  $('h1.title', html).each(function () {
    var loaded = $(this).text()
    var title = $(this).children("a").text()
    var link = $(this).children("a").attr("href")
    stream.write(title)
    chunk.push({title: loaded, link: `https://stalkermod.ru/${link}`})
  });


  res.json(chunk)

  }).catch(err => {
   throw err
 })
})


app.listen(3001, ()=>{
 console.log("server connected")
})