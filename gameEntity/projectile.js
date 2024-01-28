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
    constructor(game, x, y, owner, lifespan, damage) {
        super(game, x, y);
        this.collisionSize = 16;
        this.attackedEntities = [];
        this.velocity = new Vector2(0, 0);
        this.owner = owner;
        this.damage = damage;
        this.lifespan = lifespan;
        this.timer = 0;
    }
    update() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        this.checkCollision();
        this.timer += this.game.clockTick;
        if (this.lifespan > 0 && this.timer > this.lifespan) {
            this.removeFromWorld = true;
        }
    }
    checkCollision() {
        let that = this;
        let thisPosition = new Vector2(this.x, this.y);
        let magnitude = 0;
        this.game.entities.forEach(function (other) {
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
            this.sprite.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - (this.sprite.width * 0.5), this.y - this.game.camera.y - (this.sprite.height * 0.5) - 16, 1, 0);
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.x - this.game.camera.x - this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - this.game.camera.x + this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
        }
    }
}
//# sourceMappingURL=projectile.js.map