"""
WS2812 RGB(x035)

Micropython library for the WS2812 NeoPixel-RGB(method inheritance)
=======================================================
@dahanzimin From the Mixly Team
"""
from time import sleep

class NeoPixel:
	def __init__(self, func, n, bpp=3, ORDER=(0, 1, 2, 3)):
		self.func = func
		self.bpp = bpp
		self.rgbs = n
		self.ORDER = ORDER
		self.rgb_buf = bytearray(self.rgbs * bpp)
		self.write()

	def __len__(self):
		return self.rgbs

	def __setitem__(self, n, v):
		for i in range(self.bpp):
			self.rgb_buf[n * self.bpp + self.ORDER[i]] = v[i] 

	def __getitem__(self, n):
		return tuple(self.rgb_buf[n * self.bpp + self.ORDER[i]] for i in range(self.bpp))

	def fill(self, v):
		for i in range(self.bpp):
			j = self.ORDER[i]
			while j < self.rgbs * self.bpp:
				self.rgb_buf[j] = v[i]
				j += self.bpp

	def write(self):
		self.func(self.rgb_buf)

	def color_chase(self,R, G, B, wait):
		for i in range(self.rgbs):
			self.__setitem__(i,(R, G, B))
			self.write()
			sleep(wait/1000)

	def rainbow_cycle(self, wait, clear=True):
		for j in range(255):
			for i in range(self.rgbs):
				rc_index = (i * 256 // self.rgbs) + j
				self.__setitem__(i,self.wheel(rc_index & 255))
			self.write()
			sleep(wait / 1000 / 256)
		if clear:
			self.fill((0, 0, 0)) 
			self.write()

	def wheel(self,pos):
		if pos < 0 or pos > 255:
			return (0, 0, 0)
		elif pos < 85:
			return (pos * 3, 255 - pos * 3,  0)
		elif pos < 170:
			pos -= 85
			return (255 - pos * 3, 0, pos * 3)
		else:
			pos -= 170
			return (0, pos * 3, 255 - pos * 3)
