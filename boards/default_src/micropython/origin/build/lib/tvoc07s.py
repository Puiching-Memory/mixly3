"""
TVOC

Micropython library for the TVOC(UART)
=======================================================
@dahanzimin From the Mixly Team 
"""
import time

class TVOC:
    def __init__(self, uart):
        self._uart = uart
        self._uart.init(baudrate=9600)
        self._tvoc = (0, 0 ,0)  #TVOC mg/m3, CH2O mg/m3, C02 ppm
        self._flag = False
        if not self._chip_id():
            raise AttributeError("Cannot find a TOVC")

    def _rreg(self):
        '''Read data'''
        if self._uart.any():
            eec = 0
            buf = self._uart.read(9)
            for i in buf[:8]:
                eec += i
            if (eec & 0xFF) == buf[8] and buf[0] == 0x2C:
                self._tvoc=((buf[2] << 8 | buf[3]) * 0.001, (buf[4] << 8 | buf[5]) * 0.001, buf[6] << 8 | buf[7] )
                return True

    def _chip_id(self):
        for _ in range(5):
            if self._rreg():
                return True
            time.sleep(1)
        return False

    def read(self):
        self._rreg()
        return  self._tvoc
