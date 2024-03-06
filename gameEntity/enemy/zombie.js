class Zombie extends Enemy {
    static moveSpeed = 60;
    static lostDelay = 50;
    static walkDelay = 0.1;
    static baseDamage = 2;
    static levelDamage = 2;
    static lungeDelay = 1.5;
    static lungeBuildUp = 0.5;
    static lungeTime = 0.6;
    static lungeRestTime = 1.5;
    static slashBuildUp = 0.2;
    static slashTime = 0.75;
    facingDirection;
    target;
    targetDirection;
    standAnim;
    runAnim;
    attackSwingAnim;
    buildUpAnim;
    lungeWindAnim;
    lungeAnim;
    getupAnim;
    shadowSprite;
    slashBehavior;
    lungeBehavior;
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
        this.buildUpAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/buildup.png"), 64, 64, 4, Zombie.slashBuildUp, false, false, false);
        this.attackSwingAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/attack.png"), 64, 64, 8, Zombie.slashTime, false, false, false);
        this.lungeWindAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/lungewind.png"), 64, 64, 4, Zombie.lungeBuildUp, false, false, false);
        this.lungeAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/lunge.png"), 64, 64, 13, Zombie.lungeTime, false, false, false);
        this.getupAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/getup.png"), 64, 64, 21, Zombie.lungeRestTime, false, false, false);
        this.attackSwingAnim.elapsedTime = this.attackSwingAnim.totalTime; // Make the animation start in it's finished state.
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
        this.slashBehavior = new SlashingNodes(this, Zombie.slashBuildUp, Zombie.damage);
        this.lungeBehavior = new LungingNodes(this, Zombie.lungeDelay, Zombie.damage);
        this.chaseBehavior = new ChasingNodes(this, Zombie.walkDelay, Zombie.moveSpeed, Zombie.lostDelay);
        this.chaseBehavior.setExitNode(this.lungeBehavior.entryNode);
        this.lungeBehavior.setExitNode(this.slashBehavior.entryNode);
        this.slashBehavior.setExitNode(this.chaseBehavior.entryNode);
        this.ai = new FSM(this.chaseBehavior.entryNode, this.before, this.after);
    }
    ;
    before = () => {
        this.targetDirection = new Vector2(this.target.x - this.x, this.target.y - this.y);
        this.chaseBehavior.before && this.chaseBehavior.before();
        this.lungeBehavior.before && this.lungeBehavior.before();
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
        this.lungeBehavior.after && this.lungeBehavior.after();
        this.slashBehavior.after && this.slashBehavior.after();
    };
    update = () => {
        this.ai.update();
    };
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
            case State.WIND_SLASH:
                animator = this.buildUpAnim;
                break;
            case State.SLASH:
                animator = this.attackSwingAnim;
                break;
            case State.WIND_LUNGE:
                animator = this.lungeWindAnim;
                break;
            case State.LUNGE:
                animator = this.lungeAnim;
                break;
            case State.GET_UP:
                animator = this.getupAnim;
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
//# sourceMappingURL=zombie.js.map