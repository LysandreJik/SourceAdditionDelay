from scipy.io import wavfile
import os
import matplotlib.pyplot as plt
import numpy as np
from pprint import pprint
from scipy import signal


dirpath = os.path.dirname(os.path.abspath('__file__'))

def get_syllabe(data):
    (fs, son) = wavfile.read(dirpath+'\\ICA\\G_2_personnes_2_micro_0alarme.wav')
    return son[data[0]:data[1], 0]

def get_bien(pad=False, offset=0):
    return get_signal(60000, 20000, pad)

def get_elle(pad=False, offset=0):
    return get_signal(50000, 20000, pad)

def get_lumiere(pad=False, offset=0):
    return get_signal(75000, 20000, pad)

def get_signal(offset=0, length=20000, pad=False, path='\\ICA\\G_2_personnes_2_micro_0alarme.wav'):
    (fs, son) = wavfile.read(dirpath+'\\'+path.replace('/', '\\'))
    if offset + 20000 > len(son): raise ValueError("The offset value must be inferior to "+str(len(son) - 20000))
    if pad:
        if pad > 20000: raise ValueError("The padding value must be inferior to 20000")
        return np.append(np.zeros(pad), np.array(son[offset:offset+length-pad, 0]))/abs(np.amax(son[offset:offset+length-pad, 0]))
    else:
        return son[offset:offset+length, 0]/np.amax(son[offset:offset+length, 0])

def get_entire_signal(path, offset):
    (fs, son) = wavfile.read(dirpath+"\\"+path.replace('/', '\\'))
    print('son', len(son[:, 0]))
    print('son', son[:, 0])
    print('sqn', len(np.append(np.zeros(offset), son[:, 0])))
    print('sqn', np.append(np.zeros(offset), son[:, 0]))
    sig = np.append(np.zeros(offset), son[:, 0])
    sig = sig.astype(int)
    return sig


def get_basic_signals(name, offset=0, length=441000):
    if name == "Sine wave":
        s = np.append(np.zeros(offset), np.sin(np.linspace(0, 10, length)))
    elif name == "Square wave":
        s = np.append(np.zeros(offset), np.sign(np.sin(np.linspace(0, 10, length))))
    elif name == "Sawtooth wave":
        s = np.append(np.zeros(offset), signal.sawtooth(np.linspace(0, 10, length)))

    return s

    