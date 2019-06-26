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
        self.display_maze()
        self.check_possible_movements()

    def move_player(self, direction):
        """
        Moves the player in the desired direction
        :param direction:
        :return:
        """
        print(f'moving player {direction}')
        self.path.append(direction)
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
            self.determine_optimal_movement(possible_movements=possible_movements)
        else:
            self.revert_to_checkpoint()

    # TODO: Possibly optimize this
    def determine_optimal_movement(self, possible_movements):
        """
        Determines what move will put the player closest to the end point (greedy algorithm)
        :param possible_movements: list - all open movements
        :return:
        """
        if len(possible_movements) == 1:
            self.move_player(direction=possible_movements[0])
        else:
            # TODO: Create orderedict of chekpoints to hold additional possible movements
            self.checkpoints.append(Position(x=self.player.x, y=self.playery))
            # Chooses space that will get player closest to the end
            point_distances = {self.distance_formula(point): point for point in possible_movements}
            min_distance = (min(point_distances.keys()))
            optimal_movement = point_distances[min_distance]

            self.move_player(direction=optimal_movement)

        return

    def revert_to_checkpoint(self):
        """
        Reverts the player back to where they had a decision on which way to go
        :return:
        """
        return

    def display_maze(self):
        for row in self.layout:
            print(row)

    def distance_formula(self, direction):
        """
        Calculates distance between a point and the end
        :param direction: String - direction in which is being checked
        :return: float - distance from the point to the end
        """
        point = self.calculate_point(direction)
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


if __name__ == '__main__':
    main()