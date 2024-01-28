// provide pathfinding to entities.
// IMPORTANT: path is reversed so it is easy to pop next waypoint off end.
function pathfind(source, destination) {
    const cave = gameEngine.globalEntities.get('cave');
    if (cave.grid[source.x][source.y] == 1) {
        console.error("Cannot pathfind from inside wall!");
        return;
    }
    dfs(source, destination, cave.grid);
}
function dfs(source, destination, world) {
    // setup
    const path = [source];
    // could add dead end list, but I think that would add a bit of complexity for very situational gain.
    const result = step(destination, world, path);
    console.log("result: ", JSON.stringify(result));
    return result;
    function step(destination, world, path) {
        console.log("about to step. path: ", JSON.stringify(path));
        if (path.length > 100) {
            console.log("path too long, returning");
            return undefined;
        }
        const lastCoord = path[path.length - 1];
        if (lastCoord.x == destination.x && lastCoord.y == destination.y) {
            return path;
        }
        const vectorToDest = lastCoord.vector(destination).normalized();
        let adjacents = lastCoord.adjacentCoords().filter((coord) => coordIsValid(coord));
        if (adjacents.length == 0) {
            console.log("dead end, stepping back");
            return undefined;
        }
        // sort coordinates by their similarity to the vector to the destination.
        adjacents.sort((a, b) => vectorDifference(lastCoord.vector(a), vectorToDest) - vectorDifference(lastCoord.vector(b), vectorToDest));
        console.log(JSON.stringify(adjacents));
        for (const coord of adjacents) {
            const result = step(destination, world, [...path, coord]);
            if (result != undefined) {
                return result;
            }
        }
        return undefined;
        function coordIsValid(coordinate) {
            return coordinate.x >= 0 && coordinate.x < world.length &&
                coordinate.y >= 0 && coordinate.y < world[0].length &&
                world[coordinate.x][coordinate.y] == 0 &&
                path.find((coord) => coord.x == coordinate.x && coord.y == coordinate.y) == undefined;
        }
    }
}
/**
 * Returns the absolute difference of the two vectors ratios.
 * Should be lower if the vectors are more similar
 */
function vectorDifference(vector1, vector2) {
    const v1 = vector1.normalized();
    const v2 = vector2.normalized();
    console.log("v1: ", JSON.stringify(v1), " v2: ", JSON.stringify(v2));
    return Math.abs(v1.x - v2.x) + Math.abs(v1.y - v2.y);
}
class Coordinate {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    adjacentCoords() {
        return [
            new Coordinate(this.x + 1, this.y),
            new Coordinate(this.x - 1, this.y),
            new Coordinate(this.x, this.y + 1),
            new Coordinate(this.x, this.y - 1),
            // diagnals shouldn't be used for pathfinding, as characters cannot move through a diagonal gap.
            // this might cause zigzag pathing, but thats a better problem than zombies walking infinitely into a wall.
            // new Coordinate(this.x + 1, this.y + 1),
            // new Coordinate(this.x - 1, this.y + 1),
            // new Coordinate(this.x + 1, this.y - 1),
            // new Coordinate(this.x - 1, this.y - 1),
        ];
    }
    // Get the vector pointing from one coordinate to another
    vector(other) {
        return new Vector2(other.x - this.x, other.y - this.y);
    }
}
//# sourceMappingURL=pathfinder.js.map