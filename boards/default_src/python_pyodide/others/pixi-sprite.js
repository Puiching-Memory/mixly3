import PIXI from 'pixi.js';
import $ from 'jquery';


const mixlySprite = {
    stage: new PIXI.Container(),
    pointer: { x: 0, y: 0 },
    backgroundSprite: null,
    sprites: {},
    texts: {},
    counter: 0,
    keys: {},
    state: false,
    running: false,
    repeatPlay: () => { },

    displayTag: false,
    processingDisplayEvent: null,

    successDisplayEvents: [],
    successProcessingDisplayEvents: [],

    startTime: performance.now(),
    timer: 0,
    lastFrameTime: null,
    lastSecond: null,
    targetFPS: 60,
    frameCount: 0,
    currentFPS: 60,

    canvasHeight: 450,
    canvasWidth: 800
};

mixlySprite.gameLoop = () => {
    if (mixlySprite.state == true) {
        mixlySprite.repeatPlay();
        mixlySprite.gameLoopDisplay();
    }
    mixlySprite.timer = performance.now() - mixlySprite.startTime;
}
mixlySprite.animate = (currentTime) => {
    const deltaTime = currentTime - mixlySprite.lastFrameTime;

    if (deltaTime >= 1000 / mixlySprite.targetFPS) {
        mixlySprite.frameCount++;
        mixlySprite.gameLoop();
        mixlySprite.renderer.render(mixlySprite.stage);
        mixlySprite.lastFrameTime = currentTime;
    }
    if (currentTime - mixlySprite.lastSecond >= 1000) {
        mixlySprite.currentFPS = mixlySprite.frameCount;
        mixlySprite.frameCount = 0;
        mixlySprite.lastSecond = currentTime;
    }
    requestAnimationFrame(mixlySprite.animate);
}

mixlySprite.createBackground = (img, mode = 0) => {
    var player;
    if (mode == 0) {
        // eslint-disable-next-line new-cap
        player = new PIXI.Sprite.fromImage(`../common/media/spriteimg/${img}.png`);
    }
    player.name = 'background';
    player.anchor.set(0.5);
    player.x = mixlySprite.canvasWidth / 2;
    player.y = mixlySprite.canvasHeight / 2;

    // const $canvas = $('#spriteContainer canvas');
    // const canvasWidth = $canvas.width();
    // const canvasHeight = $canvas.height();
    // player.width = ($('body').width() / 2);
    // player.height = ($('body').width() / 2)/canvasWidth*canvasHeight;

    player.width = mixlySprite.canvasWidth;
    player.height = mixlySprite.canvasHeight;

    player.interactive = true;
    player.buttonMode = true;
    player.isDown = false;
    player.isUp = true;
    player.on('mousedown', function () {
        this.isDown = true;
        this.isUp = false;
        if (mixlySprite.state) this.runningMouseDown();
    })
        .on('mouseup', function () {
            this.isDown = false;
            this.isUp = true;
        })
        .on('mouseupoutside', function () {
            this.isDown = false;
            this.isUp = true;
        });
    player.runningMouseDown = new Function("");
    if (mixlySprite.backgroundSprite && mixlySprite.backgroundSprite.parent) {
        // 如果子节点已经在父节点中，需要先移除
        mixlySprite.stage.removeChild(mixlySprite.backgroundSprite);
    }
    mixlySprite.backgroundSprite = player;
    mixlySprite.stage.addChildAt(mixlySprite.backgroundSprite, 0);
    return 0;
}

