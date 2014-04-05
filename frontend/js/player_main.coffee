# Run this command from minimal-player/ to continuously monitor & compile files:
# coffee --compile --watch --output static/js/ frontend/js/

window.toggleSubtitles = ->
  $('#subtitle-container').slideToggle
    duration: 400
    complete: ->
      $('subtitle-container').css('display', 'none')
      util.maintainAspect()

window.toggleComments = ->
  console.log('toggle comments')
  $('#comment-container').slideToggle
    duration: 400
    complete: ->
      $('comment-container').css('display', 'none')
      util.maintainAspect()

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


    # Create a handler for "submitComment"
    $('#comment-button').on('click', ->
        #check if player is at 0?
        #change the username to refer to an actual user
        username = 'testuser'
        timestamp = timeline.currentTimelineURI()
        text = $('input[name=comment-input]').val()
        comment = 
                    username: 'testuser',
                    timestamp: timestamp, 
                    text: text

        $.ajax({
          type: "POST",
          url: "/comments",
          data: JSON.stringify(comment),
          contentType:"application/json; charset=utf-8",
          dataType: "json",
          success: ->
            alert('successful post')
        });
    )


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

