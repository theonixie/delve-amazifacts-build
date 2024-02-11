class Tarren extends GameEntity {
    renderLayer;
    collisionSize;
    standAnim;
    shadowSprite;
    constructor(x, y) {
        super(x, y);
        // Tarren can only be seen in the outpost.
        this.inCave = false;
        this.renderLayer = 2;
        this.collisionSize = 12;
        //TODO: replace with new asset
        this.standAnim = new Animator(ASSET_MANAGER.getAsset("./sprites/outpost/tarren.png"), 0, 0, 64, 64, 19, 0.08, 0, false, true);
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    update() {
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 48 && mousePos.y < this.y + 4 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                gameEngine.globalEntities.get("skillUpgradeMenu").menuVisible = true;
                gameEngine.globalEntities.get("inventoryMenu").menuVisible = true;
                // Just in case, let's make sure the stat menu isn't visible.
                gameEngine.globalEntities.get("statMenu").menuVisible = false;
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - gameEngine.camera.x - 16, this.y - gameEngine.camera.y - 8, 32, 16);
        this.standAnim.drawFrame(ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 56, 1);
        let mousePos = gameEngine.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 48 && mousePos.y < this.y + 4) {
            if (this.withinPlayerRange()) {
                gameEngine.tooltipArray = [{
                        text: "Tarren",
                        fontSize: 12
                    },
                    {
                        text: "Press [E] to talk",
                        fontSize: 12
                    }];
            }
            else {
                gameEngine.tooltipArray = [{
                        text: "Tarren",
                        fontSize: 12
                    }];
            }
        }
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(this.x - gameEngine.camera.x - this.collisionSize * 2, this.y - gameEngine.camera.y);
            ctx.lineTo(this.x - gameEngine.camera.x, this.y - gameEngine.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - gameEngine.camera.x + this.collisionSize * 2, this.y - gameEngine.camera.y);
            ctx.lineTo(this.x - gameEngine.camera.x, this.y - gameEngine.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
        }
    }
    withinPlayerRange() {
        let player = gameEngine.globalEntities.get("hero");
        return Math.abs(this.x - player.x) < 128 && Math.abs(this.y - player.y) < 64;
    }
}
//# sourceMappingURL=tarren.js.map