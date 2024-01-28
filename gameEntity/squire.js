class Squire extends GameEntity {
    renderLayer;
    collisionSize;
    standAnim;
    shadowSprite;
    constructor(game, x, y) {
        super(game, x, y);
        // Squire can only be seen in the outpost.
        this.inCave = false;
        this.renderLayer = 2;
        this.collisionSize = 12;
        this.standAnim = new Animator(ASSET_MANAGER.getAsset("./sprites/outpost/squire.png"), 0, 0, 64, 64, 19, 0.08, 0, false, true);
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    update() {
        let mousePos = this.game.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 48 && mousePos.y < this.y + 4 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                this.game.globalEntities.get("recycleMenu").menuVisible = true;
                this.game.globalEntities.get("inventoryMenu").menuVisible = true;
                // Just in case, let's make sure the stat menu isn't visible.
                this.game.globalEntities.get("statMenu").menuVisible = false;
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 8, 32, 16);
        this.standAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 56, 1);
        let mousePos = this.game.getMousePosition();
        if (mousePos.x > this.x - 16 && mousePos.x < this.x + 16 && mousePos.y > this.y - 48 && mousePos.y < this.y + 4) {
            if (this.withinPlayerRange()) {
                this.game.tooltipArray = [{
                        text: "Squire",
                        fontSize: 12
                    },
                    {
                        text: "Press [E] to talk",
                        fontSize: 12
                    }];
            }
            else {
                this.game.tooltipArray = [{
                        text: "Squire",
                        fontSize: 12
                    }];
            }
        }
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(this.x - this.game.camera.x - this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - this.game.camera.x + this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
        }
    }
    withinPlayerRange() {
        let player = this.game.globalEntities.get("hero");
        return Math.abs(this.x - player.x) < 128 && Math.abs(this.y - player.y) < 64;
    }
}
//# sourceMappingURL=squire.js.map