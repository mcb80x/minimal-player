// Generated by CoffeeScript 1.7.1
(function() {
  window.displayHelp = function() {
    return $("#helpDialog").dialog();
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

  window.toggleComments = function() {
    $('#subtitle-container').css('display', 'none');
    $('.icon-quote-left').removeClass('on');
    if ($('#toggleComments').hasClass('on')) {
      $('#toggleComments').removeClass('on');
      $('#comment-timeline-canvas').hide();
    } else {
      $('#toggleComments').addClass('on');
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

  window.submitInput = function() {
    var comment, discussionID, replyToID, text, timestamp, user, _i, _len, _ref;
    console.log("start of submit Input method");
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
    console.log('comment', comment);
    if ((replyToID == null) === createCommentThread(comment, [])) {

    } else {
      _ref = $('.oldComments');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comment = _ref[_i];
        if ($(comment).data('messageID') === replyToID) {
          $(comment).parent().append(createComment("reply", comment));
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

  window.addCallback = function(comments) {
    var c, comment, replies, _i, _j, _len, _len1, _results;
    _results = [];
    for (_i = 0, _len = comments.length; _i < _len; _i++) {
      comment = comments[_i];
      if (comment['discussion_id'] === '') {
        if (timeline.getCommentCallbackList().indexOf(JSON.stringify(comment)) === -1) {
          replies = [];
          for (_j = 0, _len1 = comments.length; _j < _len1; _j++) {
            c = comments[_j];
            if (c['discussion_id'] === comment['_id']['$oid']) {
              replies.push(c);
            }
          }
          timeline.atTimelineURI(comment['timestamp'], (function(comment, replies) {
            return function() {
              return createCommentThread(comment, replies);
            };
          })(comment, replies));
          _results.push(timeline.addCommentCallback(JSON.stringify(comment)));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  window.getComments = function(stage) {
    return $.ajax({
      type: "GET",
      url: "/comments",
      dataType: "json",
      success: function(comments) {
        console.log('successful comments get');
        addCallback(comments);
        draw(comments, stage);
      }
    });
  };

  window.replyToComment = function(myUsername, theirUsername, messageID, discussionID) {
    $('#input-field').data('username', myUsername);
    $('#input-field').data('replyToID', messageID);
    $('#input-field').data('discussionID', discussionID);
    $('#reply-label').text('@' + theirUsername).show();
    $('#cancel-button').show();
    return $('#input-field').css('padding-left', $('#reply-label').width() + 6 + 25);
  };

  window.resetInputField = function() {
    $('#input-field').data('username', null);
    $('#input-field').data('replyToID', null);
    $('#input-field').data('discussionID', null);
    $('#input-field').val('Say something...').addClass('default');
    $('#reply-label, #cancel-button').hide();
    return $('#input-field').css('padding-left', 5);
  };

  window.createComment = function(type, comment) {
    $newComment;
    var $newComment, discussionID, messageID;
    if (type === "initial") {
      console.log('creating initial comment');
      $newComment = $('<div/>').addClass('oneComment').append('<p class="message"></p> <span class="threadCount"></span> <a href="javascript:void(0);" class="commentReply"> <i class="icon-mail-forward commentReply" title="Reply to this Comment"></i> </a> <a href="javascript:void(0);" class="flag" onclick="deleteComment();"> <i class="icon-warning-sign" title="Flag Comment for Removal"></i> </a>');
    } else {
      console.log('create a reply');
      $newComment = $('<div/>').addClass('oneComment').append('<p class="message"></p> <a href="javascript:void(0);" class="flag" onclick="deleteComment();"> <i class="icon-warning-sign" title="Flag Comment for Removal"></i> </a>');
    }
    $newComment.hover(function() {
      return $newComment.find('.flag').show();
    }, function() {
      return $newComment.find('.flag').hide();
    });
    $newComment.find('.message').text(comment['user']['username'] + ': ' + comment['text']);
    $newComment.find('.commentReply').click(function(e) {
      var discussionID;
      e.stopPropagation();
      discussionID = comment['discussion_id'] || comment['_id']['$oid'];
      return replyToComment('testuser123', comment['user']['username'], comment['_id']['$oid'], discussionID);
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
    return $newComment;
  };

  window.createCommentThread = function(comment, replies) {
    var $commentThread, $dot, $dotCount, $dotReply, $dottedLine, $firstComment, $newReply, count, dotPosition, i, lineHeight, reply, _i, _len;
    console.log('replies', replies);
    if (comment['display'] === 'true') {
      ageMostRecentComment();
      pruneAndAgeComments();
      $commentThread = $('<div/>').addClass('newComment');
      $firstComment = createComment("initial", comment).css('top', 0);
      $commentThread.append($firstComment);
      if (replies != null) {
        lineHeight = 90 + replies.length * 30;
        dotPosition = 60 + replies.length * 30;
        count = replies.length > 0 ? '' : replies.length;
        if (replies.length > 0) {
          $commentThread.find('.oneComment:first').find('.threadCount').text(replies.length);
        } else {
          $commentThread.find('.threadCount').remove();
        }
        for (i = _i = 0, _len = replies.length; _i < _len; i = ++_i) {
          reply = replies[i];
          $newReply = createComment("reply", reply);
          $newReply.css('top', 30 + 30 * i);
          $commentThread.find('.oneComment:last').after($newReply);
        }
      } else {
        $commentThread.find('.threadCount').remove();
        lineHeight = 90;
        dotPosition = 60;
        count = '';
      }
      $dottedLine = $('<div/>').addClass('dottedLine').hide().css('height', lineHeight);
      $commentThread.append($dottedLine);
      $dot = $('<div/>').addClass('dot').css('left', -15).css('top', dotPosition).hide();
      $dotReply = $('<div class="dotReply"><i class="icon-mail-forward dotReply" title="Reply to this Comment"></i></div>').hide();
      $dot.append($dotReply);
      $dotCount = $('<div class="dotCount">' + count + '</div>');
      $dot.append($dotCount);
      $commentThread.append($dot);
      $commentThread.click(function() {
        var newPosition;
        if (($(this).data('clicked') == null) || $(this).data('clicked')) {
          $(this).css('bottom', 25 - 61);
          return $(this).data('clicked', false);
        } else {
          newPosition = 27 - 62 - (30 * replies.length || 0);
          $(this).css('bottom', newPosition);
          return $(this).data('clicked', true);
        }
      });
      $commentThread.css('height', 90 + (30 * replies.length || 0));
      $commentThread.css('bottom', 27 - 62 - (30 * replies.length || 0));
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
    $('.newComment').unbind();
    $('.newComment').children().hide();
    $('.newComment').find('.dot').show().click(function() {
      var discussionID, message, messageID, theirUsername;
      messageID = $(this).parent().data('messageID');
      discussionID = $(this).parent().data('discussionID');
      message = $(this).parent().find('.oneComment:last .message').text();
      theirUsername = message.slice(0, message.indexOf(':'));
      return replyToComment("testuser123", theirUsername, messageID, discussionID);
    });
    return $('.newComment').addClass('oldComment').hover(function() {
      $(this).find('.dotReply').show();
      $(this).find('.dotCount').hide();
      $(this).find('.dottedLine').show();
      $(this).find('.oneComment').show();
      return $(this).find('.threadCount').show();
    }, function() {
      $(this).find('.dotReply').hide();
      $(this).find('.dotCount').show();
      $(this).find('.dottedLine').hide();
      $(this).find('.oneComment').hide();
      return $(this).find('.threadCount').hide();
    }).removeClass('newComment').css('bottom', 27);
  };

  window.timelineURItoX = function(uri) {
    var time;
    time = uri.split('/')[1];
    return (time / timeline.totalDuration) * 100;
  };

  window.draw = function(comments, stage) {
    var canvasWidth, comment, line, percentAcrossCanvas, _fn, _i, _len;
    _fn = function(comment) {
      line.on("mouseover", function() {
        var newtip;
        $('#comment-timeline-canvas').qtip('toggle', true);
        newtip = '<img id="qtip-image" src="' + comment['user']['img'] + '" height="15px" width="15px"/> ' + '<span id="qtip-text">' + comment['text'] + '</span>';
        return $('#comment-timeline-canvas').qtip('option', 'content.text', newtip);
      });
      return line.on("mouseout", function() {
        $('#comment-timeline-canvas').qtip('toggle', false);
        return $('#comment-timeline-canvas').qtip('option', 'content.text', "");
      });
    };
    for (_i = 0, _len = comments.length; _i < _len; _i++) {
      comment = comments[_i];
      canvasWidth = document.getElementById('comment-timeline-canvas').width;
      percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * canvasWidth / 100).toPrecision(2);
      line = new createjs.Shape();
      line.graphics.beginFill("a7fd9a").drawRect(percentAcrossCanvas, 0, 2, canvasWidth);
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
    $('#comment-timeline-canvas').qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Hover over the lines to see comments people have made",
      position: {
        target: 'mouse',
        adjust: {
          x: 0,
          y: 5
        }
      }
    });
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
    hideComment = function() {
      console.log('deleting');
      return $('#comment-container div:first').remove();
    };
    stage = new createjs.Stage("comment-timeline-canvas");
    stage.on("stagemousedown", function(evt) {
      var canvasWidth;
      canvasWidth = document.getElementById('comment-timeline-canvas').width;
      console.log("the canvas was clicked at " + evt.stageX);
      return timeline.seekDirect(evt.stageX.toPrecision(2), canvasWidth);
    });
    getComments(stage);
    intervalHandler = setInterval(function() {
      pruneAndAgeComments();
      return getComments(stage);
    }, 1000);
    console.log("~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~");
    reportOnDeck = function(ondecks) {
      return console.log(ondecks);
    };
    timeline.onNewOnDeckURIs(reportOnDeck);
    $(".ui-slider-vertical").hide();
    return window.timeline = timeline;
  });

}).call(this);
