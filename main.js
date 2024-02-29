const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
// ASSET_MANAGER.queueDownload("./path/to/image.png");
// BACKGROUNDS
ASSET_MANAGER.queueDownload("./sprites/background/cave.png");
// ENEMIES
ASSET_MANAGER.queueDownload("./sprites/enemy/sandbag/stand.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/walk.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/attack.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/buildup.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/lunge.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/lungewind.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/zombie/getup.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/slime/walk.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/slime/attack.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/bat/walk.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/knight/stand.png");
ASSET_MANAGER.queueDownload("./sprites/enemy/knight/walk.png");
// PLAYER
ASSET_MANAGER.queueDownload("./sprites/hero/stand.png");
ASSET_MANAGER.queueDownload("./sprites/hero/run.png");
ASSET_MANAGER.queueDownload("./sprites/hero/dodge.png");
ASSET_MANAGER.queueDownload("./sprites/hero/attack_swing.png");
ASSET_MANAGER.queueDownload("./sprites/hero/mine.png");
ASSET_MANAGER.queueDownload("./sprites/hero/skill_shoot.png");
// ICONS
// Set this for-loop to match the number of in-game skills.
for (let i = 0; i < 5; i++) {
    ASSET_MANAGER.queueDownload("./sprites/icon/skill" + i.toString() + ".png");
    ASSET_MANAGER.queueDownload("./sprites/icon/skillcard" + i.toString() + ".png");
}
ASSET_MANAGER.queueDownload("./sprites/icon/stemkit.png");
ASSET_MANAGER.queueDownload("./sprites/icon/sword0.png");
// OUTPOST
ASSET_MANAGER.queueDownload("./sprites/outpost/floor.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/squire.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/tarren.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/house_tarren.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/house_squire.png");
ASSET_MANAGER.queueDownload("./sprites/outpost/campfire.png");
// SKILLS
ASSET_MANAGER.queueDownload("./sprites/skill/bomb.png");
ASSET_MANAGER.queueDownload("./sprites/skill/energy_shot.png");
ASSET_MANAGER.queueDownload("./sprites/skill/energy_disk.png");
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
ASSET_MANAGER.queueDownload("./sprites/stempak_glow.png");
ASSET_MANAGER.queueDownload("./sprites/vignette.png");
ASSET_MANAGER.queueDownload("./sprites/woodCrates.png");
// TITLE
ASSET_MANAGER.queueDownload("./sprites/ui/title.png");
// SOUNDS
ASSET_MANAGER.queueDownload("./sounds/footstep0.wav");
ASSET_MANAGER.queueDownload("./sounds/footstep1.wav");
ASSET_MANAGER.queueDownload("./sounds/footstep2.wav");
ASSET_MANAGER.queueDownload("./sounds/stemkit_use.wav");
ASSET_MANAGER.queueDownload("./sounds/full_restore.wav");
ASSET_MANAGER.queueDownload("./sounds/block_break.wav");
// The function given as a parameter to this method call will be executed once
// all assets have been loaded. In this case, we want the game to start.
ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.imageSmoothingEnabled = false;
    gameEngine.init(ctx);
    ItemGenerator.initializeModifiers();
    let title = new TitleScreen(0, 0);
    gameEngine.addEntity(title);
    gameEngine.start();
});
//# sourceMappingURL=main.js.map