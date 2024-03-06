class ShootingNodes extends Behavior {
    actor;
    attackTimer = 0;
    attackDelay;
    damage;
    projectileSpeed = 150;
    projectileSprite = new Animator3D(ASSET_MANAGER.getAsset("./sprites/skill/energy_shot.png"), 32, 32, 4, 0.05, false, true);
    attackTimerDone;
    shooting;
    constructor(actor, attackDelay, damage, projectileSprite, projectileSpeed = 150) {
        super();
        this.actor = actor;
        this.attackDelay = attackDelay;
        this.damage = damage;
        this.attackTimerDone = new DecisionNode(() => { return this.attackTimer >= this.attackDelay; }, "shooting timer done?");
        this.shooting = new ActionNode(this.shoot, State.SHOOT, "shooting");
        this.shooting.animation = this.actor.shootAnim;
        this.shooting.setup = this.beginShoot;
        this.attackTimerDone.yes = this.shooting;
        if (projectileSprite) {
            this.projectileSprite = projectileSprite;
        }
        this.projectileSpeed = projectileSpeed;
        this.entryNode = this.attackTimerDone;
    }
    setExitNode = (node) => {
        this.attackTimerDone.no = node;
        this.shooting.next = node;
    };
    before = () => {
        const ourPos = new Coordinate(this.actor.x, this.actor.y, true);
        const targetPos = new Coordinate(this.actor.target.x, this.actor.target.y, true);
        let pathIsClear = directPathIsClear(ourPos, targetPos);
        if (pathIsClear) {
            this.attackTimer += gameEngine.clockTick;
        }
        else {
            this.attackTimer = 0;
        }
    };
    shoot = () => {
        this.attackTimer = 0;
        this.actor.velocity = new Vector2(0, 0);
        return true;
    };
    beginShoot = () => {
        let projectile = new Projectile(this.actor.x, this.actor.y, this.actor, 0, this.damage);
        projectile.sprite = this.projectileSprite;
        projectile.collisionSize = 4;
        projectile.onEnemyCollision = () => {
            projectile.removeFromWorld = true;
        };
        projectile.onWallCollision = () => {
            projectile.removeFromWorld = true;
        };
        projectile.velocity = this.actor.targetDirection.normalized().scale(this.projectileSpeed);
        gameEngine.addEntity(projectile);
    };
}
//# sourceMappingURL=shoot.js.map