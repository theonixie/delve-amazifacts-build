class Skill extends Item {
    icon;
    cooldown;
    // Set to the cooldown time when activated.
    // Can only cast skill when cooldownTimer is <= 0.
    cooldownTimer;
    // Energy cost of this skill.
    // Defaults to 0.
    cost = 0;
    skillCategory;
    // TODO: skillcategory to group different skills together
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
/**
 * A skill that shoots energy projectiles out in front of the character.
 * Higher perk level allows multiple projectiles to be fired.
 * @extends {Skill}
 */
class EnergyShot extends Skill {
    projectileSpeed = 256;
    cost = 4;
    baseDamage = 5;
    get damage() {
        return this.baseDamage;
    }
    skillCategory = SkillCategory.Energy;
    // Perk 0 options:
    // 1 = Split shot
    constructor() {
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard0.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill0.png"));
        this.cooldown = 0;
        this.cooldownTimer = 0;
        // For testing.
        // this.perk0 = 1;
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
            },
            {
                text: "Cost: " + this.cost.toString() + "EP",
                fontSize: 10
            },
            {
                text: "Damage: " + this.damage.toString(),
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (player.energy >= this.cost) {
            //gameEngine.addEntity()
            let projectile = new Projectile(player.x, player.y, player, 0, this.damage);
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
            player.energy -= this.cost;
        }
    }
}
/**
 * A skill that drops a bomb that explodes in a cross pattern.
 * Deals damage and  can also be used for mining out ore.
 * @extends {Skill}
 */
class BlastCharge extends Skill {
    skillCategory = SkillCategory.Mundane;
    cost = 15;
    baseDamage = 20;
    get damage() {
        return this.baseDamage;
    }
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
            },
            {
                text: "Cost: " + this.cost.toString() + "EP",
                fontSize: 10
            },
            {
                text: "Damage: " + this.damage.toString(),
                fontSize: 10
            },
            {
                text: "Cooldown: " + this.cooldown.toString() + " seconds",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0 && player.energy >= this.cost) {
            let bomb = new Bomb(player.x, player.y);
            bomb.owner = player;
            bomb.damage = this.damage;
            gameEngine.addEntity(bomb);
            this.cooldownTimer = this.cooldown / (player.cooldownMod + (player.reflex * 0.02));
            player.energy -= this.cost;
        }
    }
}
/**
 * An energy attack that deals massive damage in front of the character.
 * @extends {Skill}
 */
class EnergyClaw extends Skill {
    skillCategory = SkillCategory.Energy;
    constructor() {
        // Needs its own asset
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Energy Claw",
                fontSize: 12
            },
            {
                text: "Strike out in front of you,",
                fontSize: 10
            },
            {
                text: "dealing massive single target damage.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            // probably handle this in a similar manner of basic attack, but only allow it to hit 1 target
            // and deal significantly more damage
        }
    }
}
/**
 * An energy attack that shoots a spread of buckshot in front of the character.
 * @extends {Skill}
 */
class EnergyBlast extends Skill {
    projectileSpeed = 256;
    cost = 12;
    skillCategory = SkillCategory.Energy;
    constructor() {
        // Needs its own asset
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard4.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill4.png"));
        this.cooldown = 1;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Energy Blast",
                fontSize: 12
            },
            {
                text: "Launch of spread of energy projectiles in front of you.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (player.energy >= this.cost) {
            let adj = 0;
            // If upgraded, add two more random projectiles
            if (this.perk0 == 1) {
                adj += 2;
            }
            for (let i = 0; i < 5 + adj; i++) {
                let projectile = new Projectile(player.x, player.y, player, 0, 5);
                projectile.sprite = new Animator3D(ASSET_MANAGER.getAsset("./sprites/skill/energy_shot.png"), 32, 32, 4, 0.05, false, true);
                projectile.collisionSize = 4;
                projectile.onEnemyCollision = () => {
                    projectile.removeFromWorld = true;
                };
                projectile.onWallCollision = () => {
                    projectile.removeFromWorld = true;
                };
                let random = randomInt(50) - 25;
                projectile.velocity = gameEngine.getMousePosition().minus(new Vector2(player.x, player.y)).normalized().scale(this.projectileSpeed).rotated(random);
                gameEngine.addEntity(projectile);
            }
            player.energy -= this.cost;
        }
    }
}
/**
 * An energy attack that fires a high damage disk of energy.
 * Can be upgraded to instead orbit the character rather than go straight forward.
 * @extends {Skill}
 */
