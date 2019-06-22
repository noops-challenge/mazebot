![Mazebot animation](https://user-images.githubusercontent.com/212941/59631813-9ad09f80-90fd-11e9-8556-810c48531558.gif)

# 👋 Meet Mazebot
For many years, Mazebot spent most of its vacation days and countless lunch breaks mapping the many forgotten cavernous subterranean floors beneath the Noops factory.

Spending all that time getting lost and finding its way took its toll on Mazebot.

These days, Mazebot is excited about only one thing: Challenging you to solve mazes.

Are you ready to solve them?

Start with the smaller mazes. Once you get the basics down, enter the Mazebot 500, a race to solve a series of mazes in a row.

IF you can complete them all, you will get a certificate of your achievement.

# 🤖 API

Each maze in Mazebot's collection has a map that is a an array of rows.

Each row is an array of single-length strings representing the contents of each location in the maze.

The possible values are:

- `" "` empty - a passable square
- `"X"` - wall - not passable
- `"A"` - starting position - this is where you start in the maze
- `"B"` - goal - this is where you need to navigate to to escape the maze

The rows are in order from north to south, and the entries in each column are in order from west to east.

In these mazes, you may travel in any of the four cardinal directions ("N", "E", "S", "W").

## ✳️ How to play

Mazebot offers two ways to play: random mode, and the great maze race.

See the [API documentation](./API.md) for more information.

## 🎲 Random mode

Mazebot will give you a random selection from its maze collection and see how fast you can solve it.

You can optionally limit the sizes of maze you would like with the `minSize` and `maxSize` parameters.

### Get a random maze

`GET /mazebot/random`

### Get a maze that is at least 20 squares wide.

`GET /mazebot/random?minSize=20`

### Get a maze that is between 30 and 60 squares wide.

`GET /mazebot/random?minSize=30&maxSize=60`

## 🏎️ Race mode

In race mode, mazebot will give you a series of mazes and challenge you to solve them all. At the end, if you are successful, Mazebot will award you a certificate that you can use to prove your maze mettle.

###  Get information about the race

`GET /mazebot/race`

###  Start the race

`POST /mazebot/race { "login": "yourgithubnamehere" }`

# Starter Kits

## Ruby command line client

You can start building a command-line solver by starting with the [the included ruby script](./mazebot.rb).

The script demonstrates how to access the Mazebot API and work through the Mazebot race.

Can you build a program that can complete the Mazebot 500 on its own?

## HTML5 Canvas Maze Game

Mazebot has also included an [HTML Game](./canvas-game) that will let you play through random mazes from the Mazebot API.

Check out the [source code](./canvas-game) and show us your forks.

[Play it now!](https://noopschallenge.github.io/canvas-game/index.html)

![Screenshot](canvas-game/mazebot-screenshot.png?raw=true "Mazebot screenshot")

Look at [the README](./canvas-game/README.md) for more information and ideas for extending the game.

# ✨ A few ideas

- **Create an automated solver**: Humans can be pretty good at solving mazes, but they'll never be as fast as a well-tuned computer. You could start from the [the included ruby script](./mazebot.rb) or start from scratch in another language.  If you create a solver in another language, please share it with the Noops!

- **Extend the game:** Check out [the canvas game README](./canvas-game/README.md) for some ideas on how to get started.

- **Create your own maze game:** Try using a tool like [Phaser](http://phaser.io/) to create your own game using the Mazebot API.

- **Create your own maze API:** Try making your own API that serves random mazes and connect the canvas maze game to it.

- **Create a colorful terminal client** Do you have a fondness for ASCII graphics? Create a fun client

- **Generate art with the mazes**: Solving these mazes isn't the only thing you can do with them. Maybe you'd rather use these maze patterns to generate art or sound.

- **Remix:** Try mixing in one of the [other Noops APIs](http://noopschallenge.com/challenges) to make something amazing.

Mazebot can't wait to see what you make!

More about Mazebot here: https://noopschallenge.com/challenges/mazebot
