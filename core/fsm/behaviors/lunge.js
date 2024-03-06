class LungingNodes extends Behavior {
    /** The maximum distance in blocks that the lunge counter should still count */
    static lungeDistance = 5;
    lungeTime;
    lungeSpeed;
    lungeDirection;
    lungeDecay;
    lungeSlash;
    actor;
    attackTimer = 0;
    attackDelay;
    damage;
    attackTimerDone;
    buildingUp;
    lunging;
    resting;
    constructor(actor, attackDelay, damage) {
        super();
        this.actor = actor;
        this.attackDelay = attackDelay;
        this.damage = damage;
        this.lungeTime = this.actor.lungeAnim.totalTime;
        this.attackTimerDone = new DecisionNode(() => { return this.attackTimer >= attackDelay; }, "lunge timer done?");
        this.buildingUp = new ActionNode(() => { return true; }, State.WIND_LUNGE, "building up lunge");
        this.buildingUp.animation = this.actor.lungeWindAnim;
        this.buildingUp.setup = this.buildUp;
        this.lunging = new ActionNode(this.lunge, State.LUNGE, "lunging");
        this.lunging.animation = this.actor.lungeAnim;
        this.lunging.setup = this.beginLunge;
        this.resting = new ActionNode(this.rest, State.GET_UP, "getting up after lunge");
        this.resting.animation = this.actor.getupAnim;
        this.resting.setup = this.beginRest;
        this.attackTimerDone.yes = this.buildingUp;
        this.buildingUp.next = this.lunging;
        this.lunging.next = this.resting;
        this.entryNode = this.attackTimerDone;
    }
    setExitNode = (node) => {
        this.resting.next = node;
        this.attackTimerDone.no = node;
    };
    before = () => {
        const ourPos = new Coordinate(this.actor.x, this.actor.y, true);
        const targetPos = new Coordinate(this.actor.target.x, this.actor.target.y, true);
        let pathIsClear = directPathIsClear(ourPos, targetPos);
        if (this.actor.targetDirection.magnitude() <= (32 * LungingNodes.lungeDistance) &&
            this.actor.targetDirection.magnitude() > 64 && pathIsClear) {
            this.attackTimer += gameEngine.clockTick;
        }
        else {
            this.attackTimer = 0;
        }
    };
    // Lunge has 4 parts to it
    // Build up
    // Lunge
    // Attack
    // Recover
    // Each have their own action
    // Currently we just stop. As soon as we get here the lunge is confirmed so we just need to wait for the build-up animation
    buildUp = () => {
        this.actor.lungeWindAnim.elapsedTime = 0;
        this.actor.velocity = new Vector2(0, 0);
    };
    beginLunge = () => {
        this.attackTimer = 0;
        this.actor.lungeAnim.elapsedTime = 0;
        this.lungeDirection = this.actor.targetDirection.normalized();
        this.lungeSpeed = (2 * (this.actor.targetDirection.magnitude() - 17)) / this.lungeTime;
        this.lungeDecay = (this.lungeSpeed / this.lungeTime);
        this.lungeSlash = new Projectile(this.actor.x + (this.lungeDirection.x * 16), this.actor.y + (this.lungeDirection.y * 16), this.actor, this.lungeTime, 4);
        gameEngine.addEntity(this.lungeSlash);
        this.lungeSlash.onWallCollision = () => {
            this.lungeSlash.removeFromWorld = true;
        };
    };
    lunge = () => {
        // lungeSpeed is subtracted before and after because we are essentially taking a Riemann sum of the area under a line.
        // subtracting first underestimates, subtracting after overestimates, doing both (but half as much) gives us a perfect estimation.
        this.lungeSpeed -= this.lungeDecay * gameEngine.clockTick / 2;
        this.actor.velocity = this.lungeDirection.scale(this.lungeSpeed);
        this.lungeSlash.velocity = this.lungeDirection.scale(this.lungeSpeed);
        this.lungeSpeed -= this.lungeDecay * gameEngine.clockTick / 2;
        // continuation condition of the action. If this is false the action will end.
        return this.lungeSpeed > 0;
    };
    beginRest = () => {
        this.actor.getupAnim.elapsedTime = 0;
    };
    rest = () => {
        this.actor.velocity = new Vector2(0, 0);
        return true;
    };
}
//# sourceMappingURL=lunge.js.map