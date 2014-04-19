
window.tempComments = [{"text": "early comment", "created_at": "2014-04-10T18:56:02.796132", "parent_id": "", "video": "fleet_week", "user": {"username": "testuser", "userID": "12dfeg92345301xsdfj", "img": "http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r"}, "timestamp": "fleet_week/19.86303", "_id": {"$oid": "534b04b5074fb2b003e30879"}, "display": "true", "discussion_id": ""}]
window.stage
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

window.toggleVolume = ->
  video_playing.toggleMute()
  if video_playing.muted is true
    $( "#slider-vertical" ).slider({value: 0})
  else
    $( "#slider-vertical" ).slider({value: 100})

# -----------------------------------------
# Display of Lines on Timeline
#-----------------------------------------

window.draw = (comments, stage)->
  console.log("draw")
  stage.autoClear = true; 
  stage.removeAllChildren();
  canvas = document.getElementById('comment-timeline-canvas')
  canvas.width = $('#comment-timeline-canvas-container').width()
  canvas.height = $('#comment-timeline-canvas-container').height()
  for comment in comments
    console.log("drawing comment")
    canvasWidth = document.getElementById('comment-timeline-canvas').width
    console.log canvasWidth
    percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * canvasWidth/100).toPrecision(2)
    line = new createjs.Shape()
    console.log(line)
    line.graphics.beginFill("3d3d3d").drawRect(percentAcrossCanvas,0,2,canvasWidth)
    # Draws comments to timeline
    stage.addChild(line)
  stage.update()

window.timelineURItoX = (uri) ->
  time = uri.split('/')[1]
  (time/timeline.totalDuration) * 100

window.resizeCommentCanvas = (tempComments, stage) ->
  draw(tempComments, stage)


$ ->
    window.maintainAspectRatio()

    $(window).resize( ->
      console.log('resize')
      window.maintainAspectRatio()
      window.resizeCommentCanvas(tempComments, stage)
    );

    # Create a scene controller
    window.sceneController = new lessonplan.SceneController(sceneList)

    # Create a new timeline object, and associate it with the scene
    timeline = new lessonplan.Timeline('#timeline-controls', window.sceneController)

    if window.showSubtitles? and window.showSubtitles
      window.toggleSubtitles()


    # Test reportOnDeck
    console.log "~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~"
    reportOnDeck = (ondecks) ->
        console.log ondecks

    timeline.onNewOnDeckURIs(reportOnDeck)

    window.timeline = timeline

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
      if e.which is 13 then submitInput()
    )

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
    window.stage = new createjs.Stage("comment-timeline-canvas")
    window.stage.on("stagemousedown", (evt)->
      console.log("clicked stage")
      canvasWidth = document.getElementById('comment-timeline-canvas').width
      timeline.seekDirectToX((evt.stageX).toPrecision(2), canvasWidth)
    )
    draw(window.tempComments, window.stage)
    setTimeout(->
      draw(window.tempComments, window.stage)
    , 2000)