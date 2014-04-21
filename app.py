import os
import os.path
import re
import json
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
from mongokit import Connection, Document, ObjectId
import datetime
from bson import Binary, Code
from bson.json_util import dumps
from StringIO import StringIO

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
# Mongo Database Connection Setup
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
# Open Mongo Connection
# -------------------------------------------------------
connection = Connection(MONGODB_HOST, MONGODB_PORT)

# -------------------------------------------------------
# Database Schema Setup
# -------------------------------------------------------
@connection.register
class Comment(Document):
    __collection__='comments'
    __database__='comment_db'
    structure = {
        'video': basestring,
        'user': dict,
        'text': basestring,
        'created_at': basestring,
        'timestamp': basestring,
        'display': basestring,
        'parent_id': basestring,
        'parent_text': basestring,
        'likes': int
    }
    default_values = {'created_at': datetime.datetime.utcnow().isoformat(), 'display': 'true'} #format: ISODate("2014-04-04T02:45:04.226Z")
    required_fields = ['video', 'user', 'text', 'created_at', 'timestamp', 'display']
    use_dot_notation = True

@connection.register
class Confusion(Document):
    __collection__='confusion'
    __database__='comment_db'
    structure= {
        'video': basestring,
        'totalLength': float,
        'timestamps': list
    }
    required_fields = ['video', 'timestamps']
    use_dot_notation = True

db = connection.comment_db
comments = db.Comment
confusion = db.Confusion

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
# URL Routing for GET/POST Comments
# -------------------------------------------------------

@app.route('/comments', methods=['GET'])
def comment_get():
    return dumps(comments.find())

@app.route('/comments', methods=['POST'])
def comment_post():
    #creates and saves posted comment
    newComment = connection.Comment()
    newComment['video'] = request.json['video']
    newComment['text'] = request.json['text']
    newComment['timestamp'] = request.json['timestamp']
    newComment['user'] = request.json['user']
    newComment['display'] = request.json['display']
    newComment['parent_id'] = request.json['parent_id']
    newComment['parent_text'] = request.json['parent_text']
    newComment['likes'] = 0
    newComment.save()

    return 'COMMENTS POST'

@app.route('/like', methods=['POST'])
def comment_like():
  try:
    request.json['selector']['id']
  except:
    comment = connection.Comment.find_one(request.json['selector'])
  else:
    query_id = {"_id": ObjectId(request.json['selector']['id'])};
    comment = connection.Comment.find_one(query_id)
  
  comment['likes'] = comment['likes']+1
  comment.save()

@app.route('/delete', methods=['POST'])
def comment_delete():
  try:
    request.json['selector']['id']
  except:
    comment = connection.Comment.find_one(request.json['selector'])
  else:
    query_id = {"_id": ObjectId(request.json['selector']['id'])};
    comment = connection.Comment.find_one(query_id)

  comment['display'] = 'false'
  comment.save()

# -------------------------------------------------------
# URL Routing for GET/POST Confusion
# -------------------------------------------------------

@app.route('/confusion/<videoName>', methods=['GET'])
def confusion_get(videoName):
    data = dumps(confusion.find({'video': str(videoName)}))
    return render_template('confusion.jade', data=data)

@app.route('/confusion', methods=['POST'])
def confusion_post():
    videoName = request.json['timestamp'].split('/')[0]
    timestamp = request.json['timestamp'].split('/')[1]
    totalLength = request.json['totalLength']
    io = StringIO(dumps(confusion.find({'video': videoName})))
    if(len(json.load(io)) > 0):
        connection.comment_db.confusion.find_and_modify({'video':videoName}, {'$push':{'timestamps':timestamp}}) 
    else:
        newConf = connection.Confusion()
        newConf['video'] = videoName
        newConf['timestamps'] = [timestamp]
        newConf['totalLength'] = totalLength
        newConf.save()

    return 'CONFUSION POST'

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
