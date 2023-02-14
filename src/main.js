import { getData, getSearch } from './mockedJson.js';
// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {
    prepareSubmit();
    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element 
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};
function prepareSubmit() {
    // Assumption: there's only one thing
    const maybeForm = document.getElementById('commands');
    if (maybeForm == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeForm instanceof HTMLFormElement)) {
        console.log(`Found element ${maybeForm}, but it wasn't an input`);
    }
    else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        maybeForm.addEventListener("submit", handleSubmit);
    }
}
let history = '';
let contents = new Array;
//contents = [["hi", "hey", "hello"], ["bye", "see ya", "later"]]
function handleSubmit(event) {
    const maybeDisplays = document.getElementsByClassName("scroll");
    const maybeDisplay = maybeDisplays.item(0);
    event.preventDefault();
    if (maybeDisplay == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeDisplay instanceof HTMLDivElement)) {
        console.log(`Found element ${maybeDisplay}, but it wasn't a div`);
    }
    else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        const maybeInputs = document.getElementsByClassName('repl-command-box');
        // Assumption: there's only one thing
        const maybeInput = maybeInputs.item(0);
        // Is the thing there? Is it of the expected type? 
        //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
        if (maybeInput == null) {
            console.log("Couldn't find input element");
        }
        else if (!(maybeInput instanceof HTMLInputElement)) {
            console.log(`Found element ${maybeInput}, but it wasn't an input`);
        }
        else {
            // Notice that we're passing *THE FUNCTION* as a value, not calling it.
            // The browser will invoke the function when a key is pressed with the input in focus.
            //  (This should remind you of the strategy pattern things we've done in Java.)
            // history += processCommand(maybeInput.value) + '\n';
            // console.log("hey!");
            // maybeDisplay.innerText = history;
            // maybeInput.value = '';
            const output = processCommand(maybeInput.value);
            maybeDisplay.appendChild(output);
            maybeInput.value = '';
        }
    }
}
let current_mode = "brief";
function processCommand(command) {
    let output = document.createElement("div");
    if (command == "mode") { // if user switches the mode by command
        if (current_mode == "brief") {
            // if current mode is brief
            current_mode = "verbose"; // change mode into verbose
            output.innerText = "Command: " + command + "\nOutput: Changed to verbose mode" + "\n";
            //return "Command: " + command + "\nOutput: Changed to verbose mode" + "\n";
        }
        else { // if current mode is verbose
            current_mode = "brief"; // change mode into brief
            output.innerText = "Changed to brief mode" + '\n';
        }
        return output;
    }
    if (current_mode == "verbose") {
        let inputCommand = document.createElement("div");
        inputCommand.innerText = "Command: " + command;
        output.appendChild(inputCommand);
    }
    if (command == "view") {
        if (contents.length == 0) {
            let errorMessage = document.createElement("div");
            if (current_mode == "verbose") {
                errorMessage.innerText += "Output: ";
            }
            errorMessage.innerText += "Invalid command";
            output.appendChild(errorMessage);
            return output;
        }
        let viewTable = viewCSVData(contents);
        if (current_mode == "verbose") {
            // if current mode is brief
            //return "Showing data contents from loaded CSV" + "\n";
            // if current mode is verbose
            let tag = document.createElement("div");
            tag.innerText = "Output:";
            output.appendChild(tag);
            //viewCSVData(contents);
            //return (
            //  "Command: " + command + "\nShowing data contents from loaded CSV" + "\n"
            //);
        }
        output.appendChild(viewTable);
        return output;
    }
    else {
        const cArguments = command.split(" ", 3);
        //let results = '';
        let results = document.createElement("div");
        if (cArguments.length != 3) {
            if (current_mode == "verbose") {
                results.innerText += "Output: ";
            }
            if (cArguments.length == 2 && cArguments[0] == "load_file") {
                let parsed = processLoadData(cArguments[1]);
                if (parsed == null) {
                    results.innerText += "File does not exist";
                }
                else {
                    results.innerText += parsed;
                }
            }
            else {
                results.innerText += "Invalid command";
            }
        }
        else {
            if (cArguments[0] == "search") {
                let query = processSearch(cArguments[1], cArguments[2]);
                if (query == null) {
                    if (current_mode == "verbose") {
                        results.innerText += "Output: Invalid query";
                    }
                    else {
                        results.innerText += "Invalid query";
                    }
                }
                else {
                    if (current_mode == "verbose") {
                        let tag = document.createElement("div");
                        tag.innerText = "Output:";
                        output.appendChild(tag);
                    }
                    results.append(query);
                }
            }
            else {
                if (current_mode == "verbose") {
                    results.innerText += "Output: Invalid command";
                }
                else {
                    results.innerText += "Invalid command";
                }
            }
        }
        output.appendChild(results);
        return output;
    }
}
function processLoadData(filepath) {
    const data = getData(filepath);
    if (data == null) {
        return `File ${filepath} does not exist`;
    }
    else {
        contents = data;
        console.log(data);
        return `File ${filepath} loaded!`;
    }
}
let finished_table = null;
function viewCSVData(contents) {
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");
    // creating all cells
    for (let i = 0; i < contents.length; i++) {
        // creates a table row
        const row = document.createElement("tr");
        for (let j = 0; j < contents[i].length; j++) {
            // go through each array element within the larger array
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            const cell = document.createElement("td");
            const cellText = document.createTextNode(contents[i][j]);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        // add the row to the end of the table body
        tblBody.appendChild(row);
    }
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    //document.getElementsByClassName("scroll")[0].appendChild(tbl);
    //finished_table = document.body.appendChild(tbl);
    return tbl;
}
function processSearch(column, value) {
    const data = getSearch(column, value);
    if (data == null) {
        return null;
    }
    else {
        console.log(data);
        //viewCSVData(data)
        //return true
        return viewCSVData(data);
    }
}
// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export { prepareSubmit, handleSubmit };
