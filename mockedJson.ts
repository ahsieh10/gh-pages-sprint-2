export let mockedParseData = new Map<string, Array<Array<string>>>();
export let mockedQueryData = new Map<string, Array<Array<string>>>();

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
["e", "a", "g", "h"],
["a", "j", "k", "l"],
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
["e", "p"],
["i", "j"],
["i", "j"],
["c", "d"],
["o", "p"],
["q", "r"],
["s", "c"],
["w", "t"],
["n", "p"],
["z", "s"],
["p", "n"],
];

const emptyFile = [[]];

mockedParseData.set("file1", file1);
mockedParseData.set("oneColumnFile", oneColumnFile);
mockedParseData.set("oneRowFile", oneRowFile);
mockedParseData.set("equalColumnRowFile", equalColumnRowFile);
mockedParseData.set("manyColumnsLowRowsFile", manyColumnsLowRowsFile);
mockedParseData.set("manyRowsLowColumnsFile", manyRowsLowColumnsFile);
mockedParseData.set("emptyFile", emptyFile);

mockedQueryData.set("file1 2 remains", [["The", "song", "remains", "the", "same."]])
mockedQueryData.set("equalColumnRowFile 0 a", [["a", "b", "c", "d"], ["a", "j", "k", "l"]])
mockedQueryData.set("equalColumnRowFile 1 a", [["e", "a", "g", "h"]])
mockedQueryData.set("equalColumnRowFile 2 a", [[]])
mockedQueryData.set("manyRowsLowColumnsFile b p", [["e", "p"], ["o", "p"],["n", "p"]])
mockedQueryData.set("manyColumnsLowRowsFile file for", [[]])