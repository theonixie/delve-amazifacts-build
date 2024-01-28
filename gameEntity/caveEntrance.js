class CaveEntrance extends GameEntity {
    sprite;
    constructor(game, x, y) {
        super(game, x, y);
        this.inCave = false;
        this.sprite = ASSET_MANAGER.getAsset("./sprites/tile/floor_exit.png");
    }
    update() {
        let mousePos = this.game.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                // Go to outpost.
                this.game.inCave = true;
                let player = this.game.globalEntities.get("hero");
                player.inCave = true;
                player.x = 0;
                player.y = 4096;
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x - this.game.camera.x - 96, this.y - this.game.camera.y - 48);
        let mousePos = this.game.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16) {
            if (this.withinPlayerRange()) {
                this.game.tooltipArray = [{
                        text: "Cave Entrance",
                        fontSize: 12
                    },
                    {
                        text: "Press [E] return to current floor.",
                        fontSize: 12
                    }];
            }
            else {
                this.game.tooltipArray = [{
                        text: "Cave Entrance",
                        fontSize: 12
                    }];
            }
        }
    }
    withinPlayerRange() {
        let player = this.game.globalEntities.get("hero");
        return Math.abs(this.x - player.x) < 128 && Math.abs(this.y - player.y) < 64;
    }
}
//# sourceMappingURL=caveEntrance.js.map