class TitleScreen extends HudEntity {
    titleSprite;
    showCredits = false;
    constructor(x, y) {
        super(x, y);
        this.titleSprite = ASSET_MANAGER.getAsset("./sprites/ui/title.png");
    }
    update() {
        if (Input.leftClick) {
            if (this.hoveringStartButton()) {
                this.startGame();
                this.removeFromWorld = true;
            }
            else if (this.hoveringCreditsButton()) {
                this.showCredits = !this.showCredits;
            }
        }
    }
    draw(ctx) {
        if (this.hoveringStartButton()) {
            ctx.fillStyle = "black";
            ctx.fillRect(200, 200, 200, 50);
        }
        else if (this.hoveringCreditsButton()) {
            ctx.fillStyle = "black";
            ctx.fillRect(200, 275, 200, 50);
        }
        ctx.drawImage(this.titleSprite, 0, 0);
        if (this.showCredits) {
            ctx.fillStyle = "black";
            ctx.fillRect(125, 25, 350, 150);
            ctx.fillStyle = "white";
            ctx.font = "12px monospace";
            ctx.fillText("Created by:", 130, 40);
            ctx.fillText("- Elias Peterson", 130, 60);
            ctx.fillText("- Matt Bauchspies", 130, 80);
            ctx.fillText("- Rosemary Roach", 130, 100);
            ctx.fillText("Made in 2024 for TCSS 491", 130, 120);
        }
    }
    hoveringStartButton() {
        return (Input.mouse.x > 200 && Input.mouse.x < 400 && Input.mouse.y > 200 && Input.mouse.y < 250);
    }
    hoveringCreditsButton() {
        return (Input.mouse.x > 200 && Input.mouse.x < 400 && Input.mouse.y > 275 && Input.mouse.y < 325);
    }
    startGame() {
        let mapDisplay = new MapDisplay(0, 0);
        gameEngine.addEntity(mapDisplay);
        let selectedItem = new SelectedItem(0, 0);
        gameEngine.globalEntities.set("selectedItem", selectedItem);
        let inventoryMenu = new InventoryMenu(0, 0);
        gameEngine.globalEntities.set("inventoryMenu", inventoryMenu);
        gameEngine.addEntity(inventoryMenu);
        let statMenu = new StatMenu(0, 0);
        gameEngine.globalEntities.set("statMenu", statMenu);
        gameEngine.addEntity(statMenu);
        let recycleMenu = new RecycleMenu(0, 0);
        gameEngine.globalEntities.set("recycleMenu", recycleMenu);
        gameEngine.addEntity(recycleMenu);
        let skillUpgradeMenu = new SkillUpgradeMenu(0, 0);
        gameEngine.globalEntities.set("skillUpgradeMenu", skillUpgradeMenu);
        gameEngine.addEntity(skillUpgradeMenu);
        let hero = new Hero(0, 4096);
        gameEngine.cameraTarget = hero;
        gameEngine.globalEntities.set("hero", hero);
        gameEngine.addEntity(hero);
        // Connect the inventory and stat menu to the player.
        inventoryMenu.player = hero;
        statMenu.initialize(hero);
        // Initialize upgrade menu
        skillUpgradeMenu.initialize();
        // For testing.
        gameEngine.addEntity(new DroppedItem(-80, 4060, new EnergyShot()));
        gameEngine.addEntity(new DroppedItem(-96, 4060, new BlastCharge()));
        gameEngine.addEntity(new DroppedItem(-40, 4060, new EnergyDisk()));
        gameEngine.addEntity(new DroppedItem(-24, 4060, new EnergyBlast()));
        // // Weapon generation testing.
        // for(let i = 0; i < 5; i++)
        //     gameEngine.addEntity(new DroppedItem(-60, 4000, ItemGenerator.generateWeapon()));
        gameEngine.addEntity(selectedItem);
        // Outpost stuff
        gameEngine.addEntity(new Squire(-1064, -90));
        gameEngine.addEntity(new Tarren(-1256, -90));
        gameEngine.addEntity(new House(-1320, -128, 0));
        gameEngine.addEntity(new House(-1000, -128, 1));
        gameEngine.addEntity(new Barrier(-680, -200));
        gameEngine.addEntity(new Barrier(-1640, -200));
        gameEngine.addEntity(new Barrier(-680, 280));
        gameEngine.addEntity(new Barrier(-1640, 280));
        gameEngine.addEntity(new OutpostFloor(-860, -120));
        gameEngine.addEntity(new OutpostFloor(-1460, -120));
        gameEngine.addEntity(new OutpostFloor(-860, 280));
        gameEngine.addEntity(new OutpostFloor(-1460, 280));
        gameEngine.addEntity(new OutpostFloor(-1760, -120));
        gameEngine.addEntity(new OutpostFloor(-1760, 280));
        gameEngine.addEntity(new OutpostFloor(-560, -120));
        gameEngine.addEntity(new OutpostFloor(-560, 280));
        gameEngine.addEntity(new OutpostFloor(-1160, -320));
        let cave = new Cave(0, 0);
        gameEngine.addEntity(cave);
        gameEngine.globalEntities.set("cave", cave);
        gameEngine.addEntity(new FloorEntrance(0, 4096));
        gameEngine.addEntity(new CaveEntrance(-860, 0));
        mapDisplay.hero = hero;
        mapDisplay.cave = cave;
        gameEngine.addEntity(new Hud(0, 0));
        gameEngine.gameActive = true;
    }
}
//# sourceMappingURL=titleScreen.js.map