mixlySprite.createASprite = (img, x = mixlySprite.canvasWidth / 2, y = mixlySprite.canvasHeight / 2, name = '', mode = 0) => {
    if (name == '') {
        name = 'sprite' + (++mixlySprite.counter);
    }
    var player;
    if (mode == 0) {
        // eslint-disable-next-line new-cap
        player = new PIXI.Sprite.fromImage(`../common/media/spriteimg/${img}.png`);
    }
    if (!mixlySprite.sprites[name] && !mixlySprite.texts[name]) {
        player.name = name;
        player.anchor.set(0.5);
        player.x = x;
        player.y = y;
        player.interactive = true;
        player.buttonMode = true;
        player.isDown = false;
        player.isUp = true;
        player.on('mousedown', function (event) {
            this.isDown = true;
            this.isUp = false;
            if (!mixlySprite.state) {
                this.data = event.data;
                this.alpha = 0.5;
                this.dragging = true;
            } else this.runningMouseDown();
        })
            .on('mouseup', function () {
                this.isDown = false;
                this.isUp = true;
                if (!mixlySprite.state) {
                    this.alpha = 1;
                    this.dragging = false;
                    this.data = null;
                }
            })
            .on('mouseupoutside', function () {
                this.isDown = false;
                this.isUp = true;
                if (!mixlySprite.state) {
                    this.alpha = 1;
                    this.dragging = false;
                    this.data = null;
                }
            })
            .on('mousemove', function () {
                if (!mixlySprite.state)
                    if (this.dragging) {
                        var newPosition = this.data.getLocalPosition(this.parent);
                        this.position.x = newPosition.x;
                        this.position.y = newPosition.y;
                    }
            })
        player.runningMouseDown = new Function("");
        player.show = function () {
            this.visible = true;
        };
        player.hide = function () {
            this.visible = false;
        };
        player.enlarge = function (s) {
            const ratio = this.height / this.width;
            var measure = Math.sqrt(this.height * this.width);
            measure += s;
            this.width = Math.sqrt(measure * measure / ratio);
            this.height = this.width * ratio;
        };
        player.enlargeTo = function (s) {
            var ratio = this.height / this.width;
            this.width = Math.sqrt(s * s / ratio);
            this.height = this.width * ratio;
        };

        player.expandTo = async function (s, time = 1) {
            if (mixlySprite.running) {
                mixlySprite.displayTag = true;
                mixlySprite.processingDisplayEvent = {
                    sprite: this,
                    targetS: s,
                    totalTime: time * 1000,
                    startTime: performance.now(),
                    displayType: 'expand'
                };

                var prom = new Promise((resolve) => {
                    if (mixlySprite.displayTag === false) {
                        resolve();
                    } else {
                        const checkTagInterval = setInterval(() => {
                            if (mixlySprite.displayTag === false) {
                                clearInterval(checkTagInterval);
                                resolve();
                            }
                        }, 10);
                    }
                });
                return await prom;
            }
            mixlySprite.successProcessingDisplayEvents.push({
                sprite: this,
                targetS: s,
                totalTime: time * 1000,
                startTime: performance.now(),
                displayType: 'expand'
            });
            return 0;
        };

        player.move = function (step) {
            this.x += step * Math.cos(this.rotation);
            this.y += step * Math.sin(this.rotation);
        };
        player.moveTo = function (x, y) {
            this.x = x;
            this.y = y;
        };
        player.slideTo = async function (x, y, time = 1) {
            if (mixlySprite.running) {
                mixlySprite.displayTag = true;
                mixlySprite.processingDisplayEvent = {
                    sprite: this,
                    targetX: x,
                    targetY: y,
                    totalTime: time * 1000,
                    startTime: performance.now(),
                    displayType: 'slide'
                };

                var prom = new Promise((resolve) => {
                    const checkTagInterval = setInterval(() => {
                        if (mixlySprite.displayTag === false) {
                            clearInterval(checkTagInterval);
                            resolve();
                        }
                    }, 10);
                });

                return await prom;
            }
            mixlySprite.successProcessingDisplayEvents.push({
                sprite: this,
                targetX: x,
                targetY: y,
                totalTime: time * 1000,
                startTime: performance.now(),
                displayType: 'slide'
            });
            return 0;
        };
        player.addX = function (step) {
            this.x += step;
        };
        player.addY = function (step) {
            this.y += step;
        };
        player.rotate = function (degree) {
            this.rotation += Math.PI / 180 * degree;
        };
        player.rotateTo = function (degree) {
            this.rotation = Math.PI / 180 * degree;
        };
        player.circleTo = async function (degree, time = 1) {
            if (mixlySprite.running) {
                mixlySprite.displayTag = true;
                mixlySprite.processingDisplayEvent = {
                    sprite: this,
                    targetDegree: degree,
                    totalTime: time * 1000,
                    startTime: performance.now(),
                    displayType: 'circle'
                };
                var prom = new Promise((resolve) => {
                    if (mixlySprite.displayTag === false) {
                        resolve();
                    } else {
                        const checkTagInterval = setInterval(() => {
                            if (mixlySprite.displayTag === false) {
                                clearInterval(checkTagInterval);
                                resolve();
                            }
                        }, 10);
                    }
                });
                return await prom;
            }
            mixlySprite.successProcessingDisplayEvents.push({
                sprite: this,
                targetDegree: degree,
                totalTime: time * 1000,
                startTime: performance.now(),
                displayType: 'circle'
            });
            return 0;
        };
        player.hit = function (sprite) {
            return mixlySprite.hitTestRectangle(this, sprite);
        };
        player.outOfScreen = function () {
            return this.y >= mixlySprite.renderer.height || this.y <= 0 || this.x <= 0 || this.x >= mixlySprite.renderer.width;
        };
        player.mouseAction = function (func) {
            this.runningMouseDown = func;
        };

        // new
        player.setScale = function (h = 0, w = 0) {
            if (h == 0) h = this.height;
            if (w == 0) w = this.width;
            this.height = h;
            this.width = w;
        }
        player.filterGray = function () {
            const grayscaleFilter = new PIXI.filters.ColorMatrixFilter();
            grayscaleFilter.blackAndWhite();
            this.filters = [grayscaleFilter];
        }
        player.filterBrighter = function () {
            const brightnessFilter = new PIXI.filters.ColorMatrixFilter();
            brightnessFilter.brightness(1.25); // 增加亮度
            this.filters = [brightnessFilter];
        }
        player.filterOrigin = function () {
            this.filters = null;
        }

        mixlySprite.stage.addChild(player);
        mixlySprite.sprites[name] = player;
    }
    return name;
}

