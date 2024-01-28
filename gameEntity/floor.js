class Floor extends GameEntity {
    renderLayer;
    collisionSize;
    spritesheet;
    constructor(x, y) {
        super(x, y);
        this.renderLayer = 1;
        this.collisionSize = 0;
        if (gameEngine.currentFloor < 4)
            this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tile/cave_floor.png");
        else if (gameEngine.currentFloor < 7)
            this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tile/factory_floor.png");
        else
            this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tile/castle_floor.png");
    }
    update() {
    }
    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, 64, 32, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 16, 64, 32);
    }
}
//# sourceMappingURL=floor.js.map