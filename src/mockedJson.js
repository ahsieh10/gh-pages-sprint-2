"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
let mockedData = new Map();
function getData(filepath) {
    if (mockedData.has(filepath)) {
        return mockedData.get(filepath);
    }
    else {
        return null;
    }
}
exports.getData = getData;
