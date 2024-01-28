class FloorExit extends GameEntity {
    sprite;
    constructor(x, y) {
        super(x, y);
        this.inCave = true;
        this.sprite = ASSET_MANAGER.getAsset("./sprites/tile/floor_exit.png");
    }
    update() {
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                // Go deeper...
                gameEngine.enterNewCave();
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x - gameEngine.camera.x - 96, this.y - gameEngine.camera.y - 48);
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16) {
            if (this.withinPlayerRange()) {
                gameEngine.tooltipArray = [{
                        text: "Floor Exit",
                        fontSize: 12
                    },
                    {
                        text: "Press [E] to go to next floor.",
                        fontSize: 12
                    }];
            }
            else {
                gameEngine.tooltipArray = [{
                        text: "Floor Exit",
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
//# sourceMappingURL=floorExit.js.map