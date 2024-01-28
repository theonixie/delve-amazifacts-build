class Cube {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/woodCrates.png");
    }
    ;
    collide(other) {
    }
    update() {
    }
    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, 64, 64, this.x, this.y + 16, 64, 64);
    }
    ;
}
//# sourceMappingURL=cube.js.map