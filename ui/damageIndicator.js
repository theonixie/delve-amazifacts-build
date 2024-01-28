/**
 * Entity used to draw damage indicators on the screen. NOTE: Uses world position, not screen position!
 */
class DamageIndicator extends HudEntity {
    /** The number to display as damage. */
    damageAmount;
    /** The velocity of this damage number. Used to make it fly off the target. */
    velocity;
    /** How long this indicator has existed. Slowly fades and then disappears after a set amount of time. */
    lifeTimer;
    constructor(x, y, damageAmount) {
        super(x, y);
        this.damageAmount = damageAmount;
        this.velocity = new Vector2(Math.random() * 24.0 - 12, -180);
        this.lifeTimer = 1;
    }
    update() {
        this.velocity.y += 250 * gameEngine.clockTick;
        this.x += this.velocity.x * gameEngine.clockTick;
        this.y += this.velocity.y * gameEngine.clockTick;
        this.lifeTimer -= gameEngine.clockTick;
        if (this.lifeTimer <= 0) {
            this.removeFromWorld = true;
        }
    }
    draw(ctx) {
        ctx.globalAlpha = this.lifeTimer + 0.5;
        ctx.font = "bold 12px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("-" + this.damageAmount, this.x - gameEngine.camera.x, this.y - gameEngine.camera.y);
        ctx.globalAlpha = 1;
    }
}
//# sourceMappingURL=damageIndicator.js.map