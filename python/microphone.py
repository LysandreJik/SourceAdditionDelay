import numpy as np
from scipy import signal
from scipy.io import wavfile
import os
import time
import json
import math
dirpath = os.path.dirname(os.path.abspath('__file__'))

def get_model(file_name):
    with open(dirpath+'\\models\\'+file_name+'\\delays.json') as f:
        data = json.load(f)

    return data


def normalize(X):
    return X/abs(np.amax(X))


def get_entire_signal(path, offset):
    (fs, son) = wavfile.read(dirpath+"\\python\\"+path.replace('/', '\\'))
    sig = np.append(np.zeros(offset), son[:, 0])
    sig = sig.astype(int)
    return sig


def get_basic_signals(name, offset=0, length=441000):
    if name == "Sine wave":
        s = np.append(np.zeros(offset), np.sin(np.linspace(0, 4410000, length)))
    elif name == "Square wave":
        s = np.append(np.zeros(offset), np.sign(np.sin(np.linspace(0, 4410000, length))))
    elif name == "Sawtooth wave":
        s = np.append(np.zeros(offset), signal.sawtooth(np.linspace(0, 4410000, length)))

    return s


def getxn(model, n=10000, save=False):
    start_time = time.time()
    model = json.loads(model)
    maxlength = -1

    for source in model["sources"]:
        if source['path'] == "basic":
            length = len(get_basic_signals(source['name'], offset=int(source['t0'])*44100))
        else:
            length = len(get_entire_signal(source['path'], int(source['t0'])*44100))

        if length > maxlength:
            maxlength = length

    signaux = np.zeros(maxlength)

    for source in model["sources"]:
        if source['path'] == "basic":
            signal = get_basic_signals(source['name'], offset=int(source['t0'])*44100)
            sig = normalize(np.append(signal, np.zeros(maxlength - len(signal))))
            signaux = np.c_[signaux, sig]
        else:
            signal = get_entire_signal(source['path'], int(source['t0'])*44100)
            sig = normalize(np.append(signal, np.zeros(maxlength - len(signal))))
            signaux = np.c_[signaux, sig]

    signaux = signaux[:, 1:]

    for index, microphoneRelationship in enumerate(model['relationships']):
        microphone = np.zeros(signaux.shape[0])
        for index2, individualRelationship in enumerate(microphoneRelationship):
            temporal_offset = round(44100*individualRelationship['delay'])
            if temporal_offset > 0:
                microphone = np.array(np.add(microphone, np.append(np.zeros(temporal_offset), np.dot(1-individualRelationship['attenuation'], signaux[:, index2])[0:-temporal_offset])))
            else:
                microphone = np.array(np.add(microphone, np.dot(1-individualRelationship['attenuation'], signaux[:, index2])))
        if index == 0:
            microphones = microphone
        else:
            microphones = np.c_[microphones, microphone]

    if save:
        return microphones
    else:
        return {"microphones": microphones[0:-1:math.floor(len(microphone)/n), :], "time": time.time() - start_time, "max": max(microphones.min(), microphones.max(), key=abs)}
