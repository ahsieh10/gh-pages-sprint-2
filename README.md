# Project details
Project name: Echo
Team members and contributions: Allison Hsieh (ahsieh10) and Michael Ma (mma32)
Total Estimated Time: ~25-30 hours (combined)
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
## Write reproduction steps for all the bugs in your program. If the mentor TA finds an error and knows how to reproduce it, they will be able to leave better feedback. If the mentor TA finds the bug without proper documentation, they will assume you did not test your program properly.
## Explanations for checkstyle errors (hopefully none)

# Tests
 ## need to add this info after implementing tests Explain the testing suites that you implemented for your program and how each test ensures that a part of the program works. 

# How-Tos
To run our program, open our index.html (in the public file) with live server.
Then, you can start typing in commands to test out our program. To submit a
command, you can either click on the "Submit command" button or press enter
on your keyboard -- either should work! You can type in "mode" to switch
between brief and verbose modes for the command prompt input/output statements.
Also, to load in a CSV file, type in (without the quotes) "load_file *file-name*". After this, you can use our other commands "view" and "search *column* *value*". 
If you try to use "view" or "search", or otherwise type in something that isn't
a command (i.e: gibberish like "dskjfkjbjk"), the command prompt will return
an Invalid Command output.

## Build and run your program --> need to add this to how-to