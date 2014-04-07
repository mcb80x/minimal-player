# Run this command from minimal-player/ to continuously monitor & compile files:
# coffee --compile --watch --output static/js/ frontend/js/

window.toggleSubtitles = ->
  $('#comment-container').css('display', 'none') #hides commments so subtitles can be displayed
  $('#subtitle-container').slideToggle
    duration: 400
    complete: ->
      #$('subtitle-container').css('display', 'none')
      util.maintainAspect()

window.toggleComments = ->
  $('#subtitle-container').css('display', 'none') #hides subtitles so comments can be displayed
  console.log('toggle comments')
  $('#comment-container').slideToggle
    duration: 400
    complete: ->
      $('comment-container').css('display', 'none')
      util.maintainAspect()

window.toggleInput = ->
  if timeline.paused()
    timeline.play()
  else
    timeline.pause()
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

window.submitInput = ->
  #change the username to refer to an actual user
  username = 'testuser'
  timestamp = timeline.currentTimelineURI()
  text = $('#inputTextArea').val()
  comment = 
              username: 'testuser',
              timestamp: timestamp, 
              text: text

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
  });

window.submitConfusion = ->
  #submit confusion somehow
  timestamp = timeline.currentTimelineURI()
  $.ajax({
    type: "POST",
    url: "/confusion",
    data: timestamp,
    dataType: "text",
    success: ->
      alert('successful post')
  });

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

    #limit comment length
    left = 140
    $('#charactersLeft').text(left);
    $('#inputTextArea').keyup( ->
      left = 140 - $(this).val().length;
      $('#charactersLeft').text(left);
    );

    # Gets all comments from db, installs their callbacks
    hasCallback = []

    #removes first comment after 10000ms
    deleteComment = ->
      $('#comment-container div:first-child').remove()
    displayComment = (comment)->
      $('#comment-container').append('<div class="comment">' + comment['username'] + ': ' + comment['text'] + '</div>')
      setTimeout(deleteComment, 10000)

    addCallback = (comments)-> 
      for comment in comments
        if hasCallback.indexOf(JSON.stringify(comment)) is -1
          timeline.atTimelineURI(comment['timestamp'], do(comment)-> ->displayComment(comment))
          hasCallback.push(JSON.stringify(comment))

    getComments = ->
      #pull comments from database
      $.ajax({
          type: "GET",
          url: "/comments",
          dataType: "json",
          success: (comments)->
            console.log('successful comments get')
            addCallback(comments)
            return
        });

    getComments()
    setInterval(getComments, 1000)

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

    window.timeline = timeline

