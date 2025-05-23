goog.loadJs('common', () => {

goog.require('path');
goog.require('layui');
goog.require('Mixly.LocalStorage');
goog.require('Mixly.Config');
goog.provide('Mixly.Storage');

const {
    LocalStorage,
    Config,
    Storage
} = Mixly;

const { laytpl } = layui;

const { BOARD } = Config;

Storage.user = function (key, value) {
    let storagePath = path.join(LocalStorage.PATH['USER'], key);
    if (arguments.length > 1) {
        LocalStorage.set(storagePath, value);
    } else {
        value = LocalStorage.get(storagePath);
    }
    return value;
}

Storage.board = function (key, value) {
    let storagePath = path.join(laytpl(LocalStorage.PATH['BOARD']).render({
        boardType: BOARD.boardType
    }), key);
    if (arguments.length > 1) {
        LocalStorage.set(storagePath, value);
    } else {
        value = LocalStorage.get(storagePath);
    }
    return value;
}

Storage.thirdParty = function (name, key, value) {
    let storagePath = path.join(laytpl(LocalStorage.PATH['THIRD_PARTY']).render({
        boardType: BOARD.boardType,
        thirdPartyName: name ?? 'default'
    }), key);
    if (arguments.length > 1) {
        LocalStorage.set(storagePath, value);
    } else {
        value = LocalStorage.get(storagePath);
    }
    return value;
}

});