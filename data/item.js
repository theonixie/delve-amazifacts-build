class Item {
    width;
    height;
    modifiers;
    sprite;
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.modifiers = [];
    }
}
class ItemModifier {
    /** Determines how powerful this modifier is. Starts at 1 for a base modifier. */
    rank;
    /** The maximum rank this modifier can have, barring any special effects. */
    maxRank;
    /** Base level requirement. */
    baseLevelReq;
    /**
     * Every additional rank to this modifier raises it's level requirement.
     * This only influences item generation and recycling; leveling up an item
     * with experience won't influence the level requirement of an item.
     */
    rankLevelReq;
    /**
     * The function that is executed when the item is equipped.
     * It takes in the Hero class as a parameter.
     */
    onEquip;
    /**
     * The function that is executed when the item is unequipped.
     * It takes in the Hero class as a parameter.
     */
    onUnequip;
    /** The tooltip for the modifier, added to the weapon's tooltip. */
    tooltip;
}
class IntegrityUpModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 5;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        this.onEquip = (hero) => (hero.integrityMod += 2 * this.rank);
        this.onUnequip = (hero) => (hero.integrityMod -= 2 * this.rank);
        this.tooltip = {
            text: "Integrity +" + (this.rank * 2).toString() + " [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
class BatteryUpModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 5;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        this.onEquip = (hero) => (hero.batteryMod += 2 * this.rank);
        this.onUnequip = (hero) => (hero.batteryMod -= 2 * this.rank);
        this.tooltip = {
            text: "Battery +" + (this.rank * 2).toString() + " [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
class PowerUpModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 5;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        this.onEquip = (hero) => (hero.powerMod += 2 * this.rank);
        this.onUnequip = (hero) => (hero.powerMod -= 2 * this.rank);
        this.tooltip = {
            text: "Power +" + (this.rank * 2).toString() + " [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
class ReflexUpModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 5;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        this.onEquip = (hero) => (hero.reflexMod += 2 * this.rank);
        this.onUnequip = (hero) => (hero.reflexMod -= 2 * this.rank);
        this.tooltip = {
            text: "Reflex +" + (this.rank * 2).toString() + " [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
class LeechModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 4;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        let leechEffect = (owner, target, projectile) => {
            owner.gainHealth(this.rank);
        };
        this.onEquip = (hero) => { hero.onEnemyHurt.push(leechEffect); };
        this.onUnequip = (hero) => { hero.onEnemyHurt.splice(hero.onEnemyHurt.indexOf(leechEffect), 1); };
        this.tooltip = {
            text: "Restore " + (this.rank).toString() + " health per hit [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
class MaxDamageModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 4;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        this.onEquip = (hero) => { hero.heldWeapon.damageMax += 2 * this.rank; };
        this.onUnequip = (hero) => { hero.heldWeapon.damageMax -= 2 * this.rank; };
        this.tooltip = {
            text: "Max Damage +" + (this.rank * 2).toString() + " when equipped [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
class CooldownModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 3;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        this.onEquip = (hero) => { hero.cooldownMod += 0.20 * this.rank; };
        this.onUnequip = (hero) => { hero.cooldownMod -= 0.20 * this.rank; };
        this.tooltip = {
            text: "Reduces skill cooldowns by " + (20 * this.rank).toString() + "% [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
class MineSpeedModifier extends ItemModifier {
    constructor(rank) {
        super();
        this.maxRank = 4;
        this.setRank(rank);
    }
    setRank(rank) {
        this.rank = Math.min(rank, this.maxRank);
        this.onEquip = (hero) => { hero.mineSpeedMod += 0.25 * this.rank; };
        this.onUnequip = (hero) => { hero.mineSpeedMod -= 0.25 * this.rank; };
        this.tooltip = {
            text: "Increases mining speed by " + (25 * this.rank).toString() + "% [" + ("★".repeat(this.rank)) + ("☆".repeat(this.maxRank - this.rank)) + "]",
            fontSize: 10
        };
    }
}
const ItemGenerator = class {
    static weaponModifiers;
    static initializeModifiers() {
        this.weaponModifiers = [];
        this.weaponModifiers.push(IntegrityUpModifier);
        this.weaponModifiers.push(BatteryUpModifier);
        this.weaponModifiers.push(PowerUpModifier);
        this.weaponModifiers.push(ReflexUpModifier);
        this.weaponModifiers.push(LeechModifier);
        this.weaponModifiers.push(MaxDamageModifier);
        this.weaponModifiers.push(CooldownModifier);
        this.weaponModifiers.push(MineSpeedModifier);
    }
    static generateWeapon() {
        let weapon = new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon/sword0.png"));
        weapon.modifiers = [];
        let modifierOptions = [...this.weaponModifiers].sort((a, b) => { return Math.random() - 0.5; });
        let totalOptionsTaken;
        // Random distribution: 10% chance for 3 modifiers, 30% chance for 2, 60% chance for 1.
        let rngResult = Math.random();
        if (rngResult < 0.1)
            totalOptionsTaken = 3;
        else if (rngResult < 0.4)
            totalOptionsTaken = 2;
        else
            totalOptionsTaken = 1;
        for (let i = 0; i < totalOptionsTaken; i++) {
            weapon.modifiers.push(new modifierOptions[i](1));
        }
        return weapon;
    }
};
//# sourceMappingURL=item.js.map