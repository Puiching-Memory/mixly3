"""
mixgo_sant Onboard resources(v1.9)

Micropython library for the mixgo_sant Onboard resources
=======================================================

@dahanzimin From the Mixly Team
"""
from machine import *
import time, gc, st7789_cf, math

'''RTC'''
rtc_clock = RTC()

'''I2C-onboard'''
#inboard_i2c = I2C(0)
inboard_i2c = SoftI2C(scl=Pin(47), sda=Pin(48), freq=400000)
onboard_i2c = SoftI2C(scl=Pin(47), sda=Pin(38), freq=400000)

'''BOT035-Sensor'''
try :
	import sant_bot
	onboard_bot = sant_bot.BOT035(inboard_i2c)
except Exception as e:
	print("Warning: Failed to communicate with BOT035 (Coprocessor) or",e)

'''TFT/240*240'''
onboard_tft = st7789_cf.ST7789(reset=onboard_bot.tft_reset, backlight=onboard_bot.tft_brightness, font_address=0xE00000)

'''ACC-Sensor'''
try :
	import sc7a20
	onboard_acc = sc7a20.SC7A20(inboard_i2c)
except Exception as e:
	print("Warning: Failed to communicate with SC7A20H (ACC) or",e)

'''ALS_PS-Sensor *2'''
try :
	import ltr553als
	onboard_als_l = ltr553als.LTR_553ALS(onboard_i2c)
except Exception as e:
	print("Warning: Failed to communicate with TR_553ALS-L (ALS&PS) or",e)

try :
	#import ltr553als
	onboard_als_r = ltr553als.LTR_553ALS(inboard_i2c)
except Exception as e:
	print("Warning: Failed to communicate with TR_553ALS-R (ALS&PS) or",e)

'''THS-Sensor'''
try :
	import shtc3
	onboard_ths = shtc3.SHTC3(inboard_i2c)
except Exception as e:
	print("Warning: Failed to communicate with GXHTC3 (THS) or",e)

'''MGS-Sensor'''
try :
	import mmc5603
	onboard_mgs = mmc5603.MMC5603(inboard_i2c)
except Exception as e:
	print("Warning: Failed to communicate with MMC5603 (MGS) or",e)

'''ASR-Sensor'''
try :
	from ci1302x import CI1302
	onboard_asr = CI1302(inboard_i2c, onboard_bot.asr_en)
except Exception as e:
	print("Warning: Failed to communicate with CI130X (ASR) or",e)

'''2RGB_WS2812'''    
from ws2812x import NeoPixel
onboard_rgb = NeoPixel(onboard_bot.rgb_sync, 4)

'''1Buzzer-Music'''
from musicx import MIDI
onboard_music = MIDI(46, pa_ctrl=onboard_bot.spk_en)

'''5KEY_Sensor'''
class KEYSensor:
	def __init__(self, pin, range):
		self.pin = pin
		self.adc = ADC(Pin(pin))
		self.adc.atten(ADC.ATTN_0DB)
		self.range = range
		self.flag = True

	def _value(self):
		values = []
		for _ in range(25):
			values.append(self.adc.read())
			time.sleep_us(5)
		return (self.range-200) < min(values) < (self.range+200)

	def get_presses(self, delay = 1):
		last_time,presses = time.time(), 0
		while time.time() < last_time + delay:
			time.sleep_ms(50)
			if self.was_pressed():
				presses += 1
		return presses

	def is_pressed(self):
		return self._value()

	def was_pressed(self):
		if(self._value() != self.flag):
			self.flag = self._value()
			if self.flag :
				return True
			else:
				return False

	def irq(self, handler, trigger):
		Pin(self.pin, Pin.IN).irq(handler = handler, trigger = trigger)

'''1KEY_Button'''
class Button(KEYSensor):
	def __init__(self, pin):
		self.pin = pin
		self.key = Pin(pin, Pin.IN)
		self.flag = True

	def _value(self):
		return not self.key.value()

