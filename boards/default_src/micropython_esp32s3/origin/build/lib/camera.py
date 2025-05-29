"""
Camera GC032A/FrameBuffer(Inherit C module)

MicroPython library for the GC032A(Inherit C module)
=======================================================
@dahanzimin From the Mixly Team
"""

import time
from sensor import *
from machine import SoftI2C, Pin
from mixgo_sant import onboard_bot

class GC032A(Camera):
    def __init__(self, framesize=LCD, hmirror=None):
        onboard_bot.cam_en(1, 500)
        super().__init__()
        super().set_framesize(framesize)
        time.sleep_ms(100)
        if hmirror is not None:
            super().set_hmirror(hmirror)
            time.sleep_ms(100)
        SoftI2C(scl=Pin(47), sda=Pin(48), freq=400000)
        SoftI2C(scl=Pin(47), sda=Pin(38), freq=400000)

    def deinit(self):
        super().deinit()
        onboard_bot.cam_en(0, 100)

    def display(self, show=True):
        if show:
            super().display()
        else:
            super().display_stop()
