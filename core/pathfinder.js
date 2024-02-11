// provide pathfinding to entities.
// IMPORTANT: path is reversed so it is easy to pop next waypoint off end.
function pathfind(source, destination) {
    const cave = gameEngine.globalEntities.get('cave');
    if (cave.grid[source.x][source.y] == 1) {
        console.error("Cannot pathfind from inside wall!");
        return;
    }
    const path = dfs(source, destination, cave.grid);
    if (!!path) {
        path.pop();
        trimPath(path);
        return path;
    }
    console.error("pathfinding failed");
    return undefined;
}
function dfs(source, destination, world) {
    // setup
    const path = [source];
    const deadEnds = [];
    try {
        const result = step(destination, world, path);
        return result.reverse();
    }
    catch (e) {
        try {
            const result = step(source, world, [destination]);
            return result;
        }
        catch (e) {
        }
    }
    function step(destination, world, path) {
        const lastCoord = path[path.length - 1];
        if (path.length > 30) {
            deadEnds.push(lastCoord);
            return undefined;
            // throw new Error();
        }
        if (lastCoord.x == destination.x && lastCoord.y == destination.y) {
            return path;
        }
        const vectorToDest = lastCoord.vector(destination).normalized();
        let adjacents = lastCoord.adjacentCoords().filter((coord) => coordIsValid(coord));
        if (adjacents.length == 0) {
            deadEnds.push(lastCoord);
            return undefined;
        }
        // sort coordinates by their similarity to the vector to the destination.
        adjacents.sort((a, b) => vectorDifference(lastCoord.vector(a), vectorToDest) - vectorDifference(lastCoord.vector(b), vectorToDest));
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
                path.find((coord) => coord.x == coordinate.x && coord.y == coordinate.y) == undefined &&
                deadEnds.find((coord) => coord.x == coordinate.x && coord.y == coordinate.y) == undefined;
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
    return Math.abs(v1.x - v2.x) + Math.abs(v1.y - v2.y);
}
function trimPath(path) {
    for (let i = path.length - 1; i > 2; i--) {
        if (directPathIsClear(path[i], path[i - 2])) {
            path.splice(i - 1, 1);
        }
    }
}
class Coordinate {
    x;
    y;
    entityPosition;
    constructor(x, y, entityPosition) {
        this.x = x;
        this.y = y;
        this.entityPosition = entityPosition ?? false;
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
    toWorldPosition() {
        return this.toExactWorldPosition().floor();
    }
    floor() {
        return new Coordinate(Math.floor(this.x), Math.floor(this.y));
    }
    toExactWorldPosition() {
        if (!this.entityPosition) {
            throw new Error("Tried to convert a world position to a world position.");
        }
        // We add 16 to the y position to make it align with the tiles. I don't know why this happens.
        const tileX = (this.x / 64) + ((this.y + 16) / 32);
        const tileY = ((this.y + 16) / 32) - (this.x / 64);
        return new Coordinate(tileX, tileY, false);
    }
    toEntityPosition() {
        if (this.entityPosition) {
            throw new Error("Tried to convert an entity position to an entity position.");
        }
        const entityX = 32 * (this.x - this.y);
        const entityY = 16 * (this.x + this.y);
        return new Coordinate(entityX, entityY, true);
    }
}
function directPathIsClear(source, destination) {
    if (!source.entityPosition) {
        source = source.toEntityPosition();
        source.x = source.x + 16;
        source.y = source.y + 8;
    }
    if (!destination.entityPosition) {
        destination = destination.toEntityPosition();
        destination.x = destination.x + 16;
        destination.y = destination.y + 8;
    }
    const srcPosX = new Coordinate(source.x + 16, source.y, true);
    const srcNegX = new Coordinate(source.x - 16, source.y, true);
    const srcPosY = new Coordinate(source.x, source.y + 8, true);
    const srcNegY = new Coordinate(source.x, source.y - 8, true);
    return directLineIsClear(srcPosX, destination) &&
        directLineIsClear(srcNegX, destination) &&
        directLineIsClear(srcPosY, destination) &&
        directLineIsClear(srcNegY, destination);
}
function directLineIsClear(source, destination) {
    const cave = gameEngine.globalEntities.get('cave');
    if (!source.entityPosition) {
        source = source.toEntityPosition();
    }
    if (!destination.entityPosition) {
        destination = destination.toEntityPosition();
    }
    const vectorToDest = source.vector(destination).normalized().scale(4);
    let current = source;
    let currentWorld = current.toWorldPosition();
    const destinationWorld = destination.toWorldPosition();
    while (currentWorld.x != destinationWorld.x || currentWorld.y != destinationWorld.y) {
        current.x += vectorToDest.x;
        current.y += vectorToDest.y;
        currentWorld = current.toWorldPosition();
        if (cave.grid[currentWorld.x][currentWorld.y] != 0) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=pathfinder.js.map