"""
CI1302(继承ci130x)

MicroPython library for the CI130Xx (ASR-I2C)
=======================================================
@dahanzimin From the Mixly Team
"""
from ci130x import CI130X

class CI1302(CI130X):
	def __init__(self, i2c_bus,  addr=0x64):
		self._device  = i2c_bus
		self._address = addr
		self._cmd_id = None

	def _wreg(self, reg):
		'''Write memory address'''
		try:
			self._device.writeto(self._address, reg)
		except Exception as e:
			raise AttributeError("Power supply may not be turned on or", e)

	def _rreg(self, reg, nbytes=1):
		'''Read memory address'''
		try:
			return self._device.readfrom_mem(self._address, reg, nbytes)
		except Exception as e:
			raise AttributeError("Power supply may not be turned on or", e)
