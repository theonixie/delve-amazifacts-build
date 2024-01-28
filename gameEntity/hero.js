/**
 * The main class for the player character. Handles the player object and all behavior associated with it.
 */
class Hero extends Character {
    animFrame;
    animTimer;
    facingDirection;
    facingNormal;
    moveSpeed;
    standAnim;
    runAnim;
    dodgeAnim;
    attackSwingAnim;
    skillShootAnim;
    mineAnim;
    shadowSprite;
    footstepSfx = ["./sounds/footstep0.ogg", "./sounds/footstep1.ogg", "./sounds/footstep2.ogg", "./sounds/footstep3.ogg"];
    footstepSfxCounter = 0;
    /** The player's level. Increase this by gaining experience points. */
    level;
    /** How many experience points the player has. Reaching certain thresholds increases your level. */
    experiencePoints;
    // TODO: For testing purposes, let's just assume reaching level 2 requires 100 points, and the requirement goes up by 100 per level.
    /** Gained when leveling up. They can be spent to upgrade stats. */
    statPoints;
    /** The maximum amount of health the player can have. */
    maxHealth;
    /** How much health the player has currently. */
    health;
    /** Maximum amount of energy the player can have. */
    maxEnergy;
    /** Used to perform Energy skills. Restore it with basic attacks. */
    energy;
    /** When skills are used, their cooldowns are divided by this number. */
    cooldownMod = 1;
    /** Determines max HP. */
    #baseIntegrity;
    get baseIntegrity() {
        return this.#baseIntegrity;
    }
    set baseIntegrity(value) {
        this.#baseIntegrity = value;
        this.maxHealth = 10 + ((this.baseIntegrity + this.integrityMod) * 2);
        // As a safety check, limit the current health if the new max health is below it.
        this.health = Math.min(this.maxHealth, this.health);
    }
    /** Determines max EP. */
    #baseBattery;
    get baseBattery() {
        return this.#baseBattery;
    }
    set baseBattery(value) {
        this.#baseBattery = value;
        this.maxEnergy = 10 + ((this.baseBattery + this.batteryMod) * 2);
        // As a safety check, limit the current energy if the new max energy is below it.
        this.energy = Math.min(this.maxEnergy, this.energy);
    }
    /** Increases damage. */
    basePower;
    /** Reduces skill cooldowns by 5% per point. */
    baseReflex;
    #integrityMod = 0;
    get integrityMod() {
        return this.#integrityMod;
    }
    set integrityMod(value) {
        this.#integrityMod = value;
        this.maxHealth = 10 + ((this.baseIntegrity + this.integrityMod) * 2);
        // As a safety check, limit the current health if the new max health is below it.
        this.health = Math.min(this.maxHealth, this.health);
    }
    #batteryMod = 0;
    get batteryMod() {
        return this.#batteryMod;
    }
    set batteryMod(value) {
        this.#batteryMod = value;
        this.maxEnergy = 10 + ((this.baseBattery + this.batteryMod) * 2);
        // As a safety check, limit the current energy if the new max energy is below it.
        this.energy = Math.min(this.maxEnergy, this.energy);
    }
    powerMod = 0;
    reflexMod = 0;
    get power() {
        return this.basePower + this.powerMod;
    }
    get reflex() {
        return this.baseReflex + this.reflexMod;
    }
    heldWeapon;
    heldStemkit;
    heldSkills;
    /**
    * Defines effects caused by hitting an enemy. Assumes that
    * every function uses the enemy that was hit, the projectile, and the source.
    */
    onEnemyHurt;
    state;
    // How much the player has of each resource.
    // index 0 is unused since it corresponds to nothing in StoneBlock, the rest correspond to resources.
    heldResources;
    constructor(game, x, y) {
        super(game, x, y);
        this.collisionSize = 8;
        this.animFrame = 0;
        this.animTimer = 0;
        this.velocity = new Vector2(0, 0);
        this.facingDirection = 0;
        this.facingNormal = new Vector2(0, 1);
        this.moveSpeed = 180;
        this.heldResources = new Array(0, 0, 0, 0, 0, 0, 0, 0);
        this.standAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/stand.png"), 64, 64, 16, 0.167, false, true);
        this.runAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/run.png"), 64, 64, 16, 0.05, false, true);
        this.dodgeAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/dodge.png"), 64, 64, 13, 0.05, false, false);
        this.dodgeAnim.elapsedTime = this.dodgeAnim.totalTime; // Make the animation start in it's finished state.
        this.attackSwingAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/attack_swing.png"), 48, 48, 10, 0.05, false, false);
        this.attackSwingAnim.elapsedTime = this.attackSwingAnim.totalTime; // Make the animation start in it's finished state.
        this.skillShootAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/skill_shoot.png"), 48, 48, 11, 0.05, false, false);
        this.skillShootAnim.elapsedTime = this.skillShootAnim.totalTime; // Make the animation start in it's finished state.
        this.mineAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/mine.png"), 64, 64, 11, 0.05, false, false);
        this.mineAnim.elapsedTime = this.mineAnim.totalTime; // Make the animation start in it's finished state.
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
        this.level = 0;
        this.experiencePoints = 0;
        this.statPoints = 0;
        this.baseIntegrity = 10;
        this.baseBattery = 10;
        this.basePower = 2;
        this.baseReflex = 2;
        // Set health & energy.
        this.health = this.maxHealth;
        this.energy = this.maxEnergy;
        this.state = PlayerState.Normal;
        // Create a test weapon.
        this.heldWeapon = new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon/sword0.png"));
        // Create a test stemkit.
        this.heldStemkit = new Stemkit(15, 3, ASSET_MANAGER.getAsset("./sprites/icon/stemkit.png"));
        this.onEnemyHurt = [];
        this.heldSkills = [];
        for (let i = 0; i < 4; i++) {
            this.heldSkills.push(null);
        }
    }
    ;
    update() {
        this.animTimer++;
        if (this.animTimer > 10) {
            this.animFrame++;
            if (this.animFrame > 3)
                this.animFrame = 0;
            this.animTimer = 0;
        }
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Reduce cooldowns on any skills that have cooldowns.
        for (let i = 0; i < 4; i++) {
            if (this.heldSkills[i] !== null && this.heldSkills[i].cooldownTimer > 0) {
                this.heldSkills[i].cooldownTimer -= this.game.clockTick;
            }
        }
        switch (this.state) {
            case PlayerState.Normal:
                this.processMoveInput();
                this.updateFacingDirection();
                if (Input.frameKeys["Space"]) {
                    this.dodge();
                }
                else if (Input.mousedown || Input.rightClick) {
                    let mouseClick = this.game.getMousePosition().minus(new Vector2(this.x, this.y)).normalized();
                    this.faceMouseDirection();
                    if (Input.mousedown) { // Attack!
                        this.attack();
                    }
                    else if (Input.rightClick) { // Mine!
                        this.state = PlayerState.Mining;
                        this.mineAnim.elapsedTime = 0;
                    }
                }
                else if (Input.frameKeys["Digit1"]) {
                    this.castSkill(0);
                }
                else if (Input.frameKeys["Digit2"]) {
                    this.castSkill(1);
                }
                else if (Input.frameKeys["Digit3"]) {
                    this.castSkill(2);
                }
                else if (Input.frameKeys["Digit4"]) {
                    this.castSkill(3);
                }
                break;
            case PlayerState.Attacking:
                this.processMoveInput();
                if (this.attackSwingAnim.isDone()) {
                    this.state = PlayerState.Normal;
                    if (Input.mousedown || Input.rightClick) {
                        let mouseClick = this.game.getMousePosition().minus(new Vector2(this.x, this.y)).normalized();
                        this.faceMouseDirection();
                        if (Input.mousedown) { // Attack!
                            this.attack();
                        }
                        else if (Input.rightClick) { // Mine!
                            this.state = PlayerState.Mining;
                            this.mineAnim.elapsedTime = 0;
                        }
                    }
                }
                break;
            case PlayerState.Dodging:
                this.processMoveInput();
                this.updateFacingDirection();
                if (this.dodgeAnim.isDone()) {
                    this.state = PlayerState.Normal;
                }
                break;
            case PlayerState.Mining:
                if (this.mineAnim.currentFrame() >= 4 && this.mineAnim.currentFrame() <= 6) {
                    let mineDirection = new Vector2(this.facingNormal.x, this.facingNormal.y * 0.5).normalized();
                    this.game.globalEntities.get("cave").mineTile(mineDirection.scale(32).add(new Vector2(this.x, this.y)));
                    //this.game.globalEntities.get("cave").mineTile(this.game.getMousePosition());
                }
                else {
                    this.processMoveInput();
                }
                if (this.mineAnim.isDone()) {
                    this.state = PlayerState.Normal;
                    if (Input.mousedown || Input.rightClick) {
                        let mouseClick = this.game.getMousePosition().minus(new Vector2(this.x, this.y)).normalized();
                        this.faceMouseDirection();
                        if (Input.mousedown) { // Attack!
                            this.attack();
                        }
                        else if (Input.rightClick) { // Mine!
                            this.state = PlayerState.Mining;
                            this.mineAnim.elapsedTime = 0;
                        }
                    }
                }
                if (Input.frameKeys["Space"]) {
                    this.mineAnim.stop();
                    this.dodge();
                }
                break;
        }
        // Checking healing is separate from all other states since we can heal whenever.
        if (Input.frameKeys["KeyQ"]) {
            if (this.heldStemkit !== null && this.heldStemkit.charges > 0 && this.health < this.maxHealth) {
                this.gainHealth(this.heldStemkit.healAmount);
                this.heldStemkit.charges--;
            }
        }
        this.checkCollision();
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
    ;
    /**
     * Sets our velocity based on keyboard input. Some states allow movement, while others don't.
     */
    processMoveInput() {
        let move = new Vector2(0, 0);
        if (Input.keys["KeyW"] == true) {
            move.y = -0.5;
        }
        if (Input.keys["KeyS"] == true) {
            move.y = 0.5;
        }
        if (Input.keys["KeyA"] == true) {
            move.x = -1;
        }
        if (Input.keys["KeyD"] == true) {
            move.x = 1;
        }
        move = move.normalized();
        this.velocity = move.scale(this.moveSpeed * (this.dodgeAnim.currentFrame() < 10 ? 1.5 : 1.0));
        // // UNUSED. Allows for movement by clicking with the mouse. Might be buggy if re-enabled due to camera displacement.
        // if(Input.mousedown === true && Math.sqrt(Math.pow(this.game.mouse.x - 32 - this.x, 2) + Math.pow(this.game.mouse.y - 64 - this.y, 2)) > 5) {
        //     let magnitude = Math.sqrt(Math.pow(this.game.mouse.x - 32 - this.x, 2) + Math.pow(this.game.mouse.y - 64 - this.y, 2));
        //     this.velocity.x = this.moveSpeed * (this.game.mouse.x - 32 - this.x) / magnitude;
        //     this.velocity.y = this.moveSpeed * (this.game.mouse.y - 64 - this.y) / magnitude;
        // }
    }
    /** Updates the player's facingDirection to point towards where their velocity is facing. */
    updateFacingDirection() {
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
        }
    }
    /** Updates the player's facingDirection to point towards the mouse. */
    faceMouseDirection() {
        let mouseClick = this.game.getMousePosition().minus(new Vector2(this.x, this.y)).normalized();
        this.facingNormal = mouseClick;
        let angleRad = Math.atan2(-mouseClick.x, mouseClick.y);
        this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
    }
    /** Makes the player enter a dodging state and starts the dodge animation. */
    dodge() {
        this.state = PlayerState.Dodging;
        this.dodgeAnim.elapsedTime = 0;
    }
    attack() {
        let mouseClick = this.game.getMousePosition().minus(new Vector2(this.x, this.y)).normalized();
        this.state = PlayerState.Attacking;
        this.attackSwingAnim.elapsedTime = 0;
        // Only attack if we are holding a weapon.
        // TODO: Add attack for if the player is holding no weapon.
        if (this.heldWeapon !== null) {
            let projectile = new Projectile(this.game, this.x + (mouseClick.x * 16), this.y + (mouseClick.y * 16), this, 0.05, Math.floor(this.power * 0.5) + Math.floor((Math.random() * (this.heldWeapon.damageMax - this.heldWeapon.damageMin + 1)) + this.heldWeapon.damageMin));
            projectile.onEnemyCollision = (enemy) => {
                projectile.owner.gainEnergy(2);
                for (let i = 0; i < this.onEnemyHurt.length; i++) {
                    this.onEnemyHurt[i](this, enemy, projectile);
                }
            };
            this.game.addEntity(projectile);
        }
    }
    castSkill(skillIndex) {
        if (this.heldSkills[skillIndex] !== null) {
            this.heldSkills[skillIndex].cast(this.game, this);
        }
    }
    gainExperience(amount) {
        this.experiencePoints += amount;
        if (this.experiencePoints >= (this.level + 1) * 100) {
            this.level++;
            this.statPoints += 3;
        }
    }
    gainEnergy(amount) {
        this.energy = Math.min(this.energy + amount, this.maxEnergy);
    }
    gainHealth(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    equipWeapon(weapon) {
        this.heldWeapon = weapon;
        let that = this;
        this.heldWeapon.modifiers.forEach(element => {
            element.onEquip(that);
        });
    }
    unequipWeapon() {
        let that = this;
        this.heldWeapon.modifiers.forEach(element => {
            element.onUnequip(that);
        });
        this.heldWeapon = null;
    }
    onProjectileCollision(projectile) {
        // Add handling for enemy projectiles here.
        if (projectile.owner instanceof Hero) {
            return;
        }
        projectile.attackedEntities.push(this);
        let damageTaken = projectile.damage;
        this.health -= damageTaken;
        this.game.addEntity(new DamageIndicator(this.game, this.x, this.y, damageTaken));
        if (this.health <= 0) // Death
         {
            for (let i = 0; i < 5; i++) {
                let goreVelocity = new Vector2((Math.random() * 200) - 100, (Math.random() * 200) - 100);
                this.game.addEntity(new Gore(this.game, this.x, this.y, goreVelocity));
            }
            // // This is for testing item drops.
            // this.game.addEntity(new DroppedItem(this.game, this.x, this.y, new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon_sword0.png"))));
            // this.game.addEntity(new DroppedItem(this.game, this.x, this.y, new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon_sword0.png"))));
            // this.game.addEntity(new DroppedItem(this.game, this.x, this.y, new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon_sword0.png"))));
            // this.game.addEntity(new DroppedItem(this.game, this.x, this.y, new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon_sword0.png"))));
            this.game.addEntity(new DroppedItem(this.game, this.x, this.y, ItemGenerator.generateWeapon()));
            this.removeFromWorld = true;
        }
        this.velocity = new Vector2(this.x - projectile.x, this.y - projectile.y).normalized().scale(256);
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 8, 32, 16);
        //ctx.drawImage(this.spritesheet, this.animFrame * 64, this.facingDirection * 64, 64, 64, this.x, this.y, 64, 64);
        if (!this.attackSwingAnim.isDone()) {
            this.attackSwingAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 24, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else if (!this.dodgeAnim.isDone()) {
            this.dodgeAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else if (!this.mineAnim.isDone()) {
            this.mineAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else if (this.velocity.x != 0 || this.velocity.y != 0) {
            this.runAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
            if (this.runAnim.currentFrame() >= 7 && this.footstepSfxCounter == 0) {
                ASSET_MANAGER.playAsset(this.footstepSfx[Math.floor(Math.random() * this.footstepSfx.length)]);
                this.footstepSfxCounter = 1;
            }
            else if (this.runAnim.currentFrame() >= 15 && this.footstepSfxCounter == 1) {
                ASSET_MANAGER.playAsset(this.footstepSfx[Math.floor(Math.random() * this.footstepSfx.length)]);
                this.footstepSfxCounter = 2;
            }
            else if (this.runAnim.currentFrame() < 7 && this.footstepSfxCounter == 2) {
                this.footstepSfxCounter = 0;
            }
        }
        else {
            this.standAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(this.x - this.game.camera.x - this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - this.game.camera.x + this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
        }
    }
    ;
}
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Normal"] = 0] = "Normal";
    PlayerState[PlayerState["Attacking"] = 1] = "Attacking";
    PlayerState[PlayerState["Casting"] = 2] = "Casting";
    PlayerState[PlayerState["Dodging"] = 3] = "Dodging";
    PlayerState[PlayerState["Mining"] = 4] = "Mining";
})(PlayerState || (PlayerState = {}));
//# sourceMappingURL=hero.js.map