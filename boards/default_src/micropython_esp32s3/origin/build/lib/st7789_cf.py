"""
ST7789/FrameBuffer(Inherit C module)

MicroPython library for the ST7789(Inherit C module)
=======================================================
@dahanzimin From the Mixly Team
"""
import time, uframebuf
from tftlcd import LCD15

class ST7789(uframebuf.FrameBuffer_Uincode):
	def __init__(self, width=240, height=240, reset=None, backlight=None, direction=1, font_address=0x700000):
		if reset is not None:
			reset(0)
			time.sleep_ms(50)
			reset(1)
			time.sleep_ms(100)
		self.display = LCD15(portrait=direction)
		self._width = width
		self._height = height
		self._buffer = bytearray(width * height * 2)
		super().__init__(self._buffer, width, height, uframebuf.RGB565)
		self.font(font_address)
		self.show()
		self._backlight = backlight
		if backlight: self.set_brightness(0.5)

	def get_brightness(self):
		return self._backlight() / 100

	def set_brightness(self, brightness):
		if not 0.0 <= brightness <= 1.0:
			raise ValueError("Brightness must be a decimal number in the range: 0.0~1.0")
		self._backlight(int(brightness * 100))

	def color(self, red, green=None, blue=None):
		"""	Convert red, green and blue values (0-255) into a 16-bit 565 encoding."""
		if green is None or blue is None:
			return red
		else:
			return (red & 0xf8) << 8 | (green & 0xfc) << 3 | blue >> 3

	def picture(self, x, y, path):
		self.display.Picture(x, y, path)

	def show(self):
		"""Refresh the display and show the changes."""
		self.display.write_buf(self._buffer, 0, 0, self._width, self._height)
