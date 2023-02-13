
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

function handleSubmit(event: SubmitEvent){
    event.preventDefault();
    const maybeDisplays: HTMLCollectionOf<Element> = document.getElementsByClassName('scroll')
    const maybeDisplay: Element | null = maybeDisplays.item(0)
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
            maybeDisplay.innerText = 'hi';
        }
    }
}

// Provide this to other modules (e.g., for testing!)
// The configuration in this project will require /something/ to be exported.
export {prepareSubmit, handleSubmit}
