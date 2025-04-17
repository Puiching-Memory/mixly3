"""
MINI GX -MixGo MINI EXT (G2, G5)

MicroPython library for the MINI GX (Expansion board for MixGo MINI)
=======================================================
@dahanzimin From the Mixly Team
"""

import gc
from machine import Pin, SoftI2C

'''i2c-extboard'''
ext_i2c = SoftI2C(scl=Pin(7), sda=Pin(8), freq=400000)

'''RFID_Sensor'''
try :
    import rc522
    ext_rfid = rc522.RC522(ext_i2c)
except Exception as e:
    print("Warning: Failed to communicate with SI522A (RFID) or",e)

'''ASR_Sensor(G5)'''
try :
    import ci130x
    ext_asr = ci130x.CI130X(ext_i2c)
except Exception as e:
    #print("Warning: Failed to communicate with CI130X (ASR) or",e)
    pass

'''Reclaim memory'''
gc.collect()
