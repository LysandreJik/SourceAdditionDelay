import sys
from sounds import get_file, get_signal_length
from microphone import getxn
import json
import numpy as np
from scipy.io import wavfile
import os
import time


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


if sys.argv[1] == "signal":
    print(json.dumps({"signal": get_file(sys.argv[2]), "metadata": get_signal_length(sys.argv[2])}, cls=NumpyEncoder))
elif sys.argv[1] == "microphones":
    print(json.dumps(getxn(sys.argv[3], n=int(sys.argv[2])), cls=NumpyEncoder))
elif sys.argv[1] == "save":
    millis = int(round(time.time() * 1000))
    os.chdir('C:')
    wavfile.write(os.path.join(sys.argv[3], sys.argv[4] + '_' + str(millis) + ".wav"), 48000, getxn(sys.argv[2], save=True))
    with open(os.path.join(sys.argv[3], sys.argv[4] + '_' + str(millis) + ".json"), 'w') as outfile:
        print(sys.argv[2])
        json.dump(json.loads(sys.argv[2]), outfile)

    print('Successfully saved file : ', str(millis)+".json")

sys.stdout.flush()
