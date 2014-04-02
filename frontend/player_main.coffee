
window.toggleSubtitles = ->
  $('#subtitle-container').slideToggle
    duration: 400
    complete: ->
      $('subtitle-container').css('display', 'none')
      util.maintainAspect()


$ ->
    util.maintainAspect()

    # Create a scene controller
    window.sceneController = new lessonplan.SceneController(sceneList)

    # Create a new timeline object, and associate it with the scene
    window.timeline = new lessonplan.Timeline('#timeline-controls', window.sceneController)

    if window.showSubtitles? and window.showSubtitles
      window.toggleSubtitles()

