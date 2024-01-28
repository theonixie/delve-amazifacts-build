class BombExplosion extends GameEntity {
    sprite;
    removeFromWorld;
    constructor(game, x, y, owner) {
        super(game, x, y);
        let projectile = new Projectile(game, x, y, owner, 0.1, 20);
        projectile.onWallCollision = () => {
            this.game.globalEntities.get("cave").mineTile(new Vector2(this.x, this.y));
        };
        game.addEntity(projectile);
        this.sprite = new Animator(ASSET_MANAGER.getAsset("./sprites/vfx/explosion.png"), 0, 0, 64, 64, 16, 0.05, 0, false, false);
    }
    update() {
        if (this.sprite.isDone()) {
            this.removeFromWorld = true;
        }
    }
    draw(ctx) {
        this.sprite.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 56, 1);
    }
}
//# sourceMappingURL=bombExplosion.js.map