import sys
from sounds import get_bien, get_elle
import json
import numpy as np


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

if(sys.argv[1] == "get_bien"):
    print(json.dumps(get_bien(), cls=NumpyEncoder))
else: 
    print(json.dumps(get_elle(), cls=NumpyEncoder))


sys.stdout.flush()
