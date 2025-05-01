from js import window


def createBackground(img):
    return window.mixlySprite.createBackground(img)


class Sprite:
    def __init__(self, img, x, y, name=''):
        self.vname = window.mixlySprite.createASprite(img, x, y, name)
    
    @property
    def this(self):
        return window.mixlySprite.sprites.__getattribute__(self.vname)

    def show(self):
        return self.this.show()

    def hide(self):
        return self.this.hide()
        
    def enlarge(self):
        return self.this.enlarge()
    
    def enlargeTo(self, s):
        return self.this.enlargeTo(s)
        
    def expandTo(self, s, time):
        return self.this.expandTo(s, time)
        
    def move(self, step):
        return self.this.move(step)
        
    def moveTo(self, x, y):
        return self.this.moveTo(x, y)
        
    async def slideTo(self, x, y, time):
        return await self.this.slideTo(x, y, time)
        
    def addX(self, step):
        return self.this.addX(step)
        
    def addY(self, step):
        return self.this.addY(step)
    
    def getX(self):
        return self.this.getX()
    
    def getY(self):
        return self.this.getY()
    
    def rotate(self, degree):
        return self.this.rotate(degree)
    
    def rotateTo(self, degree):
        return self.this.rotateTo(degree)
    
    def circleTo(self, degree):
        return self.this.circleTo(degree)
    
    def hit(self, sprite2):
        return self.this.hit(sprite2.this)
    
    def outOfScreen(self):
        return self.this.outOfScreen()
    
    def mouseAction(self, calc):
        return self.this.mouseAction(calc)
    
    def isClicked(self):
        return self.this.isDown
    
    def setScale(self, h, w):
        return self.this.setScale(h, w)
    
    def filterGray(self):
        return self.this.filterGray()
    
    def filterBrighter(self):
        return self.this.filterBrighter()
    
    def filterOrigin(self):
        return self.this.filterOrigin()
    

class Text:
    def __init__(self, text, x, y, name=''):
        self.vname = window.mixlySprite.createText(text, x, y, name)
    
    @property
    def this(self):
        return window.mixlySprite.texts.__getattribute__(self.vname)
    
    def changeText(self, text):
        return self.this.changeText(text)
    
    def show(self):
        return self.this.show()
    
    def hide(self):
        return self.this.hide()
    

def clearAllSprites():
    return window.mixlySprite.clearAllSprites()
    
def repeat(calc):
    return window.mixlySprite.repeat(calc)
    
def keyboardListener(calc):
    return window.mixlySprite.keyboardListener(key, calc)
    
def isKeyboardHit(keyvalue):
    return window.mixlySprite.isKeyboardHit(keyvalue)

def getTime():
    return window.mixlySprite.timer / 1000

def clearTimer():
    return window.mixlySprite.clearTimer()