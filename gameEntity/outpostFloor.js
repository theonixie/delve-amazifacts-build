class OutpostFloor extends Floor {
    constructor(game, x, y) {
        super(game, x, y);
        this.inCave = false;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/outpost/floor.png");
    }
    update() { }
    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x - this.game.camera.x - 300, this.y - this.game.camera.y - 200);
    }
}
//# sourceMappingURL=outpostFloor.js.map