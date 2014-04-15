// Generated by CoffeeScript 1.7.1
(function() {
  var drawCommentLines;

  window.displayHelp = function() {
    if ($('#toggleHelp i').hasClass('on')) {
      $('#toggleHelp i').removeClass('on');
      return $('.qtip').each(function() {
        return $(this).qtip('hide');
      });
    } else {
      $('#toggleHelp i').addClass('on');
      $('#toggleComments').qtip('toggle', true);
      $('#toggleSubtitles').qtip('toggle', true);
      $('#scene-indicator-container').qtip('toggle', true);
      $('#timeline-controls').qtip('toggle', true);
      $('#comment-timeline-canvas-container').qtip('toggle', true);
      $('#clock-text').qtip('toggle', true);
      $('#confusion-control').qtip('toggle', true);
      $('#volume-control').qtip('toggle', true);
      $('#courseMapButton').qtip('toggle', true);
      return $('#downloadVideoButton').qtip('toggle', true);
    }
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
      displayComment(comment);
    } else {
      _ref = $('.oldComments');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comment = _ref[_i];
        if ($(comment).data('messageID') === replyToID) {
          $(comment).parent().append(createBasicCommentDiv("reply", comment));
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
    return $('#input-field').css('padding-left', 5);
  };

  window.replyToComment = function(myUsername, theirUsername, messageID, discussionID) {
    $('#input-field').data('username', myUsername);
    $('#input-field').data('replyToID', messageID);
    $('#input-field').data('discussionID', discussionID);
    $('#reply-label').text('@' + theirUsername).show();
    $('#cancel-button').show();
    return $('#input-field').css('padding-left', $('#reply-label').width() + 6 + 25);
  };

  window.createBasicCommentDiv = function(type, comment) {
    $newComment;
    var $newComment, discussionID, messageID;
    if (type === "initial") {
      console.log('creating initial comment');
      $newComment = $('<div/>').addClass('oneComment').append('<p class="message"></p> <span class="threadCount"></span> <a href="javascript:void(0);" class="reply"> <i class="icon-mail-forward" title="Reply to this Comment"></i> </a> <a href="javascript:void(0);" class="flag" onclick="deleteComment();"> <i class="icon-warning-sign" title="Flag Comment for Removal"></i> </a>');
    } else {
      console.log('create a reply');
      $newComment = $('<div/>').addClass('oneComment').append('<p class="message"></p> <a href="javascript:void(0);" class="flag" onclick="deleteComment();"> <i class="icon-warning-sign" title="Flag Comment for Removal"></i> </a>');
    }
    $newComment.hover(function() {
      $newComment.css('background-color', 'rgba(240,240,240,1)');
      return $newComment.find('.flag').show();
    }, function() {
      $newComment.css('background-color', 'white');
      return $newComment.find('.flag').hide();
    });
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
    var $commentThread, $dottedLine, $firstComment, $newReply, i, reply, _i, _len;
    console.log('replies', replies);
    if (comment['display'] === 'true') {
      ageMostRecentComment();
      pruneAndAgeComments();
      $commentThread = $('<div/>').addClass('newComment');
      $firstComment = createBasicCommentDiv("initial", comment);
      $commentThread.append($firstComment);
      if (replies.length > 0) {
        $commentThread.find('.oneComment:first').find('.threadCount').text(replies.length);
      } else {
        $commentThread.find('.oneComment:first').find('.threadCount').remove();
      }
      if (replies != null) {
        for (i = _i = 0, _len = replies.length; _i < _len; i = ++_i) {
          reply = replies[i];
          $newReply = createBasicCommentDiv("reply", reply);
          $newReply.css('top', 31 + 30 * i);
          $commentThread.find('.oneComment:last').after($newReply);
        }
      }
      $commentThread.click(function() {
        var newPosition;
        if (($(this).data('clicked') == null) || $(this).data('clicked')) {
          newPosition = parseInt($('.newComment').css('top').slice(0, -2)) - (32 * replies.length);
          $('.newComment').css('top', newPosition);
          $('.newComment').children().show();
          return $(this).data('clicked', false);
        } else {
          newPosition = parseInt($('.newComment').css('top').slice(0, -2)) + (32 * replies.length);
          $('.newComment').css('top', newPosition);
          $('.newComment').children().hide();
          $('.newComment .oneComment:first').show();
          return $(this).data('clicked', true);
        }
      });
      $dottedLine = $('<div/>').addClass('dottedLine').css('left', 15).hide();
      $commentThread.find('.oneComment:last').after($dottedLine);
      $commentThread.css('top', $('#stage').height() - 77);
      return $('#comment-container').prepend($commentThread);
    }
  };

  window.playAnimation = true;

  window.pruneAndAgeComments = function() {
    var comment, commentDate, currentDate, _i, _len, _ref, _results;
    if (playAnimation) {
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
    }
  };

  window.ageMostRecentComment = function() {
    $('.newComment').find('.oneComment, .dottedLine, .threadCount').hide();
    return $('.newComment').addClass('oldComment').css('left', 300).css('top', 440).hover(function() {
      $(this).find('.dottedLine').show();
      $(this).find('.oneComment').show();
      return $(this).find('.threadCount').show();
    }, function() {
      $(this).find('.dottedLine').hide();
      $(this).find('.oneComment').hide();
      return $(this).find('.threadCount').hide();
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
    $('#toggleHelp').qtip({
      style: {
        classes: 'qtip-dark'
      },
      content: "Hover here to see what video controls do",
      position: {
        my: 'top right',
        at: 'bottom center',
        target: true
      }
    });
    $("#courseMapButton").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Go back to the course map",
      position: {
        my: 'right center',
        at: 'left center',
        target: true
      }
    });
    $("#downloadVideoButton").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Download this video",
      position: {
        my: 'top right',
        at: 'bottom center',
        target: true
      }
    });
    $("#toggleComments").qtip({
      style: {
        classes: 'qtip-dark',
        tip: {
          height: 27,
          width: 5,
          offset: 10
        }
      },
      show: false,
      content: "Toggle comment view",
      position: {
        my: 'bottom left',
        at: 'top center',
        target: true
      }
    });
    $("#toggleSubtitles").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Toggle subtitles",
      position: {
        my: 'bottom left',
        at: 'top center',
        target: true
      }
    });
    $("#scene-indicator-container").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Click a segment to choose a video",
      position: {
        my: 'bottom center',
        at: 'top center',
        target: true
      }
    });
    $("#timeline-controls").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Play or pause",
      position: {
        my: 'top left',
        at: 'bottom left',
        target: true
      }
    });
    $("#comment-timeline-canvas-container").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Hover here to see comments people have made on this video",
      position: {
        my: 'top center',
        at: 'bottom center',
        target: true
      }
    });
    $("#clock-text").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Time remaining on this video",
      position: {
        my: 'top right',
        at: 'bottom left',
        target: true
      }
    });
    $("#confusion-control").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Click here while watching the video to let the instructor know you find that part confusing!",
      position: {
        my: 'bottom right',
        at: 'top center',
        target: true
      }
    });
    $("#volume-control").qtip({
      style: {
        classes: 'qtip-dark'
      },
      show: false,
      content: "Volume Control",
      position: {
        my: 'top center',
        at: 'bottom center',
        target: true
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
    hideComment = function() {
      console.log('deleting');
      return $('#comment-container div:first').remove();
    };
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
