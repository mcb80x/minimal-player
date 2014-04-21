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

window.toggleHelp = ->
  $('#helpDialog').dialog()

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
  $('#input-field').data('parent_id', $('#message').data('id'))
  $('#input-field').data('parent_username', $('#username').text())
  $('#input-field').data('parent_text', $('#message').text())
  $('#cancel-button').show()
  $('#input-field').css('padding-left', $('#reply-label').width() + 6 + 25)

window.resetInputField = ->
  $('#input-field').blur().val('').addClass('inputDefault').css('padding-left', 5);
  $('#input-field').removeData()
  $('#reply-label, #cancel-button').hide()

window.likeComment = ->
  commentText = $('#message').text()
  if !$('#likeComment').hasClass('liked')
    $('#likeComment').addClass('liked')
    likeCount = $('#likeCount').text()
    $('#likeCount').text(likeCount + 1)
    queryString = if $('#message').data('id') is '' then {'text': $('#message').text()} else {'id': $('#message').data('id')}
    submitLike(queryString)

window.confirmCommentDeletion = ->
  comment = $('#message').html()
  commentText = $('#message').text()
  commentID = $('#message').data('id')
  $('#deleteDialog').dialog();
  $('#commentToDelete').html(comment)
  $('#confirmDeletion').on('click', ->
    $('#reportComment').addClass('flagged')
    queryString = if commentID is '' then {'text': commentText} else {'id': commentID}
    console.log('queryString', queryString)
    deleteComment(queryString)
  )

# -----------------------------------------
# Comment Display
#-----------------------------------------

window.displayComment = (comment) ->
  $('#reportComment').removeClass('flagged')
  $('#likeComment').removeClass('liked')
  $('#message-container').children().show()
  if comment['parent_text'] is ''
    $('#message').html('<span id="messageText">' + comment['text'] + '</span>')
  else
    $('#message').html('<span id="messageParent">@' + comment['parent_username'] + ' </span><span class="messageText">' + comment['text'] + '</span>')
    $('#messageParent').hover(->
      $parentDetail = $('<div/>').addClass('parentDetail').html(comment['parent_text'])
      $('#messageParent').append($parentDetail);
    , ->
      #console.log('Hi')
      $('.parentDetail').remove()
    )

  $('#username').text(comment['user']['username'])
  likeValue = if comment['likes'] > 0 then comment['likes'] else ''
  $('#likeCount').text(likeValue)
  $('#message').data('time-created', new Date().getTime())
  commentID = if comment['_id']? then comment['_id']['$oid'] else ''
  $('#message').data('id', commentID)

window.checkCommentAge = ->
  timeCreated = $('#message').data('time-created')
  now = new Date().getTime()
  if (now - timeCreated > 5000)
    $('#reportComment').removeClass('flagged')
    $('#likeComment').removeClass('liked')
    $('#message-container').children().hide()


# -----------------------------------------
# Database: POST
#-----------------------------------------

window.submitComment = (stage)->
  # HARDCODED - will need to be updated with actual user info once user database is integrated
  user = {username: 'testuser', userID: '12dfeg92345301xsdfj', img: 'http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r'}
  timestamp = timeline.currentTimelineURI()
  text = $('#input-field').val()
  parent_id = $('#input-field').data('parent_id') || ''
  parent_username = $('#input-field').data('parent_username') || ''
  parent_text = $('#input-field').data('parent_text') || ''
  comment = 
              video: timestamp.split('/')[0]
              user: user,
              timestamp: timestamp, 
              text: text,
              display: 'true',
              parent_id: parent_id,
              parent_username: parent_username,
              parent_text: parent_text
  displayComment(comment)
  resetInputField()
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

window.submitLike = (queryObject)->
  updateParameters =
    selector: queryObject
  $.ajax({
    type: "POST",
    url: "/like",
    data: JSON.stringify(updateParameters),
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
  });

window.deleteComment = (queryObject)->
  $('#deleteDialog').dialog('close')
  updateParameters =
    selector: queryObject
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
  for comment in comments when comment['display'] isnt 'false'
    canvasWidth = document.getElementById('comment-timeline-canvas').width
    percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * (canvasWidth/100)).toPrecision(2)
    line = new createjs.Shape()
    line.graphics.beginFill("3d3d3d").drawRect(percentAcrossCanvas,0,2,canvasWidth)
    line.canvasX = percentAcrossCanvas
    line.canvasY = 0
    line.canvasW = 2
    line.canvasH = canvasWidth
    # Draws comments to timeline
    stage.addChild(line)
    do(comment)->
      line.on("mouseover", (event)->
        target = event.target;
        target.graphics.clear().beginFill("33cc33").drawRect(target.canvasX, target.canvasY, target.canvasW, target.canvasH).endFill();
        stage.update()
        displayComment(comment)
      )
      line.on("mouseout", (event)->
        target = event.target;
        target.graphics.clear().beginFill("3d3d3d").drawRect(target.canvasX, target.canvasY, target.canvasW, target.canvasH).endFill();
        stage.update()
      )
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

    intervalHandler = setInterval( ->
      window.checkCommentAge()
    , 1000)
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
    stage.enableMouseOver()

    # -----------------------------------------
    # Resize video controls on window resize
    # -----------------------------------------
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
