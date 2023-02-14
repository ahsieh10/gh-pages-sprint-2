import {getData, getSearch} from './mockedJson.js'
// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {    
    prepareSubmit()
    
    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element 
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
}

function prepareSubmit(){
    // Assumption: there's only one thing
    const maybeForm: Element | null = document.getElementById('commands')
    if(maybeForm == null) {
        console.log("Couldn't find input element")
    } else if(!(maybeForm instanceof HTMLFormElement)) {
        console.log(`Found element ${maybeForm}, but it wasn't an input`)
    } else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        maybeForm.addEventListener("submit", handleSubmit);
    }
}

let history = '';
let contents = null;
function handleSubmit(event: SubmitEvent) {
    const maybeDisplays: HTMLCollectionOf<Element> =
    document.getElementsByClassName("scroll");
    const maybeDisplay: Element | null = maybeDisplays.item(0);
    event.preventDefault();
    if(maybeDisplay == null) {
        console.log("Couldn't find input element")
    } else if(!(maybeDisplay instanceof HTMLDivElement)) {
        console.log(`Found element ${maybeDisplay}, but it wasn't a div`)
    } else {
        // Notice that we're passing *THE FUNCTION* as a value, not calling it.
        // The browser will invoke the function when a key is pressed with the input in focus.
        //  (This should remind you of the strategy pattern things we've done in Java.)
        const maybeInputs: HTMLCollectionOf<Element> = document.getElementsByClassName('repl-command-box')
        // Assumption: there's only one thing
        const maybeInput: Element | null = maybeInputs.item(0)
        // Is the thing there? Is it of the expected type? 
        //  (Remember that the HTML author is free to assign the repl-input class to anything :-) )
        if(maybeInput == null) {
            console.log("Couldn't find input element")
        } else if(!(maybeInput instanceof HTMLInputElement)) {
            console.log(`Found element ${maybeInput}, but it wasn't an input`)
        } else {
            // Notice that we're passing *THE FUNCTION* as a value, not calling it.
            // The browser will invoke the function when a key is pressed with the input in focus.
            //  (This should remind you of the strategy pattern things we've done in Java.)
            history += processCommand(maybeInput.value) + '\n';
            maybeDisplay.innerText = history;
            maybeInput.value = '';
        }
    }
}

let current_mode = "brief";
function processCommand(command: string) {

  if (command == "mode") { // if user switches the mode by command
    if (current_mode == "brief") {
      // if current mode is brief
      current_mode = "verbose"; // change mode into verbose
      return "Command: " + command + "\nOutput: Changed to verbose mode" + "\n";
    }
    else { // if current mode is verbose
        current_mode = "brief"; // change mode into brief
        return "Changed to brief mode" + '\n';
    }
  }
  else if(command == "view"){
    //do view
  }
  else{
    const cArguments: Array<string> = command.split(" ", 3)
    let results = '';
    if((cArguments.length == 0 || cArguments.length == 1) || cArguments.length > 3){
        results = "Invalid command"
    }
    else if(cArguments[0] == "load_file"){
        if(cArguments.length == 1){
            results = "Invalid command"
        }
        else{
            results = processLoadData(cArguments[1])
            if(results == null){
                results = "Invalid command"
            }
        }
    }
    else{
        results = "Invalid command"
    }
    if (current_mode == "brief") {
        return results + "\n";
    }
    else{
        return "Command: " + command + "\nOutput: " + results + '\n';
    }
  }
}

function processLoadData(filepath: string){
    const data: Array<Array<string>> | null = getData(filepath)
    if(data == null){
        return `File ${filepath} does not exist`
    }
    else{
        contents = data
        console.log(data)
        return `File ${filepath} loaded!`
    }
}

function processSearch(column: string, value: string){
    
}

// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export {prepareSubmit, handleSubmit}
