class House extends StoneBlock {
    sprite;
    constructor(x, y, index) {
        super(x, y);
        this.inCave = false;
        this.collisionSize = 48;
        this.sprite = ASSET_MANAGER.getAsset("./sprites/outpost/" + (index == 0 ? "house_tarren.png" : "house_squire.png"));
    }
    update() { }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x - gameEngine.camera.x - 96, this.y - gameEngine.camera.y - 144);
    }
}
//# sourceMappingURL=house.js.map