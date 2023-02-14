let mockedParseData = new Map();
let mockedQueryData = new Map();
const file1 = [
    ["1", "2", "3", "4", "5"],
    ["The", "song", "remains", "the", "same."]
];
const oneColumnFile = [["1"], ["2"], ["3"], ["4"]];
const oneRowFile = [
    [
        "this",
        "is",
        "a",
        "one",
        "row",
        "file",
        "ok?",
        "got it?",
        "and",
        "it",
        "is",
        "very",
        "long",
    ],
];
const equalColumnRowFile = [
    ["a", "b", "c", "d"],
    ["e", "f", "g", "h"],
    ["i", "j", "k", "l"],
    ["m", "n", "o", "p"],
];
const manyColumnsLowRowsFile = [
    [
        "this",
        "is",
        "a",
        "high",
        "column",
        "file",
        "ok?",
        "got it?",
        "and",
        "it",
        "is",
        "very",
        "long",
    ],
    [
        "but",
        "there",
        "aren't",
        "many",
        "rows",
        "so",
        "we",
        "can",
        "test",
        "it",
        "better",
        "for",
        "functionality",
    ],
];
const manyRowsLowColumnsFile = [
    ["a", "b"],
    ["e", "f"],
    ["i", "j"],
    ["i", "j"],
    ["c", "d"],
    ["o", "p"],
    ["q", "r"],
    ["s", "c"],
    ["w", "t"],
    ["n", "p"],
    ["z", "z"],
    ["m", "n"],
];
mockedParseData.set("file1", file1);
mockedParseData.set("oneColumnFile", oneColumnFile);
mockedParseData.set("oneRowFile", oneRowFile);
mockedParseData.set("equalColumnRowFile", equalColumnRowFile);
mockedParseData.set("manyColumnsLowRowsFile", manyColumnsLowRowsFile);
mockedParseData.set("manyRowsLowColumnsFile", manyRowsLowColumnsFile);
mockedQueryData.set("2remains", file1);
export function getData(filepath) {
    if (mockedParseData.has(filepath)) {
        return mockedParseData.get(filepath);
    }
    else {
        return null;
    }
}
export function getSearch(contents, column, value) {
    console.log(contents);
    if (mockedQueryData.has(column + value)) {
        return mockedQueryData.get(column + value);
    }
    else {
        return null;
    }
}
