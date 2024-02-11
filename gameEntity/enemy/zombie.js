class Zombie extends Enemy {
    static moveSpeed = 60;
    // Attack timer is only incremented when close enough but not attacking, so it needs to be less than before
    static attackDelay = 0.1;
    static lostDelay = 50;
    static walkDelay = 0.1;
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
        this.standAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/walk.png"), 64, 64, 1, 0.08, false, true);
        this.runAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/walk.png"), 64, 64, 12, 0.08, false, true);
        this.attackSwingAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/attack.png"), 64, 64, 8, 0.05, false, false);
        this.attackSwingAnim.elapsedTime = this.attackSwingAnim.totalTime; // Make the animation start in it's finished state.
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
        this.slashBehavior = new SlashingNodes(this, Zombie.attackDelay);
        this.chaseBehavior = new ChasingNodes(this, Zombie.walkDelay, Zombie.moveSpeed, Zombie.lostDelay);
        this.slashBehavior.setExitNode(this.chaseBehavior.entryNode);
        this.chaseBehavior.setExitNode(this.slashBehavior.entryNode);
        this.ai = new FSM(this.chaseBehavior.entryNode, this.before, this.after);
    }
    ;
    before = () => {
        this.targetDirection = new Vector2(this.target.x - this.x, this.target.y - this.y);
        this.chaseBehavior.before();
    };
    after = () => {
        this.checkCollision();
        this.x += this.velocity.x * gameEngine.clockTick;
        this.y += this.velocity.y * gameEngine.clockTick;
    };
    update = () => {
        this.ai.update();
    };
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - gameEngine.camera.x - 16, this.y - gameEngine.camera.y - 8, 32, 16);
        if (this.ai.lastActionNode?.name == "attack") {
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
}
//# sourceMappingURL=zombie.js.map