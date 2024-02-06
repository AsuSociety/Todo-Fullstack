from json import JSONEncoder
from models import Task


class TasksEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Task):
            return obj.dict()
        return super().default(obj)
    