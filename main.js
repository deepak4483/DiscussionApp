const mongodb=require("mongodb");

const MongoClient=mongodb.MongoClient;
let url="mongodb+srv://root:1234567890@cluster0.1posg.mongodb.net/DiscussionApp?retryWrites=true&w=majority";

const client=new MongoClient(url);
const dbname="Discussion"
var dbInstance=null;

client.connect().then(function(){
  console.log("db connected");
  dbInstance=client.db(dbname);
});

console.log("dbinstance-->",dbInstance);
var fs=require("fs");
var express=require("express")

var app=express();
app.use(express.json());
app.use(express.static("client"));



app.get("/getQuestions",function(req,res){
  readQuestion(function(data){
    res.end(JSON.stringify(data));
  })
})

app.post("/save",function(req,res){
  const collection=dbInstance.collection("questionList");
  console.log(req.body);
  collection.insertOne(req.body).then(function(result)
  {
    
    if(result.acknowledged)
    {
      res.status(200);
      res.end();
    }
    else{
      res.status(500);
      res.end();
    }
  })
})

app.post("/delete",function(req,res){

  const collection=dbInstance.collection("questionList");

  collection.deleteOne({"uploadedAt":req.body.id}).then(function(result){
    if(result.acknowledged)
    {
      res.status(200);
      res.end();
    }
    else{
      res.status(500);
      res.end();
    }
  })

})

app.post("/saveResponse",function(req,res){

	const collection=dbInstance.collection("questionList");

	console.log(req.body.response);
	console.log(req.body.id);
	collection.updateOne({"uploadedAt":req.body.id},{$push:{"responses":req.body.response}}).then(function(result){
		if(result.acknowledged)
    {
      res.status(200);
      res.end();
    }
    else{
      res.status(500);
      res.end();
    }
	})
})

function readQuestion(callback){
  const collection=dbInstance.collection("questionList");
  collection.find({}).toArray().then(function(data){
    callback(data);
  })
}

app.post("/update",function(req,res)
{
  const collection=dbInstance.collection("questionList")

  // console.log(req.body.id)
  // console.log(req.body.upvote)
  collection.updateOne({"uploadedAt":req.body.id},{$inc:{"upvotes":1}}).then(function(result)
  {
    if(result.acknowledged)
    {
      res.status(200);
      res.end();
    }
    else{
      res.status(300);
      res.end();
    }
  })
})


app.listen(3000,function(){
  console.log("running at 3000")
})