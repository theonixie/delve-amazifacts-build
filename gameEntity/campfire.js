class Campfire extends Barrier {
    shadowSprite;
    constructor(x, y) {
        super(x, y);
        this.collisionSize = 12;
        this.spritesheet = new Animator(ASSET_MANAGER.getAsset("./sprites/outpost/campfire.png"), 0, 0, 64, 64, 3, 0.2, 0, false, true);
        this.inCave = false;
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    update() {
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 48 && mousePos.y < this.y + 4 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                let player = gameEngine.globalEntities.get("hero");
                player.fullRestore();
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - gameEngine.camera.x - 16, this.y - gameEngine.camera.y - 8, 32, 16);
        this.spritesheet.drawFrame(ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 40, 1);
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 48 && mousePos.y < this.y + 4) {
            if (this.withinPlayerRange()) {
                gameEngine.tooltipArray = [{
                        text: "Campfire",
                        fontSize: 12
                    },
                    {
                        text: "Press [E] to heal",
                        fontSize: 12
                    }];
            }
            else {
                gameEngine.tooltipArray = [{
                        text: "Campfire",
                        fontSize: 12
                    }];
            }
        }
    }
    withinPlayerRange() {
        let player = gameEngine.globalEntities.get("hero");
        return Math.abs(this.x - player.x) < 128 && Math.abs(this.y - player.y) < 64;
    }
}
//# sourceMappingURL=campfire.js.map