# Run this command from minimal-player/ to continuously monitor & compile files:
# coffee --compile --watch --output static/js/ frontend/js/

window.displayHelp = ->
  # this needs to be completed
  alert('You clicked the help button!')

window.toggleSubtitles = ->
  $('#comment-container').css('display', 'none') #hides commments so subtitles can be displayed
  $('#toggleComments').removeClass('on')

  if $('.icon-quote-left').hasClass('on')
    $('.icon-quote-left').removeClass('on')
  else $('.icon-quote-left').addClass('on')
  $('#subtitle-container').slideToggle
    duration: 400
    complete: ->
      #$('subtitle-container').css('display', 'none')
      util.maintainAspect()

drawCommentLines = false
window.toggleComments = ->
  $('#subtitle-container').css('display', 'none') #hides subtitles so comments can be displayed
  $('.icon-quote-left').removeClass('on')

  if $('#toggleComments').hasClass('on')
    #turn comments off
    $('#toggleComments').removeClass('on')
    drawCommentLines = false
    $('#comment-timeline-canvas').hide()
  else
    #turn comments on
    $('#toggleComments').addClass('on')
    drawCommentLines = true
    $('#comment-timeline-canvas').show()
  $('#comment-container').slideToggle
    duration: 400
    complete: ->
      $('comment-container').css('display', 'none')
      util.maintainAspect()

window.submitInput = ()->
  #change the username to refer to an actual user
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

  #$('#input-container').hide()

  # display comment on screen
  if replyToID is '' #if it is a new comment thread
    console.log('New Thread')
    displayComment(comment)
  else
    if $('.newComment').data('messageID') is replyToID then $('.newComment').prepend(createBasicCommentDiv(comment))
    for comment in $('.oldComments')
      if $(comment).data('messageID') is replyToID
        $(comment).prepend(createBasicCommentDiv(comment))
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
  #submit confusion somehow
  timestamp = timeline.currentTimelineURI()
  totalLength = timeline.totalDuration
  
  console.log totalLength
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
  console.log('updateParameters', updateParameters)
  $.ajax({
    type: "POST",
    url: "/delete",
    data: JSON.stringify(updateParameters),
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
  });

window.toggleVolume = ->
  console.log("toggling volume")
  if not video_playing.muted
    video_playing.mute()
    video_playing.muted = true
    $( "#slider-vertical" ).slider({value: 0})
  else
    video_playing.fullvolume()
    video_playing.muted = false
    $( "#slider-vertical" ).slider({value: 100})

window.timelineURItoX = (uri) ->
  time = uri.split('/')[1]
  (time/timeline.totalDuration) * 100

window.resetInputField = ->
  # Non-superficial
  $('#input-field').data('username', null)
  $('#input-field').data('replyToID', null)
  $('#input-field').data('discussionID', null)
  # Superficial
  $('#input-field').val('Say something...').addClass('default')
  $('#reply-label, #cancel-button').hide()
  $('#input-field').css('left', 0)

window.replyToComment = (myUsername, theirUsername, messageID, discussionID) ->
  # Non-superficial
  $('#input-field').data('username', myUsername)
  $('#input-field').data('replyToID', messageID)
  $('#input-field').data('discussionID', discussionID)
  # Superficial
  $('#reply-label').text('@' + theirUsername).show()
  $('#cancel-button').show()
  $('#input-field').css('left', $('#reply-label').width() + 6 + 25)

