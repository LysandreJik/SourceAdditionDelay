import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
from scipy.io import wavfile
import os
dirpath = os.path.dirname(os.path.abspath('__file__'))

def sine(frequency, size=1000):
    return np.sin(np.linspace(0, frequency, size))

def sign(frequency, size=1000):
    return np.sign(sine(frequency, size))

def chirp(frequency, size=1000):
    return signal.chirp(np.linspace(0, 10, size), f0=frequency[0], f1=frequency[1], t1=2.5)

def square_chirp(frequency, size=1000):
    return np.sign(signal.chirp(np.linspace(0, 10, size), f0=frequency[0], f1=frequency[1], t1=2.5))

def zeros():
    return np.zeros(1000)

def write_file(file, filename, fs=44100):
    wavfile.write(dirpath+"/ICA/"+filename, fs, file)
    

def show(signals, subplot=False):
    plt.figure()
    if subplot:
        for index in range(signals.shape[1]):
            plt.subplot(signals.shape[1], 1, index+1)
            plt.plot(signals[:, index])
    else:
        for index, signal in enumerate(signals):
            plt.plot(signal)
    plt.show()

    