class Floor extends GameEntity {
    renderLayer;
    collisionSize;
    spritesheet;
    constructor(game, x, y) {
        super(game, x, y);
        this.renderLayer = 1;
        this.collisionSize = 0;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tile/floor_cave.png");
    }
    update() {
    }
    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, 64, 32, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 16, 64, 32);
    }
}
//# sourceMappingURL=floor.js.map