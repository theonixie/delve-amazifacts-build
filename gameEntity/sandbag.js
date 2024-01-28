class Sandbag extends Enemy {
    facingDirection;
    moveSpeed;
    standAnim;
    runAnim;
    shadowSprite;
    constructor(game, x, y) {
        super(game, x, y);
        this.collisionSize = 8;
        this.health = 15;
        this.removeFromWorld = false;
        this.experiencePoints = 10;
        this.velocity = new Vector2(0, 0);
        this.facingDirection = 0;
        this.moveSpeed = 3;
        //this.standSheet = ASSET_MANAGER.getAsset("./sprites/testCharacter.png");
        this.standAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/sandbag/stand.png"), 48, 48, 1, 1, false, true);
        //this.runSheet = ;
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    ;
    update() {
        // if(this.game.mousedown === true && Math.sqrt(Math.pow(this.game.mouse.x - 32 - this.x, 2) + Math.pow(this.game.mouse.y - 64 - this.y, 2)) > 5) {
        //     let magnitude = Math.sqrt(Math.pow(this.game.mouse.x - 32 - this.x, 2) + Math.pow(this.game.mouse.y - 64 - this.y, 2));
        //     this.velocity.x = this.moveSpeed * (this.game.mouse.x - 32 - this.x) / magnitude;
        //     this.velocity.y = this.moveSpeed * (this.game.mouse.y - 64 - this.y) / magnitude;
        // }
        // If we are moving, update the facing direction.
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
            //console.log(this.facingDirection);
        }
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        this.velocity = this.velocity.scale(0.5);
        this.checkCollision();
    }
    ;
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 8, 32, 16);
        //ctx.drawImage(this.spritesheet, this.animFrame * 64, this.facingDirection * 64, 64, 64, this.x, this.y, 64, 64);
        this.standAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 24, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(this.x - this.game.camera.x - this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - this.game.camera.x + this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
        }
    }
    ;
}
//# sourceMappingURL=sandbag.js.map