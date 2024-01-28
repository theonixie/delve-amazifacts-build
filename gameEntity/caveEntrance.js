class CaveEntrance extends GameEntity {
    sprite;
    constructor(x, y) {
        super(x, y);
        this.inCave = false;
        this.sprite = ASSET_MANAGER.getAsset("./sprites/tile/floor_exit.png");
    }
    update() {
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                // Go to outpost.
                gameEngine.inCave = true;
                let player = gameEngine.globalEntities.get("hero");
                player.inCave = true;
                player.x = 0;
                player.y = 4096;
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x - gameEngine.camera.x - 96, this.y - gameEngine.camera.y - 48);
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16) {
            if (this.withinPlayerRange()) {
                gameEngine.tooltipArray = [{
                        text: "Cave Entrance",
                        fontSize: 12
                    },
                    {
                        text: "Press [E] return to current floor.",
                        fontSize: 12
                    }];
            }
            else {
                gameEngine.tooltipArray = [{
                        text: "Cave Entrance",
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
//# sourceMappingURL=caveEntrance.js.map