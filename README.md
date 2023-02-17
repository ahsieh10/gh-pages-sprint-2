# Project details
Project name: Echo
Team members and contributions: Allison Hsieh (ahsieh10) and Michael Ma (mma32)
Total Estimated Time: ~35-40 hours (combined)
Repo Link: https://github.com/cs0320-s2023/sprint-2-ahsieh10-mma32

# Design Choices
## HTML (index.html)
index.html is how we made our commands and functions appear on an actual server.
The main purpose of the page is to display a history of command input/outputs
and allow for users to input & submit their own commands from their end.

## Typescript Functionality (main.ts)
main.ts is where we made certain features on index.html user-inputtable (i.e:
pressing submit command actually processes the user command instead of just
being a non-functional button image). This file is also where we created the
functions that would allow us to implement commands for the user stories: mode,
load_file, view, and search. The high-level explanation for our commands here is
that we take in user input from the textbox and have it go through different
situations within a large if-else block depending on what the text in the user
input says (i.e: if the user input said "view", the program checks if a CSV
file has loaded in yet, and also checks if the current mode is brief or verbose).
Having helper functions meant that we didn't have to process the textbox user
input separately in a different function for every single command; rather,
the program takes in the command and assigns it to our main helper function,
which then looks to see which command it is referring to.

## Typescript Data Mocking (mockedJson.ts)
mockedJson.ts is where we created mocked data to imitate results from 
parsing and searching from the backend. We utilized a hashmap of strings
representing the filename to a 2D array of strings representing the CSV. We made
sure to have a variety of CSV shapes (i.e: low rows high columns, high rows low
columns) and also accounted for edge cases like a CSV file that exists but has
a CSV with no data in it.


## CSS (main.css)
CSS was used to improve the visuals of the HTML server, but we did not spend
too much time on it since visual appeal/design is not an evaluated aspect of
the sprint and we had already spent a decent amount of time on implementation.

# Errors/Bugs

# Tests
Implemented JEST and Dom testing suites

JEST: ensures that methods are working properly program-side, checks for
proper HTML-style output of each function.

*Note*: We kept most tests in the raw HTML string format, rather than show it in
a readable string format without the divs/bodies/etc. We thought the benefit of
being able to more thoroughly check the values outweighed the extra messiness
that it entailed.

*Additional Note*: Our invalid commands / empty cases in JEST return an empty
div --> this is intentional!

DOM: ensures that program is appearing properly server-side, checks for proper
display on the server.

General edge cases to consider: calling other functions when load_file has
not been called in yet, calling invalid commands, calling valid commands with
invalid inputs (i.e: "search 1293812939123892 !!!!"), properly loaded CSV file
with empty contents.

# How-Tos
To run our program, open our index.html (in the public file) with live server.
Then, you can start typing in commands to test out our program. To submit a
command, you can either click on the "Submit command" button or press enter
on your keyboard -- either should work! You can type in "mode" to switch
between brief and verbose modes for the command prompt input/output statements.
Also, to load in a CSV file, type in (without the quotes) "load_file *file-name*". 
After this, you can use our other commands "view" and "search *column* *value*". 
If you try to use "view" or "search" without loading in a CSV file, or otherwise 
type in something that isn't a command (i.e: gibberish like "dskjfkjbjk"), 
the command prompt will return an Invalid Command output.

## Build and run your program --> need to add this to how-to