// Generated by CoffeeScript 1.7.1
(function() {
  var drawCommentLines;

  window.displayHelp = function() {
    return alert('You clicked the help button!');
  };

  window.toggleSubtitles = function() {
    $('#comment-container').css('display', 'none');
    $('#toggleComments').removeClass('on');
    if ($('.icon-quote-left').hasClass('on')) {
      $('.icon-quote-left').removeClass('on');
    } else {
      $('.icon-quote-left').addClass('on');
    }
    return $('#subtitle-container').slideToggle({
      duration: 400,
      complete: function() {
        return util.maintainAspect();
      }
    });
  };

  drawCommentLines = false;

  window.toggleComments = function() {
    $('#subtitle-container').css('display', 'none');
    $('.icon-quote-left').removeClass('on');
    if ($('#toggleComments').hasClass('on')) {
      $('#toggleComments').removeClass('on');
      drawCommentLines = false;
      $('#comment-timeline-canvas').hide();
    } else {
      $('#toggleComments').addClass('on');
      drawCommentLines = true;
      $('#comment-timeline-canvas').show();
    }
    return $('#comment-container').slideToggle({
      duration: 400,
      complete: function() {
        $('comment-container').css('display', 'none');
        return util.maintainAspect();
      }
    });
  };

  window.submitInput = function() {
    var comment, discussionID, replyToID, text, timestamp, user, _i, _len, _ref;
    user = {
      username: 'testuser',
      userID: '12dfeg92345301xsdfj',
      img: 'http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r'
    };
    timestamp = timeline.currentTimelineURI();
    text = $('#input-field').val();
    replyToID = $('#input-field').data('replyToID') || '';
    discussionID = $('#input-field').data('discussionID') || '';
    $('#input-field').val('');
    comment = {
      video: timestamp.split('/')[0],
      user: user,
      timestamp: timestamp,
      text: text,
      display: 'true',
      parent_id: replyToID,
      discussion_id: discussionID
    };
    if (replyToID === '') {
      console.log('New Thread');
      displayComment(comment);
    } else {
      if ($('.newComment').data('messageID') === replyToID) {
        $('.newComment').prepend(createBasicCommentDiv(comment));
      }
      _ref = $('.oldComments');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comment = _ref[_i];
        if ($(comment).data('messageID') === replyToID) {
          $(comment).prepend(createBasicCommentDiv(comment));
          break;
        }
      }
    }
    timeline.play();
    return $.ajax({
      type: "POST",
      url: "/comments",
      data: JSON.stringify(comment),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function() {
        return alert('successful post');
      }
    });
  };

  window.submitConfusion = function() {
    var timestamp, totalLength;
    timestamp = timeline.currentTimelineURI();
    totalLength = timeline.totalDuration;
    console.log(totalLength);
    return $.ajax({
      type: "POST",
      url: "/confusion",
      data: JSON.stringify({
        timestamp: timestamp,
        totalLength: totalLength
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function() {
        return alert('successful post');
      }
    });
  };

  window.deleteComment = function() {
    var updateParameters;
    updateParameters = {
      selector: {
        "text": $('.message').text()
      }
    };
    console.log('updateParameters', updateParameters);
    return $.ajax({
      type: "POST",
      url: "/delete",
      data: JSON.stringify(updateParameters),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function() {
        return alert('successful post');
      }
    });
  };

  window.toggleVolume = function() {
    console.log("toggling volume");
    if (!video_playing.muted) {
      video_playing.mute();
      video_playing.muted = true;
      return $("#slider-vertical").slider({
        value: 0
      });
    } else {
      video_playing.fullvolume();
      video_playing.muted = false;
      return $("#slider-vertical").slider({
        value: 100
      });
    }
  };

  window.timelineURItoX = function(uri) {
    var time;
    time = uri.split('/')[1];
    return (time / timeline.totalDuration) * 100;
  };

  window.resetInputField = function() {
    $('#input-field').data('username', null);
    $('#input-field').data('replyToID', null);
    $('#input-field').data('discussionID', null);
    $('#input-field').val('Say something...').addClass('default');
    $('#reply-label, #cancel-button').hide();
    return $('#input-field').css('left', 0);
  };

  window.replyToComment = function(myUsername, theirUsername, messageID, discussionID) {
    $('#input-field').data('username', myUsername);
    $('#input-field').data('replyToID', messageID);
    $('#input-field').data('discussionID', discussionID);
    $('#reply-label').text('@' + theirUsername).show();
    $('#cancel-button').show();
    return $('#input-field').css('left', $('#reply-label').width() + 6 + 25);
  };

  window.createBasicCommentDiv = function(comment) {
    var $newComment, discussionID, messageID;
    $newComment = $('<div/>').addClass('oneComment').append('<p class="message"></p> <a href="javascript:void(0);" class="reply"> <i class="icon-mail-forward" title="Reply to this Comment"></i> </a> <a href="javascript:void(0);" class="flag" onclick="deleteComment();"> <i class="icon-warning-sign" title="Flag Comment for Removal"></i> </a>');
    $newComment.css('width', 70 + 7 * (comment['username'] + ': ' + comment['text']).length);
    $newComment.find('.message').text(comment['username'] + ': ' + comment['text']);
    $newComment.find('.reply').click(function(e) {
      var discussionID;
      e.stopPropagation();
      discussionID = comment['discussion_id'] || comment['_id']['$oid'];
      return replyToComment('katie', comment['username'], comment['_id']['$oid'], discussionID);
    });
    if (comment['discussion_id'] || comment['_id']) {
      messageID = comment['_id']['$oid'];
      discussionID = comment['discussion_id'] || comment['_id']['$oid'];
    } else {
      discussionID = 'none';
      messageID = 'none';
    }
    $newComment.data('messageID', messageID);
    $newComment.data('discussionID', discussionID);
    console.log('$newComment', $newComment);
    return $newComment;
  };

  window.displayComment = function(comment, replies) {
    var $commentThread, $dottedLine, $newReply, $threadCount, i, reply, _i, _len;
    console.log('replies', replies);
    if (comment['display'] === 'true') {
      ageMostRecentComment();
      pruneAndAgeComments();
      $commentThread = $('<div/>').addClass('newComment');
      $commentThread.append(createBasicCommentDiv(comment));
      if (replies != null) {
        $threadCount = $('<span/>').addClass('threadCount').text(replies.length);
        $commentThread.append($threadCount);
        for (i = _i = 0, _len = replies.length; _i < _len; i = ++_i) {
          reply = replies[i];
          $newReply = createBasicCommentDiv(reply);
          $newReply.css('bottom', 148 - 32 * i);
          $newReply.css('width', ($newReply.find('.message').html().length * 7) + 70);
          $commentThread.find('.oneComment:last').after($newReply);
        }
      }
      $dottedLine = $('<div/>').addClass('dottedLine').css('left', 15).hide();
      $commentThread.find('.oneComment:last').after($dottedLine);
      return $('#comment-container').prepend($commentThread);
    }
  };

  window.pruneAndAgeComments = function() {
    var comment, commentDate, currentDate, _i, _len, _ref, _results;
    commentDate = $('.newComment').data("time-created");
    currentDate = new Date().getTime();
    if (currentDate - commentDate > 5000) {
      ageMostRecentComment();
    }
    _ref = $('.oldComment');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      comment = _ref[_i];
      if ($(comment).hasClass('oldComment')) {
        $(comment).css('left', $(comment).position()['left'] + 20);
      }
      if ($(comment).position()['left'] + 30 > $('#player-wrapper').width()) {
        _results.push($(comment).remove());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  window.ageMostRecentComment = function() {
    $('.newComment').find('.oneComment, .dottedLine').hide();
    return $('.newComment').addClass('oldComment').css('left', '5px').click(function() {
      if (($(this).data('clicked') == null) || $(this).data('clicked')) {
        $(this).children().show();
        return $(this).data('clicked', false);
      } else {
        $(this).find('.dottedLine').hide();
        $(this).find('.oneComment').hide();
        return $(this).data('clicked', true);
      }
    }).removeClass('newComment');
  };

  window.hasCallback = [];

  window.addCallback = function(comments) {
    var c, comment, replies, _i, _j, _len, _len1, _results;
    _results = [];
    for (_i = 0, _len = comments.length; _i < _len; _i++) {
      comment = comments[_i];
      if (comment['discussion_id'] === '') {
        if (hasCallback.indexOf(JSON.stringify(comment)) === -1) {
          replies = [];
          for (_j = 0, _len1 = comments.length; _j < _len1; _j++) {
            c = comments[_j];
            if (c['discussion_id'] === comment['_id']['$oid']) {
              replies.push(c);
            }
          }
          timeline.atTimelineURI(comment['timestamp'], (function(comment, replies) {
            return function() {
              return displayComment(comment, replies);
            };
          })(comment, replies));
          _results.push(hasCallback.push(JSON.stringify(comment)));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  window.currentComments = '';

  window.getComments = function(stage) {
    return $.ajax({
      type: "GET",
      url: "/comments",
      dataType: "json",
      success: function(comments) {
        var currentComments, stringifiedComments;
        console.log('successful comments get');
        stringifiedComments = JSON.stringify(comments);
        if (currentComments !== stringifiedComments) {
          console.log("new comment");
          addCallback(comments);
          draw(comments, stage);
          currentComments = stringifiedComments;
        }
      }
    });
  };

  window.draw = function(comments, stage) {
    var comment, line, percentAcrossCanvas, _fn, _i, _len;
    _fn = function(comment) {
      console.log("DOING IT");
      line.on("mouseover", function() {
        var newtip;
        newtip = '<img id="qtip-image" src="' + comment['user']['img'] + '" height="15px" width="15px"/> ' + '<span id="qtip-text">' + comment['text'] + '</span>';
        return $('#comment-timeline-canvas').qtip('option', 'content.text', newtip);
      });
      return line.on("mouseout", function() {
        return $('#comment-timeline-canvas').qtip('option', 'content.text', "Comment!");
      });
    };
    for (_i = 0, _len = comments.length; _i < _len; _i++) {
      comment = comments[_i];
      percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * 3).toPrecision(2);
      line = new createjs.Shape();
      line.graphics.beginFill("a7fd9a").drawRect(percentAcrossCanvas, 0, 2, 300);
      stage.addChild(line);
      stage.enableMouseOver();
      _fn(comment);
    }
    return stage.update();
  };

  $(function() {
    var hideComment, intervalHandler, reportOnDeck, stage, timeline;
    util.maintainAspect();
    window.sceneController = new lessonplan.SceneController(sceneList);
    timeline = new lessonplan.Timeline('#timeline-controls', window.sceneController);
    if ((window.showSubtitles != null) && window.showSubtitles) {
      window.toggleSubtitles();
    }
    $('#input-field').focus(function() {
      if (this.value === this.defaultValue) {
        this.value = '';
        return $(this).removeClass('default');
      } else {
        return $('#input-icon').replaceWith('<i id="cancel-button" class="icon-undo" title="Clear the input field" onclick="resetInputField();"></i>');
      }
    });
    $('#input-field').blur(function() {
      if (this.value === '') {
        this.value = this.defaultValue;
        return $(this).addClass('default');
      }
    });
    $('#input-field').keypress(function(e) {
      if (e.which === 13) {
        return submitInput();
      }
    });
    hideComment = function() {
      console.log('deleting');
      return $('#comment-container div:first').remove();
    };
    $('#comment-timeline-canvas').qtip({
      style: {
        classes: 'qtip-dark'
      },
      content: "Comment!",
      position: {
        target: 'mouse',
        adjust: {
          x: 0,
          y: 5
        }
      }
    });

    /*
    stage = new createjs.Stage("comment-timeline-canvas")
    stage.on("stagemousedown", (evt)-> 
        console.log ("the canvas was clicked at "+evt.stageX)
        temp = (evt.stageX/500) * timeline.totalDuration
        timeline.seekToX(temp)
    )
     */
    stage = new createjs.Stage("comment-timeline-canvas");
    stage.on("stagemousedown", function(evt) {
      console.log("the canvas was clicked at " + evt.stageX);
      return timeline.seekToX(evt.stageX.toPrecision(2));
    });
    getComments(stage);
    intervalHandler = setInterval(function() {
      pruneAndAgeComments();
      return getComments(stage);
    }, 1000);
    $("#slider-vertical").slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 95,
      slide: function(event, ui) {
        console.log(ui);
        video_playing.muted = false;
        return video_playing.changevolume(ui.value / 100);
      }
    });
    $(".icon-volume-down").on({
      mouseenter: function() {
        return $(".ui-slider-vertical").show();
      },
      mouseleave: function() {
        return $(".ui-slider-vertical").hide();
      }
    });
    $(".ui-slider-vertical").on({
      mouseenter: function() {
        return $(".ui-slider-vertical").show();
      },
      mouseleave: function() {
        return $(".ui-slider-vertical").hide();
      }
    });
    console.log("~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~");
    reportOnDeck = function(ondecks) {
      return console.log(ondecks);
    };
    timeline.onNewOnDeckURIs(reportOnDeck);
    $(".ui-slider-vertical").hide();
    return window.timeline = timeline;
  });

}).call(this);
