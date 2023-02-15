import * as main from './main';
import "@testing-library/dom"
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
        <div class="scroll">
        </div>          
        </div>
        <!-- Prepare a region of the page to hold the command input box -->
        <div class="repl-input">
            <form id = "commands">
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

let tryButton: HTMLElement
// Don't neglect to give the type for _every_ identifier.
let input1: HTMLElement, input2: HTMLElement, input3: HTMLElement

// Setup! This runs /before every test function/
beforeEach(() => {
  // (1) Restore the program's history to empty
  main.clearHistory()

  // (2) Set up a mock document containing the skeleton that 
  // index.html starts with. This is refreshed for every test.
  document.body.innerHTML = startHTML

  // (3) Find the elements that should be present at the beginning
  // Using "getBy..." will throw an error if this element doesn't exist.
  tryButton = screen.getByText("Try it!")
  input1 = screen.getByLabelText("Guess 1")
  input2 = screen.getByLabelText("Guess 2")
  input3 = screen.getByLabelText("Guess 3")
});

test("toggling verbose", () => {
    const input = ["", "", ""];
    const output = pattern(input);
    expect(output).toBe(false);
  });

