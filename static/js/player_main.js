// Generated by CoffeeScript 1.7.1
(function() {
  var discussionID, replyToID, wasPausedByInput;

  window.toggleSubtitles = function() {
    $('#comment-container').css('display', 'none');
    $('.icon-comment').removeClass('on');
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
    if ($('.icon-comment').hasClass('on')) {
      $('.icon-comment').removeClass('on');
    } else {
      $('.icon-comment').addClass('on');
    }
    return $('#comment-container').slideToggle({
      duration: 400,
      complete: function() {
        $('comment-container').css('display', 'none');
        return util.maintainAspect();
      }
    });
  };

  wasPausedByInput = false;

  window.toggleInput = function() {

    /*
    if not timeline.paused()
      timeline.pause()
      wasPausedByInput = true
    else if wasPausedByInput
      timeline.play()
      wasPausedByInput = false
    else
      wasPausedByInput = false
    
    $('#inputTextArea').val('')
    console.log('toggle comment input')
    $('#input-container').animate
      width: "toggle"
      duration: 400
      complete: ->
        if $('#input-container').css('display') is 'block'
          $('#input-container').css('display', 'none') 
        else
          $('#input-container').css('display', 'block')
     */
  };

  replyToID = null;

  discussionID = null;

  window.submitInput = function() {
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
      parent_id: replyToID,
      discussion_id: discussionID
    };
    $('#input-container').hide();
    timeline.play();
    return $.ajax({
      type: "POST",
      url: "/comments",
      data: JSON.stringify(comment),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function() {
        alert('successful post');
        replyToID = null;
        return discussionID = null;
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
    $('#cancel-button').replaceWith('<i id="input-icon" class="icon-edit" title="Type a comment here"></i>');
    $('#input-field').val('Say something...').addClass('default');
    $('#input-field').data('conversation', null);
    $('#reply-label').hide();
    return $('#input-field').css('left', 25);
  };

  window.setupCommentReply = function() {
    var $whichComment, name, str;
    $whichComment = $('.oldCommentHover');
    str = $whichComment.text();
    name = str.slice(0, str.indexOf(':') + 1);
    $('#reply-label').text(name).show();
    $('#input-field').css('left', $('#reply-label').width() + 6 + 25);
    $('#input-icon').replaceWith('<i id="cancel-button" class="icon-ban-circle" title="Clear the input field" onclick="resetInputField();"></i>');
    return $('#input-field').data('conversation', $whichComment.data('conversation'));
  };

  $(function() {
    var addCallback, ageMostRecentComment, currentComments, displayComment, draw, getComments, hasCallback, hideComment, intervalHandler, pruneAndAgeComments, reportOnDeck, stage, timeline;
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
        return $('#input-icon').replaceWith('<i id="cancel-button" class="icon-ban-circle" title="Clear the input field" onclick="resetInputField();"></i>');
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

    /*
    $(".icon-mail-reply").click( ->
      $('$input-field').val()
      replyToID = $(this).data("messageID")
    
      discussionID = $("#first").data("discussionID")
    )
     */
    hasCallback = [];
    hideComment = function() {
      console.log('deleting');
      return $('#comment-container div:first').remove();
    };
    pruneAndAgeComments = function() {
      var comment, commentDate, currentDate, line, _i, _j, _len, _len1, _ref, _ref1, _results;
      commentDate = $('.newComment').data("time-created");
      currentDate = new Date().getTime();
      if (currentDate - commentDate > 5000) {
        ageMostRecentComment();
      }
      _ref = $('.oldComment');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comment = _ref[_i];
        $(comment).css('left', $(comment).position()['left'] + 20);
        if ($(comment).position()['left'] + 30 > $('#player-wrapper').width()) {
          $(comment).remove();
        }
      }
      _ref1 = $('.dottedLine');
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        line = _ref1[_j];
        _results.push($(line).css('left', $(line).position()['left'] + 20));
      }
      return _results;
    };
    ageMostRecentComment = function() {
      $('.newComment').children().hide();
      return $('.newComment').addClass('oldComment').css('left', '5px').click(function() {
        var $dottedLine, $hoverDetail;
        if (($(this).data('clicked') == null) || $(this).data('clicked')) {
          clearInterval(intervalHandler);
          $hoverDetail = $(this).clone().addClass('oldCommentHover').css('left', $(this).position()['left'] + 10);
          $hoverDetail.children().show();
          $hoverDetail.data('conversation', $(this).data('conversation'));
          $dottedLine = $('<div/>').addClass('dottedLine').css('left', $(this).position()['left'] + 10);
          $('#comment-container').append($hoverDetail);
          $('#comment-container').append($dottedLine);
          return $(this).data('clicked', false);
        } else {
          $('.oldCommentHover').remove();
          $('.dottedLine').remove();
          return $(this).data('clicked', true);
        }
      }).removeClass('newComment');
    };
    displayComment = function(comment) {
      var $emptyComment;
      if (comment['display'] === 'true') {
        ageMostRecentComment();
        pruneAndAgeComments();
        $emptyComment = $('<div/>').addClass('newComment').append('<p class="message"></p> <span class="time"></span> <a href="javascript:void(0);" class="reply" onclick="setupCommentReply();"> <i class="icon-mail-reply" title="Reply to this Comment"></i> </a> <a href="javascript:void(0);" class="flag" onclick="deleteComment();"> <i class="icon-warning-sign" title="Flag Comment for Removal"></i> </a>');
        $emptyComment.find('.message').text('@' + comment['username'] + ': ' + comment['text']);
        $emptyComment.find('.username').text(comment['username']);
        $emptyComment.data("time-created", new Date().getTime());
        discussionID = comment['discussion_id'] || comment['_id']['$oid'];
        $emptyComment.data("conversation", {
          'messageID': comment['_id']['$oid'],
          'discussionID': discussionID
        });
        return $('#comment-container').prepend($emptyComment);
      }
    };

    /*
      if comment['display'] is 'true'
    
        if comment['discussion_id'] is null
          comment['discussion_id'] = comment['_id']['$oid']
    
        $('#first').data( {messageID: null, discussionID: null})                
        $('#first').data( {messageID: $("#second").data("messageID"), discussionID: $("#second").data("discussionID")})                
        $('#second').data( {messageID: null, discussionID: null})        
        $('#second').data( {messageID: $("#third").data("messageID"), discussionID: $("#third").data("discussionID")})          
        $('#third').data( {messageID: null, discussionID: null})
        $('#third').data( {messageID: comment['_id']['$oid'], discussionID: comment['discussion_id']})
    
        $('#first .message').text($('#second .message').text())
        $('#first .userAndTime').text($('#second .userAndTime').text())
    
        $('#second .message').text($('#third .message').text())
        $('#second .userAndTime').text($('#third .userAndTime').text())
    
        $('#third .message').text(comment['text'])
    <<<<<<< HEAD
     */
    addCallback = function(comments) {
      var comment, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = comments.length; _i < _len; _i++) {
        comment = comments[_i];
        if (hasCallback.indexOf(JSON.stringify(comment)) === -1) {
          timeline.atTimelineURI(comment['timestamp'], (function(comment) {
            return function() {
              return displayComment(comment);
            };
          })(comment));
          _results.push(hasCallback.push(JSON.stringify(comment)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
    stage = new createjs.Stage("comment-timeline-canvas");
    stage.on("stagemousedown", function(evt) {
      console.log("the canvas was clicked at " + evt.stageX);
      return timeline.seekToX(evt.stageX.toPrecision(2));
    });
    draw = function(comments) {
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
    currentComments = '';
    getComments = function() {
      return $.ajax({
        type: "GET",
        url: "/comments",
        dataType: "json",
        success: function(comments) {
          var stringifiedComments;
          console.log('successful comments get');
          stringifiedComments = JSON.stringify(comments);
          if (currentComments !== stringifiedComments) {
            console.log("new comment");
            addCallback(comments);
            draw(comments);
            currentComments = stringifiedComments;
          }
        }
      });
    };
    getComments();
    intervalHandler = setInterval(function() {
      pruneAndAgeComments();
      return getComments();
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
