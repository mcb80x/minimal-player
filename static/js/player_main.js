// Generated by CoffeeScript 1.7.1
(function() {
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

  $(function() {
    var reportOnDeck, timeline;
    window.maintainAspectRatio();
    $(window).resize(function() {
      console.log('resize');
      return window.maintainAspectRatio();
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
    console.log("~~~~~~~~~ INSTALL TIMED CALLBACK ~~~~~~~~~~~~~");
    timeline.atTimelineURI('fleet_week/5.0', function() {
      return alert('This is an installed callback!');
    });
    return window.timeline = timeline;
  });

}).call(this);
