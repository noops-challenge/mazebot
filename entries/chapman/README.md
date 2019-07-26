{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# 1. Maze Traveler Code"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1.1 NOOP Challenge GET and POST functions\n",
    "These were based on the examples given in the API README"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1.2 Walker Class\n",
    "A representation of a being in a maze with properties:\n",
    "   \n",
    "### 1.2.1 Parameters\n",
    "- `x`, `y `: location\n",
    "- `directions`: list of moves it has made (ex. `'NEWS'`)\n",
    "- `locations`: list of visited locations related to .directions list \n",
    "- `visited`: list of all visited nodes regardless of .directions or .locations\n",
    "\n",
    "### 1.2.1 Methods\n",
    "A Walker has the methods: `N`, `E`, `W`, and `S` used to move the walker, changing its coordinates and storing the direction and location to their appropriate lists:\n",
    "\n",
    "A walker has a method to set its location (used when backtracking).\n",
    "- `set_at`: set the Walkers `x`,`y` to a node, `locations[index]`'s `x`,`y`\n",
    "- `clone`: generates unique instance of the walker (I used it to evaluate neighboring solutions)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1.3 Dungeon_master Class\n",
    "The solver that manipulates a Walker to determine a solution to the passed in maze/map\n",
    "\n",
    "### 1.3.1 Parameters\n",
    "- `maze` The Dungeon_master stores a passed in instance of a maze\n",
    "\n",
    "### 1.3.2 Methods\n",
    "- `solve` The main logic of the solution process.\n",
    "\n",
    "#### ✨Suggest Methods\n",
    "\n",
    "- `LOOK_AROUND`\n",
    "Determine the state of each possible move (NEWS) from current location\n",
    "\n",
    "- `MOVE_FORWARD`\n",
    "Use the information gained in step one, along with the Walker's `locations` and `visited` lists to determine the next move\n",
    "\n",
    "- `BACKTRACK`\n",
    "If the Walker has reached a terminal non-goal location, determine what point in `locations` it should return to and continue searching in a differnt direction. Ensure that the backtrack process removes unwanted directions and locations leading to terminal location.\n",
    "\n",
    "- `FEEDBACK`\n",
    "Provide information about the Walkers progress as it searches."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1.4 Helper Functions\n",
    "Because long lines of display are sometimes hard to manage the following functions attempt to compactly display (smaller) mazes.\n",
    "\n",
    "- `draw_maze`: displays the maze, optionally, with the walkers tour indicated by '='\n",
    "\n",
    "#### ✨Suggest Functions\n",
    "I would also suggest creating functions to concisely display data generated during the solution process. (ex. string of neighboring moves, string of Walker.locations)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# 2. Solve a maze\n",
    "1. Get a new maze from the Mazebot or navigate to a maze's url and save the JSON to work on a single instance (like the one provided).\n",
    "\n",
    "2. Define a Walker\n",
    "\n",
    "3. Define a Dungeon_master with a maze\n",
    "\n",
    "4. Solve the maze with the Dungeon_master and Walker"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# 3. RaceMode\n",
    "1. Initiate the race\n",
    "2. While `nextMaze` is returned, solve that maze\n",
    "2. Win!"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.7.3"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
