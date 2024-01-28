class StoneBlock extends GameEntity {
    renderLayer;
    // 0 = no resource | 1 = copper | 2 = iron | 3 = gold
    // 4 = sapphire | 5 = emerald | 6 = amethyst | 7 = diamond
    resource;
    collisionSize;
    spritesheet;
    constructor(x, y) {
        super(x, y);
        this.renderLayer = 2;
        this.collisionSize = 16;
        if (gameEngine.currentFloor < 4)
            this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tile/cave_wall.png");
        else if (gameEngine.currentFloor < 7)
            this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tile/factory_wall.png");
        else
            this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tile/castle_wall.png");
        // Pick a random resource for this block.
        // For testing purposes, this is chosen at random.
        // Each floor should have unique resource distributions.
        // There is only a 5% chance that a block will contain a resource.
        if (Math.random() < 0.05) {
            this.resource = Math.floor(Math.random() * 7) + 1;
        }
        else {
            this.resource = 0;
        }
    }
    update() {
    }
    draw(ctx) {
        let player = gameEngine.globalEntities.get("hero");
        if (this.x - 32 < player.x && this.x + 32 > player.x && this.y - 32 < player.y && this.y > player.y) {
            ctx.globalAlpha = 0.7;
        }
        // The sprite drawn depends on the resource.
        ctx.drawImage(this.spritesheet, (this.resource % 4) * 96, Math.floor(this.resource / 4) * 96, 96, 96, this.x - gameEngine.camera.x - 48, this.y - gameEngine.camera.y - 72, 96, 96);
        ctx.globalAlpha = 1;
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
}
//# sourceMappingURL=stoneBlock.js.map