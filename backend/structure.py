import yaml


course_structure = yaml.load(open('./structure/course_structure.yml'))

if course_structure is None:
    raise ValueError('Course structure did not load correctly')


# add in svg identifier strings

def to_capital_case(s):

    return ''.join(s.title().split('_'))


for module in course_structure['modules']:

    module['identifier'] = to_capital_case(module['name'])

    for lesson in module['lessons']:
        lesson['identifier'] = to_capital_case(lesson['name'])

# count up the milestones for easy access


for module in course_structure['modules']:

    module['n_milestones'] = 0

    if module.has_key('approx_n_milestones'):
        module['n_milestones'] += module.get('approx_n_milestones', 0)

    if not module.has_key('lessons'):
        module['lessons'] = []

    for lesson in module['lessons']:

        lesson['n_milestones'] = 0
        if lesson.has_key('approx_n_milestones'):
            module['n_milestones'] += lesson.get('approx_n_milestones', 0)
            lesson['n_milestones'] += lesson.get('approx_n_milestones', 0)

        if not lesson.has_key('segments'):
            lesson['segments'] = []

        for segment in lesson['segments']:

            segment['n_milestones'] = 0

            if (not segment.has_key('milestones') or
                segment['milestones'] is None):
                segment['milestones'] = []

            n_milestones = len(segment['milestones'])
            segment['n_milestones'] += n_milestones
            lesson['n_milestones'] += n_milestones
            module['n_milestones'] += n_milestones

module_lookup = {}
segment_list_lookup = {}
segment_lookup = {}
lesson_lookup = {}

for module in course_structure['modules']:
    module_lookup[module['name']] = module
    segment_list_lookup[module['name']] = {}
    segment_lookup[module['name']] = {}
    lesson_lookup[module['name']] = {}

    for lesson in module['lessons']:
        segment_lookup[module['name']][lesson['name']] = {}
        segment_list_lookup[module['name']][lesson['name']] = lesson['segments']
        lesson_lookup[module['name']][lesson['name']] = lesson

        for segment in lesson['segments']:
            segment_lookup[module['name']][lesson['name']][segment['name']] = segment

# import pprint
# pp = pprint.PrettyPrinter(depth=5)
# pp.pprint(course_structure)

def possible_milestones(module_id, lesson_id=None, segment_id=None):
    if segment_id is not None:
        try:
            modules = course_structure['modules']
            module = [m for m in modules if m['name'] == module_id][0]
            lessons = module['lessons']
            lesson = [l for l in lessons if l['name'] == lesson_id][0]
            segments = lesson['segments']
            segment = [s for s in segments if s['name'] == segment_id][0]
            return segment['n_milestones']
        except Exception as e:
            print(e)
            raise ValueError('Invalid course segment')

    if lesson_id is not None:
        try:
            modules = course_structure['modules']
            module = [m for m in modules if m['name'] == module_id][0]
            lessons = module['lessons']
            lesson = [l for l in lessons if l['name'] == lesson_id][0]
            return lesson['n_milestones']
        except Exception as e:
            print(e)
            raise ValueError('Invalid course lesson')

    if module_id is not None:
        try:
            modules = course_structure['modules']
            module = [m for m in modules if m['name'] == module_id][0]
            return module['n_milestones']
        except Exception as e:
            print(e)
            raise ValueError('Invalid course module')

    return 0

def get_segment_list(module_id, lesson_id):
    # TODO: try/except
    return segment_list_lookup[module_id][lesson_id]

def get_lesson(module_id, lesson_id):
    return lesson_lookup[module_id][lesson_id]
