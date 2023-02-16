import * as main from './main';
import { screen, fireEvent } from "@testing-library/dom";
// Lets us send user events (like typing and clicking)
import userEvent from "@testing-library/user-event";

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

let tryButton: HTMLElement; let input: HTMLElement;
// Don't neglect to give the type for _every_ identifier.

// Setup! This runs /before every test function/
beforeEach(() => {
  // (1) Restore the program's history to empty
  document.body.innerHTML = startHTML;
  main.clearHistory()

  // (2) Set up a mock document containing the skeleton that
  // index.html starts with. This is refreshed for every test.

  tryButton = screen.getByText("Submit command")
  input = screen.getByTestId("repl-command-box")

  // (3) Find the elements that should be present at the beginning
  // Using "getBy..." will throw an error if this element doesn't exist.

});

// test("toggling mode changes prints correct output", () => {

//   let input = screen.getByPlaceholderText("Enter command here");
//   fireEvent.change(input, { target: { value: "mode" } }); // pretend a user entered "mode" command
//   fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });
//   expect(screen.getByTestId("scroll").children.length).toBe(1);
//   expect(
//     expect(screen.getByTestId("scroll").children[0].children[0]).toEqual(
//       "Command: mode" + "\nOutput: Changed to verbose mode" + "\n"
//     )
//   );
// });

test("Verbose + brief mode output shows up correctly", () => {
    let output = document.createElement("div")
    output.innerText = "Command: mode\nOutput: Changed to verbose mode\n"
    const verboseMock = (guess: string) => output
    tryButton.addEventListener("click", () => main.renderHistory(verboseMock));
    userEvent.click(tryButton)
    expect(screen.getAllByText("Command: mode\nOutput: Changed to verbose mode\n").length).toBe(1)
    // let input = screen.getByPlaceholderText("Enter command here");
    // fireEvent.change(input, { target: { value: "mode" } }); // pretend a user entered "mode" command
    // fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });
    // expect(screen.getByTestId("scroll").children.length).toBe(1);
    // expect(
    //   expect(screen.getByTestId("scroll").children[0].children[0]).toEqual(
    //     "Command: mode" + "\nOutput: Changed to verbose mode" + "\n"
    //   )
    // );
  });
