class FloorEntrance extends GameEntity {
    sprite;
    constructor(x, y) {
        super(x, y);
        this.sprite = ASSET_MANAGER.getAsset("./sprites/tile/floor_entrance.png");
    }
    update() {
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                // Go to outpost.
                gameEngine.inCave = false;
                let player = gameEngine.globalEntities.get("hero");
                player.inCave = false;
                player.x = -860;
                player.y = 0;
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x - gameEngine.camera.x - 96, this.y - gameEngine.camera.y - 48);
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 16 && mousePos.y < this.y + 16) {
            if (this.withinPlayerRange()) {
                gameEngine.tooltipArray = [{
                        text: "Floor Entrace",
                        fontSize: 12
                    },
                    {
                        text: "Press [E] to return to surface.",
                        fontSize: 12
                    }];
            }
            else {
                gameEngine.tooltipArray = [{
                        text: "Floor Entrance",
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
//# sourceMappingURL=floorEntrance.js.map