mixlySprite.clearAllSprites = () => {
    if (mixlySprite.backgroundSprite && mixlySprite.backgroundSprite.parent) mixlySprite.backgroundSprite.parent.removeChild(mixlySprite.backgroundSprite);
    for (const name in mixlySprite.sprites) {
        mixlySprite.sprites[name].parent.removeChild(mixlySprite.sprites[name]);
        delete mixlySprite.sprites[name];
    }
    for (const name in mixlySprite.texts) {
        mixlySprite.texts[name].parent.removeChild(mixlySprite.texts[name]);
        delete mixlySprite.texts[name];
    }
    mixlySprite.counter = 0;
    mixlySprite.clearTimer();
    return 0;
}

mixlySprite.createText = (text, x = mixlySprite.canvasWidth / 2, y = mixlySprite.canvasHeight / 2, name = '') => {
    if (name == '') {
        name = 'text' + (++mixlySprite.counter);
    }
    if (!mixlySprite.sprites[name] && !mixlySprite.texts[name]) {
        var textObj = new PIXI.Text(text);
        textObj.name = name;
        textObj.x = x;
        textObj.y = y;
        textObj.interactive = true;
        textObj.buttonMode = true;
        textObj.on('mousedown', function (event) {
            this.isDown = true;
            this.isUp = false;
            if (!mixlySprite.state) {
                this.data = event.data;
                this.alpha = 0.5;
                this.dragging = true;
            } else this.runningMouseDown();
        })
            .on('mouseup', function () {
                this.isDown = false;
                this.isUp = true;
                if (!mixlySprite.state) {
                    this.alpha = 1;
                    this.dragging = false;
                    this.data = null;
                }
            })
            .on('mouseupoutside', function () {
                this.isDown = false;
                this.isUp = true;
                if (!mixlySprite.state) {
                    this.alpha = 1;
                    this.dragging = false;
                    this.data = null;
                }
            })
            .on('mousemove', function () {
                if (!mixlySprite.state)
                    if (this.dragging) {
                        var newPosition = this.data.getLocalPosition(this.parent);
                        this.position.x = newPosition.x;
                        this.position.y = newPosition.y;
                    }
            });
        textObj.runningMouseDown = new Function("");
        textObj.changeText = function (text) {
            this.text = text;
        };
        textObj.show = function () {
            this.visible = true;
        };
        textObj.hide = function () {
            this.visible = false;
        };
        mixlySprite.stage.addChild(textObj);
        mixlySprite.texts[name] = textObj;
    }
    return name;
}

