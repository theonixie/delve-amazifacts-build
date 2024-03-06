/** Represents anything that can move and take damage, like the player or enemies. */
class Character extends GameEntity {
    collisionSize;
    velocity;
    removeFromWorld;
    constructor(x, y) {
        super(x, y);
        this.removeFromWorld = false;
        this.velocity = new Vector2(0, 0);
    }
    checkCollision() {
        let that = this;
        let thisPosition = new Vector2(this.x, this.y);
        let magnitude = 0;
        gameEngine.entities.forEach(function (other) {
            if (other !== that && (other instanceof Projectile || other instanceof Character || other instanceof Barrier)) {
                magnitude = thisPosition.isoMagnitude(new Vector2(other.x, other.y));
                if (magnitude < that.collisionSize + other.collisionSize) {
                    // Projectile handling
                    if (other instanceof Projectile && !other.attackedEntities.includes(that)) {
                        that.onProjectileCollision(other);
                    }
                    else if (other instanceof Character) {
                        const bothEnemies = that instanceof Enemy && other instanceof Enemy;
                        const scaleFactor = bothEnemies ? 16 : 64;
                        let point = new Vector2(other.x - that.x, other.y - that.y).normalized();
                        that.velocity = that.velocity.minus(point.scale(scaleFactor));
                    }
                    else if (other instanceof Barrier) {
                        magnitude = thisPosition.isoMagnitude(new Vector2(other.x, other.y));
                        if (magnitude < that.collisionSize + other.collisionSize) {
                            var vector = new Vector2(other.x - that.x, other.y - that.y);
                            var line = new Vector2(0.894427, 0.447213); // Approximate to (1/2, sqrt(3)/2)
                            // Flip the X or Y direction based on the direction the character is from the wall.
                            if (vector.x < 0)
                                line.x *= -1;
                            if (vector.y < 0)
                                line.y *= -1;
                            magnitude = Math.abs(magnitude - (that.collisionSize + other.collisionSize));
                            that.x -= line.scale(magnitude).x;
                            that.y -= line.scale(magnitude).y;
                            thisPosition.x = that.x;
                            thisPosition.y = that.y;
                        }
                    }
                }
            }
        });
        let tileX = Math.floor((this.x / 64) + ((this.y + 16) / 32));
        let tileY = Math.floor(((this.y + 16) / 32) - (this.x / 64));
        let cave = gameEngine.globalEntities.get("cave");
        for (let x = tileX - 1; x <= tileX + 1; x++) {
            for (let y = tileY - 1; y <= tileY + 1; y++) {
                if (tileX >= 0 && tileX <= 255 && tileY >= 0 && tileY <= 255) {
                    if (cave.entityGrid[x][y] instanceof StoneBlock) {
                        // Stone blocks prevent us from passing through them.
                        let other = cave.entityGrid[x][y];
                        magnitude = thisPosition.isoMagnitude(new Vector2(other.x, other.y));
                        if (magnitude < that.collisionSize + other.collisionSize) {
                            var vector = new Vector2(other.x - that.x, other.y - that.y);
                            var line = new Vector2(0.894427, 0.447213); // Approximate to (1/2, sqrt(3)/2)
                            // Flip the X or Y direction based on the direction the character is from the wall.
                            if (vector.x < 0)
                                line.x *= -1;
                            if (vector.y < 0)
                                line.y *= -1;
                            magnitude = Math.abs(magnitude - (that.collisionSize + other.collisionSize));
                            that.x -= line.scale(magnitude).x;
                            that.y -= line.scale(magnitude).y;
                            thisPosition.x = that.x;
                            thisPosition.y = that.y;
                        }
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=character.js.map