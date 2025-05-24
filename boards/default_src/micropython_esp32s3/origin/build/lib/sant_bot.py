"""
SANT_WCH

Micropython library for the SANT_WCH(--V1.8--)
=======================================================
@dahanzimin From the Mixly Team
"""
import time
from micropython import const

_BOT035_ADDRESS     = const(0x13)
_BOT5_TOUCH         = const(0x01)
_BOT035_ADC         = const(0x05)
_BOT035_PWM         = const(0x09)
_BOT035_LED         = const(0x0F)
_BOT035_STA         = const(0x12)
_BOT035_CMD         = const(0x13)
_BOT035_RGB         = const(0x14)
_BOT035_KB          = const(0x20)
_BOT035_MS          = const(0x24)
_BOT035_STR         = const(0x28)

class BOT035:
    def __init__(self, i2c_bus):
        self._i2c = i2c_bus
        self._touchs = [self.touch(0), self.touch(1)]
        self.reset()

    def _wreg(self, reg, val, digit=1):
        '''Write memory address'''
        self._i2c.writeto_mem(_BOT035_ADDRESS, reg, val.to_bytes(digit, 'little'))

    def _rreg(self, reg, nbytes=1):
        '''Read memory address'''
        self._i2c.writeto(_BOT035_ADDRESS, reg.to_bytes(1, 'little'))
        return  int.from_bytes(self._i2c.readfrom(_BOT035_ADDRESS, nbytes), 'little')

    def reset(self):
        self._i2c.writeto_mem(_BOT035_ADDRESS, _BOT035_PWM, b' Ndddd\x00\x00\x00\x8c\xb0')

    def key_adc(self):
        return self._rreg(_BOT035_ADC, 2)

    def touch(self, index, value=None):
        index = max(min(index, 1), 0)
        touch = 4095 - self._rreg(_BOT5_TOUCH + index * 2, 2)
        return touch > value if value else  touch

    def touched(self, index, value=600):
        return self.touch(index, value)

    def touch_slide(self):
        values = []
        for i in range(20):
            values.append((self.touch(1) - self._touchs[1]) - (self.touch(0) - self._touchs[0]))
        return round(sorted(values)[10] / 10) 

    def usben(self, index=1, duty=None, freq=None):
        index = max(min(index, 4), 1)
        if duty is not None:
            self._wreg(_BOT035_PWM + index + 1, int(max(min(duty, 100), 0)))
        if freq is not None:
            self._wreg(_BOT035_PWM, max(min(freq, 65535), 10), 2)
        if freq is None and duty is None:
            return self._rreg(_BOT035_PWM + index + 1), self._rreg(_BOT035_PWM ,2)

    def tft_brightness(self, brightness=None):
        if brightness is None:
            return self._rreg(_BOT035_LED)
        else:
            self._wreg(_BOT035_LED, max(min(brightness, 100), 0))

    def led_pwm(self, index=1, duty=None):
        index = max(min(index, 2), 1)
        if duty is None:
            return self._rreg(_BOT035_LED + index)
        else:
            self._wreg(_BOT035_LED + index, max(min(duty, 100), 0))

    def tft_reset(self, value):
        self._wreg(_BOT035_CMD, (self._rreg(_BOT035_CMD) & 0x7F) | (value << 7))

    def spk_en(self, value):
        self._wreg(_BOT035_CMD, (self._rreg(_BOT035_CMD) & 0xBF) | (value << 6))

    def cam_en(self, value):
        self._wreg(_BOT035_CMD, (self._rreg(_BOT035_CMD) & 0xDF) | (value << 5))
    
    def cam_reset(self, value):
        self._wreg(_BOT035_CMD, (self._rreg(_BOT035_CMD) & 0xEF) | (value << 4))

    def asr_en(self, value=None):
        self._wreg(_BOT035_CMD, (self._rreg(_BOT035_CMD) & 0xF3) | (value << 2))

    def uart_select(self, value):
        self._wreg(_BOT035_CMD, (self._rreg(_BOT035_CMD) & 0xFC) | value)

    def rgb_sync(self, buffer, n=12):
        self._i2c.writeto_mem(_BOT035_ADDRESS, _BOT035_RGB, buffer if len(buffer) < n else buffer[:n])

    def hid_keyboard(self, special=0, general=0, release=True):
        self._buf = bytearray(4)
        self._buf[0] = special
        if type(general) in (tuple, list):
            for i in range(len(general)):
                if i > 2: break
                self._buf[i + 1] = general[i]
        else:
            self._buf[1] = general
        self._i2c.writeto_mem(_BOT035_ADDRESS, _BOT035_KB, self._buf)
        if release:
            time.sleep_ms(10)
            self._i2c.writeto_mem(_BOT035_ADDRESS, _BOT035_KB, bytes(4))

    def hid_keyboard_str(self, string, delay=0):
        for char in str(string):
            self._wreg(_BOT035_STR, ord(char) & 0xFF)
            time.sleep_ms(20 + delay)

    def hid_keyboard_state(self):
        state = self._rreg(_BOT035_STA)
        return bool(state & 0x10), bool(state & 0x20), bool(state & 0x40)

    def hid_mouse(self, keys=0, move=(0, 0), wheel=0, release=True):
        self._i2c.writeto_mem(_BOT035_ADDRESS, _BOT035_MS, bytes([keys & 0x0F, move[0] & 0xFF, move[1] & 0xFF, wheel & 0xFF]))
        if release:
            time.sleep_ms(10)
            self._i2c.writeto_mem(_BOT035_ADDRESS, _BOT035_MS, bytes(4))
