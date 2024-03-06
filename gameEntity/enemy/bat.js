class Bat extends Enemy {
    static moveSpeed = 90;
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
    shootAnim;
    shadowSprite;
    shootBehavior;
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
        this.standAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/bat/walk.png"), 64, 64, 9, 0.08, false, true);
        this.runAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/bat/walk.png"), 64, 64, 9, 0.08, false, true);
        this.shootAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/bat/walk.png"), 64, 64, 9, Bat.slashTime, false, false, false);
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
        const projectileSprite = new Animator3D(ASSET_MANAGER.getAsset("./sprites/skill/energy_shot.png"), 32, 32, 4, 0.05, false, true);
        const withinRange = new DecisionNode(this.withinRangeToShoot, "within range to shoot?");
        const wait = new ActionNode(this.waitForShoot, State.WAIT_SHOOT, "waiting to shoot");
        const tooClose = new DecisionNode(() => { return this.targetDirection.magnitude() <= 32 * 2; }, "too close to shoot?");
        const moveAway = new ActionNode(this.moveAwayToShoot, State.WALK, "moving away to shoot");
        this.shootBehavior = new ShootingNodes(this, 1.5, Bat.damage, projectileSprite, 150);
        this.chaseBehavior = new ChasingNodes(this, Bat.walkDelay, Bat.moveSpeed, Bat.lostDelay);
        withinRange.yes = tooClose;
        tooClose.no = wait;
        tooClose.yes = moveAway;
        moveAway.next = tooClose;
        withinRange.no = this.chaseBehavior.entryNode;
        wait.next = this.chaseBehavior.directPath;
        this.chaseBehavior.setExitNode(this.shootBehavior.entryNode);
        this.shootBehavior.setExitNode(withinRange);
        this.ai = new FSM(this.chaseBehavior.entryNode, this.before, this.after);
    }
    ;
    before = () => {
        this.targetDirection = new Vector2(this.target.x - this.x, this.target.y - this.y);
        this.chaseBehavior.before && this.chaseBehavior.before();
        this.shootBehavior.before && this.shootBehavior.before();
    };
    after = () => {
        this.checkCollision();
        this.x += this.velocity.x * gameEngine.clockTick;
        this.y += this.velocity.y * gameEngine.clockTick;
        const state = this.ai.lastActionNode.state;
        if (state == State.WALK && this.velocity.magnitude() > 25) {
            let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
        }
        else if (state == State.WAIT_SHOOT || state == State.WIND_LUNGE || state == State.WIND_SLASH) {
            let angleRad = Math.atan2(-this.targetDirection.x, this.targetDirection.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
        }
        this.chaseBehavior.after && this.chaseBehavior.after();
        this.shootBehavior.after && this.shootBehavior.after();
    };
    withinRangeToShoot = () => {
        return this.targetDirection.magnitude() <= 32 * 5;
    };
    waitForShoot = () => {
        this.velocity = new Vector2(0, 0);
    };
    moveAwayToShoot = () => {
        this.velocity = this.targetDirection.normalized().scale(-Bat.moveSpeed);
    };
    update() {
        this.ai.update();
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - gameEngine.camera.x - 16, this.y - gameEngine.camera.y - 8, 32, 16);
        let animator;
        switch (this.ai.lastActionNode?.state) {
            case State.STAND:
                animator = this.standAnim;
                break;
            case State.WALK:
                animator = this.runAnim;
                break;
            case State.SHOOT:
                animator = this.shootAnim;
                break;
            default:
                animator = this.standAnim;
                break;
        }
        animator.drawFrame(ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 40, 1, this.facingDirection);
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
//# sourceMappingURL=bat.js.map