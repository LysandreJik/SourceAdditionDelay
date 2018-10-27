import sys
from sounds import get_file, get_signal_length
from microphone import getxn
import json
import numpy as np
from scipy.io import wavfile
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
    wavfile.write("datasets/"+str(millis)+".wav", 44100, getxn(sys.argv[2], save=True))
    with open('datasets/'+str(millis)+'.json', 'w') as outfile:
        json.dump(sys.argv[2], outfile, cls=NumpyEncoder)

    print('Successfully saved file : ', str(millis)+".json")

sys.stdout.flush()
