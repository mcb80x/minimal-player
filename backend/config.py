# Assorted constants, paths, etc.
import os

live_course = True

production_mode = os.environ.get('MCB80X_PRODUCTION_MODE', False)
staging_mode = os.environ.get('MCB80X_STAGING_MODE', False)
use_ssl = False
if use_ssl:
    prefix = 'https://'
else:
    prefix = 'http://'


if use_ssl:
    webm_url = 'https://00154d32e8566f53ad1c-67ceeb49c91d4922c8e701c2972e0565.ssl.cf2.rackcdn.com'
else:
    webm_url = 'http://7bb8fb3a9cc11966e2b4-67ceeb49c91d4922c8e701c2972e0565.r93.cf2.rackcdn.com'


if staging_mode:

    staging_url = 'staging.mcb80x.org'

    info_site_url = prefix + staging_url
    base_url = prefix + staging_url
    app_url = prefix + staging_url
    audio_url = prefix + 'cdn.mcb80x.org/audio/cdn0'
    # if use_ssl:
    #     audio_url = 'https://dc8fe89840eb7548d2c4-3972c9f5d1fe0eebc407b0e8591b4739.ssl.cf2.rackcdn.com/cdn0'
    # else:
    #     audio_url = 'http://ebd9a9402d9df251e499-3972c9f5d1fe0eebc407b0e8591b4739.r49.cf2.rackcdn.com/cdn0'

    content3d_url = prefix + 'cdn.mcb80x.org/content3d'
    static_url = prefix + staging_url + '/static'

elif production_mode:
    info_site_url = prefix + 'www.mcb80x.org'
    base_url = prefix + 'www.mcb80x.org'
    app_url = prefix + 'www.mcb80x.org'
    audio_url = prefix + 'cdn.mcb80x.org/audio/cdn0'
    # if use_ssl:
    #     audio_url = 'https://dc8fe89840eb7548d2c4-3972c9f5d1fe0eebc407b0e8591b4739.ssl.cf2.rackcdn.com/cdn0'
    # else:
    #     audio_url = 'http://ebd9a9402d9df251e499-3972c9f5d1fe0eebc407b0e8591b4739.r49.cf2.rackcdn.com/cdn0'

    content3d_url = prefix + 'cdn.mcb80x.org/content3d'
    static_url = prefix + 'www.mcb80x.org/static'

else:
    info_site_url = '/info'
    base_url = prefix + '127.0.0.1:2664'
    app_url = base_url
    static_url = '/static'
    audio_url = prefix + 'cdn.mcb80x.org/audio/cdn0'

    # if use_ssl:
    #     audio_url = 'https://dc8fe89840eb7548d2c4-3972c9f5d1fe0eebc407b0e8591b4739.ssl.cf2.rackcdn.com/cdn0'
    # else:
    #     audio_url = 'http://ebd9a9402d9df251e499-3972c9f5d1fe0eebc407b0e8591b4739.r49.cf2.rackcdn.com/cdn0'

    content3d_url = 'http://127.0.0.1:2664/static/images3d'

interactives_url = static_url + '/interactives'
dashboard_url = app_url + '/dashboard'

player_template_file = 'player.jade'
course_map_template_file = 'course_map.jade'

# student_dashboard_template_file = 'student_dashboard.html'
# student_dashboard_template_file = 'dashboard.html'
student_dashboard_template_file = 'dashboard.jade'

debug_mode = True
# if production_mode:
#     debug_mode = False

# if debug_mode:
#     debug_suffix = '-debug'
# else:
#     debug_suffix = ''

debug_suffix = ''

site_parameters = {

    'static_base_url': static_url,
    'base_url': base_url,
    'app_base_url': app_url,
    'audio_base_url': audio_url,
    'webm_base_url': webm_url,
    'content3d_base_url': content3d_url,
    'interactives_base_url': interactives_url,
    'debug_suffix': debug_suffix
}