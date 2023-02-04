var newQuestionForm = document.getElementById("newQuestionForm");
var searchBar = document.getElementById("questionSearch");
var QuestionsList = document.getElementById("dataList");
var createQuestionForm = document.getElementById("toggleDisplay");
var questionTitle = document.getElementById("subject");
var questionDescription = document.getElementById("question");
var submitQuestionButton = document.getElementById("submitBtn");
var questionDetails = document.getElementById("respondQue");
var resolveQuestionContainer = document.getElementById("resolveHolder");
var resolveQuestionButton = document.getElementById("resolveQuestion");
var upVoteButton = document.getElementById("upVote");
var downVoteButton = document.getElementById("downVote");
var responsesList = document.getElementById("respondAns");
var writeCommentContainer = document.getElementById("commentHolder");
var commentatorName = document.getElementById("pickName");
var comment = document.getElementById("pickComment");
var submitCommentButton = document.getElementById("commentBtn");


newQuestionForm.addEventListener("click",function(event){
    createQuestionForm.style.display = "block";
    questionDetails.style.display = "none";
    resolveQuestionContainer.style.display = "none";
    responsesList.style.display = "none";
    writeCommentContainer.style.display = "none";
})

searchBar.addEventListener("change", function(event){
    filterQuestions(event.target.value);
});

function filterQuestions(query){
    getAllQuestions(function(allQuestions){

        clearQuestionPanel();
            
        if(query){

            var filteredQuestions = allQuestions.filter(function(question){
                if(question.title.includes(query)){
                    return true;
                }
            });

            if(filteredQuestions.length){
                filteredQuestions.forEach(function(question){
                    addQuestionInPanel(question);
                });
            }
            else{
                printNoMatchFound();
            }
        }
        else{
        
            allQuestions.forEach(function(question){
                addQuestionInPanel(question);
            });
        }
    });

}

function clearQuestionPanel(){
    QuestionsList.innerHTML = "";
}

function printNoMatchFound(){
    var noMatchTitle = document.createElement("h4");
    noMatchTitle.innerHTML = "No Match Found";

    QuestionsList.appendChild(noMatchTitle);
}
// display all existing questions
function laodQuestions(){
    getAllQuestions(function(allQuestions){
        // console.log(allQuestions);
        // allQuestions = allQuestions.sort(function(presentQuestion, nextQuestion){
        //     if(presentQuestion.isFavourite){
        //         return -1;
        //     }
        //     else 
        //         return 1;
        // });

        allQuestions.forEach(function(question){
            addQuestionInPanel(question);
        });
    })

    
}

laodQuestions();

// take question input
submitQuestionButton.addEventListener("click",onQuestionSubmit);

function onQuestionSubmit(){
   if(questionTitle.value==="" || questionDescription.value==="")
    alert("please enter a valide Question");
    else
    {
        var question = {
            title: questionTitle.value,
            description : questionDescription.value,
            responses : [],
            upvotes : 0, 
            downvotes : 0,
            uploadedAt : Date.now(),
            isFavourite : false
        }

        postQuestionToServer(question);
        addQuestionInPanel(question);
    }
    questionTitle.value = "";
    questionDescription.value = "";
}


// get all questions from storage
function getAllQuestions(onResponse){
    
    var request=new XMLHttpRequest();
    request.open("GET","/getQuestions");
    request.send();
    request.addEventListener("load",function(){       
        var question=JSON.parse(request.responseText);
        if(question)
            onResponse(question);
        else
            onResponse([]);
    })
    
}

