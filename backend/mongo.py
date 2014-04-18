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

