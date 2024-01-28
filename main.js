const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
//ASSET_MANAGER.queueDownload("./path/to/image.png");
// BACKGROUNDS
ASSET_MANAGER.queueDownload("./sprites/background/cave.png");
// ENEMIES
ASSET_MANAGER.queueDownload("./sprites/enemy/sandbag/stand.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/walk.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/attack.png");
// PLAYER
ASSET_MANAGER.queueDownload("./sprites/hero/stand.png");
ASSET_MANAGER.queueDownload("./sprites/hero/run.png");
ASSET_MANAGER.queueDownload("./sprites/hero/dodge.png");
ASSET_MANAGER.queueDownload("./sprites/hero/attack_swing.png");
ASSET_MANAGER.queueDownload("./sprites/hero/mine.png");
ASSET_MANAGER.queueDownload("./sprites/hero/skill_shoot.png");
// ICONS
ASSET_MANAGER.queueDownload("./sprites/icon/skill0.png");
ASSET_MANAGER.queueDownload("./sprites/icon/skill1.png");
ASSET_MANAGER.queueDownload("./sprites/icon/skillcard0.png");
ASSET_MANAGER.queueDownload("./sprites/icon/skillcard1.png");
ASSET_MANAGER.queueDownload("./sprites/icon/stemkit.png");
ASSET_MANAGER.queueDownload("./sprites/icon/sword0.png");
// OUTPOST
ASSET_MANAGER.queueDownload("./sprites/outpost/floor.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/squire.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/house_tarren.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/house_squire.png");
// SKILLS
ASSET_MANAGER.queueDownload("./sprites/skill/bomb.png");
ASSET_MANAGER.queueDownload("./sprites/skill/energy_shot.png");
// TILES
ASSET_MANAGER.queueDownload("./sprites/tile/floor_entrance.png");
ASSET_MANAGER.queueDownload("./sprites/tile/floor_exit.png");
ASSET_MANAGER.queueDownload("./sprites/tile/cave_floor.png");
ASSET_MANAGER.queueDownload("./sprites/tile/cave_wall.png");
ASSET_MANAGER.queueDownload("./sprites/tile/factory_floor.png");
ASSET_MANAGER.queueDownload("./sprites/tile/factory_wall.png");
ASSET_MANAGER.queueDownload("./sprites/tile/castle_floor.png");
ASSET_MANAGER.queueDownload("./sprites/tile/castle_wall.png");
// UI
ASSET_MANAGER.queueDownload("./sprites/ui/button_increase.png");
ASSET_MANAGER.queueDownload("./sprites/ui/button_increase_disabled.png");
ASSET_MANAGER.queueDownload("./sprites/ui/hud_backpack.png");
ASSET_MANAGER.queueDownload("./sprites/ui/hud_over.png");
ASSET_MANAGER.queueDownload("./sprites/ui/hud_under.png");
ASSET_MANAGER.queueDownload("./sprites/ui/menu_inventory.png");
ASSET_MANAGER.queueDownload("./sprites/ui/menu_recycle.png");
ASSET_MANAGER.queueDownload("./sprites/ui/menu_stats.png");
ASSET_MANAGER.queueDownload("./sprites/ui/resource_hud.png");
// VFX
ASSET_MANAGER.queueDownload("./sprites/vfx/explosion.png");
ASSET_MANAGER.queueDownload("./sprites/vfx/gore_screw.png");
ASSET_MANAGER.queueDownload("./sprites/vfx/shadow.png");
// OTHER STUFF
ASSET_MANAGER.queueDownload("./sprites/item_glow.png");
ASSET_MANAGER.queueDownload("./sprites/vignette.png");
ASSET_MANAGER.queueDownload("./sprites/woodCrates.png");
// SOUNDS
ASSET_MANAGER.queueDownload("./sounds/footstep0.ogg");
ASSET_MANAGER.queueDownload("./sounds/footstep1.ogg");
ASSET_MANAGER.queueDownload("./sounds/footstep2.ogg");
ASSET_MANAGER.queueDownload("./sounds/footstep3.ogg");
// The function given as a parameter to this method call will be executed once
// all assets have been loaded. In this case, we want the game to start.
ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.imageSmoothingEnabled = false;
    gameEngine.init(ctx);
    ItemGenerator.initializeModifiers();
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
    let hero = new Hero(0, 4096);
    gameEngine.cameraTarget = hero;
    gameEngine.globalEntities.set("hero", hero);
    gameEngine.addEntity(hero);
    // Connect the inventory and stat menu to the player.
    inventoryMenu.player = hero;
    statMenu.initialize(hero);
    //gameEngine.addEntity(new Cube(200, 100));
    gameEngine.addEntity(new Sandbag(64, 4125));
    //gameEngine.addEntity(new Zombie(gameEngine, 80, 4125));
    gameEngine.addEntity(new DroppedItem(-80, 4050, new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon/sword0.png"))));
    gameEngine.addEntity(new DroppedItem(-80, 4060, new EnergyShot()));
    gameEngine.addEntity(new DroppedItem(-96, 4060, new BlastCharge()));
    // For testing purposes
    for (let i = 0; i < 5; i++)
        gameEngine.addEntity(new DroppedItem(-60, 4000, ItemGenerator.generateWeapon()));
    gameEngine.addEntity(selectedItem);
    // Outpost stuff
    gameEngine.addEntity(new Squire(-1064, -90));
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
    // For testing.
    gameEngine.addEntity(new FloorExit(-128, 4096));
    mapDisplay.hero = hero;
    mapDisplay.cave = cave;
    gameEngine.addEntity(new Hud(0, 0));
    gameEngine.start();
});
//# sourceMappingURL=main.js.map