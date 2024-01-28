class OutpostFloor extends Floor {
    constructor(x, y) {
        super(x, y);
        this.inCave = false;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/outpost/floor.png");
    }
    update() { }
    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x - gameEngine.camera.x - 300, this.y - gameEngine.camera.y - 200);
    }
}
//# sourceMappingURL=outpostFloor.js.map