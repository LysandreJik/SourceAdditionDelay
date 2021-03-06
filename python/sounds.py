from scipy.io import wavfile
import os
import math
import numpy as np

dirpath = os.path.dirname(os.path.abspath('__file__'))

def get_file(path):
    (fs, son) = wavfile.read(path)
    arr = np.array(son[0:-1:math.floor(len(son)/10000)])
    norm = np.linalg.norm(arr, np.inf)
    if norm == 0:
        return arr
    return arr / norm

def get_signal_length(path):
    (fs, son) = wavfile.read(path)
    return {"fs": fs, "n": len(son[:])}

