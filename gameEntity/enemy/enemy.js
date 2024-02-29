class Enemy extends Character {
    droptable;
    health;
    experiencePoints;
    static baseDamage;
    static levelDamage;
    static get damage() {
        return this.baseDamage + (this.levelDamage * gameEngine.currentFloor);
    }
    constructor(x, y) {
        super(x, y);
        this.collisionSize = 8;
        this.removeFromWorld = false;
        this.droptable = new BasicTable;
    }
    onProjectileCollision(projectile) {
        // If this is an enemy projectile, don't take damage.
        if (projectile.owner instanceof Enemy) {
            return;
        }
        projectile.attackedEntities.push(this);
        let damageTaken = projectile.damage;
        this.health -= damageTaken;
        gameEngine.addEntity(new DamageIndicator(this.x, this.y, damageTaken));
        if (this.health <= 0 && this.removeFromWorld != true) // Death
         {
            for (let i = 0; i < 5; i++) {
                let goreVelocity = new Vector2((Math.random() * 200) - 100, (Math.random() * 200) - 100);
                gameEngine.addEntity(new Gore(this.x, this.y, goreVelocity));
            }
            if (projectile.owner instanceof Hero) {
                projectile.owner.gainExperience(this.experiencePoints);
            }
            this.droptable.drop(this.x, this.y);
            this.removeFromWorld = true;
            gameEngine.enemiesDefeated++;
        }
        this.velocity = new Vector2(this.x - projectile.x, this.y - projectile.y).normalized().scale(256);
        if (projectile.onEnemyCollision !== undefined)
            projectile.onEnemyCollision(this);
    }
}
//# sourceMappingURL=enemy.js.map