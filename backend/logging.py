from .config import production_mode
import simplejson as json
from bson import json_util


if production_mode:
    db = 'production'
else:
    db = 'development'

def logged_in(user_id, remote_addr):
    print('@[{0}.login] {1}'.format(db, json.dumps({'user_id': user_id, 'remote_addr': remote_addr})))

def logged_out(user_id, remote_addr):
    print('@[{0}.logout] {1}'.format(db, json.dumps({'user_id': user_id, 'remote_addr': remote_addr})))

def page_loaded(user_id, path):
    print('@[{0}.page] {1}'.format(db, json.dumps({'user_id': user_id, 'path':path})))

def milestone_cleared(user_id, module, lesson, segment, milestone):
    print('@[{0}.milestone] {1}'.format(db,
        json.dumps(dict(user_id=user_id,
                        module=module,
                        lesson=lesson,
                        segment=segment,
                        milestone=milestone))))

def interaction(user_id, interaction_type, target, value, path_hash):
    d = dict(user_id=user_id,
        type=interaction_type,
        target=target,
        value=value,
        path_hash=path_hash)
    print('@[{0}.interaction] {1}'.format(db, json.dumps(d)))


def exam_question_answered(user_id, exam, question, option, value):
    print('@[{0}.exam] {1}'.format(db,
        json.dumps(dict(user_id=user_id,
                        exam=exam,
                        question=question,
                        option=option,
                        value=value), default=json_util.default)))