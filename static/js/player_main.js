// Generated by CoffeeScript 1.7.1
(function() {
  window.tempComments = [
    {
      "text": "early comment",
      "created_at": "2014-04-10T18:56:02.796132",
      "parent_id": "",
      "video": "fleet_week",
      "user": {
        "username": "testuser",
        "userID": "12dfeg92345301xsdfj",
        "img": "http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r"
      },
      "timestamp": "fleet_week/19.86303",
      "_id": {
        "$oid": "534b04b5074fb2b003e30879"
      },
      "display": "true",
      "discussion_id": ""
    }
  ];

  window.stage;

  window.toggleVolume = function() {
    video_playing.toggleMute();
    if (video_playing.muted === true) {
      return $("#slider-vertical").slider({
        value: 0
      });
    } else {
      return $("#slider-vertical").slider({
        value: 100
      });
    }
  };

  window.toggleSubtitles = function() {
    if ($('#toggleSubtitles').hasClass('on')) {
      $('#toggleSubtitles').removeClass('on');
      $('#subtitle-container').hide();
    } else {
      $('#toggleSubtitles').addClass('on');
      $('#subtitle-container').show();
    }
    return maintainAspectRatio();
  };

  window.toggleComments = function() {
    if ($('#toggleComments').hasClass('on')) {
      $('#toggleComments').removeClass('on');
      $('#stage').css('bottom', 50);
      $('#controls').css('bottom', 0);
      $('#comment-container').hide();
    } else {
      $('#toggleComments').addClass('on');
      $('#stage').css('bottom', 110);
      $('#controls').css('bottom', 60);
      $('#comment-container').show();
    }
    return maintainAspectRatio();
  };

  window.maintainAspectRatio = function() {
    var availableHeight, availableWidth, commentHeight, controlsHeight, newHeight, newWidth, subtitleHeight;
    console.log('maintain');
    commentHeight = $('#toggleComments').hasClass('on') ? 60 : 0;
    subtitleHeight = $('#toggleSubtitles').hasClass('on') ? 60 : 0;
    controlsHeight = 50;
    availableHeight = $('#player-wrapper').height() - commentHeight - subtitleHeight - controlsHeight;
    availableWidth = $('#player-wrapper').width();
    $('#stage').css('bottom', commentHeight + subtitleHeight + controlsHeight);
    newWidth = (availableWidth / availableHeight) >= 16 / 9 ? Math.round(availableHeight * (16 / 9)) : availableWidth;
    newHeight = (availableWidth / availableHeight) >= 16 / 9 ? availableHeight : Math.round(availableWidth * (9 / 16));
    if (newWidth < availableWidth) {
      $('#stage').css('left', .5 * (availableWidth - newWidth));
    } else {
      $('#stage').css('left', 0);
    }
    $('#stage').css('height', newHeight);
    return $('#stage').css('width', newWidth);
  };

  window.replyToComment = function() {
    $('#reply-label').text($('#username').text()).show();
    $('#cancel-button').show();
    return $('#input-field').css('padding-left', $('#reply-label').width() + 6 + 25);
  };

  window.resetInputField = function() {
    console.log('reset');
    $('#input-field').val('Say something...').addClass('default');
    $('#reply-label, #cancel-button').hide();
    return $('#input-field').css('padding-left', 5);
  };

  window.likeComment = function() {
    var commentText;
    commentText = $('#message').text();
    if (!$('#likeComment').hasClass('liked')) {
      $('#likeComment').addClass('liked');
      return submitLike(commentText);
    }
  };

  window.confirmCommentDeletion = function() {
    var comment, commentText;
    comment = $('#message').html();
    commentText = $('#message').text();
    $('#deleteDialog').dialog();
    $('#commentToDelete').html(comment);
    return $('#confirmDeletion').on('click', function() {
      $('#reportComment').addClass('flagged');
      return deleteComment(commentText);
    });
  };

  window.displayComment = function(comment) {
    $('#reportComment').removeClass('flagged');
    $('#likeComment').removeClass('liked');
    $('#message-container').children().show();
    $('#message').text(comment['text']);
    return $('#username').text('@ ' + comment['user']['username']);
  };

  window.submitComment = function() {
    var comment, text, timestamp, user;
    user = {
      username: 'testuser',
      userID: '12dfeg92345301xsdfj',
      img: 'http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r'
    };
    timestamp = timeline.currentTimelineURI();
    text = $('#input-field').val();
    $('#input-field').val('');
    comment = {
      video: timestamp.split('/')[0],
      user: user,
      timestamp: timestamp,
      text: text,
      display: 'true',
      parent_id: '',
      discussion_id: ''
    };
    displayComment(comment);
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

  window.submitLike = function(messageText) {
    var updateParameters;
    updateParameters = {
      selector: {
        "text": messageText
      }
    };
    return $.ajax({
      type: "POST",
      url: "/like",
      data: JSON.stringify(updateParameters),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function() {
        return alert('successful post');
      }
    });
  };

  window.deleteComment = function(messageText) {
    var updateParameters;
    $('#deleteDialog').dialog('close');
    updateParameters = {
      selector: {
        "text": messageText
      }
    };
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
    var comment, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = comments.length; _i < _len; _i++) {
      comment = comments[_i];
      if (comment['display'] === "true") {
        _results.push(timeline.atTimelineURI(comment['timestamp'], (function(comment) {
          return function() {
            return displayComment(comment);
          };
        })(comment)));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  window.getComments = function() {
    return $.ajax({
      type: "GET",
      url: "/comments",
      dataType: "json",
      success: function(comments) {
        addCallback(comments);
      }
    });
  };

  window.draw = function(comments, stage) {
    var canvas, canvasWidth, comment, line, percentAcrossCanvas, _i, _len;
    console.log("draw");
    stage.autoClear = true;
    stage.removeAllChildren();
    canvas = document.getElementById('comment-timeline-canvas');
    canvas.width = $('#comment-timeline-canvas-container').width();
    canvas.height = $('#comment-timeline-canvas-container').height();
    for (_i = 0, _len = comments.length; _i < _len; _i++) {
      comment = comments[_i];
      console.log("drawing comment");
      canvasWidth = document.getElementById('comment-timeline-canvas').width;
      console.log(canvasWidth);
      percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * canvasWidth / 100).toPrecision(2);
      line = new createjs.Shape();
      console.log(line);
      line.graphics.beginFill("3d3d3d").drawRect(percentAcrossCanvas, 0, 2, canvasWidth);
      stage.addChild(line);
    }
    return stage.update();
  };

  window.timelineURItoX = function(uri) {
    var time;
    time = uri.split('/')[1];
    return (time / timeline.totalDuration) * 100;
  };

  window.resizeCommentCanvas = function(tempComments, stage) {
    return draw(tempComments, stage);
  };

  $(function() {
    var reportOnDeck, timeline;
    window.maintainAspectRatio();
    $(window).resize(function() {
      console.log('resize');
      window.maintainAspectRatio();
      return window.resizeCommentCanvas(tempComments, stage);
    });
    window.sceneController = new lessonplan.SceneController(sceneList);
    timeline = new lessonplan.Timeline('#timeline-controls', window.sceneController);
    if ((window.showSubtitles != null) && window.showSubtitles) {
      window.toggleSubtitles();
    }
    console.log("~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~");
    reportOnDeck = function(ondecks) {
      return console.log(ondecks);
    };
    timeline.onNewOnDeckURIs(reportOnDeck);
    window.timeline = timeline;
    window.getComments();
    $('#input-field').focus(function() {
      if (this.value === this.defaultValue) {
        this.value = '';
        return $(this).removeClass('inputDefault');
      }
    }).blur(function() {
      if (this.value === '') {
        this.value = this.defaultValue;
        return $(this).addClass('inputDefault');
      }
    }).keypress(function(e) {
      if (e.which === 13) {
        return submitComment();
      }
    });
    $("#slider-vertical").slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 95,
      slide: function(event, ui) {
        return video_playing.changeVolume(ui.value / 100);
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
    $(".ui-slider-vertical").hide();
    window.stage = new createjs.Stage("comment-timeline-canvas");
    window.stage.on("stagemousedown", function(evt) {
      var canvasWidth;
      console.log("clicked stage");
      canvasWidth = document.getElementById('comment-timeline-canvas').width;
      return timeline.seekDirectToX(evt.stageX.toPrecision(2), canvasWidth);
    });
    draw(window.tempComments, window.stage);
    return setTimeout(function() {
      return draw(window.tempComments, window.stage);
    }, 2000);
  });

}).call(this);
