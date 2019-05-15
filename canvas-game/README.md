# 🎮 Mazebot game starter

Here's an example HTML game that uses the Mazebot API. that renders a random maze and allows the player to navigate around it to find the solution.


Check out the [live demo](https://noops-challenge.github.io/mazebot/canvas-game) or clone this repository to your computer and open `index.html` in your browser to play locally.

This game is written without libraries and no build tools -- just JavaScript, HTML, and CSS. If you want to change it, just edit the files and refresh your borwser.

It uses the [HTML canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to render the game.

#### Controls:

Use the arrow keys, mouse or touch to navigate the maze.
Plus key (+) or double-click/tap to zoom in/out.

# ✨ A few ideas

- **Change the difficulty:** Right now, the size of the maze can be controlled by setting the `minWidth` and `maxWidth` query parameters, which are [passed along to the Mazebot API](./js/index.js#L37). You could make the difficulty increase as the game progresses, or let the player select their difficulty when the game starts.

- **Change the graphics:** Check out the [display rendering code](./js/display) to get some ideas. You could start by changing [the colors](./js/display/styles.js)... or maybe you'd like a different [avatar](./js/display/overlay-renderer.js) -- try making a vehicle that drives or a creature that walks! You could change the [map](./js/display/map-renderer.js): try replacing the graphics with a [tileset](). You could even completely replace the renderer with your own 3D or isometeric renderer!

- **Add a solver:** Perhaps you'd like to add a solver to the game that can be [triggered somehow](./js/game/maze-input#L141) by the player.

- **Add a soundtrack:** Add some sound effects using the WebAudio API, or background music while you play.

- **Add enemies:** Make the maze harder by adding enemies that chase the player around the maze.

- **Add different controls:** You could add support for vim keys to the [keyboard handler](./js/game/maze-input), or try to add [tilt controls](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation#Processing_motion_events) for players on mobile devices.

- **Animate avatar movement:** The avatar moves instantly, and can move as fast as the player can move their mouse or finger. You could try to animate the movement in the [game loop](./js/game/maze-game.js#L61) to make the game smoother.

Mazebot looks forward to seeing what you can do!
