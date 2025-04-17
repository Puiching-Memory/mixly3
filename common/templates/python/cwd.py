try:
    import os
except ImportError:
    import uos as os

print(os.getcwd(), end='')