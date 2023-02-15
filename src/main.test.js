"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const main = __importStar(require("./main"));
const dom_1 = require("@testing-library/dom");
const startHTML = `<body>
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
            <label for="commands">Command Input Box</label>
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
    <script type="module" src="../src/main.js"></script>
</body>`;
let tryButton = HTMLButtonElement;
// Don't neglect to give the type for _every_ identifier.
// Setup! This runs /before every test function/
beforeEach(() => {
    // (1) Restore the program's history to empty
    main.clearHistory();
    // (2) Set up a mock document containing the skeleton that
    // index.html starts with. This is refreshed for every test.
    document.body.innerHTML = startHTML;
    // (3) Find the elements that should be present at the beginning
    // Using "getBy..." will throw an error if this element doesn't exist.
});
test("toggling mode changes prints correct output", () => {
    let input = dom_1.screen.getByPlaceholderText("Enter command here");
    dom_1.fireEvent.change(input, { target: { value: "mode" } }); // pretend a user entered "mode" command
    dom_1.fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });
    expect(dom_1.screen.getByTestId("scroll").children.length).toBe(1);
    expect(expect(dom_1.screen.getByTestId("scroll").children[0].children[0]).toEqual("Command: mode" + "\nOutput: Changed to verbose mode" + "\n"));
});
