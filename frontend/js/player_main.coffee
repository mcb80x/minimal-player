
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


$ ->
    window.maintainAspectRatio()


    $(window).resize( ->
      console.log('resize')
      window.maintainAspectRatio()
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

    # # Test current URI (@ 1 sec intervals)
    # console.log "~~~~~~~~~ CURRENT URI ~~~~~~~~~~~~~"
    # chirp = ->
    #     currentURI = timeline.currentTimelineURI() 
    #     console.log 'Current URI'
    #     console.log currentURI
    #     console.log timeline.timelineURItoX(currentURI) + '%'

    # setInterval(chirp, 1000)


    # Test registering a callback
    console.log "~~~~~~~~~ INSTALL TIMED CALLBACK ~~~~~~~~~~~~~"
    timeline.atTimelineURI('fleet_week/5.0', -> alert('This is an installed callback!'))

    window.timeline = timeline