class EnergyDisk extends Skill {
    projectileSpeed = 180;
    cost = 8;
    baseDamage = 8;
    get damage() {
        return this.baseDamage;
    }
    skillCategory = SkillCategory.Energy;
    constructor() {
        // TODO: asset for this skillcard
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard3.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill3.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Energy Disk",
                fontSize: 12
            },
            {
                text: "Launch a disk of pure energy forwards.",
                fontSize: 10
            },
            {
                text: "Ricochets off walls.",
                fontSize: 10
            },
            {
                text: "Cost: " + this.cost.toString() + "EP",
                fontSize: 10
            },
            {
                text: "Damage: " + this.damage.toString(),
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0 && player.energy >= this.cost) {
            // Basically a large energy shot, bigger projectile and more damage
            let projectile = new Projectile(player.x, player.y, player, 5, this.damage);
            projectile.sprite = new Animator(ASSET_MANAGER.getAsset("./sprites/skill/energy_disk.png"), 0, 0, 32, 32, 2, 0.05, 0, false, true);
            projectile.collisionSize = 4;
            projectile.onWallCollision = (other) => {
                let reflectNormal = new Vector2(Math.sign(projectile.x - other.x), Math.sign(projectile.y - other.y) * 2).normalized();
                projectile.velocity = projectile.velocity.minus(reflectNormal.scale(2 * projectile.velocity.dot(reflectNormal)));
                projectile.x += reflectNormal.x * 5;
                projectile.y += reflectNormal.y * 5;
                // Reset this projectile's attacked entities list (allows for repeat hits)
                projectile.attackedEntities = [];
            };
            projectile.velocity = gameEngine.getMousePosition().minus(new Vector2(player.x, player.y)).normalized().scale(this.projectileSpeed);
            gameEngine.addEntity(projectile);
            player.energy -= this.cost;
        }
    }
}
/**
 * Fires a massive drill that can dig through walls.
 * Perks can make it last longer and/or crit more.
 * @extends {Skill}
 */
class GigaDrill extends Skill {
    skillCategory = SkillCategory.Mundane;
    constructor() {
        // TODO: asset for this skillcard
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Giga Drill",
                fontSize: 12
            },
            {
                text: "Fire a drill that will dig through walls,",
                fontSize: 10
            },
            {
                text: "embedding into the first enemy it contacts.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            // large projectile, ideally with a 'spinning' animation, that can also destroy walls
            // When it hits an enemy, causes DOT if they survive?? the embedded aspect
        }
    }
}
/**
 * An attack that causes the character to rush forward.
 * Destroys walls that it comes in contact with and pushes enemies away.
 * @extends {Skill}
 */
class BatteringRam extends Skill {
    skillCategory = SkillCategory.Mundane;
    constructor() {
        // TODO: asset for this skillcard
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Battering Ram",
                fontSize: 12
            },
            {
                text: "Launch yourself through walls,",
                fontSize: 10
            },
            {
                text: "pushing all enemies away from the character.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            // Launch the character forward until max distance allowed or collision, destroying walls and pushing enemies in aoe
        }
    }
}
/**
 * An attack that creates an orbiting ball of light around the character,
 * inflicting damage on enemies that enter it.
 * @extends {Skill}
 */
class RadiatingPresence extends Skill {
    skillCategory = SkillCategory.Radiation;
    constructor() {
        // TODO: asset for this skillcard
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Radiating Presence",
                fontSize: 12
            },
            {
                text: "Engulf yourself in light,",
                fontSize: 10
            },
            {
                text: "striking enemies that enter it with radiation.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            //similar to ball lightning, but radiation damage and
        }
    }
}
/**
 * An attack that launches a ball of lightning that electrocutes enemies.
 * @extends {Skill}
 */
class BallLightning extends Skill {
    skillCategory = SkillCategory.Energy;
    constructor() {
        // TODO: asset for this skillcard
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Ball Lightning",
                fontSize: 12
            },
            {
                text: "Launch a slow moving projectile of pure lightning.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            // slow moving projectile, radius DOT around projectile
        }
    }
}
/**
 * An attack that sacrifices health for damage.
 * @extends {Skill}
 */
class Microwave extends Skill {
    skillCategory = SkillCategory.Radiation;
    constructor() {
        // TODO: asset for this skillcard
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Microwave",
                fontSize: 12
            },
            {
                text: "Inflict heavy damage to an enemy in exchange for your own health.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            // slow moving projectile, radius DOT around projectile
        }
    }
}
/**
 * A skill that places a turret at the character's location.
 * @extends {Skill}
 */
class Construct extends Skill {
    skillCategory = SkillCategory.Mundane;
    constructor() {
        // TODO: asset for this skillcard
        super(ASSET_MANAGER.getAsset("./sprites/icon/skillcard1.png"), ASSET_MANAGER.getAsset("./sprites/icon/skill1.png"));
        this.cooldown = 4;
        this.cooldownTimer = 0;
    }
    getTooltip() {
        return [
            {
                text: "Construct",
                fontSize: 12
            },
            {
                text: "Place a turret that fights for you.",
                fontSize: 10
            }
        ];
    }
    cast(player) {
        if (this.cooldownTimer <= 0) {
            // slow moving projectile, radius DOT around projectile
        }
    }
}
// An enum for differentiating between different skill categories
var SkillCategory;
(function (SkillCategory) {
    SkillCategory["Energy"] = "ENERGY";
    SkillCategory["Mundane"] = "MUNDANE";
    SkillCategory["Radiation"] = "RADIATION";
})(SkillCategory || (SkillCategory = {}));
//# sourceMappingURL=skill.js.map