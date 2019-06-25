import requests
from collections import namedtuple


Position = namedtuple('Position', ['x', 'y'])


class Maze:
    def __init__(self, layout, start, end, dimensions):
        self.layout = layout
        self.start = start
        self.end = end
        self.dimensions = dimensions
        self.check_possible_movements()

    def move_player(self, direction):
        """
        Moves the player in the desired direction
        :param direction:
        :return:
        """
        return

    def check_possible_movements(self):
        """

        :return:
        """
        new_possible_movements = []

        # Look left

        # Look right

        # Look up

        # Look down

        if not new_possible_movements:
            self.revert_to_checkpoint()

    def determine_optimal_movement(self, possible_movements):
        """
        Determines what move will put the player closest to the end point (greedy algorithm)
        :param possible_movements: list - all open movements
        :return:
        """

        return

    def revert_to_checkpoint(self):
        """
        Reverts the player back to where they had a decision on which way to go
        :return:
        """
        return


def main():
    data = requests.get(url='https://api.noopschallenge.com/mazebot/random').json()

    layout = data['map']
    dimensions = len(layout[0])
    start = data['startingPosition']
    end = data['endingPosition']

    start = Position(x=start[1], y=start[0])
    end = Position(x=end[1], y=end[0])

    maze = Maze(layout=layout, start=start, end=end, dimensions=dimensions)


if __name__ == '__main__':
    main()