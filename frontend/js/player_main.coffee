# -----------------------------------------
# Player Configuration/Display
#-----------------------------------------

window.toggleVolume = ->
  video_playing.toggleMute()
  if video_playing.muted is true
    $( "#slider-vertical" ).slider({value: 0})
  else
    $( "#slider-vertical" ).slider({value: 100})

window.toggleSubtitles = ->
  if $('#toggleSubtitles').hasClass('on')
    $('#toggleSubtitles').removeClass('on')
    $('#subtitle-container').hide()
  else
    $('#toggleSubtitles').addClass('on')
    $('#subtitle-container').show()
  maintainAspectRatio()

window.toggleComments = ->
  if $('#toggleComments').hasClass('on')
    $('#toggleComments').removeClass('on')
    $('#stage').css('bottom', 50)
    $('#controls').css('bottom', 0)
    $('#comment-container').hide()
  else
    $('#toggleComments').addClass('on')
    $('#stage').css('bottom', 110)
    $('#controls').css('bottom', 60)
    $('#comment-container').show()
  maintainAspectRatio()

window.maintainAspectRatio = ->
  console.log('maintain')
  commentHeight = if $('#toggleComments').hasClass('on') then 60 else 0
  subtitleHeight = if $('#toggleSubtitles').hasClass('on') then 60 else 0
  controlsHeight =  50

  availableHeight = $('#player-wrapper').height()-commentHeight-subtitleHeight-controlsHeight
  availableWidth = $('#player-wrapper').width()
  

  $('#stage').css('bottom', commentHeight + subtitleHeight + controlsHeight)

  newWidth = if (availableWidth/availableHeight) >= 16/9 then Math.round(availableHeight * (16/9)) else availableWidth
  newHeight = if (availableWidth/availableHeight) >= 16/9 then availableHeight else Math.round(availableWidth * (9/16))

  if newWidth < availableWidth then $('#stage').css('left', .5*(availableWidth-newWidth)) else $('#stage').css('left', 0)

  $('#stage').css('height', newHeight)
  $('#stage').css('width', newWidth)

# -----------------------------------------
# Functions for Comment Buttons
#-----------------------------------------

window.replyToComment = () ->
  $('#reply-label').text($('#username').text()).show()
  $('#cancel-button').show()
  $('#input-field').css('padding-left', $('#reply-label').width() + 6 + 25)

window.resetInputField = ->
  console.log('reset')
  $('#input-field').val('Say something...').addClass('default')
  $('#reply-label, #cancel-button').hide()
  $('#input-field').css('padding-left', 5)

window.likeComment = ->
  commentText = $('#message').text()
  if !$('#likeComment').hasClass('liked')
    $('#likeComment').addClass('liked')
    likeCount = $('#likeCount').text()
    $('#likeCount').text(likeCount + 1)
    submitLike(commentText)

window.confirmCommentDeletion = ->
  comment = $('#message').html()
  commentText = $('#message').text()
  $('#deleteDialog').dialog();
  $('#commentToDelete').html(comment)
  $('#confirmDeletion').on('click', ->
    $('#reportComment').addClass('flagged')
    deleteComment(commentText)
  )

# -----------------------------------------
# Comment Display
#-----------------------------------------

window.displayComment = (comment) ->
  $('#reportComment').removeClass('flagged')
  $('#likeComment').removeClass('liked')
  $('#message-container').children().show()
  $('#message').text(comment['text'])
  $('#username').text('@ ' + comment['user']['username'])
  likeValue = if comment['likes'] > 0 then comment['likes'] else ''
  $('#likeCount').text(likeValue)

# -----------------------------------------
# Database: POST
#-----------------------------------------

window.submitComment = (stage)->
  # HARDCODED - will need to be updated with actual user info once user database is integrated
  user = {username: 'testuser', userID: '12dfeg92345301xsdfj', img: 'http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r'}
  timestamp = timeline.currentTimelineURI()
  text = $('#reply-label').text() + $('#input-field').val()
  $('#input-field').val('')
  comment = 
              video: timestamp.split('/')[0]
              user: user,
              timestamp: timestamp, 
              text: text,
              display: 'true'
              parent_id: ''
              discussion_id: ''
  displayComment(comment)
  $.ajax({
    type: "POST",
    url: "/comments",
    data: JSON.stringify(comment),
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
  });
  getComments(stage)

