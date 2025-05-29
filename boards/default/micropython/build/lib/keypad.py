"""
Simple Keypad

Micropython library for the Simple Keypad
=======================================================

#Based on Author: 'Teeraphat Kullanankanjana' 
@dahanzimin From the Mixly Team
"""

from machine import Pin
from time import sleep

class Keypad:
    def __init__(self, row_pins, column_pins, keys):
        """Initialize the keypad object."""
        if not all(isinstance(pin, Pin) for pin in row_pins):
            raise ValueError("Row pins must be instances of Pin.")
        
        if not all(isinstance(pin, Pin) for pin in column_pins):
            raise ValueError("Column pins must be instances of Pin.")
        
        if not isinstance(keys, list) or not all(isinstance(row, list) for row in keys):
            raise ValueError("Keys must be a 2D list.")

        self.row_pins = row_pins
        self.column_pins = column_pins
        self.keys = keys

        for pin in self.row_pins:
            pin.init(Pin.IN, Pin.PULL_UP)

        for pin in self.column_pins:
            pin.init(Pin.OUT)

        if len(self.row_pins) > len(self.keys) or len(self.column_pins) > len(self.keys[0]):
            raise ValueError("Number of row/column pins does not match the key layout size.")

    def read_keypad(self):
        """Read the keypad and return the pressed key."""
        for col_pin in self.column_pins:
            col_pin.value(0)
            for i, row_pin in enumerate(self.row_pins):
                if not row_pin.value():
                    key_pressed = self.keys[i][self.column_pins.index(col_pin)]
                    col_pin.value(1)
                    return key_pressed
            col_pin.value(1)
        return None
