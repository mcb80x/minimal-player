# Run this command from minimal-player/ to continuously monitor & compile files:
# coffee --compile --watch --output static/js/ frontend/js/

window.toggleSubtitles = ->
  $('#comment-container').css('display', 'none') #hides commments so subtitles can be displayed
  $('.icon-comment').removeClass('on')

  if $('.icon-quote-left').hasClass('on')
    $('.icon-quote-left').removeClass('on')
  else $('.icon-quote-left').addClass('on')
  $('#subtitle-container').slideToggle
    duration: 400
    complete: ->
      #$('subtitle-container').css('display', 'none')
      util.maintainAspect()

window.toggleComments = ->
  $('#subtitle-container').css('display', 'none') #hides subtitles so comments can be displayed
  $('.icon-quote-left').removeClass('on')

  if $('.icon-comment').hasClass('on')
    $('.icon-comment').removeClass('on')
  else $('.icon-comment').addClass('on')
  $('#comment-container').slideToggle
    duration: 400
    complete: ->
      $('comment-container').css('display', 'none')
      util.maintainAspect()

wasPausedByInput = false
window.toggleInput = ->
  ###
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
  ###

replyToID = null
discussionID = null
window.submitInput = ()->
  #change the username to refer to an actual user
  user = {username: 'testuser', userID: '12dfeg92345301xsdfj', img: 'http://www.gravatar.com/avatar/705a657e42d328a1eaac27fbd83eeda2?s=200&r=r'}
  timestamp = timeline.currentTimelineURI()
  text = $('#input-field').val()
  $('#input-field').val('')
  comment = 
              video: timestamp.split('/')[0]
              user: user,
              timestamp: timestamp, 
              text: text,
              display: 'true'
              parent_id: replyToID
              discussion_id: discussionID

  $('#input-container').hide()

  timeline.play()
  $.ajax({
    type: "POST",
    url: "/comments",
    data: JSON.stringify(comment),
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: ->
      alert('successful post')
      replyToID = null
      discussionID = null
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

#window.removeComment = ->
#  window.editComment({"selector": {"text": $('.message').text()}, "field": "display", "newValue": "false"})

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

    $('#input-field').focus( ->
      if this.value is this.defaultValue
        this.value = '';
        $(this).removeClass('default');
    )

    $('#input-field').blur( ->
      if this.value is ''
        this.value = this.defaultValue;
        $(this).addClass('default');
    )

    $('.hideUntilMouseOver').hide()

    $('#first, #second, #third').mouseenter(->
      $(this).addClass('expanded')
      $(this).find('.hideUntilMouseOver').show()
    )
    $('#first, #second, #third').mouseleave(->
      $(this).removeClass('expanded')
      $(this).find('.hideUntilMouseOver').hide()
    )

    #appropriately thread reply-comments
    $("#first .icon-mail-reply").on("click", ->
      alert "clicked first reply"
      replyToID = $("#first").data("messageID")
      discussionID = $("#first").data("discussionID")
    )
    
    $("#second .icon-mail-reply").on("click", ->
      alert "clicked second reply"
      replyToID = $("#second").data("messageID")
      discussionID = $("#second").data("discussionID")
    )

    $("#third .icon-mail-reply").on("click", ->
      alert "clicked third reply"
      replyToID = $("#third").data("messageID")
      discussionID = $("#third").data("discussionID")
    )

    $('#input-field').keypress((e)->
      if e.which is 13 then submitInput()
    )

    # Gets all comments from db, installs their callbacks
    hasCallback = []

    #removes first comment after 10000ms
    hideComment = ->
      console.log('deleting')
      $('#comment-container div:first').remove()

    displayComment = (comment)->
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
        $('#third .userAndTime').text(comment['user']['username'] + ' @ ' + new Date().toDateString())


    addCallback = (comments)-> 
      for comment in comments
        if hasCallback.indexOf(JSON.stringify(comment)) is -1
          timeline.atTimelineURI(comment['timestamp'], do(comment)-> ->displayComment(comment))
          hasCallback.push(JSON.stringify(comment))

    draw = (comments)->
      canvas = document.getElementById('comment-timeline-canvas')
      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f00";
      for comment in comments
        # console.log canvas.width #300
        # x/300 = percent/100
        percentOfCanvas = (timelineURItoX(comment['timestamp']) * 3).toPrecision(2)
        ctx.fillRect(percentOfCanvas,0,1,300); #x, y, w, h
    
    getComments = ->
      #pull comments from database
      $.ajax({
          type: "GET",
          url: "/comments",
          dataType: "json",
          success: (comments)->
            console.log('successful comments get')
            draw(comments)
            addCallback(comments)
            return
      });

    getComments()
    setInterval(getComments, 1000)

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
          #stuff to do on mouse enter
          $(".ui-slider-vertical").show()
      mouseleave: ->
          #stuff to do on mouse leave
          $(".ui-slider-vertical").hide()
    );
    $(".ui-slider-vertical").on(
      mouseenter: ->
          #stuff to do on mouse enter
          $(".ui-slider-vertical").show()
      mouseleave: ->
          #stuff to do on mouse leave
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

