class Gore extends GameEntity {
    height;
    velocity;
    bounceVelocity;
    facingDirection;
    bounces; // Once this chunk bounces a certain number of times, it is deleted.
    removeFromWorld; // When set to true, this entity is deleted.
    spritesheet;
    shadowSprite;
    constructor(x, y, velocity) {
        super(x, y);
        this.height = 0;
        this.bounceVelocity = Math.random() * 256;
        this.bounces = 0;
        this.velocity = velocity;
        this.spritesheet = new Animator3D(ASSET_MANAGER.getAsset("./sprites/vfx/gore_screw.png"), 16, 16, 8, 0.167, false, true);
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    update() {
        this.x += this.velocity.x * gameEngine.clockTick;
        this.y += this.velocity.y * gameEngine.clockTick;
        this.bounceVelocity -= 800 * gameEngine.clockTick;
        this.height += this.bounceVelocity * gameEngine.clockTick;
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
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - gameEngine.camera.x - 4, this.y - gameEngine.camera.y - 2, 8, 4);
        this.spritesheet.drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - 8, this.y - gameEngine.camera.y - 8 - this.height, 1, this.facingDirection);
    }
}
//# sourceMappingURL=gore.js.map