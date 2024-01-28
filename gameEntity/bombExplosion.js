class BombExplosion extends GameEntity {
    sprite;
    removeFromWorld;
    constructor(x, y, owner) {
        super(x, y);
        let projectile = new Projectile(x, y, owner, 0.1, 20);
        projectile.onWallCollision = () => {
            gameEngine.globalEntities.get("cave").mineTile(new Vector2(this.x, this.y));
        };
        gameEngine.addEntity(projectile);
        this.sprite = new Animator(ASSET_MANAGER.getAsset("./sprites/vfx/explosion.png"), 0, 0, 64, 64, 16, 0.05, 0, false, false);
    }
    update() {
        if (this.sprite.isDone()) {
            this.removeFromWorld = true;
        }
    }
    draw(ctx) {
        this.sprite.drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 56, 1);
    }
}
//# sourceMappingURL=bombExplosion.js.map