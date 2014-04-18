
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

    window.timeline = timeline

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
