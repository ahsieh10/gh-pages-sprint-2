import * as main from './main';
import { screen } from "@testing-library/dom";
// Lets us send user events (like typing and clicking)
import userEvent from "@testing-library/user-event";
import * as mock from '../mockedJson';
//Serializer that allows us to convert html elements into html text
var s = new XMLSerializer();
/**
 * Extracts the inner text of an HTML element.
 *
 * @param elem Element extracted from screen
 * @returns inner text
 */
function extractText(elem) {
    if (elem instanceof HTMLElement) {
        return elem.innerText;
    }
    else {
        return null;
    }
}
var startHTML = "<section>\n    <!-- Tell the browser what to show if JavaScript/TypeScript is disabled. -->\n    <noscript>This example requires JavaScript to run.</noscript>\n    <!-- Prepare a region of the page to hold the entire REPL interface -->\n    <div class=\"repl\">\n        <!-- Prepare a region of the page to hold the command history -->\n        <div class=\"repl-history\">  \n        <h1>Command History</h1>\n        <label for=\"scroll\">Output Box</label>\n        <div class=\"scroll\" data-testid=\"scroll\">\n        </div>          \n        </div>\n        <!-- Prepare a region of the page to hold the command input box -->\n        <div class=\"repl-input\">\n            <label for=\"repl-command-box\">Command Input Box</label>\n            <input type=\"text\" class=\"repl-command-box\" data-testid=\"repl-command-box\" placeholder=\"Enter command here\">\n            <div class=\"button\">\n                <button> Submit command</button>\n            </div>\n        </div>\n    </div>\n</section>";
//tryButton = submit button
var tryButton;
// Don't neglect to give the type for _every_ identifier.
// Setup! This runs /before every test function/
beforeEach(function () {
    // (1) Restore the program's history to empty
    document.body.innerHTML = startHTML;
    main.clearHistory();
    tryButton = screen.getByText("Submit command");
});
//Uses mocked processor to output verbose mode output
test("Brief -> Verbose output shows up correctly", function () {
    //Verbose output
    var output = document.createElement("div");
    output.innerText = "Command: mode\nOutput: Changed to verbose mode\n";
    //Mock
    var verboseMock = function (guess) { return output; };
    //Buton setup
    tryButton.addEventListener("click", function () { return main.renderHistory(verboseMock); });
    userEvent.click(tryButton);
    //Fetch element from screen and check html for identicality
    var display = screen.getByTestId("scroll");
    expect(display.children.length).toBe(1);
    expect(s.serializeToString(display.children[0])).toBe(s.serializeToString(output));
});
//Tests that command history can coexist on the screen
test("Brief -> Verbose -> Brief shows up correctly", function () {
    //Verbose output (same as first test)
    var output = document.createElement("div");
    output.innerText = "Command: mode\nOutput: Changed to verbose mode\n";
    var verboseMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(verboseMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    expect(display.children.length).toBe(1);
    expect(extractText(display.children[0])).toBe("Command: mode\nOutput: Changed to verbose mode\n");
    //Brief output
    var briefOutput = document.createElement("div");
    briefOutput.innerText = "Changed to brief mode\n";
    //Brief mock
    var briefMock = function (guess) { return briefOutput; };
    //Change listener to invoke brief mock on button click
    tryButton.removeEventListener("click", function () { return main.renderHistory(verboseMock); });
    tryButton.addEventListener("click", function () { return main.renderHistory(briefMock); });
    userEvent.click(tryButton);
    //Checks that there are two commands in history
    expect(display.children.length).toBe(2);
    //Checks content of both
    expect(extractText(display.children[0])).toBe("Command: mode\nOutput: Changed to verbose mode\n");
    expect(extractText(display.children[1])).toBe("Changed to brief mode\n");
});
//Testing table display in brief mode
test("Display table brief", function () {
    //Mock that returns table of csv data
    var tableMock = function (guess) { return main.viewCSVData(mock.equalColumnRowFile); };
    tryButton.addEventListener("click", function () { return main.renderHistory(tableMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Checks to see that there is one output in the history box
    expect(display.children.length).toBe(1);
    //Checks to see that contents of table are identical
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(main.viewCSVData(mock.equalColumnRowFile));
    expect(str1).toBe(str2);
});
//Testing table display in verbose mode
test("Display table verbose", function () {
    //Sets up output, a div containing a div (command header) and a table"
    var output = document.createElement("div");
    var suboutput = document.createElement("div");
    suboutput.innerText = "Command: either search or view";
    output.appendChild(suboutput);
    output.appendChild(main.viewCSVData(mock.equalColumnRowFile));
    var tableMock = function (guess) { return output; };
    //Listens for table mock
    tryButton.addEventListener("click", function () { return main.renderHistory(tableMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Make sure that there is one command run
    expect(display.children.length).toBe(1);
    //Make sure that both the command and the output are included in printout
    expect(display.children[0].children.length).toBe(2);
    //Checks for content identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
//Checks rendering for empty file/query
test("Empty result brief (may happen from empty file)", function () {
    //Creates empty table
    var output = document.createElement("table");
    var body = document.createElement("tbody");
    output.appendChild(body);
    //Mock that returns empty table
    var emptyMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(emptyMock); });
    userEvent.click(tryButton);
    //Make sure empty table renders properly on screen
    var display = screen.getByTestId("scroll");
    expect(display.children.length).toBe(1);
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
//Checks rendering for empty file/query (verbose version)
test("Empty result verbose", function () {
    //Creates empty table + header with typed in comand
    var output = document.createElement("div");
    //header
    var suboutput = document.createElement("div");
    suboutput.innerText = "Command: either search or view";
    //actual table
    var tableOutput = document.createElement("table");
    var body = document.createElement("tbody");
    tableOutput.appendChild(body);
    output.appendChild(suboutput);
    output.appendChild(tableOutput);
    //Testing rendering on screen
    var tableMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(tableMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Make sure only one total output
    expect(display.children.length).toBe(1);
    //Make sure there is header and table
    expect(display.children[0].children.length).toBe(2);
    //Check that table body exists
    expect(display.children[0].children[1].children.length).toBe(1);
    //Check for identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
//Checks rendering of "invalid commmands"
test("Invalid command (brief and verbose)", function () {
    //Creates overall output div (one for brief, one for verbose)
    var outputBrief = document.createElement("div");
    var outputVerbose = document.createElement("div");
    //Creates command output tags
    var suboutputBrief = document.createElement("div");
    var suboutputVerbose = document.createElement("div");
    //Creates header (command that user typed)
    var header = document.createElement("div");
    //Set values
    suboutputBrief.innerHTML = "Invalid command";
    suboutputVerbose.innerHTML = "Output: Invalid command";
    header.innerHTML = "Command: any invalid command";
    //Appends output header to output div, appends brief + verbose output to respective overarching divs
    outputVerbose.appendChild(header);
    outputBrief.appendChild(suboutputBrief);
    outputVerbose.appendChild(suboutputVerbose);
    //Create mocks
    var briefMock = function (guess) { return outputBrief; };
    var verboseMock = function (guess) { return outputVerbose; };
    //Attach event listener to brief mock first
    tryButton.addEventListener("click", function () { return main.renderHistory(briefMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Check that there is one output div
    expect(display.children.length).toBe(1);
    //Checks that there is only one line in the output div
    expect(display.children[0].children.length).toBe(1);
    //Checks identicality for brief mock
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(outputBrief);
    expect(str1).toBe(str2);
    //Change event listener to verbose mock
    tryButton.removeEventListener("click", function () { return main.renderHistory(briefMock); });
    tryButton.addEventListener("click", function () { return main.renderHistory(verboseMock); });
    userEvent.click(tryButton);
    //Checks that there are two outputs (since we did not reset history)
    expect(display.children.length).toBe(2);
    //Checks that recent output is verbose (has header and output)
    expect(display.children[1].children.length).toBe(2);
    //Check for identicality for both outputs
    str1 = s.serializeToString(display.children[0]);
    expect(str1).toBe(str2);
    str1 = s.serializeToString(display.children[1]);
    str2 = s.serializeToString(outputVerbose);
    expect(str1).toBe(str2);
});
test("Load file (default)", function () {
    //Create output div and output element
    var output = document.createElement("div");
    var suboutput = document.createElement("div");
    suboutput.innerText = "File file1 loaded!";
    //Append output element to output div
    output.appendChild(suboutput);
    var loadMock = function (guess) { return output; };
    //Create listener + click
    tryButton.addEventListener("click", function () { return main.renderHistory(loadMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    expect(display.children.length).toBe(1);
    //Checks that there is only one line of output
    expect(display.children[0].children.length).toBe(1);
    //Check for identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
test("Load file (verbose)", function () {
    //Initialize outputs like in default except header (inputted command) is also included
    var output = document.createElement("div");
    var suboutput = document.createElement("div");
    var header = document.createElement("div");
    //Set values
    suboutput.innerText = "Output: File file1 loaded!";
    header.innerHTML = "Command: any invalid command";
    //Append header and suboutput to output
    output.appendChild(header);
    output.appendChild(suboutput);
    //Activate user event with mock
    var loadMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(loadMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Checks that there is only one overall output
    expect(display.children.length).toBe(1);
    //Checks that header and output exists
    expect(display.children[0].children.length).toBe(2);
    //Checks for identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
test("Load file (nonexistent brief)", function () {
    //Initializes output + suboutput
    var output = document.createElement("div");
    var suboutput = document.createElement("div");
    suboutput.innerText = "File does not exist";
    output.appendChild(suboutput);
    //Activate user event with mock
    var loadMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(loadMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Checks that there is one overall output
    expect(display.children.length).toBe(1);
    //Checks that there is just actual output
    expect(display.children[0].children.length).toBe(1);
    //check for identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
test("Load file (nonexistent verbose)", function () {
    //Initializes output + suboutput + header (user typed command)
    var output = document.createElement("div");
    var suboutput = document.createElement("div");
    var header = document.createElement("div");
    //Initialize inner text
    suboutput.innerText = "Output: File does not exist";
    header.innerHTML = "Command: load_file nonexistent_file";
    output.appendChild(header);
    output.appendChild(suboutput);
    //Activate user event with mock
    var loadMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(loadMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Check that there is only one overall output
    expect(display.children.length).toBe(1);
    //Check that output includes header + command output
    expect(display.children[0].children.length).toBe(2);
    //Check for identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
test("Invalid query (brief)", function () {
    //Initializes output + suboutput
    var output = document.createElement("div");
    var suboutput = document.createElement("div");
    //Initialize inner text
    suboutput.innerText = "Invalid query";
    output.appendChild(suboutput);
    //Activate user event with mock
    var loadMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(loadMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Checks that there is one overall output
    expect(display.children.length).toBe(1);
    //Checks that there is just actual output
    expect(display.children[0].children.length).toBe(1);
    //Check for identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
test("Invalid query (verbose)", function () {
    //Initializes output + suboutput + header (user typed command)
    var output = document.createElement("div");
    var suboutput = document.createElement("div");
    var header = document.createElement("div");
    //Initialize inner text
    suboutput.innerText = "Output: Invalid query";
    header.innerHTML = "Command: search non existent";
    output.appendChild(header);
    output.appendChild(suboutput);
    //Activate user event with mock
    var loadMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(loadMock); });
    userEvent.click(tryButton);
    var display = screen.getByTestId("scroll");
    //Check that there is only one overall output
    expect(display.children.length).toBe(1);
    //Check that output includes header + command output
    expect(display.children[0].children.length).toBe(2);
    //Check for identicality
    var str1 = s.serializeToString(display.children[0]);
    var str2 = s.serializeToString(output);
    expect(str1).toBe(str2);
});