// add question in panel
function addQuestionInPanel(question){
    var questionContainer = document.createElement("div");
    questionContainer.setAttribute("id", question.uploadedAt);
    questionContainer.setAttribute("class", "questionTag");
    questionContainer.style.background = "#BDBDBD";

    var newQuestionTitle = document.createElement("h5");
    newQuestionTitle.style.fontSize="22px";
    newQuestionTitle.innerHTML = question.title;
    questionContainer.appendChild(newQuestionTitle);

    var newQuestionDescription = document.createElement("h5");
    newQuestionDescription.style.color="mediumblue";
    newQuestionDescription.innerHTML = question.description;
    questionContainer.appendChild(newQuestionDescription);

    var upVotes = document.createElement("h5");
    upVotes.style.color="green";
    upVotes.innerHTML = "UpVotes = " + question.upvotes;
    questionContainer.appendChild(upVotes);

    var downVotes = document.createElement("h5");
    downVotes.style.color="red";
    downVotes.innerHTML = "DownVotes = " + question.downvotes;
    questionContainer.appendChild(downVotes);

    var dateTime = document.createElement("h5");
    dateTime.innerHTML = new Date(question.uploadedAt).toLocaleString();
    questionContainer.appendChild(dateTime);

    var timePassed = document.createElement("h5");
    timePassed.innerHTML = "uploaded " + updateTimeEverySecond(timePassed)(question.uploadedAt) + "ago";
    questionContainer.appendChild(timePassed); 

    // var addToFavourite = document.createElement("button");
    // addToFavourite.setAttribute("id","favourite");
    
    // if(question.isFavourite){
    //     addToFavourite.innerHTML = "REMOVE FROM FAVOURITES";
    //    var star = "\u2606";
    //    newQuestionTitle.append(" " + star);
       
    // }
    // else{
    //     addToFavourite.innerHTML = "ADD TO FAVOURITE";
        
    // }

    // QuestionsList.appendChild(addToFavourite);

    QuestionsList.appendChild(questionContainer);

    questionContainer.addEventListener("click", onQuestionClick(question), {once:true});

    // addToFavourite.addEventListener("click", showFavouriteQuestionsFirst(question));
}

// Sort the favourite marked questions to top of the questions list
// function showFavouriteQuestionsFirst(question){
//     return function(event){

//         question.isFavourite = !question.isFavourite;
//         updateQuestion(question);
//         if(question.isFavourite){
//             event.target.innerHTML = "REMOVE FROM FAVOURITEs";
//         }
//         else{
//             event.target.innerHTML = "ADD TO FAVOURITE";
//         }
       
//     }
// }

// update time after every second
function updateTimeEverySecond(element){
    return function(time){
            setInterval( function(){
                element.innerHTML = "uploaded " + convertTimeToAgoFormat(time) + " ago";
            },1000);

            return convertTimeToAgoFormat(time);
    }

}

// convert time to hours ago, minutes ago & seconds ago like format
function convertTimeToAgoFormat(date){

    var currentTime =  Date.now();
    var timeLapsed = currentTime - new Date(date).getTime();

    var secondsPassed = parseInt(timeLapsed/1000);
    var minutesPassed = parseInt(secondsPassed/60);
    var hoursPassed = parseInt(minutesPassed/60);

    if(secondsPassed <= 60){
        return secondsPassed + " seconds";
    }
    else if(secondsPassed > 60 && secondsPassed <= 3600){
        return minutesPassed + " minutes";
    }
    else{
        return hoursPassed + " hours";
    }

}

