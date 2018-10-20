import sys
from sounds import get_file, get_signal_length
import json
import numpy as np

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

if sys.argv[1] == "signal_length":
    print(json.dumps(get_signal_length(sys.argv[2]), cls=NumpyEncoder))
elif sys.argv[1] == "signal":
    print(json.dumps(get_file(sys.argv[2]), cls=NumpyEncoder))



sys.stdout.flush()