B1key = Button(0)
B2key = KEYSensor(17, 0)
A1key = KEYSensor(17, 1600)
A2key = KEYSensor(17, 1100)
A3key = KEYSensor(17, 550)
A4key = KEYSensor(17, 2100)

'''2-LED''' 
class LED:
	def __init__(self, func):
		self._func = func

	def setbrightness(self, index, val):
		self._func(index, val)

	def getbrightness(self, index):
		return self._func(index)

	def setonoff(self, index, val):
		if val == -1:
			self.setbrightness(index, 100)  if self.getbrightness(index) < 50 else self.setbrightness(index, 0) 
		elif val == 1:
			self.setbrightness(index, 100) 
		elif val == 0:
			self.setbrightness(index, 0) 

	def getonoff(self, index):
		return True if self.getbrightness(index) > 50 else False

onboard_led = LED(onboard_bot.led_pwm)

class Voice_Energy:
	def read(self):
		_dat = onboard_asr._rreg(0x08, 3) #在语音识别里获取
		return (_dat[0] | _dat[1] << 8) // 10

onboard_sound = Voice_Energy()

class Clock:
	def __init__(self, x, y, radius, color, oled=onboard_tft):  #定义时钟中心点和半径
		self.display = oled
		self.xc = x
		self.yc = y
		self.r = radius
		self.color= color
		self.hour = 0
		self.min = 0
		self.sec = 0

	def set_time(self, h, m, s):  #设定时间
		self.hour = h
		self.min = m
		self.sec = s

	def set_rtctime(self):  #设定时间
		t = rtc_clock.datetime()
		self.hour = t[4]
		self.min = t[5]
		self.sec = t[6]

	def drawDial(self,color):  #画钟表刻度
		r_tic1 = self.r - 1
		r_tic2 = self.r - 2
		self.display.ellipse(self.xc, self.yc, self.r, self.r, color)
		self.display.ellipse(self.xc, self.yc, 2, 2, color,True)

		for h in range(12):
			at = math.pi * 2.0 * h / 12.0
			x1 = round(self.xc + r_tic1 * math.sin(at))
			x2 = round(self.xc + r_tic2 * math.sin(at))
			y1 = round(self.yc - r_tic1 * math.cos(at))
			y2 = round(self.yc - r_tic2 * math.cos(at))
			self.display.line(x1, y1, x2, y2, color)

	def drawHour(self,color):  #画时针
		r_hour = int(self.r / 10.0 * 5)
		ah = math.pi * 2.0 * ((self.hour % 12) + self.min / 60.0) / 12.0
		xh = int(self.xc + r_hour * math.sin(ah))
		yh = int(self.yc - r_hour * math.cos(ah))
		self.display.line(self.xc, self.yc, xh, yh, color)

	def drawMin(self,color):  #画分针
		r_min = int(self.r / 10.0 * 7)
		am = math.pi * 2.0 * self.min / 60.0
		xm = round(self.xc + r_min * math.sin(am))
		ym = round(self.yc - r_min * math.cos(am))
		self.display.line(self.xc, self.yc, xm, ym, color)

	def drawSec(self,color):  #画秒针
		r_sec = int(self.r / 10.0 * 9)
		asec = math.pi * 2.0 * self.sec / 60.0
		xs = round(self.xc + r_sec * math.sin(asec))
		ys = round(self.yc - r_sec * math.cos(asec))
		self.display.line(self.xc, self.yc, xs, ys, color)

	def draw_clock(self, bg_color=0):  #画完整钟表
		self.drawDial(self.color)
		self.drawHour(self.color)
		self.drawMin(self.color)
		self.drawSec(self.color)
		self.display.show()
		self.drawHour(bg_color)
		self.drawMin(bg_color)
		self.drawSec(bg_color)

	def clear(self, color=0):  #清除
		self.display.ellipse(self.xc, self.yc, self.r, self.r, color, True)

'''Reclaim memory'''
gc.collect()
