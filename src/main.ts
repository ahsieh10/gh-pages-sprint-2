import { getData, getSearch } from "../mockedJson.js";

type ProcessFunction = (cArguments: string) => HTMLElement;

// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {
  prepareSubmit();
};

/**
 * After the window is loaded, sets up an event listener that can trigger when
 * the submit button is activated
 */
function prepareSubmit() {
  // Assumption: there's only one thing
  const maybeForm: Element | null = document.getElementById("commands");
  if (maybeForm == null) {
    console.log("Couldn't find input element");
  } else if (!(maybeForm instanceof HTMLFormElement)) {
    console.log(`Found element ${maybeForm}, but it wasn't an input`);
  } else {
    maybeForm.addEventListener("submit", handleSubmit);
  }
}

let contents = new Array<Array<string>>(); // contents of the current CSV file
let file_name = ""; // current file name

/**
 * When the submit button is activated (through pressing enter or clicking
 * on the webpage's 'Submit button' feature), takes in the input from the
 * command text box and displays a corresponding message & output on the command
 * history text box display.
 * @param event the SubmitEvent, which lets the program know to watch out for
 * the submit button being activated
 */
function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  renderHistory(processCommand);
}

/**
 * Takes in a command from the command text box and handles appropriate
 * messages or behaviors depending on the command's contents. If an invalid
 * command is inputted into the text box, output a message that says "Invalid command"
 */
let current_mode = "brief"; // default starts in brief mode
export function processCommand(command: string) {
  // when a command is passed in
  let output = document.createElement("div");

  if (command == "mode") {
    // handle mode change
    return processMode();
  }
  if (current_mode == "verbose") {
    let inputCommand = document.createElement("div");
    inputCommand.innerText = "Command: " + command;
    output.appendChild(inputCommand);
  }
  if (command == "view") {
    return processView(output);
  } else {
    const cArguments: Array<string> = command.split(" ", 3);
    let results = document.createElement("div");
    if (cArguments.length != 3) {
      // if the command is load_file
      // since load_file has 2 parameters in the textbox while search has 3
      if (current_mode == "verbose") {
        results.innerText += "Output: ";
      }
      if (cArguments.length == 2 && cArguments[0] == "load_file") {
        let parsed = processLoadData(cArguments[1]);
        if (parsed == null) {
          // if it was not parsed correctly/at all
          results.innerText += "File does not exist";
        } else {
          file_name = cArguments[1];
          results.innerText += parsed;
        }
      } else {
        results.innerText += "Invalid command"; // if you had a command that
        // had 2 parameters and was not load_file
      }
    } else {
      if (cArguments[0] == "search") {
        // if the command is search
        return processSearch(output, cArguments);
      } else {
        if (current_mode == "verbose") {
          results.innerText += "Output: Invalid command";
        } else {
          results.innerText += "Invalid command";
        }
      }
    }
    output.appendChild(results);
    return output;
  }
}

/**
 * Changes mode to opposite of current setting (brief -> verbose, verbose -> brief)
 * @returns div element containing output message
 */
function processMode() {
  let output = document.createElement("div");
  // if user switches the mode by command
  if (current_mode == "brief") {
    // if current mode is brief
    current_mode = "verbose"; // change mode into verbose
    output.innerText = "Command: mode\nOutput: Changed to verbose mode" + "\n";
  } else {
    // if current mode is verbose
    current_mode = "brief"; // change mode into brief
    output.innerText = "Changed to brief mode" + "\n";
  }
  return output;
}

function processView(output: HTMLDivElement) {
  if (contents.length == 0) {
    // if there is no CSV file (note that an
    // existing but empty CSV file would have a length of 1)
    let errorMessage = document.createElement("div");
    if (current_mode == "verbose") {
      errorMessage.innerText += "Output: ";
    }
    errorMessage.innerText += "Invalid command";
    output.appendChild(errorMessage);
    return output;
  }
  let viewTable = viewCSVData(contents); // if there is a CSV file (i.e: load_file was called properly)
  if (current_mode == "verbose") {
    // if the current mode is verbose, add
    // on this extra line
    let tag = document.createElement("div");
    tag.innerText = "Output:";
    output.appendChild(tag);
  }
  output.appendChild(viewTable); // shows the table no matter the mode
  return output;
}

