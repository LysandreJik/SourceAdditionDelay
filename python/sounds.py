from scipy.io import wavfile
import os
import matplotlib.pyplot as plt
from func import *

dirpath = os.path.dirname(os.path.abspath('__file__'))
(fs, son) = wavfile.read(dirpath+'\\python\\G_2_personnes_2_micro_0alarme.wav')

def t(val):
    return val*fs

def get_syllabe(data):
    return son[data[0]:data[1], 0]

def get_bien():
    return son[60000:80000, 0]

def get_elle():
    return son[50000:70000, 0]


# plt.plot(son[1455000:1460000])
# plt.show()
# write_file(get_bien(), 'bien.wav')