// listen to the click on question
function onQuestionClick(question){
    return function(){

        hideQuestionForm();
        showQuestionDetails();
        clearQuestionDetails();
        
        // responsesList.style.display = "none";

        addQuestionToRight(question);

    //    console.log(question.responses);

       question.responses.forEach(function(response){
           addCommentsInResponses(response);
        });          
        

        submitCommentButton.onclick =  onResponseSubmit(question);
        upVoteButton.onclick = upVoteQuestion(question);
        downVoteButton.onclick = downVoteQuestion(question);
        resolveQuestionButton.onclick = resolveQuestion(question);
    }
}
// click on question to display question's details
function showQuestionDetails(){
    questionDetails.style.display = "block";
    resolveQuestionContainer.style.display = "block";
    responsesList.style.display = "block";
    responsesList.innerHTML="";
    writeCommentContainer.style.display = "block";
}
// show question details in right panel and hide question form
function hideQuestionForm(){
    createQuestionForm.style.display = "none";
}
// clear question details
function clearQuestionDetails(){
    questionDetails.innerHTML = "";
}
// add Question to right
function addQuestionToRight(question){
    
    var questionHeading = document.createElement("h2");
    questionHeading.innerHTML = "Question";
    questionHeading.style.color = "White";
    questionDetails.appendChild(questionHeading);

    var clickedQuestionDetails = document.createElement("div");
    clickedQuestionDetails.setAttribute("id", "clickedQuestion");
    clickedQuestionDetails.style.background = "#BDBDBD";
    questionDetails.appendChild(clickedQuestionDetails);

    var questionHeading = document.createElement("h4");
    questionHeading.innerHTML = question.title;

    var questionInfo = document.createElement("p");
    questionInfo.innerHTML = question.description;

    clickedQuestionDetails.appendChild(questionHeading);
    clickedQuestionDetails.appendChild(questionInfo);

    var responseHeading = document.createElement("h2");
    responseHeading.innerHTML = "Responses";
    responseHeading.style.color = "White";
    responsesList.appendChild(responseHeading);
}

// take comments input

function onResponseSubmit(question){
    return function(){

        var response = {
            name : commentatorName.value,
            description : comment.value
        }
        saveResponse(question,response);
        addCommentsInResponses(response);
        commentatorName.value = "";
        comment.value = "";
    }
}

function saveResponse(updatedQuestion, response){

    // console.log(updatedQuestion);
    // console.log(updatedQuestion._id);
    // console.log(response);

    var request=new XMLHttpRequest();
    request.open("post","/saveResponse");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify({id:updatedQuestion.uploadedAt,response:response}));

    
}



// add comments in responses section
function addCommentsInResponses(response){


    var responseContainer = document.createElement("div");
    responseContainer.style.background = "#BDBDBD";
    responsesList.appendChild(responseContainer);

    var userName = document.createElement("h5");
    userName.innerHTML = response.name;

    var userComment = document.createElement("p");
    userComment.innerHTML = response.description;

    responseContainer.appendChild(userName);
    responseContainer.appendChild(userComment);
}

function upVoteQuestion(question){
    return function(){
        question.upvotes++;
        updateQuestion(question,question.upvotes);
        updateQuestionUI(question);

    }
    
    
}

function downVoteQuestion(question){
    return function(){
        question.downvotes++;
        updateQuestion(question,question.downvotes);
        updateQuestionUI(question);
    }
}

function updateQuestion(question,toupdate){

    var request=new XMLHttpRequest();
    request.open("post","/update");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify({id:question.uploadedAt,upvote:toupdate}));

}

function updateQuestionUI(question){

    var questionContainer = document.getElementById(question.uploadedAt);
    // console.log(questionContainer)

    questionContainer.childNodes[2].innerHTML = "Upvotes = " + question.upvotes;
    questionContainer.childNodes[3].innerHTML = "Downvotes = " + question.downvotes;
}

function resolveQuestion(question){
    return function(){

        var request=new XMLHttpRequest();
        request.open("post","/delete");
        request.setRequestHeader("Content-type","application/json");
        request.send(JSON.stringify({id:question.uploadedAt}));

        clearQuestionDetailsPanel();
        
        resolveQuestionContainer.style.display="none";
        clearQuestionPanel();
        laodQuestions();
        createQuestionForm.style.display = "block";
        responsesList.style.display = "none";
        writeCommentContainer.style.display = "none";

    }

}


function clearQuestionDetailsPanel(){
    questionDetails.style.display = "none";
}

function showQuestionPanel(){
    createQuestionForm.style.display = "block";
}

function postQuestionToServer(dataToSend)
{
    var request=new XMLHttpRequest();
    request.open("post","/save");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(dataToSend));
    request.addEventListener("load",function(){
    if(request.status===200)
        alert("question saved successfully");
    else if(request.status===400)
        alert("Error in saving tasks");
  })

}