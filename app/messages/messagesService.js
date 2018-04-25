app.factory("messagesService",['$http', '$q', 'usersService', function ($http, $q, usersService) {

  function Comment(commentText, message) {
    this.user = message.user;
    this.text = commentText;
    this.id = _.uniqueId();
    this.date = new Date();
    this.comments = [];
    this.parentId = null;
    this.message = message;


    this.addSubComment = function (text) {
      var subComment = new Comment(text, this.message);
      subComment.parentId = this.id;
      subComment.parentComment = this;
      this.comments.push(subComment);
    }

    this.removeSubComment = function (subCommentId) {
      for (i = 0; i < this.comments.length; i++) {
        if (this.comments[i].id === subCommentId) {
          this.comments.splice(i, 1);
          break;
        }
      }
    }

    this.editSubComment = function (subCommentId, text) {
      for (i = 0; i < this.comments.length; i++) {
        if (this.comments[i].id === subCommentId) {
          this.comments[i].text = text;
          break;
        }
      }
    }

  }



  function Message(message) {
    if (!message.id) {
      this.id = _.uniqueId();
      this.date = new Date();
      this.user = usersService.currentUser;
      this.comments = [];
    }
    else {
      this.id = message.id;
      this.date = new Date(message.date);
      this.user = message.user;
      this.comments = message.comments;
    }

    this.title = message.title;
    this.details = message.details;
    this.priority = message.priority;
    
    if (!message.image) {
      this.image = "http://via.placeholder.com/200x150?text=image";
    }
    else {
      this.image = message.image;
    }

    if(message.user.image === "undefined"){
      this.user.image = "http://www.noworrynotension.com/SignIn/assets/images/user-icon-png-pnglogocom.png";
    }

    this.addComment = function (text) {
      this.comments.push(new Comment(text, this));
    }

  }

  var priority = {
    info: "Info",
    important: "Important"
  }

  
  
  var messagesList = [];

  var isMessagesListLoaded = false;

  function getMessagesList() {
    var async = $q.defer();
    $http.get("files/messages.json").then(function (response) {
      if (!isMessagesListLoaded) {
        messagesList.splice(0, messagesList.length);
        for (var i = 0; i < response.data.length; i++) {
          message = response.data[i];
          if (user) {
            messagesList.push(new Message(message));
          }
        }
        isMessagesListLoaded = true;
      }
      async.resolve();
    }, function (response) {
      alert("Can't get messages");
      async.reject();
    });
    return async.promise;
  }

  function addMessage(message) {
    if (message) {
      var messageIndex = _.findIndex(messagesList, function (messageObj) { return messageObj.id === message.id });
      if (messageIndex >= 0) {
        console.log("User with such id already exists");
        return;
      }
      messagesList.push(new Message(message));
    }
  }

  function deleteMessage(messageId) {
    if (messageId) {
      var messageIndex = _.findIndex(messagesList, function (message) { return message.id === messageId });
      if (messageIndex < 0) {
        console.log("Can't remove non existing user");
        return;
      }
      messagesList.splice(messageIndex, 1);
    }
  }

  function editMessage(message) {
    if (message) {
      var messageIndex = _.findIndex(messagesList, function (messageObj) { return messageObj.id === message.id });
      if (messageIndex < 0) {
        console.log("Can't update non existing message");
        return;
      }
      messagesList[messageIndex] = message;
    }
  }

  function addComment(commentText, messageId, commentParentId) {
    if (commentText) {
      var messageIndex = _.findIndex(messagesList, function (message) { return message.id === messageId });
      if (messageIndex < 0) {
        console.log("Can't add comment to non existing message");
        return;
      }
      //messagesList[messageIndex].comments.push(new Comment(commentText));
      if (!commentParentId)
        //add new comment
        messagesList[messageIndex].addComment(commentText);
      else {
        //add subComment 
        var commentIndex = _.findIndex(messagesList[messageIndex].comments, function (comment) { return comment.id === commentParentId });
        if (commentIndex < 0) {
          console.log("Can't add subComment to non existing comment");
          return;
        }
        messagesList[messageIndex].comments[commentIndex].addSubComment(commentText);
      }
    }
  }

  function deleteComment(comment, messageId) {
    var messageIndex = _.findIndex(messagesList, function (message) { return message.id === messageId });
    if (messageIndex < 0) {
      console.log("Can't delete comment to non existing message");
      return;
    }

    if (!comment.parentId) {
      var commentIndex = _.findIndex(messagesList[messageIndex].comments, function (commentObj) { return commentObj.id === comment.id });
      messagesList[messageIndex].comments.splice(commentIndex, 1);
    }

    else {
      var commentIndex = _.findIndex(messagesList[messageIndex].comments, function (commentObj) { return commentObj.id === comment.parentId });
      messagesList[messageIndex].comments[commentIndex].removeSubComment(comment.id);
    }

  }

  function editComment(comment, commentText) {
    var messageIndex = _.findIndex(messagesList, function (message) { return message.id === comment.message.id });
    if (messageIndex < 0) {
      console.log("Can't delete comment to non existing message");
      return;
    }

    if (!comment.parentId) {
      var commentIndex = _.findIndex(messagesList[messageIndex].comments, function (commentObj) { return commentObj.id === comment.id });
      messagesList[messageIndex].comments[commentIndex].text = commentText;
    }

    else {
      var commentIndex = _.findIndex(messagesList[messageIndex].comments, function (commentObj) { return commentObj.id === comment.parentId });
      messagesList[messageIndex].comments[commentIndex].editSubComment(comment.id, commentText);
    }

  }

  return {
    priority: priority,
    messagesList: messagesList,
    addMessage: addMessage,
    addComment: addComment,
    editComment: editComment,
    deleteComment: deleteComment,
    deleteMessage: deleteMessage,
    editMessage: editMessage,
    getMessagesList: getMessagesList
  };

}]);
