## Mazebot API

The Mazebot API (https://api.noopschallenge.com/mazebot) has two different modes: *random* and *race*.

## Random mode

Mazebot will serve you random mazes. You can also use the query parameter `minSize` and `maxSize` to control the size of maze that is served.

The available sizes are: 10, 20, 30, 40, 60, 100, 120, 150, and 200.

### getting a random maze

`GET https://api.noopschallenge.com/mazebot/random`

`HTTP 200`

```
{
  "name": "Maze #236 (10x10)",
  "mazePath": "/mazebot/mazes/ikTcNQMwKhux3bWjV3SSYKfyaVHcL0FXsvbwVGk5ns8",
  "startingPosition": [ 4, 3 ],
  "endingPosition": [ 3, 6 ],
  "message": "When you have figured out the solution, post it back to this url. See the exampleSolution for more information.",
  "exampleSolution": { "directions": "ENWNNENWNNS" },
  "map": [
    [ " ", " ", "X", " ", " ", " ", "X", " ", "X", "X" ],
    [ " ", "X", " ", " ", " ", " ", " ", " ", " ", " " ],
    [ " ", "X", " ", "X", "X", "X", "X", "X", "X", " " ],
    [ " ", "X", " ", " ", "A", " ", " ", " ", "X", " " ],
    [ " ", "X", "X", "X", "X", "X", "X", "X", " ", " " ],
    [ "X", " ", " ", " ", "X", " ", " ", " ", "X", " " ],
    [ " ", " ", "X", "B", "X", " ", "X", " ", "X", " " ],
    [ " ", " ", "X", " ", "X", " ", "X", " ", " ", " " ],
    [ "X", " ", "X", "X", "X", "X", "X", " ", "X", "X" ],
    [ "X", " ", " ", " ", " ", " ", " ", " ", "X", "X" ]
  ]
}
```


### getting a maze with size constraints

`GET https://api.noopschallenge.com/mazebot/random?minSize=10&maxSize=20`

`HTTP 200`

```
{
  "name": "Maze #142 (10x10)",
  "mazePath": "/mazebot/mazes/dTXurZOonsCbWC9_PDBWpiRAvBME3VBDIf9hcwwCdNc",
  "startingPosition": [ 9, 3 ],
  "endingPosition": [ 7, 0 ],
  "message": "When you have figured out the solution, post it back to this url. See the exampleSolution for more information.",
  "exampleSolution": { "directions": "ENWNNENWNNS" },
  "map": [
    [ "X", " ", " ", " ", " ", " ", "X", "B", " ", " " ],
    [ " ", " ", " ", " ", "X", " ", " ", " ", "X", " " ],
    [ " ", "X", "X", "X", " ", "X", "X", "X", " ", "X" ],
    [ " ", " ", " ", " ", "X", " ", " ", "X", " ", "A" ],
    [ " ", "X", "X", "X", " ", "X", " ", "X", " ", " " ],
    [ " ", " ", " ", "X", " ", "X", " ", "X", " ", " " ],
    [ " ", "X", " ", "X", " ", "X", " ", "X", " ", "X" ],
    [ " ", " ", " ", "X", " ", "X", " ", "X", " ", " " ],
    [ "X", " ", "X", "X", " ", " ", " ", " ", " ", " " ],
    [ "X", " ", " ", " ", " ", "X", " ", " ", " ", "X" ]
  ]
}
```


### solving a random maze

`POST https://api.noopschallenge.com/mazebot/mazes/RPSpGy5aqL5p30LpQwqiO9O2yQipiLQT3WGqPSHtyVg`


```
{
 "directions": "ENNNN...."
}
```

`HTTP 200`

```
{
  "result": "success",
  "message": "You solved it in 0.029 seconds with 56 steps, the shortest possible solution.",
  "shortestSolutionLength": 56,
  "yourSolutionLength": 56,
  "elapsed": 29
}
```


### incorrect solution

`POST https://api.noopschallenge.com/mazebot/mazes/17pSAsql1EEaCvEe28UnAQ`


```
{
 "directions": "ESS"
}
```

`HTTP 400`

```
{ "message": "Hit a wall at directions[1]", "result": "failed" }
```


### incorrect solution - did not finish

`POST https://api.noopschallenge.com/mazebot/mazes/17pSAsql1EEaCvEe28UnAQ`


```
{
 "directions": ""
}
```

`HTTP 400`

```
{ "message": "Did not make it to point B", "result": "failed" }
```

## Race mode

Once you are getting good at solving mazes, join the Mazebot 500, a timed race to solve a series of mazes of increasing difficulty.
If you can solve them all, Mazebot will grant you a certificate of your achievement.

Be warned -- some of these mazes are really big! Maybe a robot would be better suited to this task than a human...

### get info about the maze race

`GET https://api.noopschallenge.com/mazebot/race`

`HTTP 200`

```
{
  "message": "Welcome to the Mazebot 500.\n\nI will give you a series of mazes\nIf you can solve them all, I'll give you a certificate that proves your maze mettle.\n\nAre you ready to enter?\n\nWhen you are ready, send me your github login by posting json to /mazebot/race/start\n\nSee the attached exampleRequest.\n",
  "exampleRequest": { "login": "noops-challenge" }
}
```


### Start the race with a POST

`POST https://api.noopschallenge.com/mazebot/race/start`


```
{
 "login": "yourgithubloginhere"
}
```

`HTTP 200`

```
{
  "message": "Start your engines!",
  "nextMaze": "/mazebot/race/iEGpDT1I0qFzGU81yb49JY3Srj1daT70P6e-Zr6bpR0"
}
```


### Get the first maze in the race from the provided URL

`GET https://api.noopschallenge.com/mazebot/race/Fh5Kt7l9gMQr41GvWkmoCg`

`HTTP 200`

```
{
  "name": "Mazebot 500 Stage#1 (5x5)",
  "mazePath": "/mazebot/race/Fh5Kt7l9gMQr41GvWkmoCg",
  "map": [
    [ "A", " ", " ", " ", " " ],
    [ " ", "X", "X", "X", " " ],
    [ " ", " ", "X", " ", " " ],
    [ "X", " ", "X", "B", "X" ],
    [ "X", " ", " ", " ", "X" ]
  ],
  "message": "When you have figured out the solution, post it back to this url in JSON format. See the exampleSolution for more information.",
  "startingPosition": [ 0, 0 ],
  "endingPosition": [ 3, 3 ],
  "exampleSolution": { "directions": "ENWNNENWNNS" }
}
```


### Solve the first maze in the race

`POST https://api.noopschallenge.com/mazebot/race/Fh5Kt7l9gMQr41GvWkmoCg`


```
{
 "directions": "SSE..."
}
```

`HTTP 200`

```
{
  "result": "success",
  "elapsed": 0.52,
  "shortestSolutionLength": 8,
  "yourSolutionLength": 8,
  "nextMaze": "/mazebot/race/2os41shHeVDhaKTAw1m9-Q"
}
``
