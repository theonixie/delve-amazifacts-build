class Enemy extends Character {
    health;
    experiencePoints;
    constructor(game, x, y) {
        super(game, x, y);
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
        this.game.addEntity(new DamageIndicator(this.game, this.x, this.y, damageTaken));
        if (this.health <= 0 && this.removeFromWorld != true) // Death
         {
            for (let i = 0; i < 5; i++) {
                let goreVelocity = new Vector2((Math.random() * 200) - 100, (Math.random() * 200) - 100);
                this.game.addEntity(new Gore(this.game, this.x, this.y, goreVelocity));
            }
            if (projectile.owner instanceof Hero) {
                projectile.owner.gainExperience(this.experiencePoints);
            }
            // 20% chance to drop item.            
            if (Math.random() < 0.2)
                this.game.addEntity(new DroppedItem(this.game, this.x, this.y, ItemGenerator.generateWeapon()));
            this.removeFromWorld = true;
        }
        this.velocity = new Vector2(this.x - projectile.x, this.y - projectile.y).normalized().scale(256);
        if (projectile.onEnemyCollision !== undefined)
            projectile.onEnemyCollision(this);
    }
}
//# sourceMappingURL=enemy.js.map