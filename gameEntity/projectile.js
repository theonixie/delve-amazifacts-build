class Projectile extends GameEntity {
    velocity;
    /** How long this projectile exists before destroying itself. Set to 0 for infinite lifespan. */
    lifespan;
    timer;
    owner;
    // Tracks which objects have been harmed by this projectile. Prevents repeated hits.
    attackedEntities;
    damage;
    collisionSize;
    removeFromWorld;
    hurtsPlayer;
    hurtsEnemies;
    onEnemyCollision;
    onWallCollision;
    sprite;
    constructor(x, y, owner, lifespan, damage) {
        super(x, y);
        this.collisionSize = 16;
        this.attackedEntities = [];
        this.velocity = new Vector2(0, 0);
        this.owner = owner;
        this.damage = damage;
        this.lifespan = lifespan;
        this.timer = 0;
    }
    update() {
        this.x += this.velocity.x * gameEngine.clockTick;
        this.y += this.velocity.y * gameEngine.clockTick;
        this.checkCollision();
        this.timer += gameEngine.clockTick;
        if (this.lifespan > 0 && this.timer > this.lifespan) {
            this.removeFromWorld = true;
        }
    }
    checkCollision() {
        let that = this;
        let thisPosition = new Vector2(this.x, this.y);
        let magnitude = 0;
        gameEngine.entities.forEach(function (other) {
            if (other !== that && other.collisionSize !== 0) {
                magnitude = thisPosition.isoMagnitude(new Vector2(other.x, other.y));
                if (magnitude < that.collisionSize + other.collisionSize) {
                    if (other instanceof StoneBlock) {
                        if (that.onWallCollision !== undefined) {
                            that.onWallCollision();
                        }
                    }
                }
            }
        });
    }
    draw(ctx) {
        if (this.sprite !== undefined)
            this.sprite.drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - (this.sprite.width * 0.5), this.y - gameEngine.camera.y - (this.sprite.height * 0.5) - 16, 1, 0);
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.x - gameEngine.camera.x - this.collisionSize * 2, this.y - gameEngine.camera.y);
            ctx.lineTo(this.x - gameEngine.camera.x, this.y - gameEngine.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - gameEngine.camera.x + this.collisionSize * 2, this.y - gameEngine.camera.y);
            ctx.lineTo(this.x - gameEngine.camera.x, this.y - gameEngine.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
        }
    }
}
//# sourceMappingURL=projectile.js.map