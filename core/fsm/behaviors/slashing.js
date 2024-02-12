class SlashingNodes extends Behavior {
    actor;
    attackTimer = 0;
    attackDelay;
    damage;
    attacking;
    incrementAttackTimer;
    attackTimerDone;
    closeEnough;
    constructor(actor, attackDelay, damage) {
        super();
        this.actor = actor;
        this.damage = damage;
        this.attacking = new ActionNode(this.stop, "attack");
        this.attacking.animation = this.actor.attackSwingAnim;
        this.attacking.setup = this.startingAttack;
        this.incrementAttackTimer = new ActionNode(() => { this.attackTimer += gameEngine.clockTick; }, "decrement attack timer");
        this.incrementAttackTimer.setup = this.stop;
        this.attackTimerDone = new DecisionNode(() => { return this.attackTimer >= attackDelay; }, "attack timer done");
        this.closeEnough = new DecisionNode(this.isCloseEnough);
        this.closeEnough.yes = this.attackTimerDone;
        this.attackTimerDone.yes = this.attacking;
        this.attackTimerDone.no = this.incrementAttackTimer;
        this.incrementAttackTimer.next = this.closeEnough;
        this.attacking.next = this.closeEnough;
        this.entryNode = this.closeEnough;
    }
    setExitNode = (node) => {
        this.closeEnough.no = node;
    };
    startingAttack = () => {
        this.actor.attackSwingAnim.elapsedTime = 0;
        this.attackTimer = 0;
        let attackDirection = this.actor.targetDirection.normalized();
        let projectile = new Projectile(this.actor.x + (attackDirection.x * 16), this.actor.y + (attackDirection.y * 16), this.actor, 0.05, this.damage);
        gameEngine.addEntity(projectile);
    };
    stop = () => {
        this.actor.velocity = new Vector2(0, 0);
    };
    isCloseEnough = () => {
        // Collision size equation should work for all sizes, assumes hero's hitbox is 16 wide in one direction.
        if (this.actor.targetDirection.magnitude() <= this.actor.collisionSize * 2 + 17) {
            return true;
        }
        else {
            this.attackTimer = 0;
        }
    };
}
//# sourceMappingURL=slashing.js.map