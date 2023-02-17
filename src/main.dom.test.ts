import * as main from './main';
import { screen} from "@testing-library/dom";
// Lets us send user events (like typing and clicking)
import userEvent from "@testing-library/user-event";
import * as mock from '../mockedJson'

//Serializer that allows us to convert html elements into html text
let s = new XMLSerializer();

/**
 * Extracts the inner text of an HTML element.
 * 
 * @param elem Element extracted from screen
 * @returns inner text
 */
function extractText(elem: Element){
    if(elem instanceof HTMLElement){
        return elem.innerText
    }
    else{
        return null
    }
}

const startHTML = `<section>
    <!-- Tell the browser what to show if JavaScript/TypeScript is disabled. -->
    <noscript>This example requires JavaScript to run.</noscript>
    <!-- Prepare a region of the page to hold the entire REPL interface -->
    <div class="repl">
        <!-- Prepare a region of the page to hold the command history -->
        <div class="repl-history">  
        <h1>Command History</h1>
        <label for="scroll">Output Box</label>
        <div class="scroll" data-testid="scroll">
        </div>          
        </div>
        <!-- Prepare a region of the page to hold the command input box -->
        <div class="repl-input">
            <label for="repl-command-box">Command Input Box</label>
            <input type="text" class="repl-command-box" data-testid="repl-command-box" placeholder="Enter command here">
            <div class="button">
                <button> Submit command</button>
            </div>
        </div>
    </div>
</section>`;

//tryButton = submit button
let tryButton: HTMLElement;
// Don't neglect to give the type for _every_ identifier.

// Setup! This runs /before every test function/
beforeEach(() => {
  // (1) Restore the program's history to empty
  document.body.innerHTML = startHTML;
  main.clearHistory()

  tryButton = screen.getByText("Submit command")

});

//Uses mocked processor to output verbose mode output
test("Brief -> Verbose output shows up correctly", () => {
    //Verbose output
    let output: HTMLDivElement = document.createElement("div")
    output.innerText = "Command: mode\nOutput: Changed to verbose mode\n"
    //Mock
    const verboseMock = (guess: string) => output
    //Buton setup
    tryButton.addEventListener("click", () => main.renderHistory(verboseMock));
    userEvent.click(tryButton)

    //Fetch element from screen and check html for identicality
    let display = screen.getByTestId("scroll")
    expect(display.children.length).toBe(1)
    expect(s.serializeToString(display.children[0])).toBe(s.serializeToString(output))
  });