mixlySprite.hitTestRectangle = (r1, r2) => {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    hit = false;
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
};

mixlySprite.repeat = (func) => {
    mixlySprite.repeatPlay = func;
}

mixlySprite.isKeyboardHit = (keyvalue) => {
    if (!mixlySprite.keys[keyvalue]) {
        let key = mixlySprite.keyboard(keyvalue);
        mixlySprite.keys[keyvalue] = key;
    }
    return mixlySprite.keys[keyvalue].isDown;
}

mixlySprite.keyboardListener = (keyvalue, func) => {
    if (!mixlySprite.keys[keyvalue]) {
        let key = mixlySprite.keyboard(keyvalue);
        key.press = function () {
            if (mixlySprite.state) func();
        };
        mixlySprite.keys[keyvalue] = key;
    } else {
        mixlySprite.keys[keyvalue].press = function () {
            if (mixlySprite.state) func();
        };
    }
}
mixlySprite.keyboard = (value) => {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };
    return key;
}

mixlySprite.clearTimer = () => {
    mixlySprite.startTime = performance.now();
}

mixlySprite.gameLoopDisplay = () => {
    if (mixlySprite.processingDisplayEvent) {
        const pSE = mixlySprite.processingDisplayEvent;
        switch (pSE.displayType) {
            case 'slide':
                if (performance.now() >= pSE.totalTime + pSE.startTime) {
                    pSE.sprite.moveTo(pSE.targetX, pSE.targetY);
                    mixlySprite.displayTag = false;
                    mixlySprite.processingDisplayEvent = null;
                } else {
                    var leftLoops = mixlySprite.currentFPS * (pSE.totalTime + pSE.startTime - performance.now()) / 1000;
                    if (leftLoops >= 1) {
                        pSE.sprite.addX((pSE.targetX - pSE.sprite.x) / leftLoops);
                        pSE.sprite.addY((pSE.targetY - pSE.sprite.y) / leftLoops);
                    }
                }
                break;
            case 'expand':
                if (performance.now() >= pSE.totalTime + pSE.startTime) {
                    pSE.sprite.enlargeTo(pSE.targetS);
                    mixlySprite.displayTag = false;
                    mixlySprite.processingDisplayEvent = null;
                } else {
                    var leftLoops = mixlySprite.currentFPS * (pSE.totalTime + pSE.startTime - performance.now()) / 1000;
                    if (leftLoops >= 1) {
                        pSE.sprite.enlarge((pSE.targetS - Math.sqrt(pSE.sprite.height * pSE.sprite.width)) / leftLoops);
                    }
                }
                break;
            case 'circle':
                if (performance.now() >= pSE.totalTime + pSE.startTime) {
                    pSE.sprite.rotateTo(pSE.targetDegree);
                    mixlySprite.displayTag = false;
                    mixlySprite.processingDisplayEvent = null;
                } else {
                    var leftLoops = mixlySprite.currentFPS * (pSE.totalTime + pSE.startTime - performance.now()) / 1000;
                    if (leftLoops >= 1) {
                        pSE.sprite.rotate((pSE.targetDegree - pSE.sprite.rotation * 180 / Math.PI) / leftLoops);
                    }
                }
                break;
        }
    }

    if (!mixlySprite.running) {
        if (mixlySprite.successProcessingDisplayEvents.length) {
            for (var pSEindex = mixlySprite.successProcessingDisplayEvents.length - 1; pSEindex >= 0; pSEindex--) {
                const pSE = mixlySprite.successProcessingDisplayEvents[pSEindex];
                switch (pSE.displayType) {
                    case 'slide':
                        if (performance.now() >= pSE.totalTime + pSE.startTime) {
                            pSE.sprite.moveTo(pSE.targetX, pSE.targetY);
                            mixlySprite.successProcessingDisplayEvents.splice(pSEindex, 1);
                        } else {
                            var leftLoops = mixlySprite.currentFPS * (pSE.totalTime + pSE.startTime - performance.now()) / 1000;
                            if (leftLoops >= 1) {
                                pSE.sprite.addX((pSE.targetX - pSE.sprite.x) / leftLoops);
                                pSE.sprite.addY((pSE.targetY - pSE.sprite.y) / leftLoops);
                            }
                        }
                        break;
                    case 'expand':
                        if (performance.now() >= pSE.totalTime + pSE.startTime) {
                            pSE.sprite.enlargeTo(pSE.targetS);
                            mixlySprite.successProcessingDisplayEvents.splice(pSEindex, 1);
                        } else {
                            var leftLoops = mixlySprite.currentFPS * (pSE.totalTime + pSE.startTime - performance.now()) / 1000;
                            if (leftLoops >= 1) {
                                pSE.sprite.enlarge((pSE.targetS - Math.sqrt(pSE.sprite.height * pSE.sprite.width)) / leftLoops);
                            }
                        }
                        break;
                    case 'circle':
                        if (performance.now() >= pSE.totalTime + pSE.startTime) {
                            pSE.sprite.rotateTo(pSE.targetDegree);
                            mixlySprite.successProcessingDisplayEvents.splice(pSEindex, 1);
                        } else {
                            var leftLoops = mixlySprite.currentFPS * (pSE.totalTime + pSE.startTime - performance.now()) / 1000;
                            if (leftLoops >= 1) {
                                pSE.sprite.rotate((pSE.targetDegree - pSE.sprite.rotation * 180 / Math.PI) / leftLoops);
                            }
                        }
                        break;
                }
            }
        }
    }
}

