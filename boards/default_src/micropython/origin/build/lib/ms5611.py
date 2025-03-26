import utime
from micropython import const

_MS5611_ADDR     = const(0x77)
_CMD_ADC_READ    = const(0x00)
_CMD_RESET       = const(0x1E)
_CMD_CONVERT_D1  = const(0x40)
_CMD_CONVERT_D2  = const(0x50)
_CAL_DATA_C1     = const(0xA2)
_CAL_DATA_C2     = const(0xA4)
_CAL_DATA_C3     = const(0xA6)
_CAL_DATA_C4     = const(0xA8)
_CAL_DATA_C5     = const(0xAA)
_CAL_DATA_C6     = const(0xAC)

# Oversampling settings
OSR={"OSR_256":0, "OSR_512":2, "OSR_1024":4, "OSR_2048":6, "OSR_4096":8}

class MS5611:
	def __init__(self, i2c_bus, addr=_MS5611_ADDR, osr='OSR_4096'):
		self._device = i2c_bus
		self._address = addr
		self._wreg(_CMD_RESET)
		utime.sleep_ms(50)

		self.c1 = self._rreg(_CAL_DATA_C1, 2)
		self.c2 = self._rreg(_CAL_DATA_C2, 2)
		self.c3 = self._rreg(_CAL_DATA_C3, 2)
		self.c4 = self._rreg(_CAL_DATA_C4, 2)
		self.c5 = self._rreg(_CAL_DATA_C5, 2)
		self.c6 = self._rreg(_CAL_DATA_C6, 2)
		self.pressure_cmd_rate = _CMD_CONVERT_D1 + OSR[osr]
		self.temp_cmd_rate = _CMD_CONVERT_D2  + OSR[osr]

	def _wreg(self, val):
		'''Write memory address'''
		self._device.writeto(self._address, bytes([val]))

	def _rreg(self, reg, nbytes=1):
		'''Read memory address'''
		return int.from_bytes(self._device.readfrom_mem(self._address, reg, nbytes), 'big')

	@property
	def getdata(self):
		'''处理获取数据'''
		self._wreg(self.pressure_cmd_rate)
		utime.sleep_ms(15)
		D1 = self._rreg(_CMD_ADC_READ, 3)

		self._wreg(self.temp_cmd_rate)
		utime.sleep_ms(15)
		D2 = self._rreg(_CMD_ADC_READ, 3)

		dT = D2 - self.c5 * 2 ** 8
		TEMP = 2000 + dT * self.c6 / 2 ** 23
		OFF = self.c2 * 2 ** 16 + dT * self.c4 / 2 ** 7
		SENS = self.c1 * 2 ** 15 + dT * self.c3 / 2 ** 8

		if TEMP < 2000:
			T2 = dT * dT / 2 ** 31
			OFF2 = 5 * (TEMP - 2000) ** 2 / 2
			SENS2 = 5 * (TEMP - 2000) ** 2 / 4
			if TEMP < -1500:
				OFF2 = OFF2 + 7 * (TEMP + 1500) ** 2
				SENS2 = SENS2 + 11 * (TEMP + 1500) ** 2 / 2
			TEMP = TEMP - T2
			OFF = OFF - OFF2
			SENS = SENS - SENS2

		P = (D1 * SENS / 2 ** 21 - OFF) / 2 ** 15    
		H = (1 - (P / 101325) ** (1 / 5.255)) * 44330
		return round(P / 100, 2), round(TEMP / 100, 2), round(H, 2)

	def pressure(self): 
		return self.getdata[0]

	def temperature(self): 
		return self.getdata[1]

	def altitude(self, reference=1013.25):
		return (pow((reference / 33.8639), 0.190255) - pow((self.getdata[0] / 33.8639), 0.190255)) / 0.000013125214
