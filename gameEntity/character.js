/** Represents anything that can move and take damage, like the player or enemies. */
class Character extends GameEntity {
    collisionSize;
    velocity;
    removeFromWorld;
    constructor(game, x, y) {
        super(game, x, y);
        this.removeFromWorld = false;
        this.velocity = new Vector2(0, 0);
    }
    checkCollision() {
        let that = this;
        let thisPosition = new Vector2(this.x, this.y);
        let magnitude = 0;
        this.game.entities.forEach(function (other) {
            if (other !== that && other.collisionSize !== 0) {
                magnitude = thisPosition.isoMagnitude(new Vector2(other.x, other.y));
                if (magnitude < that.collisionSize + other.collisionSize) {
                    // Projectile handling
                    if (other instanceof Projectile && !other.attackedEntities.includes(that)) {
                        that.onProjectileCollision(other);
                    }
                    else if (other instanceof Character) {
                        let point = new Vector2(other.x - that.x, other.y - that.y).normalized();
                        that.velocity = that.velocity.minus(point.scale(64));
                    }
                    else if (other instanceof StoneBlock) { // Stone blocks prevent us from passing through them.
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
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=character.js.map