class Zombie extends Enemy {
    facingDirection;
    moveSpeed;
    attackTimer = 0;
    attackDelay = 0.5;
    standAnim;
    runAnim;
    attackSwingAnim;
    shadowSprite;
    target;
    constructor(game, x, y) {
        super(game, x, y);
        this.collisionSize = 8;
        this.health = 15;
        this.removeFromWorld = false;
        this.experiencePoints = 8;
        this.velocity = new Vector2(0, 0);
        this.facingDirection = 0;
        this.moveSpeed = 60;
        this.target = game.globalEntities.get("hero");
        //this.standSheet = ASSET_MANAGER.getAsset("./sprites/testCharacter.png");
        this.runAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/walk.png"), 64, 64, 12, 0.08, false, true);
        this.attackSwingAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/attack.png"), 64, 64, 8, 0.05, false, false);
        this.attackSwingAnim.elapsedTime = this.attackSwingAnim.totalTime; // Make the animation start in it's finished state.
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    ;
    update() {
        if (this.attackSwingAnim.isDone()) {
            let targetDirection = new Vector2(this.target.x - this.x, this.target.y - this.y);
            if (targetDirection.magnitude() > 32) {
                this.attackTimer = 0;
                this.velocity = targetDirection.normalized().scale(this.moveSpeed);
                // If we are moving, update the facing direction.
                if (this.velocity.x !== 0 || this.velocity.y !== 0) {
                    let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
                    this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
                    //console.log(this.facingDirection);
                }
            }
            else { // We are close enough to attack!
                this.velocity.x = 0;
                this.velocity.y = 0;
                if (this.attackSwingAnim.isDone()) {
                    this.attackTimer += this.game.clockTick;
                }
                if (this.attackTimer > this.attackDelay) { // If the timer maxes out, reset it and attack.
                    this.attackTimer = 0;
                    this.attackSwingAnim.elapsedTime = 0;
                    let attackDirection = targetDirection.normalized();
                    let projectile = new Projectile(this.game, this.x + (attackDirection.x * 16), this.y + (attackDirection.y * 16), this, 0.05, 2);
                    this.game.addEntity(projectile);
                }
            }
        }
        else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        this.checkCollision();
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
    ;
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 8, 32, 16);
        if (!this.attackSwingAnim.isDone()) {
            this.attackSwingAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 24, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else {
            this.runAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
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
//# sourceMappingURL=zombie.js.map