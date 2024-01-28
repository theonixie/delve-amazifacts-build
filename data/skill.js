class Skill extends Item {
    icon;
    cooldown;
    // Set to the cooldown time when activated.
    // Can only cast skill when cooldownTimer is <= 0.
    cooldownTimer;
    // If a perk slot is 0, then it has no effect.
    // If a perk slot is 1 or 2, then it provides an effect.
    perk0;
    perk1;
    constructor(s, i) {
        super(1, 2);
        this.sprite = s;
        this.icon = i;
        this.perk0 = 0;
        this.perk1 = 0;
    }
}
class EnergyShot extends Skill {
    projectileSpeed = 256;
    // Perk 0 options:
    // 1 = Split shot
    constructor() {
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard0.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill0.png"));
        this.cooldown = 0;
        this.cooldownTimer = 0;
        // For testing.
        this.perk0 = 1;
    }
    getTooltip() {
        return [
            {
                text: "Energy Shot",
                fontSize: 12
            },
            {
                text: "Fire a bolt of energy.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (player.energy - 4 >= 0) {
            //gameEngine.addEntity()
            let projectile = new Projectile(player.x, player.y, player, 0, 5);
            projectile.sprite = new Animator3D(ASSET_MANAGER.getAsset("./sprites/skill/energy_shot.png"), 32, 32, 4, 0.05, false, true);
            projectile.collisionSize = 4;
            projectile.onEnemyCollision = () => {
                projectile.removeFromWorld = true;
            };
            projectile.onWallCollision = () => {
                projectile.removeFromWorld = true;
            };
            projectile.velocity = gameEngine.getMousePosition().minus(new Vector2(player.x, player.y)).normalized().scale(this.projectileSpeed);
            gameEngine.addEntity(projectile);
            if (this.perk0 == 1) {
                // Fire two extra shots off to the sides.
                // This for-loop will go from -1, to 1, then exit.
                for (let i = -1; i <= 1; i += 2) {
                    let projectile = new Projectile(player.x, player.y, player, 0, 5);
                    projectile.sprite = new Animator3D(ASSET_MANAGER.getAsset("./sprites/skill/energy_shot.png"), 32, 32, 4, 0.05, false, true);
                    projectile.collisionSize = 4;
                    projectile.onEnemyCollision = () => {
                        projectile.removeFromWorld = true;
                    };
                    projectile.onWallCollision = () => {
                        projectile.removeFromWorld = true;
                    };
                    projectile.velocity = gameEngine.getMousePosition().minus(new Vector2(player.x, player.y)).normalized().scale(this.projectileSpeed).rotated(15 * i);
                    gameEngine.addEntity(projectile);
                }
            }
            player.energy -= 4;
        }
    }
}
class BlastCharge extends Skill {
    constructor() {
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Blast Charge",
                fontSize: 12
            },
            {
                text: "Drop a bomb that explodes after 3 seconds,",
                fontSize: 10
            },
            {
                text: "destroying blocks and hurting enemies.",
                fontSize: 10
            },
            {
                text: "The explosion can hurt you.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            let bomb = new Bomb(player.x, player.y);
            bomb.owner = player;
            gameEngine.addEntity(bomb);
            this.cooldownTimer = this.cooldown / (player.cooldownMod + (player.reflex * 0.02));
        }
    }
}
//# sourceMappingURL=skill.js.map