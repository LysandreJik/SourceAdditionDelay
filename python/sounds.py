from scipy.io import wavfile
import os
import matplotlib.pyplot as plt
from func import *
import math

dirpath = os.path.dirname(os.path.abspath('__file__'))

def get_file(path):
    (fs, son) = wavfile.read(path)

    return son[0:-1:math.floor(len(son)/10000), 0]

def get_signal_length(path):
    (fs, son) = wavfile.read(path)
    return {"fs": fs, "n": len(son[:, 0])}

