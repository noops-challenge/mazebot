
# 1. Maze Traveler Code

## 1.1 NOOP Challenge GET and POST functions
These were based on the examples given in the API README

## 1.2 Walker Class
A representation of a being in a maze with properties:
   
### 1.2.1 Parameters
- `x`, `y `: location
- `directions`: list of moves it has made (ex. `'NEWS'`)
- `locations`: list of visited locations related to .directions list 
- `visited`: list of all visited nodes regardless of .directions or .locations

### 1.2.1 Methods
A Walker has the methods: `N`, `E`, `W`, and `S` used to move the walker, changing its coordinates and storing the direction and location to their appropriate lists:

A walker has a method to set its location (used when backtracking).
- `set_at`: set the Walkers `x`,`y` to a node, `locations[index]`'s `x`,`y`
- `clone`: generates unique instance of the walker (I used it to evaluate neighboring solutions)

## 1.3 Dungeon_master Class
The solver that manipulates a Walker to determine a solution to the passed in maze/map

### 1.3.1 Parameters
- `maze` The Dungeon_master stores a passed in instance of a maze

### 1.3.2 Methods
- `solve` The main logic of the solution process.

#### ✨Suggest Methods

- `LOOK_AROUND`
Determine the state of each possible move (NEWS) from current location

- `MOVE_FORWARD`
Use the information gained in step one, along with the Walker's `locations` and `visited` lists to determine the next move

- `BACKTRACK`
If the Walker has reached a terminal non-goal location, determine what point in `locations` it should return to and continue searching in a differnt direction. Ensure that the backtrack process removes unwanted directions and locations leading to terminal location.

- `FEEDBACK`
Provide information about the Walkers progress as it searches.

## 1.4 Helper Functions
Because long lines of display are sometimes hard to manage the following functions attempt to compactly display (smaller) mazes.

- `draw_maze`: displays the maze, optionally, with the walkers tour indicated by '='

#### ✨Suggest Functions
I would also suggest creating functions to concisely display data generated during the solution process. (ex. string of neighboring moves, string of Walker.locations)

# 2. Solve a maze
1. Get a new maze from the Mazebot or navigate to a maze's url and save the JSON to work on a single instance (like the one provided).

2. Define a Walker

3. Define a Dungeon_master with a maze

4. Solve the maze with the Dungeon_master and Walker

# 3. RaceMode
1. Initiate the race
2. While `nextMaze` is returned, solve that maze
2. Win!


```python

```
