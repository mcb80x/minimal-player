# Run this command from minimal-player/ to continuously monitor & compile files:
# coffee --compile --watch --output static/js/ frontend/js/

# -----------------------------------------
# Feature Toggling
#-----------------------------------------

window.displayHelp = ->
  $( "#helpDialog" ).dialog();

window.toggleSubtitles = ->
  if $('.icon-quote-left').hasClass('on')
    $('.icon-quote-left').removeClass('on')
    if $('#toggleComments').hasClass('on') then bumpSubtitles('down')
  else
    $('.icon-quote-left').addClass('on')
    if $('#toggleComments').hasClass('on') then bumpSubtitles('up')

  $('#subtitle-container').slideToggle
    duration: 400
    complete: ->
      util.maintainAspect()

window.bumpSubtitles = (direction) ->
  $subtitles = $('#subtitle-container')
  height = $subtitles.height()
  if direction is 'down'
    $subtitles.css('height', height - 50) # 50 = input field height + top tab height 
  if direction is 'up'
    $subtitles.css('height', height + 50)

window.toggleComments = ->
  if $('#toggleComments').hasClass('on')
    $('#toggleComments').removeClass('on')
    $('#comment-timeline-canvas').hide()
    if $('.icon-quote-left').hasClass('on') then bumpSubtitles('down')
  else
    #turn comments on
    $('#toggleComments').addClass('on')
    $('#comment-timeline-canvas').show()
    if $('.icon-quote-left').hasClass('on') then bumpSubtitles('up')
  $('#comment-container').slideToggle
    duration: 400
    complete: ->
      $('comment-container').css('display', 'none')
      util.maintainAspect()
  adjustSubtitlesForComments()

window.toggleVolume = ->
  if not video_playing.muted
    video_playing.mute()
    video_playing.muted = true
    $( "#slider-vertical" ).slider({value: 0})
  else
    video_playing.fullvolume()
    video_playing.muted = false
    $( "#slider-vertical" ).slider({value: 100})

# -----------------------------------------
# POST to Database
#-----------------------------------------

window.submitInput = ()->
  # HARDCODED - will need to be updated with actual user info once user database is integrated
  user = {username: 'testuser', userID: '12dfeg92345301xsdfj', img: 'http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r'}
  timestamp = timeline.currentTimelineURI()
  text = $('#input-field').val()
  replyToID = $('#input-field').data('replyToID') || ''
  discussionID = $('#input-field').data('discussionID') || ''
  $('#input-field').val('')
  comment = 
              video: timestamp.split('/')[0]
              user: user,
              timestamp: timestamp, 
              text: text,
              display: 'true'
              parent_id: replyToID
              discussion_id: discussionID

  if !replyToID? is #if comment is a new thread
    createCommentThread(comment, [])
  else
    for comment in $('.oldComments')
      if $(comment).data('messageID') is replyToID
        $(comment).parent().append(createComment("reply", comment))
        break

  timeline.play()
  $.ajax({
    type: "POST",
    url: "/comments",
    data: JSON.stringify(comment),
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
  });

window.submitConfusion = ->
  timestamp = timeline.currentTimelineURI()
  totalLength = timeline.totalDuration
  
  $( "#confusionDialog" ).dialog({width: 460});

  $.ajax({
    type: "POST",
    url: "/confusion",
    data: JSON.stringify({timestamp: timestamp, totalLength: totalLength})
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
  });

window.deleteComment = ->
  updateParameters =
    selector: {"text": $('.message').text()}
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
# GET comments from Database
#-----------------------------------------

# Gets all comments from db, installs their callbacks
window.addCallback = (comments)->
  for comment in comments
    if comment['discussion_id'] is '' #we only care about 'parent' comments
      if timeline.getCommentCallbackList().indexOf(JSON.stringify(comment)) is -1
        # finds replies for particular comment
        replies = []
        replies.push(c) for c in comments when c['discussion_id'] is comment['_id']['$oid']
        timeline.atTimelineURI(comment['timestamp'], do(comment, replies)-> ->createCommentThread(comment, replies))
        timeline.addCommentCallback(JSON.stringify(comment))

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
# Comment Submission
#-----------------------------------------

window.replyToComment = (myUsername, theirUsername, messageID, discussionID) ->
  $('#input-field').data('username', myUsername)
  $('#input-field').data('replyToID', messageID)
  $('#input-field').data('discussionID', discussionID)

  $('#reply-label').text('@' + theirUsername).show()
  $('#cancel-button').show()
  $('#input-field').css('padding-left', $('#reply-label').width() + 6 + 25)

window.resetInputField = ->
  $('#input-field').data('username', null)
  $('#input-field').data('replyToID', null)
  $('#input-field').data('discussionID', null)

  $('#input-field').val('Say something...').addClass('default')
  $('#reply-label, #cancel-button').hide()
  $('#input-field').css('padding-left', 5)

