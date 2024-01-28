class DroppedItem extends GameEntity {
    height;
    velocity;
    collisionSize = 8;
    bounceVelocity;
    associatedItem;
    spritesheet;
    shadowSprite;
    removeFromWorld;
    constructor(game, x, y, associatedItem) {
        super(game, x, y);
        this.inCave = game.inCave;
        this.associatedItem = associatedItem;
        this.height = 1;
        this.bounceVelocity = Math.random() * 128 + 512;
        this.velocity = new Vector2(Math.random() * 80 - 40, Math.random() * 80 - 40);
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
        this.spritesheet = new Animator(ASSET_MANAGER.getAsset("./sprites/item_glow.png"), 0, 0, 32, 64, 10, 0.2, 0, false, true);
        this.removeFromWorld = false;
    }
    update() {
        if (this.height <= 0) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.bounceVelocity = 0;
            this.height = 0;
        }
        else { // Object is still in the air and should move.
            var that = this;
            this.game.entities.forEach(function (entity) {
                if (entity !== that && entity.collisionSize !== 0)
                    that.collide(entity);
            });
            this.bounceVelocity -= 2500 * this.game.clockTick;
            this.height += this.bounceVelocity * this.game.clockTick;
        }
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        let mousePos = this.game.getMousePosition();
        if (mousePos.x > this.x - 8 && mousePos.x < this.x + 8 && mousePos.y > this.y - 12 && mousePos.y < this.y + 4 && Input.frameKeys["KeyE"]) {
            if (this.withinPlayerRange()) {
                let inventory = this.game.globalEntities.get("inventoryMenu");
                // Delete this pickup off the ground if it was successfully added to the inventory.
                if (inventory.addItem(this.associatedItem)) {
                    this.removeFromWorld = true;
                    // This is a hacky solution, but it prevents the player from attacking or mining while we
                    // pick up this item.
                    Input.mousedown = false;
                    Input.rightClick = false;
                }
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 8, 32, 16);
        this.spritesheet.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 56 - this.height, 1);
        let mousePos = this.game.getMousePosition();
        if (mousePos.x > this.x - 8 && mousePos.x < this.x + 8 && mousePos.y > this.y - 12 && mousePos.y < this.y + 4) {
            if (this.withinPlayerRange()) {
                this.game.tooltipArray = this.associatedItem.getTooltip().splice(0, 1).concat([{
                        text: "Press [E] to pick up.",
                        fontSize: 12
                    }]);
            }
            else {
                this.game.tooltipArray = this.associatedItem.getTooltip().splice(0, 1);
            }
        }
    }
    /**
     * Run a collision check between this entity and another entity.
     * Assumes that the other entity has a set collisionSize variable.
     * @param other The gameEntity we want to collide with.
     */
    collide(other) {
        var that = this;
        var thisPosition = new Vector2(this.x, this.y);
        var magnitude = thisPosition.isoMagnitude(new Vector2(other.x, other.y));
        if (magnitude < this.collisionSize + other.collisionSize) {
            // Other dropped items will push each other.
            if (other instanceof DroppedItem) {
                let point = new Vector2(other.x - this.x, other.y - this.y).normalized();
                this.velocity = this.velocity.minus(point.scale(8));
            }
            else if (other instanceof StoneBlock) { // Stone blocks prevent us from passing through them.
                var line;
                var vector = new Vector2(other.x - this.x, other.y - this.y);
                if (vector.x > 0) {
                    if (vector.y > 0) { // Bottom right-facing vector
                        line = new Vector2(0.5, 0.866025); // Approximate to (1/2, sqrt(3)/2)
                    }
                    else { // Top right-facing
                        line = new Vector2(0.5, -0.866025);
                    }
                }
                else { // Left-facing
                    if (vector.y > 0) { // Bottom left-facing vector
                        line = new Vector2(-0.5, 0.866025); // Approximate to (1/2, sqrt(3)/2)
                    }
                    else { // Top left-facing
                        line = new Vector2(-0.5, -0.866025);
                    }
                }
                magnitude = Math.abs(magnitude - (this.collisionSize + other.collisionSize));
                this.x -= line.scale(magnitude).x;
                this.y -= line.scale(magnitude).y;
            }
        }
    }
    withinPlayerRange() {
        let player = this.game.globalEntities.get("hero");
        return Math.abs(this.x - player.x) < 64 && Math.abs(this.y - player.y) < 32;
    }
}
//# sourceMappingURL=droppedItem.js.map