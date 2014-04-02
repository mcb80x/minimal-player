Since I'd love for this project to be generalizable not just to our player, but to almost any player, I've banged together a quick generic API with hooks to those minimal pieces of info a foreign player object would need to implement in order to give the discussion/scribble/whatever layer the info it needs to know, without inextricably tying that layer to our particular player.

I've only just thrown this all together, so it is safe to expect that things won't work quite right, and I'm happy to iterate and fix broken stuff.  It's also possible (probable?) that the API is not quite right for the needs of the project, and that's part of why I'd like to iterate a bit before bulletproofing extensively.


The player API provides the following hooks:

	`currentTimelineURI()`: 
		returns a unique identifier for where the current play "head" is at the moment.  This is a URI, rather than a simple time code, since our player can show more than just simple videos (an interactive sequence, sequences of multiple videos, etc. etc.). An example of a URI for a particular timecode in a particular video in a particular section of the course/site might look like `mcb80x/section-whatever/lesson-whatever/video1/12.5`.  It's up to the player to understand what that URI means.

	`atTimelineURI(uri, cb)`:
		install a callback on the time to call `cb` when `uri` is reached.  It's up to the player to determine when that is.  This is useful for triggering the display of the comment/annotation at the right time/place.

	`getOnDeckURIs()`:
		returns a list of all-but-leaf URI paths that are "coming up" (up to player to decide how this is determined).  So, if `video1` and `video2` are currently displayed on the timeline, the "on deck" list might look like `['mcb80x/section-whatever/video1', 'mcb80x/section-whatever/video2']`

	`onNewOnDeck(cb)`:
		Call `cb` when new URIs are considered to be "on deck"

	`timelineURIToX(uri)`:
		Ask the player for the X coordinate (in percent) where to place a given URI


You can also get the DOM element for the progress bar itself by looking at timeline.progressbarBackground