class Cave extends GameEntity {
    grid;
    entityGrid;
    // How many tiles have been mined so far.
    // The chance of finding the floor exit increases as more of the cave is revealed,
    // Eventually guaranteeing an exit after digging far enough.
    tilesRevealed = 0;
    // Once the floor exit is revealed, we avoid generating any more.
    exitFound = false;
    exitPosition;
    EnemySpawnTable;
    constructor(x, y) {
        super(x, y);
        // for(let x = 0; x < 256; x++) {
        //     for(let y = 0; y < 256; y++) {
        //         if(x % 2 == 0 && y % 2 == 0) {
        //             gameEngine.addEntity(new Floor((32 * x) + (32 * y), (16 * y) - (16 * x)));
        //         }
        //         else {
        //             gameEngine.addEntity(new Floor((32 * x) + (32 * y), (16 * y) - (16 * x)));
        //         }
        //     }
        // }
        this.createStartingCave();
        this.EnemySpawnTable = new CaveEnemyTable;
    }
    update() {
    }
    draw(ctx) {
    }
    mineTile(worldPosition) {
        // We add 16 to the y position to make it align with the tiles. I don't know why this happens.
        let tileX = Math.floor((worldPosition.x / 64) + ((worldPosition.y + 16) / 32));
        let tileY = Math.floor(((worldPosition.y + 16) / 32) - (worldPosition.x / 64));
        console.log("Mining at position X: " + tileX + " | Y: " + tileY);
        // If this is a stone block tile and within the map, break it.
        if (this.withinMapBounds(tileX, tileY) && this.entityGrid[tileX][tileY] instanceof StoneBlock) {
            // There's a chance to generate a cave instead of doing a normal mining operation.
            if (Math.random() < 0.2) {
                this.generateCave(tileX, tileY, 100);
            }
            else {
                // Delete this wall and replace it with a floor!
                this.grid[tileX][tileY] = 0;
                this.entityGrid[tileX][tileY].removeFromWorld = true;
                gameEngine.globalEntities.get("hero").heldResources[this.entityGrid[tileX][tileY].resource]++;
                let floor = new Floor(this.entityGrid[tileX][tileY].x, this.entityGrid[tileX][tileY].y);
                gameEngine.addEntity(floor);
                this.entityGrid[tileX][tileY] = floor;
                // Generate walls on tiles around this one that don't have a wall on them.
                for (let x = tileX - 1; x <= tileX + 1; x++) {
                    for (let y = tileY - 1; y <= tileY + 1; y++) {
                        if (this.entityGrid[x][y] === null) {
                            this.grid[x][y] = 1;
                            this.entityGrid[x][y] = new StoneBlock((32 * x) - (32 * y), (16 * y) + (16 * x));
                            gameEngine.addEntity(this.entityGrid[x][y]);
                        }
                    }
                }
            }
            ASSET_MANAGER.playAsset("./sounds/block_break.wav");
            for (let i = 0; i < 16; i++)
                gameEngine.addEntity(new Rubble(worldPosition.x + (Math.random() * 32) - 16, worldPosition.y + (Math.random() * 32) - 16, new Vector2((Math.random() * 32) - 16, (Math.random() * 32) - 16)));
        }
    }
    createStartingCave() {
        // Create the starting grid and entity array.
        this.grid = [];
        this.entityGrid = [];
        for (let x = 0; x < 256; x++) {
            this.grid.push([]);
            this.entityGrid.push([]);
            for (let y = 0; y < 256; y++) {
                this.grid[x].push(-1);
                this.entityGrid[x].push(null);
            }
        }
        // Generate a cave.
        let currentPosition = { x: 128, y: 128 };
        let caveSize = 500;
        let steps = 0;
        let failsafe = 0;
        let revealedTiles = [];
        //revealedTiles.push(currentPosition);
        // We ensure a small square around us is going to be floor tiles.
        for (let x = 124; x < 132; x++) {
            for (let y = 124; y < 132; y++) {
                this.grid[x][y] = 0;
                revealedTiles.push({ x: x, y: y });
            }
        }
        this.grid[currentPosition.x][currentPosition.y] = 0;
        while (steps < caveSize) {
            let attemptedMovePosition = { x: currentPosition.x, y: currentPosition.y };
            // Move in a random direction. 0 to 3 is clockwise directions, starting from up.
            let nextMoveDirection = Math.floor(Math.random() * 4);
            switch (nextMoveDirection) {
                case 0:
                    attemptedMovePosition.y--;
                    break;
                case 1:
                    attemptedMovePosition.x++;
                    break;
                case 2:
                    attemptedMovePosition.y++;
                    break;
                case 3:
                    attemptedMovePosition.x--;
                    break;
            }
            // If this tile is empty, add it to the floor stack.
            // Empty is -1, floor is 0, wall is 1
            if (this.grid[attemptedMovePosition.x][attemptedMovePosition.y] == -1) {
                revealedTiles.push(attemptedMovePosition);
                this.grid[attemptedMovePosition.x][attemptedMovePosition.y] = 0;
                steps++;
                if (steps % (caveSize / 4) == 0)
                    currentPosition = { x: 128, y: 128 };
            }
            currentPosition = attemptedMovePosition;
            failsafe++;
        }
        revealedTiles.forEach((element) => {
            for (let x = element.x - 1; x <= element.x + 1; x++) {
                for (let y = element.y - 1; y <= element.y + 1; y++) {
                    if (this.grid[x][y] == -1)
                        this.grid[x][y] = 1;
                }
            }
        });
        for (let x = 0; x < 256; x++) {
            for (let y = 0; y < 256; y++) {
                if (this.grid[x][y] == 0 && (x < 127 || x > 129 || y < 127 || y > 129)) {
                    this.entityGrid[x][y] = new Floor((32 * x) - (32 * y), (16 * y) + (16 * x));
                    gameEngine.addEntity(this.entityGrid[x][y]);
                }
                else if (this.grid[x][y] == 1) {
                    this.entityGrid[x][y] = new StoneBlock((32 * x) - (32 * y), (16 * y) + (16 * x));
                    gameEngine.addEntity(this.entityGrid[x][y]);
                }
            }
        }
    }
    generateCave(startingX, startingY, size) {
        // Generate a cave.
        let currentPosition = { x: startingX, y: startingY };
        let caveSize = size;
        let steps = 0;
        let failsafe = 0;
        let revealedTiles = [];
        //revealedTiles.push(currentPosition);
        this.grid[currentPosition.x][currentPosition.y] = 0;
        revealedTiles.push({ x: currentPosition.x, y: currentPosition.y });
        // The failsafe is in the event that a cave is being generated in a space that doesn't fit
        // the size given. I've found in testing that a failsafe of 200 steps allows for generation
        // without lagging the gameEngine.
        while (steps < caveSize && failsafe < caveSize + 200) {
            let attemptedMovePosition = { x: currentPosition.x, y: currentPosition.y };
            // Move in a random direction. 0 to 3 is clockwise directions, starting from up.
            let nextMoveDirection = Math.floor(Math.random() * 4);
            switch (nextMoveDirection) {
                case 0:
                    attemptedMovePosition.y--;
                    break;
                case 1:
                    attemptedMovePosition.x++;
                    break;
                case 2:
                    attemptedMovePosition.y++;
                    break;
                case 3:
                    attemptedMovePosition.x--;
                    break;
            }
            // If this tile is empty, add it to the floor stack.
            // Empty is -1, floor is 0, wall is 1
            if (this.withinMapBounds(attemptedMovePosition.x, attemptedMovePosition.y) && this.grid[attemptedMovePosition.x][attemptedMovePosition.y] === -1) {
                revealedTiles.push(attemptedMovePosition);
                this.grid[attemptedMovePosition.x][attemptedMovePosition.y] = 0;
                currentPosition = attemptedMovePosition;
                steps++;
            }
            else if (revealedTiles.some(e => e.x == attemptedMovePosition.x && e.y == attemptedMovePosition.y)) {
                currentPosition = attemptedMovePosition;
            }
            failsafe++;
        }
        revealedTiles.forEach((element) => {
            if (this.entityGrid[element.x][element.y] === null) {
                this.entityGrid[element.x][element.y] = new Floor((32 * element.x) - (32 * element.y), (16 * element.y) + (16 * element.x));
                gameEngine.addEntity(this.entityGrid[element.x][element.y]);
                this.tilesRevealed++;
                if (Math.random() < this.tilesRevealed / 10000 && !this.exitFound) {
                    let exitValid = true;
                    for (let x = element.x - 1; x <= element.x + 1; x++) {
                        for (let y = element.y - 1; y <= element.y + 1; y++) {
                            // revealedTiles.push(new Vector2(x, y));
                            // if(this.entityGrid[x][y] instanceof StoneBlock || this.entityGrid[x][y] === null) {
                            //     if(this.entityGrid[x][y] instanceof StoneBlock) {
                            //         this.entityGrid[x][y].removeFromWorld = true;
                            //     }
                            //     this.entityGrid[x][y] = new Floor((32 * element.x) - (32 * element.y), (16 * element.y) + (16 * element.x));
                            //     this.grid[x][y] = 0;
                            // }
                            // revealedTiles.push(new Vector2(x, y));
                            if (this.grid[x][y] != 0)
                                exitValid = false;
                        }
                    }
                    if (exitValid) {
                        this.exitPosition = new Vector2(element.x, element.y);
                        this.exitFound = true;
                    }
                }
                // Have a slight chance to generate a monster on this tile. Currently just a sandbag; add more monsters later!
                if (Math.random() < 0.1) {
                    //let monster = new (Math.random() < 0.5 ? Zombie : Slime)((32 * element.x) - (32 * element.y), (16 * element.y) + (16 * element.x));
                    this.EnemySpawnTable.drop((32 * element.x) - (32 * element.y), (16 * element.y) + (16 * element.x));
                }
            }
            for (let x = element.x - 1; x <= element.x + 1; x++) {
                for (let y = element.y - 1; y <= element.y + 1; y++) {
                    if (this.grid[x][y] == -1) {
                        this.grid[x][y] = 1;
                        this.entityGrid[x][y] = new StoneBlock((32 * x) - (32 * y), (16 * y) + (16 * x));
                        gameEngine.addEntity(this.entityGrid[x][y]);
                    }
                }
            }
        });
        // If the exit was revealed, make sure there's no blocks around it.
        if (this.exitFound) {
            gameEngine.addEntity(new FloorExit((32 * this.exitPosition.x) - (32 * this.exitPosition.y), (16 * this.exitPosition.y) + (16 * this.exitPosition.x)));
        }
    }
    /** A helper function to see if a set of XY coordinates is within the map bounds. */
    withinMapBounds(x, y) {
        return x > 0 && x < 255 && y > 0 && y < 255;
    }
}
//# sourceMappingURL=cave.js.map