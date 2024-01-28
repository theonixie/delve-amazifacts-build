class Bomb extends GameEntity {
    owner;
    timer;
    explosionDelay;
    shakeOffset;
    sprite;
    shadowSprite;
    removeFromWorld;
    constructor(game, x, y) {
        super(game, x, y);
        this.timer = 0;
        this.explosionDelay = 2;
        this.sprite = ASSET_MANAGER.getAsset("./sprites/skill/bomb.png");
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    update() {
        this.timer += this.game.clockTick;
        this.shakeOffset = (Math.random() * 4) - 2;
        if (this.timer > this.explosionDelay) {
            this.removeFromWorld = true;
            // Spawn explosions in an X shape.
            // NOTE: This technically spawns two explosions in the same spot in the center.
            // I think that actually might be fairly balanced and make sense for a center explosion to deal more
            // damage.
            for (let x = -4; x <= 4; x++) {
                this.game.addEntity(new BombExplosion(this.game, this.x + (x * 32), this.y + (x * 16), this.owner));
                this.game.addEntity(new BombExplosion(this.game, this.x + (x * 32), this.y - (x * 16), this.owner));
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 8, 32, 16);
        ctx.drawImage(this.sprite, 0, 0, 32, 32, this.x - this.game.camera.x - 16 + this.shakeOffset, this.y - this.game.camera.y - 24, 32, 32);
    }
}
//# sourceMappingURL=bomb.js.map