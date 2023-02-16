import * as main from './main';
import { screen } from "@testing-library/dom";
// Lets us send user events (like typing and clicking)
import userEvent from "@testing-library/user-event";
var startHTML = "<section>\n    <!-- Tell the browser what to show if JavaScript/TypeScript is disabled. -->\n    <noscript>This example requires JavaScript to run.</noscript>\n    <!-- Prepare a region of the page to hold the entire REPL interface -->\n    <div class=\"repl\">\n        <!-- Prepare a region of the page to hold the command history -->\n        <div class=\"repl-history\">  \n        <h1>Command History</h1>\n        <label for=\"scroll\">Output Box</label>\n        <div class=\"scroll\" data-testid=\"scroll\">\n        </div>          \n        </div>\n        <!-- Prepare a region of the page to hold the command input box -->\n        <div class=\"repl-input\">\n            <label for=\"repl-command-box\">Command Input Box</label>\n            <input type=\"text\" class=\"repl-command-box\" data-testid=\"repl-command-box\" placeholder=\"Enter command here\">\n            <div class=\"button\">\n                <button> Submit command</button>\n            </div>\n        </div>\n    </div>\n</section>";
var tryButton;
var input;
// Don't neglect to give the type for _every_ identifier.
// Setup! This runs /before every test function/
beforeEach(function () {
    // (1) Restore the program's history to empty
    document.body.innerHTML = startHTML;
    main.clearHistory();
    // (2) Set up a mock document containing the skeleton that
    // index.html starts with. This is refreshed for every test.
    tryButton = screen.getByText("Submit command");
    input = screen.getByTestId("repl-command-box");
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
test("Verbose + brief mode output shows up correctly", function () {
    var output = document.createElement("div");
    output.innerText = "Command: mode\nOutput: Changed to verbose mode\n";
    var verboseMock = function (guess) { return output; };
    tryButton.addEventListener("click", function () { return main.renderHistory(verboseMock); });
    userEvent.click(tryButton);
    expect(screen.getAllByText("Command: mode\nOutput: Changed to verbose mode\n").length).toBe(1);
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