mixlySprite.changeWidth = (w) => {
    const $canvas = $(mixlySprite.renderer.view);
    const canvasWidth = $canvas.width();
    const canvasHeight = $canvas.height();
    $canvas.width(w);
    $canvas.height(w / canvasWidth * canvasHeight);
}

mixlySprite.kill = () => {
    mixlySprite.state = false;
    mixlySprite.repeatPlay = new Function();
    for (let i in mixlySprite.keys) {
        mixlySprite.keys[i].unsubscribe();
        delete mixlySprite.keys[i];
    }
    mixlySprite.processingDisplayEvent = null;
    mixlySprite.displayTag = false;
    mixlySprite.running = false;
    mixlySprite.clearTimer();
}

mixlySprite.runit = (container) => {
    const $container = $(container);
    $container.empty();
    // Keep the scale mode to nearest
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    mixlySprite.renderer = PIXI.autoDetectRenderer(mixlySprite.canvasWidth, mixlySprite.canvasHeight, { backgroundColor: 0x00FFFFFF });
    $container.append(mixlySprite.renderer.view);
    // Create mixlySprite.stage container
    // mixlySprite.stage = new PIXI.Container();
    mixlySprite.pointer = { x: 0, y: 0 };
    mixlySprite.stage.sortableChildren = true;
    mixlySprite.stage.interactive = true;
    mixlySprite.stage.on("mousemove", (event = PIXI.InteractionEvent) => {
        mixlySprite.pointer.x = event.data.global.x;
        mixlySprite.pointer.y = event.data.global.y;
    });
    mixlySprite.lastFrameTime = 0;
    mixlySprite.running = true;
    if (!mixlySprite.lastFrameTime) {
        mixlySprite.lastFrameTime = performance.now();
        mixlySprite.lastSecond = performance.now();
    }
    mixlySprite.animate(performance.now());
    mixlySprite.repeatPlay = new Function();
    for (let i in mixlySprite.keys) {
        mixlySprite.keys[i].unsubscribe();
        delete mixlySprite.keys[i];
    }
    if (mixlySprite.backgroundSprite) {
        mixlySprite.backgroundSprite.runningMouseDown = new Function();
    }
    for (let i in mixlySprite.sprites) {
        mixlySprite.sprites[i].runningMouseDown = new Function();
    }
    for (let i in mixlySprite.texts) {
        mixlySprite.texts[i].runningMouseDown = new Function();
    }
    mixlySprite.processingDisplayEvent = null;
    mixlySprite.displayTag = false;
    mixlySprite.clearTimer();
    mixlySprite.changeWidth($('body').width() / 2);
    mixlySprite.state = true;
}

window.mixlySprite = mixlySprite;

export default mixlySprite;