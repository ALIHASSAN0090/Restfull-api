const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

const app = express();

app.set('view engine' , 'ejs');

app.use(bodyparser.urlencoded({
    extended : true
}))

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const schema = {
    title : String ,
    content : String,
    
}
const Article = mongoose.model("Article" , schema);
/*
app.get("/Article" , function(req , res){
    Article.find({})
  .then(foundArticles => {
    res.send(foundArticles);
  })
  .catch(err => {
    console.error(err);
  });

})

app.post("/Article" , function(req , res){

  const newArticle = new Article({
    title : req.body.title,
    content: req.body.content
  })
newArticle.save(res.send("Successfully added a new Article"));
})

app.delete('/Article', async (req, res) => {
  try {
    await Article.deleteMany({});
    res.send("Successfully deleted all articles");
  } catch (err) {
    res.send(err);
  }
});
*/
//app.route to chained all methids:

app.route('/Article')
  .get((req, res) => {
    Article.find({})
      .then(foundArticles => {
        res.send(foundArticles);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save()
      .then(() => {
        res.send("Successfully added a new article");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteMany({});
      res.send("Successfully deleted all articles");
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });

  //specific routes for specific Article:
  app.route("/Article/:ArticleTitle")
  .get(function(req,res){
    Article.findOne({title : req.params.ArticleTitle}).then(foundArticle =>{
      if(foundArticle){
        res.send("Item Found");
      }else{
        res.send("Item not Found");
      }
    }).catch(err =>{
      res.send("Error found")
    });
    })

    .put(function(req , res){
      Article.findOneAndUpdate(
        {title : req.params.ArticleTitle},
        {title: req.body.title , content: req.body.content},
        {overwrite : true , new : true},
        
      ).then(function(err){
        if(!err){
          res.send("successfuly Updated Article");
        }
                })
    })

    .delete((req, res) => {
      Article.deleteOne({ title: req.params.ArticleTitle })
          .then(result => {
              if (result.deletedCount > 0) {
                  res.send("Article deleted");
              } else {
                  res.status(404).send("Article not found");
              }
          })
          .catch(err => {
              console.error(err);
              res.status(500).send("Error deleting article");
          });
  });
  
   
  


//database name : wikiDB

app.listen(3000 , function(){
    console.log("server running at port : 3000 ")
})