function processSearch(output: HTMLElement, cArguments: Array<string>) {
  let results = document.createElement("div");
  if (contents.length == 0) {
    // if the csv file is empty
    if (current_mode == "verbose") {
      results.innerText += "Output: Invalid command";
    } else {
      results.innerText += "Invalid command";
    }
    output.appendChild(results);
    return output; // return an "invalid command" output
  }
  let query = processQuery(cArguments[1], cArguments[2]);
  if (query == null) {
    if (current_mode == "verbose") {
      results.innerText += "Output: Invalid query";
    } else {
      results.innerText += "Invalid query";
    }
  } else {
    if (current_mode == "verbose") {
      let tag = document.createElement("div");
      tag.innerText = "Output:";
      output.appendChild(tag);
    }
    results.append(query);
  }
  output.appendChild(results);
  return output;
}

/**
 * Stores the CSV file's name into the program if a valid name is given,
 * else return a message "File <file-name> does not exist"
 * @param filepath a string representing the file name
 * @returns a message on the command history text box display
 */
function processLoadData(filepath: string) {
  // function to load the file

  const data: Array<Array<string>> | null = getData(filepath);
  if (data == null) {
    // if the file does not exist
    return `File ${filepath} does not exist`;
  } else {
    // if the filepath can be successfully found
    contents = data;
    console.log(data);
    return `File ${filepath} loaded!`;
  }
}

/**
 * Processes the contents of a CSV file and turns the data from raw strings into
 * a structured HTML Table element
 * @param contents a 2D array of strings representing the contents/data of a
 * CSV file
 * @returns a table in HTML Element type that represents the CSV file contents
 */
function viewCSVData(contents: Array<Array<string>>) {
  // function to view the file
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  // creating all cells
  for (let i = 0; i < contents.length; i++) {
    // for every row in the CSV
    // creates a table row
    const row = document.createElement("tr");

    for (let j = 0; j < contents[i].length; j++) {
      // for every value in the row
      const cell = document.createElement("td");
      const cellText = document.createTextNode(contents[i][j]);
      cell.appendChild(cellText); // add the text into the cell
      row.appendChild(cell); // append the cell into the row
    }

    tblBody.appendChild(row); // append the row to the table body
  }

  tbl.appendChild(tblBody); // append the table body into the table
  return tbl; // returns an HTML table representing the CSV dataset
}

/**
 * Takes in a column to search in and a value to search for within the contents
 * of a CSV file in order to output rows that contain the desired value in the
 * desired column
 * @param column represents the column to search in (either an index number or
 * the name of a header value)
 * @param value the value to search for
 * @returns an HTML table element representing all rows that contain the value
 * within the specific column to search for
 */
function processQuery(column: string, value: string) {
  // function for search command
  const data: Array<Array<string>> | null = getSearch(file_name, column, value);
  if (data == null) {
    return null;
  } else {
    return viewCSVData(data);
  }
}

/**
 * Function used to render output onto html screen.
 * @param processFunction Function that takes in string and outputs an html element
 */
export function renderHistory(processFunction: ProcessFunction){
  const maybeDisplays: HTMLCollectionOf<Element> =
    document.getElementsByClassName("scroll"); // command history box display
  const maybeDisplay: Element | null = maybeDisplays.item(0);
  if (maybeDisplay == null) {
    console.log("Couldn't find input element");
  } else if (!(maybeDisplay instanceof HTMLDivElement)) {
    console.log(`Found element ${maybeDisplay}, but it wasn't a div`);
  } else {
    const maybeInputs: HTMLCollectionOf<Element> =
      document.getElementsByClassName("repl-command-box");
    // take the input from the command text box
    const maybeInput: Element | null = maybeInputs.item(0);
    if (maybeInput == null) {
      console.log("Couldn't find input element");
    } else if (!(maybeInput instanceof HTMLInputElement)) {
      console.log(`Found element ${maybeInput}, but it wasn't an input`);
    } else {

      const output: Element = processFunction(maybeInput.value);
      // process the command depending on which one it is
      maybeDisplay.appendChild(output);
      // show the output of processCommand in the history box display
      maybeInput.value = ""; // reset the command text box
    }
  }
}

/**
 * Clears data in user file (used for testing)
 */
export function clearHistory() {
  contents = new Array<Array<string>>(); // contents of the current CSV file
  file_name = "";
  current_mode = "brief"
}

export { prepareSubmit, handleSubmit };
