let mockedParseData = new Map();
let mockedQueryData = new Map();
const file1 = [
    ["1", "2", "3", "4", "5"],
    ["The", "song", "remains", "the", "same."]
];
const oneColumnFile = [
    ["1"],
    ["2"],
    ["3"],
    ["4"],
];
mockedParseData.set("file1", file1);
mockedParseData.set("oneColumnFile", oneColumnFile);
export function getData(filepath) {
    if (mockedParseData.has(filepath)) {
        return mockedParseData.get(filepath);
    }
    else {
        return null;
    }
}
export function getSearch(column, value) {
}
