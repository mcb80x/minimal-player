# Script

scene('Fleet Week!', 'fleet_week') ->

    video('Fleet Week!') ->

        # MP4 sd
        mp4 'http://player.vimeo.com/external/77888763.sd.mp4?s=30b009d8ea547f3974295574d519488d', 'sd'

        # MP4 hd
        mp4 'http://player.vimeo.com/external/77888763.hd.mp4?s=84c1ac01be52cc659b34b43aa5c6adf4', 'hd'

        # WEBM sd
        webm 'fleet_week.sd.webm', 'sd'

        # WEBM hd
        # webm 'fleet_week.hd.webm', 'hd'

        subtitles 'fleet_week'

        at(5.0) -> milestone 'start'

        at(10.0) -> milestone 'middle'
