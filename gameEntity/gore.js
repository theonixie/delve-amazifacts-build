class Gore extends GameEntity {
    height;
    velocity;
    bounceVelocity;
    facingDirection;
    bounces; // Once this chunk bounces a certain number of times, it is deleted.
    removeFromWorld; // When set to true, this entity is deleted.
    spritesheet;
    shadowSprite;
    constructor(game, x, y, velocity) {
        super(game, x, y);
        this.height = 0;
        this.bounceVelocity = Math.random() * 256;
        this.bounces = 0;
        this.velocity = velocity;
        this.spritesheet = new Animator3D(ASSET_MANAGER.getAsset("./sprites/vfx/gore_screw.png"), 16, 16, 8, 0.167, false, true);
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    update() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        this.bounceVelocity -= 800 * this.game.clockTick;
        this.height += this.bounceVelocity * this.game.clockTick;
        if (this.height < 0) {
            this.bounceVelocity = 256;
            this.height = 0;
            this.bounces += 1;
            if (this.bounces > 1) {
                this.removeFromWorld = true;
            }
        }
        let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
        this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 4, this.y - this.game.camera.y - 2, 8, 4);
        this.spritesheet.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 8, this.y - this.game.camera.y - 8 - this.height, 1, this.facingDirection);
    }
}
//# sourceMappingURL=gore.js.map