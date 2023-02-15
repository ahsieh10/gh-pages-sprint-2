import * as main from './main';
import "@testing-library/jest-dom"
import{processCommand, clearHistory} from "./main"
import {screen} from "@testing-library/dom"
// Lets us send user events (like typing and clicking)
import userEvent from '@testing-library/user-event';


const startHTML = 
`<section>
    <!-- Tell the browser what to show if JavaScript/TypeScript is disabled. -->
    <noscript>This example requires JavaScript to run.</noscript>
    <!-- Prepare a region of the page to hold the entire REPL interface -->
    <div class="repl">
        <!-- Prepare a region of the page to hold the command history -->
        <div class="repl-history">  
        <h1>Command History</h1>
        <label for="scroll">Output Box</label>
        <div class="scroll">
        </div>          
        </div>
        <!-- Prepare a region of the page to hold the command input box -->
        <div class="repl-input">
            <form id = "commands">
                <label for="repl-command-box">Command Input Box</label>
                <input type="text" class="repl-command-box" placeholder="Enter command here">
                <div class="button">
                    <button type="submit"> Submit command</button>
                </div>
            </form>
        </div>
    </div>
    <!-- Load the script! Note: the .js extension is because browsers don't use TypeScript
    directly. Instead, the author of the site needs to compile the TypeScript to JavaScript. -->
</section>`


// Don't neglect to give the type for _every_ identifier.
let tryButton: HTMLElement

// Setup! This runs /before every test function/
beforeEach(() => {
  // (1) Restore the program's history to empty
  main.clearHistory()

  // (2) Set up a mock document containing the skeleton that 
  // index.html starts with. This is refreshed for every test.
  document.body.innerHTML = startHTML

  // (3) Find the elements that should be present at the beginning
  // Using "getBy..." will throw an error if this element doesn't exist.
  tryButton = screen.getByText(" Submit Command")
});

test('toggling mode to verbose', () => {
    
    tryButton.addEventListener("click", () => main.handleSubmit);
  
    // Alternatively, we could check behavior of the update function itself directly:
    // main.updateHistoryAndRender(falseMock)    

    // We _could_ also simulate typing in the input fields via userEvent.type(...)
    // But this test is meant to be independent of the exact guess.
    userEvent.type(screen.getByLabelText('Command Input Box'), 'mode')
    userEvent.click(tryButton)
    // Now, did we get an incorrect-try block?
    
    // Could do this, but is the class name something a user (or screenreader) sees?
    // const incorrectTries = document.getElementsByClassName("incorrect-try")    
    // We should prefer this instead:
    const incorrectTries = screen.getAllByText("Guess 1 was incorrect") 
    expect(incorrectTries.length).toBe(1)
  })
