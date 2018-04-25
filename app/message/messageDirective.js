

(function (angular, window) {

    window.app.directive('message', function (messagesService) {
        return {
            scope: {
                myMessage: '='
            },
            restrict: 'E',
            templateUrl: 'app/message/messageView.html',
            link: function (scope, el, attrs) {

                scope.deleteMessage = function (myMessage) {
                    if( confirm("Are you sure?")){
                    messagesService.deleteMessage(myMessage.id);
                    }
                }

                scope.editMessage = function (myMessage) {
                    scope.$emit('updateSelectedMessage', myMessage);
                    $("#addEditMessageModelId").modal('show');
                }
                
                //comment functionality
                //add new comment
                scope.newComment = {};
                scope.selectedCommentParentId;
                scope.checkIfEnterKeyWasPressed = function ($event) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        if (scope.newComment.text) {
                            messagesService.addComment(scope.newComment.text, scope.myMessage.id, scope.commentParentId);
                        }
                        scope.newComment = {};
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                    }
                }

                function closeCommnets(comments) {
                    _.each(comments, function (comment) {
                        comment.showAddSubComment = false;
                        if (comment.parentComment) {
                            comment.parentComment.showAddSubComment = false;
                        }
                        if (comment.comments)
                            closeCommnets(comment.comments);
                    })
                }


                //add sub comment
                scope.subComment = {};
                scope.addSubComment = function (comment) {
                    if (comment.parentId === null) {
                        scope.subComment.parentId = comment.id;
                    }
                    else {
                        scope.subComment.parentId = comment.parentId;
                    }
                    closeCommnets(comment.message.comments);
                    comment.showAddSubComment = true;



                }

                scope.closeAddMessageWindow = function (comment) {
                    comment.showAddSubComment = false;
                    scope.newComment = {};
                }

                scope.isEnterKeyWasPressedAddSubComment = function ($event, comment) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        if (scope.subComment.text) {
                            messagesService.addComment(scope.subComment.text, scope.myMessage.id, scope.subComment.parentId);
                            scope.subComment.text = null;
                            comment.showAddSubComment = false;
                        }
                    }
                }

                scope.deleteComment = function (comment) {
                    messagesService.deleteComment(comment, scope.myMessage.id);
                }

                scope.selectedComment = {};
                scope.commentText = "";

                scope.editComment = function (comment) {
                    scope.selectedComment = comment;
                    scope.commentText = comment.text;
                    $("#commentModelId").modal('show');
                }

                scope.saveComment = function () {
                    messagesService.editComment(scope.selectedComment, scope.commentText);
                    $("#commentModelId").modal('hide');
                }

            }
        };
    })

})(angular, window);