window.createBasicCommentDiv = (comment) ->
  $newComment = $('<div/>').addClass('oneComment').append('
          <p class="message"></p> 
          <a href="javascript:void(0);" class="reply">
            <i class="icon-mail-forward" title="Reply to this Comment"></i>
          </a>
          <a href="javascript:void(0);" class="flag" onclick="deleteComment();">
            <i class="icon-warning-sign" title="Flag Comment for Removal"></i>
          </a>')
  # add data/handlers to comment
  $newComment.find('.message').text(comment['username'] + ': ' + comment['text'])
  $newComment.find('.reply').click( (e) ->
    e.stopPropagation()
    discussionID = comment['discussion_id'] || comment['_id']['$oid']
    replyToComment('katie', comment['username'], comment['_id']['$oid'], discussionID)
  )
  # assigns messageID & discussionID for comments from the database
  if comment['discussion_id'] || comment['_id']#['$oid']
    messageID = comment['_id']['$oid']
    discussionID = comment['discussion_id'] || comment['_id']['$oid']
  # assigns message ID & discssionID for comments directly from the user (don't have IDs yet)
  else
    discussionID = 'none'
    messageID = 'none'
  $newComment.data('messageID', messageID)#comment['_id']['$oid'])
  $newComment.data('discussionID', discussionID)
  console.log('$newComment', $newComment)
  $newComment

window.displayComment = (comment, replies)->
  console.log('replies', replies)
  if comment['display'] is 'true'
    ageMostRecentComment()
    pruneAndAgeComments()

    # create a comment thread, add initial message  
    $commentThread = $('<div/>').addClass('newComment')
    $commentThread.append(createBasicCommentDiv(comment))

    # add replies
    if replies?
      $threadCount = $('<span/>').addClass('threadCount').text(replies.length)
      $commentThread.append($threadCount)
      for reply, i in replies
        $newReply = createBasicCommentDiv(reply)
        $newReply.css('bottom', 148-32*i)
        $newReply.css('width', ($newReply.find('.message').html().length*7)+70)  
        $commentThread.find('.oneComment:last').after($newReply)
    
    # add dotted line for mouseover
    $dottedLine = $('<div/>').addClass('dottedLine').css('left', 15).hide()
    $commentThread.find('.oneComment:last').after($dottedLine)
    # add comment to DOM   
    $('#comment-container').prepend($commentThread)

window.pruneAndAgeComments = ->
  # hide current comment if it is older than 5 seconds
  commentDate = $('.newComment').data("time-created")
  currentDate = new Date().getTime()
  if currentDate - commentDate > 5000 then ageMostRecentComment()      
  for comment in $('.oldComment')
    # move comments to the right
    if $(comment).hasClass('oldComment') then $(comment).css('left', $(comment).position()['left']+20)
    # Removes old comments that have moved off the screen
    if $(comment).position()['left'] + 30 > $('#player-wrapper').width() then $(comment).remove()

    
window.ageMostRecentComment = ->
  $('.newComment').find('.oneComment, .dottedLine').hide()
  $('.newComment').addClass('oldComment').css('left', '5px').click( ->
    if !$(this).data('clicked')? || $(this).data('clicked')
      #clearInterval(intervalHandler)
      $(this).children().show()
      $(this).data('clicked', false)
    else
      # restart interval handler
      $(this).find('.dottedLine').hide()
      $(this).find('.oneComment').hide()
      $(this).data('clicked', true)
  ).removeClass('newComment')

# Gets all comments from db, installs their callbacks
window.hasCallback = []
window.addCallback = (comments)-> 
    for comment in comments
      if comment['discussion_id'] is '' #we only care about 'parent' comments
        if hasCallback.indexOf(JSON.stringify(comment)) is -1
          # finds replies for particular comment
          replies = []
          replies.push(c) for c in comments when c['discussion_id'] is comment['_id']['$oid']
          timeline.atTimelineURI(comment['timestamp'], do(comment, replies)-> ->displayComment(comment, replies))
          hasCallback.push(JSON.stringify(comment))

# Pulls comments from database
window.currentComments = ''
window.getComments = (stage)->
  $.ajax({
    type: "GET",
    url: "/comments",
    dataType: "json",
    success: (comments)->
      console.log('successful comments get')
      stringifiedComments = JSON.stringify(comments)
      if currentComments isnt stringifiedComments
        console.log "new comment"
        addCallback(comments)
        draw(comments, stage)
        currentComments = stringifiedComments
      return
  });

window.draw = (comments, stage)->
  for comment in comments
    # console.log canvas.width #300
    # x/300 = percent/100
    percentAcrossCanvas = (timelineURItoX(comment['timestamp']) * 3).toPrecision(2)
    line = new createjs.Shape()
    line.graphics.beginFill("a7fd9a").drawRect(percentAcrossCanvas,0,2,300)

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
 
#Input Bar JQuery Functions
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


    # Removes first comment after 10000ms
    hideComment = ->
      console.log('deleting')
      $('#comment-container div:first').remove()

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

    # Draws comments to timeline
    ###
    stage = new createjs.Stage("comment-timeline-canvas")
    stage.on("stagemousedown", (evt)-> 
        console.log ("the canvas was clicked at "+evt.stageX)
        temp = (evt.stageX/500) * timeline.totalDuration
        timeline.seekToX(temp)
    )

    ###

    stage = new createjs.Stage("comment-timeline-canvas")
    stage.on("stagemousedown", (evt)-> 
        console.log ("the canvas was clicked at "+evt.stageX)
        timeline.seekToX((evt.stageX).toPrecision(2))
    )

    getComments(stage)
    
    intervalHandler = setInterval(->
      pruneAndAgeComments()
      getComments(stage)
    , 1000)

    #volume control
    $( "#slider-vertical" ).slider(
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 95,
      slide: ( event, ui )->
        console.log ui
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

    # Test reportOnDeck
    console.log "~~~~~~~~~ REPORT ON DECK ~~~~~~~~~~~~~"
    reportOnDeck = (ondecks) ->
        console.log ondecks

    timeline.onNewOnDeckURIs(reportOnDeck)

    # # Makes comments appear immediately on click
    # $('#comment-button').on('click', ->
    #   newText = $('#comment-field').val()
    #   $('#comment-container').append('<div class="comment">' + newText + '</div>')
    # )

    # # Test current URI (@ 1 sec intervals)
    # console.log "~~~~~~~~~ CURRENT URI ~~~~~~~~~~~~~"
    # chirp = ->
    #     currentURI = timeline.currentTimelineURI() 
    #     console.log 'Current URI'
    #     console.log currentURI
    #     console.log timeline.timelineURItoX(currentURI) + '%'

    # setInterval(chirp, 1000)


    # Test registering a callback
    # console.log "~~~~~~~~~ INSTALL TIMED CALLBACK ~~~~~~~~~~~~~"
    # timeline.atTimelineURI('fleet_week/' + (i * 5) + '.0', do (i)-> -> alert(i)) for i in [1..5]
    # timeline.atTimelineURI('fleet_week/5.0', -> alert('This is an installed callback!'))
    # timeline.atTimelineURI('fleet_week/5.0', -> alert('This is an installed callback!'))
    # timeline.atTimelineURI('fleet_week/5.0', -> alert('This is an installed callback!'))
    # timeline.atTimelineURI('fleet_week/5.0', -> alert('This is an installed callback!'))

    #hides the volume slider on load
    $(".ui-slider-vertical").hide()
    window.timeline = timeline

