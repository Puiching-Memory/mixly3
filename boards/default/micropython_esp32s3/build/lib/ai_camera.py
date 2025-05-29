"""
AI-Camera (Inherit C module)

MicroPython library for the AI-Camera(Inherit C module)
=======================================================
@dahanzimin From the Mixly Team
"""

import esp_ai
from micropython import const

CODE_DETECTION      = const(0)
COLOR_DETECTION     = const(1)
MOTION_DEECTION     = const(2)
CAT_FACE_DETECTION  = const(3)
FACE_DETECTION      = const(4)
FACE_RECOGNITION    = const(5)

class AI:
    def __init__(self, function):
        self._func = function
        self._ai = None
        self._once = True

    def _init(self, *args):
        if self._func == CODE_DETECTION:
            self._ai = esp_ai.code_recognition()
        elif self._func == COLOR_DETECTION:
            self._ai = esp_ai.color_detection(color=args[0])
        elif self._func == MOTION_DEECTION:
            self._ai = esp_ai.motion_recognition(threshold=args[0])
        elif self._func == CAT_FACE_DETECTION:
            self._ai = esp_ai.cat_detection()
        elif self._func == FACE_DETECTION:
            self._ai = esp_ai.face_detection()
        elif self._func == FACE_RECOGNITION:
            self._ai = esp_ai.face_recognition()
        else:
            raise AttributeError('AI model is not supported')
        self._ai.start()    #启动检测，可以通过LCD观察结果
        self._once = False

    def _result(self, res, _t, _s=0, _n=0): #_s:第几个, _n:细分第几个
        if not res: return None
        if _t == 'len':
            return  res[0]
        elif _t == 'pos':
            if len(res) >= (5 + _s * 4):
                return res[(1 + _s * 4):(5 + _s * 4)]
        elif _t == 'keypoint':
            if len(res) >= (7 + _s * 14 + _n * 2):
                return res[(5 + _s * 14 + _n * 2):(7 + _s * 14 + _n * 2)]

    def code_recognition(self):
        if self._func == CODE_DETECTION:
            if self._once: self._init()
            return self._ai.read()
        else:
            raise AttributeError('This model can only run QR code detection')

    def color_detection(self, color=0, event='pos', num=0):
        if self._func == COLOR_DETECTION:
            if self._once: self._init(color)
            return self._result(self._ai.read(), event, num)
        else:
            raise AttributeError('This model can only run color detection')

    def motion_recognition(self, threshold=50):
        if self._func == MOTION_DEECTION:
            if self._once: self._init(threshold)
            return self._ai.read()
        else:
            raise AttributeError('This model can only run motion recognition')

    def cat_detection(self, event='pos', num=0):
        if self._func == CAT_FACE_DETECTION:
            if self._once: self._init()
            return self._result(self._ai.read(), event, num)
        else:
            raise AttributeError('This model can only run cat face detection')

    def face_detection(self, event='pos', num=0, point=0):
        if self._func == FACE_DETECTION:
            if self._once: self._init()
            return self._result(self._ai.read(), event, num, point)
        else:
            raise AttributeError('This model can only run face detection')

    def face_recognition(self, event='pos', num=0, point=0):
        if self._func == FACE_RECOGNITION:
            if self._once: self._init()
            return self._result(self._ai.recognize(), event, num, point)
        else:
            raise AttributeError('This model can only run face recognition')

    def face_enroll(self):
        if self._func == FACE_RECOGNITION:
            return self._ai.enroll()    
        else:
            raise AttributeError('This model can only run face recognition')

    def face_delete(self, _id):
        if self._func == FACE_RECOGNITION:
            self._ai.delete(_id)  
        else:
            raise AttributeError('This model can only run face recognition')
