import sys
from sounds import get_file, get_signal_length
import json
import numpy as np

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


print(json.dumps({"signal": get_file(sys.argv[2]), "metadata": get_signal_length(sys.argv[2])}, cls=NumpyEncoder))




sys.stdout.flush()
