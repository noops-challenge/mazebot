import requests
from collections import namedtuple


Position = namedtuple('Position', ['x', 'y'])


class Maze:
    def __init__(self, layout, start, end, dimensions):
        self.layout = layout
        self.start = start
        self.playerx = start.x
        self.playery = start.y
        self.end = end
        self.dimensions = dimensions
        self.checkpoints = [start]
        self.path = []
        self.win = False
        self.display_maze()
        self.check_possible_movements()

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
        if self.layout[y][x] == 'B':
            self.win = True

        self.layout[y][x] = 'P'
        self.path.append(direction)
        self.display_maze()

        if not self.win:
            self.check_possible_movements()
        return

    def check_possible_movements(self):
        """
        Checks to see what ways the player can maneuver
        :return:
        """
        print(f'Start: {self.start}' )
        print(f'Dimensions: {self.dimensions}')
        possible_movements = []

        # Look North
        if (self.playery - 1) >= 0:
            print('maybe north')
            if self.layout[self.playery - 1][self.playerx] != "X":
                possible_movements.append('N')
        # Look East
        if (self.playerx + 1) <= self.dimensions:
            print('maybe east')
            if self.layout[self.playery][self.playerx + 1] != "X":
                possible_movements.append('E')
        # Look South
        if (self.playery + 1) <= self.dimensions:
            print("maybe south")
            if self.layout[self.playery + 1][self.playerx] != "X":
                possible_movements.append('S')
        # Look West
        if (self.playerx - 1) >= 0:
            print('maybe west')
            if self.layout[self.playery][self.playerx - 1] != "X":
                possible_movements.append('W')

        print(possible_movements)
        if possible_movements:
            self.determine_optimal_movement(possible_directions=possible_movements)
        else:
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

        possible_spaces.sort(key=lambda x: x[0])
        optimal_movement = possible_spaces[0]
        self.move_player(optimal_movement)
        return

    def revert_to_checkpoint(self):
        """
        Reverts the player back to where they had a decision on which way to go
        :return:
        """
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
            point = Position(x=self.playerx, y=self.playery - 1)
        if direction == 'E':
            point = Position(x=self.playerx + 1, y=self.playery)
        if direction == 'S':
            point = Position(x=self.playerx, y=self.playery + 1)
        if direction == 'W':
            point = Position(x=self.playerx - 1, y=self.playery)

        return point

    def get_path(self):
        return self.path


def main():
    data = requests.get(url='https://api.noopschallenge.com/mazebot/random?maxSize=10').json()

    layout = data['map']
    dimensions = len(layout[0]) - 1
    start = data['startingPosition']
    print(start)
    end = data['endingPosition']

    start = Position(x=start[0], y=start[1])
    end = Position(x=end[0], y=end[1])

    maze = Maze(layout=layout, start=start, end=end, dimensions=dimensions)

    path = maze.get_path()
    print(path)


if __name__ == '__main__':
    main()