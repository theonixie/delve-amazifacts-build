class Slime extends Enemy {
    static moveSpeed = 30;
    static slashDelay = 0.15;
    static slashTime = 0.75;
    static lostDelay = 50;
    static walkDelay = 0.1;
    static baseDamage = 2;
    static levelDamage = 1;
    facingDirection;
    target;
    targetDirection;
    standAnim;
    runAnim;
    attackSwingAnim;
    shadowSprite;
    slashBehavior;
    chaseBehavior;
    ai;
    constructor(x, y) {
        super(x, y);
        this.collisionSize = 8;
        this.health = 15;
        this.removeFromWorld = false;
        this.experiencePoints = 8;
        this.velocity = new Vector2(0, 0);
        this.facingDirection = 0;
        this.target = gameEngine.globalEntities.get("hero");
        this.standAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/slime/walk.png"), 64, 64, 1, 0.08, false, true);
        this.runAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/slime/walk.png"), 64, 64, 12, 0.08, false, true);
        this.attackSwingAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/slime/attack.png"), 64, 64, 9, Slime.slashTime, false, false, false);
        this.attackSwingAnim.elapsedTime = this.attackSwingAnim.totalTime; // Make the animation start in it's finished state.
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
        this.slashBehavior = new SlashingNodes(this, Slime.slashDelay, Slime.damage);
        this.chaseBehavior = new ChasingNodes(this, Zombie.walkDelay, Zombie.moveSpeed, Zombie.lostDelay);
        this.slashBehavior.setExitNode(this.chaseBehavior.entryNode);
        this.chaseBehavior.setExitNode(this.slashBehavior.entryNode);
        this.ai = new FSM(this.chaseBehavior.entryNode, this.before, this.after);
    }
    ;
    before = () => {
        this.targetDirection = new Vector2(this.target.x - this.x, this.target.y - this.y);
        this.chaseBehavior.before && this.chaseBehavior.before();
        this.slashBehavior.before && this.slashBehavior.before();
    };
    after = () => {
        this.checkCollision();
        this.x += this.velocity.x * gameEngine.clockTick;
        this.y += this.velocity.y * gameEngine.clockTick;
        const state = this.ai.lastActionNode.state;
        if (state == State.WALK && this.velocity.magnitude() > 10) {
            let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
        }
        else if (state == State.WIND_LUNGE || state == State.WIND_SLASH) {
            let angleRad = Math.atan2(-this.targetDirection.x, this.targetDirection.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
        }
        this.chaseBehavior.after && this.chaseBehavior.after();
        this.slashBehavior.after && this.slashBehavior.after();
    };
    update = () => {
        this.ai.update();
    };
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - gameEngine.camera.x - 16, this.y - gameEngine.camera.y - 8, 32, 16);
        if (this.ai.lastActionNode?.name == "attacking") {
            this.attackSwingAnim.drawFrame(ctx, this.x - gameEngine.camera.x - 24, this.y - gameEngine.camera.y - 40, 1, this.facingDirection);
        }
        else if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.runAnim.drawFrame(ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 40, 1, this.facingDirection);
        }
        else {
            this.standAnim.drawFrame(ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 40, 1, this.facingDirection);
        }
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(this.x - gameEngine.camera.x - this.collisionSize * 2, this.y - gameEngine.camera.y);
            ctx.lineTo(this.x - gameEngine.camera.x, this.y - gameEngine.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - gameEngine.camera.x + this.collisionSize * 2, this.y - gameEngine.camera.y);
            ctx.lineTo(this.x - gameEngine.camera.x, this.y - gameEngine.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
            this.chaseBehavior.drawWaypoints(ctx);
        }
    }
    ;
    onProjectileCollision(projectile) {
        super.onProjectileCollision(projectile);
        if (projectile.owner instanceof Enemy) {
            return;
        }
        this.chaseBehavior.lostTimer = 0;
    }
}
//# sourceMappingURL=slime.js.map