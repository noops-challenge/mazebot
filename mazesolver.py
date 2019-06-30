import requests
import json
from collections import namedtuple


Position = namedtuple('Position', ['x', 'y'])


class Maze:
    def __init__(self, layout, start, end, dimensions):
        self.layout = layout
        self.start = start
        self.player_position = start
        self.end = end
        self.dimensions = dimensions
        self.checkpoints = [start]
        self.path = []
        self.checkpoint_paths = {self.start: self.path}
        #self.moves_since_checkpoint = 0

    def move_player(self, movement):
        """
        Moves the player in the desired direction
        :param movement: list: [direction, coordinates, distance from exit]
        :return:
        """
        direction = movement[0]
        x = movement[1].x
        y = movement[1].y

        print(f'Moving player {direction}')
        self.layout[self.player_position.y][self.player_position.x] = "V"

        self.player_position = Position(x=x, y=y)

        self.layout[y][x] = 'P'
        self.path.append(direction)
        return

    def check_possible_movements(self):
        """
        Checks to see what ways the player can move
        :return:
        """
        print()
        self.display_maze()
        print(f'Current Path: {self.get_path()}')
        print(f'Current Checkpoints: {self.checkpoints}')
        print(f'Path index: {len(self.path) - 1}')

        possible_movements = []
        restricted_spaces = ['X', 'V']  # X = Wall, V = Visited

        # Look North
        if (self.player_position.y - 1) >= 0:
            if self.layout[self.player_position.y - 1][self.player_position.x] not in restricted_spaces:
                possible_movements.append('N')
        # Look East
        if (self.player_position.x + 1) <= self.dimensions:
            if self.layout[self.player_position.y][self.player_position.x + 1] not in restricted_spaces:
                possible_movements.append('E')
        # Look South
        if (self.player_position.y + 1) <= self.dimensions:
            if self.layout[self.player_position.y + 1][self.player_position.x] not in restricted_spaces:
                possible_movements.append('S')
        # Look West
        if (self.player_position.x - 1) >= 0:
            if self.layout[self.player_position.y][self.player_position.x - 1] not in restricted_spaces:
                possible_movements.append('W')

        print(f'Player can move in the following directions: {possible_movements}')

        if possible_movements:
            self.determine_optimal_movement(possible_directions=possible_movements)
        else:
            # If there are no possible movements, the player must go back to the last spot that a choice was made
            self.revert_to_checkpoint()

    # TODO: Possibly optimize this
    def determine_optimal_movement(self, possible_directions):
        """
        Determines what move will put the player closest to the end point (greedy algorithm)
        :param possible_directions: list - all open directions (N, E, S, W)
        :return:
        """
        possible_spaces = []

        # Creates list of possible movements that includes: direction, the point on the board, distance from exit,
        for direction in possible_directions:
            space = self.calculate_point(direction=direction)
            distance_from_exit = self.distance_formula(point=space)
            possible_space = [direction, space, distance_from_exit]
            possible_spaces.append(possible_space)

        possible_spaces.sort(key=lambda x: x[2])
        optimal_movement = possible_spaces[0]

        # If the player has a choice to make, set the current point as a checkpoint
        if len(possible_spaces) > 1:
            checkpoint = self.player_position
            path_copy = self.path.copy()
            self.checkpoints.append(checkpoint)
            self.checkpoint_paths[checkpoint] = path_copy

        self.move_player(optimal_movement)
        return

    def revert_to_checkpoint(self):
        """
        Reverts the player back to where they had a decision on which way to go
        :return:
        """
        # Set current position to visited
        self.layout[self.player_position.y][self.player_position.x] = "V"

        # Get the coordinates of the last "checkpoint" (the last decision)
        last_checkpoint = self.checkpoints.pop()
        print(f'Reverting to checkpoint at {last_checkpoint}')


        # Move the player to the last checkpoint
        self.player_position = last_checkpoint
        self.layout[self.player_position.y][self.player_position.x] = "P"

        # Revert path to last checkpoint's path
        print(self.checkpoint_paths)
        self.path = self.checkpoint_paths[last_checkpoint]

        # Recheck the possible movements
        self.check_possible_movements()
        return

    def display_maze(self):
        """
        Displays maze
        :return:
        """
        for row in self.layout:
            print(row)

    def distance_formula(self, point):
        """
        Calculates distance between a point and the end
        :param point: Position - x, y coordinates of space in maze
        :return: float - distance from the point to the end
        """
        distance = (((point.x - self.end.x)**2) + (point.y - self.end.y)**2)**.5
        return distance

    def calculate_point(self, direction):
        """
        Determines the x,y cooridates of the new point based on the direction the player moves
        :param direction: String - direciton in which player is moving
        :return:
        """
        if direction == 'N':
            point = Position(x=self.player_position.x, y=self.player_position.y - 1)
        if direction == 'E':
            point = Position(x=self.player_position.x + 1, y=self.player_position.y)
        if direction == 'S':
            point = Position(x=self.player_position.x, y=self.player_position.y + 1)
        if direction == 'W':
            point = Position(x=self.player_position.x - 1, y=self.player_position.y)

        return point

    def get_path(self):
        return self.path


def main():
    # GET request
    geturl = 'https://api.noopschallenge.com/mazebot/random?maxSize=10'
    data = requests.get(url=geturl).json()

    # Stores data for the maze
    layout = data['map']
    dimensions = len(layout[0]) - 1
    start = data['startingPosition']
    end = data['endingPosition']

    # Start and End positions of the maze
    start = Position(x=start[0], y=start[1])
    end = Position(x=end[0], y=end[1])

    # Create an instance of the maze
    maze = Maze(layout=layout, start=start, end=end, dimensions=dimensions)

    # Moves the "player" until the end is reached
    success = False
    while not success:
        if maze.player_position == end:
            success = True
        else:
            maze.check_possible_movements()

    # Obtains the path and formats it as a string
    print()
    path = maze.get_path()
    string_path = ""
    for direction in path:
        string_path += direction
    print(f'Path taken: {path}')
    answer = {
        'directions': string_path
    }

    # POSTS the answer to obtain the result
    post_url = 'https://api.noopschallenge.com' + data['mazePath']
    result = requests.post(url=post_url, data=json.dumps(answer))

    # Result...
    print(result.content)


if __name__ == '__main__':
    main()


