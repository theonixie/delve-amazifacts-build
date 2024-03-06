class BasicTable extends DropTable {
    skills;
    /*
    * Currently maintaining a weight of 100 to clearly show percentage chance to drop, although is not a strict requirement
    */
    constructor() {
        super();
        this.add("Weapon", 1, 25);
        this.add("Stemkit", 1, 5);
        this.add("Stempak", 1, 5);
        this.add("Skill", 1, 5);
        this.add("nothing", 1, 50);
        this.skills = new SkillSubTable;
    }
    drop(x, y, quantity = 1) {
        let itemlist = this.roll(quantity);
        console.log(itemlist);
        itemlist.forEach(item => {
            switch (item) {
                case "Weapon": {
                    gameEngine.addEntity(new DroppedItem(x, y, ItemGenerator.generateWeapon()));
                    break;
                }
                case "Stemkit": {
                    gameEngine.addEntity(new DroppedItem(x, y, ItemGenerator.generateStemkit()));
                    break;
                }
                case "Stempak": {
                    gameEngine.addEntity(new DroppedStempak(x, y));
                    break;
                }
                case "Skill": {
                    this.skills.subroll(x, y);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }
}
class SkillSubTable extends DropTable {
    constructor() {
        super();
        this.add("EnergyShot");
        this.add("BlastCharge");
        this.add("EnergyBlast");
        this.add("EnergyDisk");
        // Skills yet to be implemented:
        // this.add("GigaDrill");
        // this.add("EnergyClaw");
        // this.add("BatteringRam");
        // this.add("RadiatingPresence");
        // this.add("BallLightning");
        // this.add("Microwave");
        // this.add("Construct");
    }
    subroll(x, y, quantity = 1) {
        let subrolls = this.roll(quantity);
        subrolls.forEach(skill => {
            switch (skill) {
                case "EnergyShot": {
                    gameEngine.addEntity(new DroppedItem(x, y, new EnergyShot));
                    break;
                }
                case "BlastCharge": {
                    gameEngine.addEntity(new DroppedItem(x, y, new BlastCharge));
                    break;
                }
                case "EnergyBlast": {
                    gameEngine.addEntity(new DroppedItem(x, y, new EnergyBlast));
                    break;
                }
                case "EnergyDisk": {
                    gameEngine.addEntity(new DroppedItem(x, y, new EnergyDisk));
                    break;
                }
            }
        });
    }
}
class CaveEnemyTable extends DropTable {
    constructor() {
        super();
        this.add("Bat");
        this.add("Slime");
        this.add("Zombie");
    }
    drop(x, y, quantity = 1) {
        let monsterlist = this.roll(quantity);
        monsterlist.forEach(monster => {
            let monsterType;
            switch (monster) {
                case "Bat": {
                    monsterType = Bat;
                    break;
                }
                case "Slime": {
                    monsterType = Slime;
                    break;
                }
                case "Zombie": {
                    monsterType = Zombie;
                    break;
                }
                default: {
                    break;
                }
            }
            console.log(monsterType);
            if (monsterType != undefined) {
                let monsterSpawned = new monsterType(x, y);
                gameEngine.addEntity(monsterSpawned);
            }
        });
    }
}
//# sourceMappingURL=lootTables.js.map