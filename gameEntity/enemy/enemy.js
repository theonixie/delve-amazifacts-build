class Enemy extends Character {
    health;
    experiencePoints;
    constructor(x, y) {
        super(x, y);
        this.collisionSize = 8;
        this.removeFromWorld = false;
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
            // 20% chance to drop item.            
            if (Math.random() < 0.2)
                gameEngine.addEntity(new DroppedItem(this.x, this.y, ItemGenerator.generateWeapon()));
            // 10% chance to drop a stempak.
            if (Math.random() < 0.1)
                gameEngine.addEntity(new DroppedStempak(this.x, this.y));
            this.removeFromWorld = true;
        }
        this.velocity = new Vector2(this.x - projectile.x, this.y - projectile.y).normalized().scale(256);
        if (projectile.onEnemyCollision !== undefined)
            projectile.onEnemyCollision(this);
    }
}
//# sourceMappingURL=enemy.js.map