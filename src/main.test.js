import * as main from './main';
import { mockedQueryData } from "../mockedJson.js";
beforeEach(function () {
    main.clearHistory();
});
var startHTML = "<body>\n    <!-- Tell the browser what to show if JavaScript/TypeScript is disabled. -->\n    <noscript>This example requires JavaScript to run.</noscript>\n    <!-- Prepare a region of the page to hold the entire REPL interface -->\n    <div class=\"repl\">\n        <!-- Prepare a region of the page to hold the command history -->\n        <div class=\"repl-history\">  \n        <h1>Command History</h1>\n        <label for=\"scroll\">Output Box</label>\n        <div class=\"scroll\">\n        </div>          \n        </div>\n        <!-- Prepare a region of the page to hold the command input box -->\n        <div class=\"repl-input\">\n            <label for=\"commands\">Command Input Box</label>\n            <form id = \"commands\">\n                <input type=\"text\" class=\"repl-command-box\" placeholder=\"Enter command here\">\n                <div class=\"button\">\n                    <button type=\"submit\"> Submit command</button>\n                </div>\n            </form>\n        </div>\n    </div>\n    <!-- Load the script! Note: the .js extension is because browsers don't use TypeScript\n    directly. Instead, the author of the site needs to compile the TypeScript to JavaScript. -->\n    <script type=\"module\" src=\"../src/main.js\"></script>\n</body>";
test("test", function () { true; });
test("check processMode", function () {
    // this test also implicitly checks that the default mode is brief
    expect(main.processMode().innerText).toBe("Command: mode\nOutput: Changed to verbose mode" + "\n"); // switched to verbose
    expect(main.processMode().innerText).toBe("Changed to brief mode" + "\n"); // switched to brief
});
/* this test implicitly tests getData too --> if getData returned null,
then it is not possible for processLoadData to properly load a file. */
test("check processLoadData", function () {
    // valid cases
    expect(main.processLoadData("file1")).toBe("File file1 loaded!");
    expect(main.processLoadData("oneRowFile")).toBe("File oneRowFile loaded!");
    expect(main.processLoadData("manyColumnsLowRowsFile")).toBe("File manyColumnsLowRowsFile loaded!");
    expect(main.processLoadData("equalColumnRowFile")).toBe("File equalColumnRowFile loaded!");
    expect(main.processLoadData("oneColumnFile")).toBe("File oneColumnFile loaded!");
    expect(main.processLoadData("manyRowsLowColumnsFile")).toBe("File manyRowsLowColumnsFile loaded!");
    expect(main.processLoadData("emptyFile")).toBe("File emptyFile loaded!");
    expect(main.processLoadData("not a real file")).toBe(
    // not a real file
    "File not a real file does not exist");
    expect(main.processLoadData("")).toBe(
    // empty case
    "File  does not exist");
});
/* note that many of the following tests show the raw string format of the
function's HTML output; this is messier than outputting a more readable string
(i.e: something like file1 above), but we decided to keep the test like this
because it is more helpful in showing us raw functionality */
test("check processView", function () {
    // valid cases
    main.processLoadData("file1");
    var output = document.createElement("div");
    expect(main.processView(output).innerHTML.trim()).toBe("<table><tbody><tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td>" +
        "</tr><tr><td>The</td><td>song</td><td>remains</td><td>the</td><td>" +
        "same.</td></tr></tbody></table>");
    main.processLoadData("oneRowFile");
    output = document.createElement("div"); // refreshes output to be used again
    expect(main.processView(output).innerHTML.trim()).toBe("<table><tbody><tr><td>this</td><td>is</td><td>a</td><td>one</td>" +
        "<td>row</td><td>file</td><td>ok?</td><td>got it?</td><td>and</td>" +
        "<td>it</td><td>is</td><td>very</td><td>long</td></tr></tbody></table>");
    main.processLoadData("manyColumnsLowRowsFile");
    output = document.createElement("div"); // refreshes output to be used again
    expect(main.processView(output).innerHTML.trim()).toBe("<table><tbody><tr><td>this</td><td>is</td><td>a</td><td>high</td><td>"
        + "column</td><td>file</td><td>ok?</td><td>got it?</td><td>and</td><td>"
        + "it</td><td>is</td><td>very</td><td>long</td></tr><tr><td>but</td><td>"
        + "there</td><td>aren't</td><td>many</td><td>rows</td><td>so</td><td>we"
        + "</td><td>can</td><td>test</td><td>it</td><td>better</td><td>for</td>"
        + "<td>functionality</td></tr></tbody></table>");
    main.processLoadData("emptyFile"); // file loaded properly but it is empty
    output = document.createElement("div"); // refreshes output to be used again
    expect(main.processView(output).innerHTML.trim()).toBe("<table><tbody>"
        + "<tr></tr></tbody></table>");
});
test("check processView invalid cases", function () {
    var output = document.createElement("div");
    expect(main.processView(output).innerHTML.trim()).toBe("<div></div>");
    // the part of the message that is supposed to return a table returns an
    // empty div instead --> this is intentional!
});
var file1 = [
    ["1", "2", "3", "4", "5"],
    ["The", "song", "remains", "the", "same."],
];
var oneColumnFile = [["1"], ["2"], ["3"], ["4"]];
var manyRowsLowColumnsFile = [
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
var emptyFile = [[]];
// note: there is no 'invalid' case for viewCSVData as long as you pass in
// a 2D array of strings of any form
test("check viewCSVData", function () {
    expect(main.viewCSVData(file1).innerHTML.trim()).toBe("<tbody><tr><td>1" +
        "</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>The</td><td>" +
        "song</td><td>remains</td><td>the</td><td>same.</td></tr></tbody>");
    expect(main.viewCSVData(oneColumnFile).innerHTML.trim()).toBe("<tbody><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td>" +
        "</tr><tr><td>4</td></tr></tbody>");
    expect(main.viewCSVData(manyRowsLowColumnsFile).innerHTML.trim()).toBe("<tbody><tr><td>a</td><td>b</td></tr><tr><td>e</td><td>p</td></tr><tr>" +
        "<td>i</td><td>j</td></tr><tr><td>i</td><td>j</td></tr><tr><td>c</td>" +
        "<td>d</td></tr><tr><td>o</td><td>p</td></tr><tr><td>q</td><td>r</td>" +
        "</tr><tr><td>s</td><td>c</td></tr><tr><td>w</td><td>t</td></tr><tr>" +
        "<td>n</td><td>p</td></tr><tr><td>z</td><td>s</td></tr><tr><td>p</td>" +
        "<td>n</td></tr></tbody>");
    expect(main.viewCSVData(emptyFile).innerHTML.trim()).toBe("<tbody><tr></tr></tbody>");
});
test("check getSearch", function () {
    expect(main.getSearch("file1", "2", "remains")).toBe(mockedQueryData.get("file1" + " " + "2" + " " + "remains"));
    expect(main.getSearch("equalColumnRowFile", "0", "a")).toBe(mockedQueryData.get("equalColumnRowFile" + " " + "0" + " " + "a"));
    // if the file is not in the data set
    expect(main.getSearch("this is not a file", "2", "remains")).toBe(null);
    // if the column is not in the data set, but all else are valid
    expect(main.getSearch("file1", "5000", "remains")).toBe(null);
    // if the value is not in the data set, but all else are valid
    expect(main.getSearch("file1", "2", "definitely not in the dataset remains")).toBe(null);
});
test("check processSearch", function () {
    // invalid case: CSV file has not been loaded in yet
    var output = document.createElement("div");
    expect(main.processSearch(output, ["search", "2", "remains"]).innerHTML.trim()).toBe("<div></div>");
    // valid case with index
    main.processLoadData("file1"); // load the file in
    output = document.createElement("div"); // refresh the output for this test
    expect(main.processSearch(output, ["search", "2", "remains"]).innerHTML.trim()).toBe("<div><table><tbody><tr><td>The</td><td>song</td><td>remains</td><td>" +
        "the</td><td>same.</td></tr></tbody></table></div>");
    // valid case with header and output has multiple rows
    main.processLoadData("manyRowsLowColumnsFile"); // load the file in
    output = document.createElement("div"); // refresh the output for this test
    expect(main.processSearch(output, ["search", "b", "p"]).innerHTML.trim()).toBe("<div><table><tbody><tr><td>e</td><td>p</td></tr><tr><td>o</td><td>p" +
        "</td></tr><tr><td>n</td><td>p</td></tr></tbody></table></div>");
    // valid case but column # does not exist in this file, all else valid
    main.processLoadData("manyRowsLowColumnsFile"); // load the file in
    output = document.createElement("div"); // refresh the output for this test
    expect(main.processSearch(output, ["search", "1000", "p"]).innerHTML.trim()).toBe("<div></div>");
    // valid case but value does not exist in this file, all else valid
    main.processLoadData("manyRowsLowColumnsFile"); // load the file in
    output = document.createElement("div"); // refresh the output for this test
    expect(main.processSearch(output, ["search", "2", "not.real...."]).innerHTML.trim()).toBe("<div></div>");
    // valid case, but parsed in CSV file is empty, so returns an empty table
    // no matter what
    main.processLoadData("emptyFile"); // load the file in
    output = document.createElement("div"); // refresh the output for this test
    expect(main.processSearch(output, ["search", "0", ""]).innerHTML.trim()).toBe("<div></div>");
});
test("check processCommand", function () {
    // checks for processMode
    expect(main.processCommand("mode").innerText).toBe("Command: mode\nOutput: Changed to verbose mode" + "\n");
    /* current_mode is now verbose; check the following functions and
      their outputs in verbose mode:
          processView, processSearch, processLoadData, final processCommand output
  
          Note: we confirm that verbose mode works properly because it prints out
          2 enclosed divs (1 for the command, and 1 for the output)
      */
    // checks view when file has not been loaded yet
    expect(main.processCommand("view").innerText).toBe("Invalid Command");
    // search with valid input when file has not been loaded yet
    expect(main.processCommand("search 2 remains").innerHTML.trim()).toBe("<div></div><div></div>");
    // search without other inputs
    expect(main.processCommand("search").innerHTML.trim()).toBe("<div></div><div></div>");
    // load_file call without a valid file input
    expect(main.processCommand("load_file 1234fakefile").innerHTML.trim()).toBe("<div></div><div></div>");
    // valid load_file call
    expect(main.processCommand("load_file file1").innerHTML.trim()).toBe("<div></div><div></div>"); // note: the empty divs here are intentional; load_file does not actually
    // show the file. Our view & search calls will implicitly ensure that
    // load_file actually loaded the file properly
    main.processCommand("load_file file1"); // load file so we can test other stuff
    // valid view call
    expect(main.processCommand("view").innerHTML.trim()).toBe("<div></div><div></div><table><tbody><tr><td>1" +
        "</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>The</td><td>" +
        "song</td><td>remains</td><td>the</td><td>same.</td></tr></tbody></table>");
    // valid search with index call
    expect(main.processCommand("search 2 remains").innerHTML.trim()).toBe("<div></div><div></div><div><table><tbody><tr><td>The</td><td>song</td><td>remains</td><td>" +
        "the</td><td>same.</td></tr></tbody></table></div>");
    // invalid search call with properly loaded CSV file
    expect(main.processCommand("search 20000 fake.name.").innerHTML.trim()).toBe("<div></div><div></div>");
    // checks that calling load_file again enacts proper replacement
    main.processCommand("load_file manyRowsLowColumnsFile");
    // valid view call on new file replacement
    expect(main.processCommand("view").innerHTML.trim()).toBe("<div></div><div></div><table><tbody><tr><td>a</td><td>b</td></tr><tr><td>e</td><td>p</td></tr><tr>" +
        "<td>i</td><td>j</td></tr><tr><td>i</td><td>j</td></tr><tr><td>c</td>" +
        "<td>d</td></tr><tr><td>o</td><td>p</td></tr><tr><td>q</td><td>r</td>" +
        "</tr><tr><td>s</td><td>c</td></tr><tr><td>w</td><td>t</td></tr><tr>" +
        "<td>n</td><td>p</td></tr><tr><td>z</td><td>s</td></tr><tr><td>p</td>" +
        "<td>n</td></tr></tbody></table>");
    // valid search with headers call on new file replacement
    expect(main.processCommand("search b p").innerHTML.trim()).toBe("<div></div><div></div><div><table><tbody><tr><td>e</td><td>p</td></tr><tr><td>o</td><td>p" +
        "</td></tr><tr><td>n</td><td>p</td></tr></tbody></table></div>");
    // invalid search call (tries to call old file contents)
    expect(main.processCommand("search 2 remains").innerHTML.trim()).toBe("<div></div><div></div>");
    // checks that the same command can be called multiple times
    expect(main.processCommand("view").innerHTML.trim()).toBe("<div></div><div></div><table><tbody><tr><td>a</td><td>b</td></tr><tr><td>e</td><td>p</td></tr><tr>" +
        "<td>i</td><td>j</td></tr><tr><td>i</td><td>j</td></tr><tr><td>c</td>" +
        "<td>d</td></tr><tr><td>o</td><td>p</td></tr><tr><td>q</td><td>r</td>" +
        "</tr><tr><td>s</td><td>c</td></tr><tr><td>w</td><td>t</td></tr><tr>" +
        "<td>n</td><td>p</td></tr><tr><td>z</td><td>s</td></tr><tr><td>p</td>" +
        "<td>n</td></tr></tbody></table>");
    // change back to brief mode
    expect(main.processCommand("mode").innerText).toBe("Changed to brief mode" + "\n");
    // checks that brief mode outputs messages properly; no need to retest all
    // commands because brief and verbose do the same functional thing, just
    // different message prints.
    // search without other inputs
    expect(main.processCommand("search").innerHTML.trim()).toBe("<div></div>");
    expect(main.processCommand("mode").innerText).toBe("Command: mode\nOutput: Changed to verbose mode" + "\n");
});
/* note: the functions renderHistory and clearHistory were not tested here
because they are exclusively used in our DOM testing suite, and are not needed
for the functionality of our program */ 
