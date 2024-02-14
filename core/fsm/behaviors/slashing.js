class SlashingNodes extends Behavior {
    actor;
    attackTimer = 0;
    attackDelay;
    damage;
    attacking;
    closeEnough;
    buildingUp;
    buildUpTimer = 0;
    buildUpDelay;
    constructor(actor, attackDelay, damage) {
        super();
        this.actor = actor;
        this.damage = damage;
        this.buildUpDelay = attackDelay;
        this.attacking = new ActionNode(this.attack, State.SLASH, "attacking");
        this.attacking.animation = this.actor.attackSwingAnim;
        this.attacking.setup = this.startingAttack;
        this.closeEnough = new DecisionNode(() => { return this.actor.targetDirection.magnitude() <= this.actor.collisionSize * 2 + 21; }, "close enough to slash?");
        this.buildingUp = new ActionNode(this.buildUp, State.WIND_SLASH, "building up slash");
        this.buildingUp.setup = this.startingWindUp;
        this.closeEnough.yes = this.buildingUp;
        this.buildingUp.next = this.attacking;
        this.entryNode = this.closeEnough;
    }
    setExitNode = (node) => {
        this.attacking.next = node;
        this.closeEnough.no = node;
    };
    startingWindUp = () => {
        if (this.actor.buildUpAnim) {
            this.actor.buildUpAnim.elapsedTime = 0;
        }
    };
    buildUp = () => {
        this.buildUpTimer += gameEngine.clockTick;
        this.actor.velocity = new Vector2(0, 0);
        if (this.buildUpTimer >= this.buildUpDelay) {
            this.buildUpTimer = 0;
            return false;
        }
        return true;
    };
    startingAttack = () => {
        this.actor.attackSwingAnim.elapsedTime = 0;
        let attackDirection = this.actor.targetDirection.normalized();
        let projectile = new Projectile(this.actor.x + (attackDirection.x * 16), this.actor.y + (attackDirection.y * 16), this.actor, 0.05, this.damage);
        gameEngine.addEntity(projectile);
    };
    stop = () => {
        this.actor.velocity = new Vector2(0, 0);
    };
    attack = () => {
        this.actor.velocity = new Vector2(0, 0);
        return true;
    };
}
//# sourceMappingURL=slashing.js.map