//Tests that command history can coexist on the screen
test("Brief -> Verbose -> Brief shows up correctly", () => { 
    //Verbose output (same as first test)
    let output: HTMLDivElement = document.createElement("div")
    output.innerText = "Command: mode\nOutput: Changed to verbose mode\n"
    const verboseMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(verboseMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    expect(display.children.length).toBe(1)
    expect(extractText(display.children[0])).toBe("Command: mode\nOutput: Changed to verbose mode\n")

    //Brief output
    let briefOutput: HTMLDivElement = document.createElement("div")
    briefOutput.innerText = "Changed to brief mode\n"
    //Brief mock
    const briefMock = (guess: string) => briefOutput
    //Change listener to invoke brief mock on button click
    tryButton.removeEventListener("click", () => main.renderHistory(verboseMock));
    tryButton.addEventListener("click", () => main.renderHistory(briefMock));
    userEvent.click(tryButton)
    //Checks that there are two commands in history
    expect(display.children.length).toBe(2)
    //Checks content of both
    expect(extractText(display.children[0])).toBe("Command: mode\nOutput: Changed to verbose mode\n")
    expect(extractText(display.children[1])).toBe("Changed to brief mode\n")
});

//Testing table display in brief mode
test("Display table brief", () => {
    //Mock that returns table of csv data
    const tableMock = (guess: string) => main.viewCSVData(mock.equalColumnRowFile)
    tryButton.addEventListener("click", () => main.renderHistory(tableMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Checks to see that there is one output in the history box
    expect(display.children.length).toBe(1)
    //Checks to see that contents of table are identical
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(main.viewCSVData(mock.equalColumnRowFile));
    expect(str1).toBe(str2)
});

//Testing table display in verbose mode
test("Display table verbose", () => {
    //Sets up output, a div containing a div (command header) and a table"
    let output: HTMLDivElement = document.createElement("div")
    let suboutput: HTMLDivElement = document.createElement("div")
    suboutput.innerText = "Command: either search or view"
    output.appendChild(suboutput)
    output.appendChild(main.viewCSVData(mock.equalColumnRowFile))
    const tableMock = (guess: string) => output

    //Listens for table mock
    tryButton.addEventListener("click", () => main.renderHistory(tableMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Make sure that there is one command run
    expect(display.children.length).toBe(1)
    //Make sure that both the command and the output are included in printout
    expect(display.children[0].children.length).toBe(2)
    //Checks for content identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

//Checks rendering for empty file/query
test("Empty result brief (may happen from empty file)", () => {
    //Creates empty table
    let output: HTMLTableElement = document.createElement("table")
    let body: HTMLTableSectionElement = document.createElement("tbody")
    output.appendChild(body)
    //Mock that returns empty table
    const emptyMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(emptyMock));
    userEvent.click(tryButton)

    //Make sure empty table renders properly on screen
    let display = screen.getByTestId("scroll")
    expect(display.children.length).toBe(1)
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

//Checks rendering for empty file/query (verbose version)
test("Empty result verbose", () => {
    //Creates empty table + header with typed in comand
    let output: HTMLDivElement = document.createElement("div")
    //header
    let suboutput: HTMLDivElement = document.createElement("div")
    suboutput.innerText = "Command: either search or view"
    //actual table
    let tableOutput: HTMLTableElement = document.createElement("table")
    let body: HTMLTableSectionElement = document.createElement("tbody")
    tableOutput.appendChild(body)
    output.appendChild(suboutput)
    output.appendChild(tableOutput)

    //Testing rendering on screen
    const tableMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(tableMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Make sure only one total output
    expect(display.children.length).toBe(1)
    //Make sure there is header and table
    expect(display.children[0].children.length).toBe(2)
    //Check that table body exists
    expect(display.children[0].children[1].children.length).toBe(1)
    //Check for identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

//Checks rendering of "invalid commmands"
test("Invalid command (brief and verbose)", () => {
    //Creates overall output div (one for brief, one for verbose)
    let outputBrief: HTMLDivElement = document.createElement("div")
    let outputVerbose: HTMLDivElement = document.createElement("div")
    //Creates command output tags
    let suboutputBrief: HTMLDivElement = document.createElement("div")
    let suboutputVerbose: HTMLDivElement = document.createElement("div")
    //Creates header (command that user typed)
    let header: HTMLDivElement = document.createElement("div")

    //Set values
    suboutputBrief.innerHTML = "Invalid command"
    suboutputVerbose.innerHTML = "Output: Invalid command"
    header.innerHTML = "Command: any invalid command"

    //Appends output header to output div, appends brief + verbose output to respective overarching divs
    outputVerbose.appendChild(header)
    outputBrief.appendChild(suboutputBrief)
    outputVerbose.appendChild(suboutputVerbose)

    //Create mocks
    let briefMock = (guess: string) => outputBrief
    let verboseMock = (guess: string) => outputVerbose
    //Attach event listener to brief mock first
    tryButton.addEventListener("click", () => main.renderHistory(briefMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Check that there is one output div
    expect(display.children.length).toBe(1)
    //Checks that there is only one line in the output div
    expect(display.children[0].children.length).toBe(1)

    //Checks identicality for brief mock
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(outputBrief);
    expect(str1).toBe(str2)

    //Change event listener to verbose mock
    tryButton.removeEventListener("click", () => main.renderHistory(briefMock));
    tryButton.addEventListener("click", () => main.renderHistory(verboseMock));
    userEvent.click(tryButton)

    //Checks that there are two outputs (since we did not reset history)
    expect(display.children.length).toBe(2)
    //Checks that recent output is verbose (has header and output)
    expect(display.children[1].children.length).toBe(2)

    //Check for identicality for both outputs
    str1 = s.serializeToString(display.children[0]);
    expect(str1).toBe(str2)
    str1 = s.serializeToString(display.children[1]);
    str2 = s.serializeToString(outputVerbose);
    expect(str1).toBe(str2)
})

test("Load file (default)", () => {
    //Create output div and output element
    let output: HTMLDivElement = document.createElement("div")
    let suboutput: HTMLDivElement = document.createElement("div")
    suboutput.innerText = "File file1 loaded!"
    
    //Append output element to output div
    output.appendChild(suboutput)
    let loadMock = (guess: string) => output

    //Create listener + click
    tryButton.addEventListener("click", () => main.renderHistory(loadMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    expect(display.children.length).toBe(1)
    //Checks that there is only one line of output
    expect(display.children[0].children.length).toBe(1)
    //Check for identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

test("Load file (verbose)", () => {
    //Initialize outputs like in default except header (inputted command) is also included
    let output: HTMLDivElement = document.createElement("div")
    let suboutput: HTMLDivElement = document.createElement("div")
    let header: HTMLDivElement = document.createElement("div")
    //Set values
    suboutput.innerText = "Output: File file1 loaded!"
    header.innerHTML = "Command: any invalid command"
    //Append header and suboutput to output
    output.appendChild(header)
    output.appendChild(suboutput)

    //Activate user event with mock
    let loadMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(loadMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Checks that there is only one overall output
    expect(display.children.length).toBe(1)
    //Checks that header and output exists
    expect(display.children[0].children.length).toBe(2)
    //Checks for identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

test("Load file (nonexistent brief)", () => {
    //Initializes output + suboutput
    let output: HTMLDivElement = document.createElement("div")
    let suboutput: HTMLDivElement = document.createElement("div")
    suboutput.innerText = "File does not exist"
    output.appendChild(suboutput)

    //Activate user event with mock
    let loadMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(loadMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Checks that there is one overall output
    expect(display.children.length).toBe(1)
    //Checks that there is just actual output
    expect(display.children[0].children.length).toBe(1)
    //check for identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

test("Load file (nonexistent verbose)", () => {
    //Initializes output + suboutput + header (user typed command)
    let output: HTMLDivElement = document.createElement("div")
    let suboutput: HTMLDivElement = document.createElement("div")
    let header: HTMLDivElement = document.createElement("div")
    //Initialize inner text
    suboutput.innerText = "Output: File does not exist"
    header.innerHTML = "Command: load_file nonexistent_file"
    output.appendChild(header)
    output.appendChild(suboutput)

    //Activate user event with mock
    let loadMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(loadMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Check that there is only one overall output
    expect(display.children.length).toBe(1)
    //Check that output includes header + command output
    expect(display.children[0].children.length).toBe(2)
    //Check for identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

test("Invalid query (brief)", () => {
    //Initializes output + suboutput
    let output: HTMLDivElement = document.createElement("div")
    let suboutput: HTMLDivElement = document.createElement("div")
    //Initialize inner text
    suboutput.innerText = "Invalid query"
    output.appendChild(suboutput)

    //Activate user event with mock
    let loadMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(loadMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Checks that there is one overall output
    expect(display.children.length).toBe(1)
    //Checks that there is just actual output
    expect(display.children[0].children.length).toBe(1)
    //Check for identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})

test("Invalid query (verbose)", () => {
    //Initializes output + suboutput + header (user typed command)
    let output: HTMLDivElement = document.createElement("div")
    let suboutput: HTMLDivElement = document.createElement("div")
    let header: HTMLDivElement = document.createElement("div")
    //Initialize inner text
    suboutput.innerText = "Output: Invalid query"
    header.innerHTML = "Command: search non existent"
    output.appendChild(header)
    output.appendChild(suboutput)

    //Activate user event with mock
    let loadMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(loadMock));
    userEvent.click(tryButton)
    let display = screen.getByTestId("scroll")
    //Check that there is only one overall output
    expect(display.children.length).toBe(1)
    //Check that output includes header + command output
    expect(display.children[0].children.length).toBe(2)
    //Check for identicality
    let str1 = s.serializeToString(display.children[0]);
    let str2 = s.serializeToString(output);
    expect(str1).toBe(str2)
})