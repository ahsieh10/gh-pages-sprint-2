import { screen } from "@testing-library/dom";

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


test("test", () => {true});