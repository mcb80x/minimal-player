import json
from mongokit import Connection, Document
import datetime
from bson import Binary, Code
from bson.json_util import dumps
from StringIO import StringIO

# -------------------------------------------------------
# Mongo Database Connection Setup
# -------------------------------------------------------
MONGODB_HOST = '127.0.0.1'
MONGODB_PORT = 27017

# -------------------------------------------------------
# Open Mongo Connection
# -------------------------------------------------------
connection = Connection(MONGODB_HOST, MONGODB_PORT)

# -------------------------------------------------------
# Database Schema Setup
# -------------------------------------------------------
def max_length(length):
    def validate(value):
        if len(value) <= length:
            return True
        raise Exception('%s must be at most %s characters long' % length)
    return validate

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
        'discussion_id': basestring #ids are basestring because mongokit is not recognising objid
    }
    validators = {
        'text': max_length(140)
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
    newComment['discussion_id'] = request.json['discussion_id']
    newComment.save()

    return 'COMMENTS POST'

@app.route('/delete', methods=['POST'])
def comment_edit():
  comment = connection.Comment.find_one(request.json['selector'])
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