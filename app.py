import os
import os.path
import re
from copy import copy
from datetime import datetime

from flask import (Flask,
                   g,
                   request,
                   session,
                   render_template,
                   redirect,
                   url_for,
                   jsonify,
                   abort)

# from flask.ext import restful
from mongokit import Connection, Document

# from backend.db import User, SiteInfo, db
# from backend.login import login, oid, get_user, require_login
# from backend.facebook import facebook
# from backend.twitter import twitter
# from backend.profile import profile
# from backend.exam import exam, ExamApi
# from backend.piazza import piazza
# from backend.dashboard import dashboard
# from backend.util import recursive_dict_sum, crossdomain, hash_user, path_hash
from backend.structure import (course_structure,
                               possible_milestones,
                               get_segment_list,
                               get_lesson)
import backend.config

# from backend.progress import Progress
# from backend.status import Status

# import backend.logging
# from backend.logging import page_loaded


# -------------------------------------------------------
# mongo database connection setup <edit>
# -------------------------------------------------------
MONGODB_HOST = '127.0.0.1'
MONGODB_PORT = 27017

# -------------------------------------------------------
# Flask App Setup (flask + flask-restful)
# -------------------------------------------------------

app = Flask(__name__)

# Enable jade handling automatically
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

# -------------------------------------------------------
# open mongo connection <edit>
# -------------------------------------------------------
connection = Connection(MONGODB_HOST, MONGODB_PORT)


# -------------------------------------------------------
# set up database schema <edit>
# -------------------------------------------------------
def max_length(length):
    def validate(value):
        if len(value) <= length:
            return True
        raise Exception('%s must be at most %s characters long' % length)
    return validate

class Comment(Document):
    __collection__='comments'
    structure = {
        'username': unicode,
        'text': unicode,
        'created_at': datetime,
        'timestamp': unicode
    }
    validators = {
        'username': max_length(20), #change based on max username length
        'text': max_length(140)
    }
    default_values = {'created_at': datetime.utcnow}
    use_dot_notation = True
    # def __repr__(self):
    #     return '<Comment %r>' % (self.username)

# register the User document with our current connection
connection.register([User])


# -------------------------------------------------------
# Register login/openid blueprint
# -------------------------------------------------------
# app.register_blueprint(login)

# secret_key = os.environ.get('FLASK_SECRET_KEY')
# if secret_key is None:
#     # try pulling config from a file
#     app.config.from_pyfile('config.cfg')
# else:
#     app.config['SECRET_KEY'] = secret_key

# oid.init_app(app)

# -------------------------------------------------------
# Register Facebook Connect and Twitter blueprints
# -------------------------------------------------------
# app.register_blueprint(facebook)
# app.register_blueprint(twitter)


# -------------------------------------------------------
# Register other blueprints
# -------------------------------------------------------

# app.register_blueprint(profile)
# app.register_blueprint(exam)
# app.register_blueprint(piazza)

# -------------------------------------------------------
# Before Request
# -------------------------------------------------------

# @app.before_request
# def set_user_if_logged_in():
#     if (request.endpoint == 'log_interaction' or
#         request.endpoint == 'progress' or
#         request.endpoint == 'exam_answers'):
#         return

#     g.user = get_user()


# -------------------------------------------------------
# Static Routes
# ------------------
#
# Routes to static content, hopefully cached by a CDN
# -------------------------------------------------------


@app.route('/static/<path:path>')
def development_mode_static(path):
    return redirect(url_for('static', filename=path))



# -------------------------------------------------------
# Error routes
# -------------------------------------------------------

@app.errorhandler(404)
def page_not_found(e):
    parameters = copy(backend.config.site_parameters)
    return render_template('404.jade', **parameters), 404


@app.errorhandler(500)
def page_error(e):
    parameters = copy(backend.config.site_parameters)
    return render_template('500.jade', **parameters), 500



# -------------------------------------------------------
# URL Routing for Course Content
# -------------------------------------------------------

# Complete course path
@app.route('/course/<module_id>/<lesson_id>/<segment_id>')
def course_content(module_id, lesson_id, segment_id, login_required=True):

    # if login_required and g.user is None:
    #     return require_login()

    parameters = copy(backend.config.site_parameters)

    player_template = backend.config.player_template_file

    parameters['module_id'] = module_id
    parameters['lesson_id'] = lesson_id
    parameters['segment_id'] = segment_id
    segments = get_segment_list(module_id, lesson_id)
    parameters['segment_list'] = segments

    # if login_required:
    #     parameters['subtitles'] = g.user['subtitles']
    #     parameters['hdvideo'] = g.user['hdvideo']

    # parameters['path_hash'] = path_hash(module_id, lesson_id, segment_id)

    interactives = set()
    for segment in segments:
        seg_interactives = segment.get('interactives', [])
        print 'seg_interactives'
        print seg_interactives
        interactives = interactives.union(set(seg_interactives))

    parameters['interactives'] = interactives


    parameters['show_interactive_tutorial'] = False
    # if len(interactives):
    #     parameters['show_interactive_tutorial'] = True

    # try:
    #     page_loaded(g.user['user_id'], '/course/{0}/{1}/{2}'.format(module_id, lesson_id, segment_id))
    # except:
    #     pass


    browser = request.user_agent.browser
    version = request.user_agent.version and int(request.user_agent.version.split('.')[0])
    platform = request.user_agent.platform
    uas = request.user_agent.string

    # Thou shalt not do browser detection this way. Except we're going to anyways.
    parameters['unsupported_browser'] = False
    if browser and version:
            if (browser == 'msie' and version < 9) \
            or (browser == 'firefox' and version < 4) \
            or (platform == 'android') \
            or (platform == 'iphone') \
            or ((platform == 'macos' or platform == 'windows') and browser == 'safari' and not re.search('Mobile', uas) and version < 534) \
            or (re.search('iPad', uas)) \
            or (platform == 'windows' and re.search('Windows Phone OS', uas)) \
            or (browser == 'opera') \
            or (re.search('BlackBerry', uas)):

                if len(interactives):
                    parameters['unsupported_browser'] = True

    parameters['unsupported_mobile'] = False
    if browser and version:
            if (platform == 'android') \
            or (platform == 'iphone') \
            or (re.search('iPad', uas)):
                parameters['unsupported_mobile'] = True

    return render_template(player_template, **parameters)


@app.route('/nologin/<module_id>/<lesson_id>/<segment_id>')
def course_content_nologin(module_id, lesson_id, segment_id):
    return course_content(module_id, lesson_id, segment_id, login_required=False)




# -------------------------------------------------------
# Interaction logging
# -------------------------------------------------------
@app.route('/log-interaction', methods=['POST'])
def log_interaction():

    # hollowed out
    return 'OK'



# -------------------------------------------------------
# Debug
# -------------------------------------------------------

if __name__ == "__main__":
    app.run(port=2664, debug=True)

