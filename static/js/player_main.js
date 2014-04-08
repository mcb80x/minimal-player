// Generated by CoffeeScript 1.7.1
(function() {
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

  window.toggleInput = function() {
    if (timeline.paused()) {
      timeline.play();
    } else {
      timeline.pause();
    }
    $('#inputTextArea').val('');
    console.log('toggle comment input');
    return $('#input-container').animate({
      width: "toggle",
      duration: 400,
      complete: function() {
        if ($('#input-container').css('display') === 'block') {
          return $('#input-container').css('display', 'none');
        } else {
          return $('#input-container').css('display', 'block');
        }
      }
    });
  };

  window.submitInput = function() {
    var comment, text, timestamp, username;
    username = 'testuser';
    timestamp = timeline.currentTimelineURI();
    text = $('#inputTextArea').val();
    comment = {
      username: 'testuser',
      timestamp: timestamp,
      text: text,
      display: 'true'
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
        return alert('successful post');
      }
    });
  };

  window.submitConfusion = function() {
    var timestamp;
    timestamp = timeline.currentTimelineURI();
    return $.ajax({
      type: "POST",
      url: "/confusion",
      data: timestamp,
      dataType: "text",
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

  $(function() {
    var addCallback, displayComment, getComments, hasCallback, hideComment, left, reportOnDeck, timeline;
    util.maintainAspect();
    window.sceneController = new lessonplan.SceneController(sceneList);
    timeline = new lessonplan.Timeline('#timeline-controls', window.sceneController);
    if ((window.showSubtitles != null) && window.showSubtitles) {
      window.toggleSubtitles();
    }
    left = 140;
    $('#charactersLeft').text(left);
    $('#inputTextArea').keyup(function() {
      left = 140 - $(this).val().length;
      return $('#charactersLeft').text(left);
    });
    $('.comment a, .comment i').hide();
    $('.first, .second, .third').mouseenter(function() {
      return $(this).find('a, i').show();
    });
    $('.first, .second, .third').mouseleave(function() {
      return $(this).find('a, i').hide();
    });
    hasCallback = [];
    hideComment = function() {
      console.log('deleting');
      return $('.comments div:first').remove();
    };
    displayComment = function(comment) {
      var newText;
      if (comment['display'] === 'true') {
        newText = '<span class="username">' + comment['username'] + ': </span><span class="message">' + comment['text'] + '</span><span class="messageID">' + comment['_id']['$oid'] + '</span>';
        $('.first div').html($('.second div').html());
        $('.second div').html($('.third div').html());
        return $('.third div').html(newText);
      }
    };
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
    getComments = function() {
      return $.ajax({
        type: "GET",
        url: "/comments",
        dataType: "json",
        success: function(comments) {
          console.log('successful comments get');
          addCallback(comments);
        }
      });
    };
    getComments();
    setInterval(getComments, 1000);
    console.log("~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~");
    reportOnDeck = function(ondecks) {
      return console.log(ondecks);
    };
    timeline.onNewOnDeckURIs(reportOnDeck);
    return window.timeline = timeline;
  });

}).call(this);