# -----------------------------------------
# Initial Comment Display
#-----------------------------------------

window.createComment = (type, comment) ->
  $newComment
  if type is "initial"
    $newComment = $('<div/>').addClass('oneComment').append('
            <p class="message"></p> 
            <span class="threadCount"></span>
            <a href="javascript:void(0);" class="commentReply">
              <i class="icon-mail-forward commentReply" title="Reply to this Comment"></i>
            </a>
            <a href="javascript:void(0);" class="flag" onclick="deleteComment();">
              <i class="icon-warning-sign" title="Flag Comment for Removal"></i>
            </a>')
  else # is a reply
    $newComment = $('<div/>').addClass('oneComment').append('
        <p class="message"></p> 
        <a href="javascript:void(0);" class="flag" onclick="deleteComment();">
          <i class="icon-warning-sign" title="Flag Comment for Removal"></i>
        </a>')
  $newComment.hover(->
    $newComment.find('.flag').show()
  , ->
    $newComment.find('.flag').hide()
  )
  $newComment.find('.message').text(comment['user']['username'] + ': ' + comment['text'])

  if comment['discussion_id'] || comment['_id']#['$oid']
    messageID = comment['_id']['$oid']
    discussionID = comment['discussion_id'] || comment['_id']['$oid']
  else # message ID & discssionID for comments directly from the user (don't have IDs yet)
    discussionID = ''
    messageID = ''

  $newComment.find('.commentReply').click( (e) ->
    e.stopPropagation()
    discussionID = comment['discussion_id'] || comment['_id']['$oid']
    replyToComment('testuser123', comment['user']['username'],  messageID, discussionID)
  )

  $newComment.data('messageID', messageID)
  $newComment.data('discussionID', discussionID)
  
  $newComment

window.createCommentThread = (comment, replies)->
  if comment['display'] is 'true'
    ageMostRecentComment()
    moveOldComments()

    # create a comment thread, add initial message  
    $commentThread = $('<div/>').addClass('newComment')
    $firstComment = createComment("initial", comment).css('top', 0)
    $commentThread.append($firstComment)

    # add replies
    if replies?

      lineHeight = 90 + replies.length*30
      dotPosition = 60 + replies.length*30
      count = if replies.length is 0 then '' else replies.length
      
      if replies.length > 0
        $commentThread.find('.oneComment:first').find('.threadCount').text(replies.length)
      else
        $commentThread.find('.threadCount').remove()

      for reply, i in replies
        $newReply = createComment("reply", reply)
        $newReply.css('top', 30+30*i)
        $commentThread.find('.oneComment:last').after($newReply)
    else
      $commentThread.find('.threadCount').remove()
      lineHeight = 90
      dotPosition = 60
      count = ''
    
    # add the dotted line that will be displayed on mouseover
    $dottedLine = $('<div/>').addClass('dottedLine').hide().css('height', lineHeight)
    $commentThread.append($dottedLine)
  
    #add the dot    
    $dot = $('<div/>').addClass('dot').css('left', -15).css('top', dotPosition).hide()

    $dotReply = $('<div class="dotReply"><i class="icon-mail-forward dotReply" title="Reply to this Comment"></i></div>').hide()
    $dot.append($dotReply)
    
    $dotCount = $('<div class="dotCount">'+ count + '</div>')
    $dot.append($dotCount)
    
    $commentThread.append($dot)

    # add popup feature
    $commentThread.click(->
      if !$(this).data('clicked')? || $(this).data('clicked')
        $(this).css('bottom',25-61) #edited
        $(this).data('clicked', false)
      else
        newPosition = 27 - 62 - (30*replies.length||0)
        $(this).css('bottom', newPosition) #edited
        $(this).data('clicked', true)
    )

    # position commentThread
    $commentThread.css('height', 90+(30*replies.length||0))
    $commentThread.css('bottom', 27 -62 -(30*replies.length||0))
    # add comment to DOM   
    $('#comment-container').prepend($commentThread)

    $('.icon-mail-forward').qtip({
      content: "Reply to this comment"
      position: {
        target: 'mouse', 
        adjust: { x: 0, y: 5 }
      }
    })
    $('.icon-warning-sign').qtip({
      content: "Flag this comment as inappropriate"
      position: {
        target: 'mouse', 
        adjust: { x: 0, y: 5 }
      }
    })

# -----------------------------------------
# Manipulating Comment Display
#-----------------------------------------


window.moveOldComments = ->
  commentDate = $('.newComment').data("time-created")
  currentDate = new Date().getTime()
  if currentDate - commentDate > 5000 then ageMostRecentComment() #comment disappears if old than 5 seconds     
  for comment in $('.oldComment') # moves comments to the right
    if $(comment).hasClass('oldComment') then $(comment).css('left', $(comment).position()['left']+20)
    # Removes old comments that have moved off the screen
    if $(comment).position()['left'] + 30 > $('#player-wrapper').width() then $(comment).remove()
  
window.ageMostRecentComment = ->
  $('.newComment').unbind() #this gets rid of the tab pop up on mouse click
  $('.newComment').children().hide()
  $('.newComment').find('.dot').show().click( ->
    messageID = $(this).parent().data('messageID')
    discussionID = $(this).parent().data('discussionID')
    message = $(this).parent().find('.oneComment:last .message').text()
    theirUsername = message.slice(0,message.indexOf(':'))
    replyToComment("testuser123", theirUsername, messageID, discussionID)
  )
  $('.newComment').addClass('oldComment').hover( ->
    $(this).find('.dotReply').show()
    $(this).find('.dottedLine').show()
    $(this).find('.oneComment').show()
    $(this).find('.threadCount').show()
    $(this).find('.dotCount').hide()
  , ->
    $(this).find('.dotReply').hide()
    $(this).find('.dottedLine').hide()
    $(this).find('.oneComment').hide()
    $(this).find('.threadCount').hide()
    $(this).find('.dotCount').show()
  ).removeClass('newComment').css('bottom', 27)

# -----------------------------------------
# Display of Lines on Timeline
#-----------------------------------------

window.draw = (comments, stage)->
  for comment in comments
    canvasWidth = document.getElementById('comment-timeline-canvas').width
    percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * canvasWidth/100).toPrecision(2)
    line = new createjs.Shape()
    line.graphics.beginFill("a7fd9a").drawRect(percentAcrossCanvas,0,2,canvasWidth)

    # Draws comments to timeline
    stage.addChild(line)
    stage.enableMouseOver()
    do(comment)->
      line.on("mouseover", ->
        $('#comment-timeline-canvas').qtip('toggle', true);
        newtip = '<img id="qtip-image" src="' + comment['user']['img'] + '" height="15px" width="15px"/> ' + '<span id="qtip-text">' + comment['text'] + '</span>'
        $('#comment-timeline-canvas').qtip('option', 'content.text', newtip);
      )
      line.on("mouseout", ->
        $('#comment-timeline-canvas').qtip('toggle', false);
        $('#comment-timeline-canvas').qtip('option', 'content.text', "");
      )
  stage.update()

window.timelineURItoX = (uri) ->
  time = uri.split('/')[1]
  (time/timeline.totalDuration) * 100

$ ->
    util.maintainAspect()

    # Create a scene controller
    window.sceneController = new lessonplan.SceneController(sceneList)

    # Create a new timeline object, and associate it with the scene
    timeline = new lessonplan.Timeline('#timeline-controls', window.sceneController)

    if window.showSubtitles? and window.showSubtitles
      window.toggleSubtitles()

    #if window.showComments? and window.showSubtitles
    #  window.toggleComments()
 
    # Creates tooltip for viewing comments on the timeline
    $('#comment-timeline-canvas').qtip({
      style: { classes: 'qtip-dark' }
      show: false
      content: "Hover over the lines to see comments people have made"
      position: {
        target: 'mouse', 
        adjust: { x: 0, y: 5 }
      }
    })
    
# -----------------------------------------
# Input-field JQuery
#-----------------------------------------
    $('#input-field').focus( ->
      if this.value is this.defaultValue
        this.value = '';
        $(this).removeClass('default');
      else
        $('#input-icon').replaceWith('<i id="cancel-button" class="icon-undo" title="Clear the input field" onclick="resetInputField();"></i>')
    )

    $('#input-field').blur( ->
      if this.value is ''
        this.value = this.defaultValue;
        $(this).addClass('default');
    )

    $('#input-field').keypress((e)->
      if e.which is 13 then submitInput()
    )

# -----------------------------------------
# Volume-related JQuery
#-----------------------------------------
    $( "#slider-vertical" ).slider(
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 95,
      slide: ( event, ui )->
        video_playing.muted = false
        video_playing.changevolume(ui.value/100)
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

    # Removes first comment after 10000ms
    hideComment = ->
      $('#comment-container div:first').remove()


    stage = new createjs.Stage("comment-timeline-canvas")
    stage.on("stagemousedown", (evt)-> 
        canvasWidth = document.getElementById('comment-timeline-canvas').width
        timeline.seekDirect((evt.stageX).toPrecision(2), canvasWidth)
    )

    getComments(stage)
    
    intervalHandler = setInterval(->
      moveOldComments()
      getComments(stage)
    , 1000)



    # Test reportOnDeck
    console.log "~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~"
    reportOnDeck = (ondecks) ->
        console.log ondecks

    timeline.onNewOnDeckURIs(reportOnDeck)



    #hides the volume slider on load
    $(".ui-slider-vertical").hide()
    window.timeline = timeline

