let mockedData = new Map();
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
mockedData.set("file1", file1);
mockedData.set("oneColumnFile", oneColumnFile);
export function getData(filepath) {
    if (mockedData.has(filepath)) {
        return mockedData.get(filepath);
    }
    else {
        return null;
    }
}