window.submitLike = (messageText)->
  updateParameters =
    selector: {"text": messageText}
  $.ajax({
    type: "POST",
    url: "/like",
    data: JSON.stringify(updateParameters),
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
  });

window.deleteComment = (messageText)->
  $('#deleteDialog').dialog('close')
  updateParameters =
    selector: {"text": messageText}
  $.ajax({
    type: "POST",
    url: "/delete",
    data: JSON.stringify(updateParameters),
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
  });

# -----------------------------------------
# Database: GET
#------------------------------------------

window.addCallback = (comments)->
  for comment in comments
    if comment['display'] is "true"
      timeline.atTimelineURI(comment['timestamp'], do(comment)-> ->displayComment(comment))

window.getComments = (stage)->
  $.ajax({
    type: "GET",
    url: "/comments",
    dataType: "json",
    success: (comments)->
      addCallback(comments)
      draw(comments, stage)
      return
  });

# -----------------------------------------
# Draw Lines on Timeline
#-----------------------------------------

window.draw = (comments, stage)->
  console.log("drawing comments on timeline")
  stage.autoClear = true; 
  stage.removeAllChildren();
  canvas = document.getElementById('comment-timeline-canvas')
  canvas.width = $('#comment-timeline-canvas-container').width()
  canvas.height = $('#comment-timeline-canvas-container').height()
  for comment in comments
    canvasWidth = document.getElementById('comment-timeline-canvas').width
    percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * (canvasWidth/100)).toPrecision(2)
    line = new createjs.Shape()
    line.graphics.beginFill("3d3d3d").drawRect(percentAcrossCanvas,0,2,canvasWidth)
    # Draws comments to timeline
    stage.addChild(line)
  stage.update()

window.timelineURItoX = (uri) ->
  time = uri.split('/')[1]
  (time/timeline.totalDuration) * 100

# --------------------------------------------------------------------------------

#---------------------------------------------------------------------------------
$ ->
    $(window).resize()

    # Create a scene controller
    window.sceneController = new lessonplan.SceneController(sceneList)

    # Create a new timeline object, and associate it with the scene
    timeline = new lessonplan.Timeline('#timeline-controls', window.sceneController, -> 
      window.getComments(stage)
    )
    console.log "after timeline"


    if window.showSubtitles? and window.showSubtitles
      window.toggleSubtitles()


    # Test reportOnDeck
    console.log "~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~"
    reportOnDeck = (ondecks) ->
        console.log ondecks

    timeline.onNewOnDeckURIs(reportOnDeck)

    window.timeline = timeline

    # -----------------------------------------
    # Volume-related JQuery
    # -----------------------------------------
    $( "#slider-vertical" ).slider(
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 95,
      slide: ( event, ui )->
        video_playing.changeVolume(ui.value/100)
    );

    $(".icon-volume-down").on(
      mouseenter: ->
          $(".ui-slider-vertical").show()
      mouseleave: ->
          $(".ui-slider-vertical").hide()
    );
    $(".ui-slider-vertical").on(
      mouseenter: ->
          $(".ui-slider-vertical").show()
      mouseleave: ->
          $(".ui-slider-vertical").hide()
    );

    #hides the volume slider on load
    $(".ui-slider-vertical").hide()


    # -----------------------------------------
    # Add timeline comment visualizer stage
    # -----------------------------------------
    stage = new createjs.Stage("comment-timeline-canvas")
    stage.on("stagemousedown", (evt)->
      console.log("clicked stage")
      canvasWidth = document.getElementById('comment-timeline-canvas').width
      timeline.seekDirectToX((evt.stageX).toPrecision(2), canvasWidth)
    )
    $(window).resize( ->
      console.log('resize')
      window.maintainAspectRatio()
      window.getComments(stage)
    );
    $(window).resize()
    
    # -----------------------------------------
    # Input-field JQuery
    #-----------------------------------------
    $('#input-field').focus( ->
      if this.value is this.defaultValue
        this.value = '';
        $(this).removeClass('inputDefault');
      #else
      #  $('#input-icon').replaceWith('<i id="cancel-button" class="icon-undo" title="Clear the input field" onclick="resetInputField();"></i>')
    ).blur( ->
      if this.value is ''
        this.value = this.defaultValue;
        $(this).addClass('inputDefault');
    ).keypress((e)->
      if e.which is 13 then submitComment(stage)
    )
