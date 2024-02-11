class HudButton extends HudEntity {
    width;
    height;
    onClicked;
    activeSprite;
    disabledSprite;
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.activeSprite = ASSET_MANAGER.getAsset("./sprites/ui/button_increase.png");
        this.disabledSprite = ASSET_MANAGER.getAsset("./sprites/ui/button_increase_disabled.png");
    }
    update() {
        if (Input.mouse.x > this.x && Input.mouse.x < this.x + this.width && Input.mouse.y > this.y && Input.mouse.y < this.y + this.height) {
            if (Input.leftClick) {
                console.log("button clicked");
                this.onClicked();
            }
        }
    }
    draw(ctx, enabled = true) {
        //ctx.fillStyle = "black";
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        if (enabled)
            ctx.drawImage(this.activeSprite, this.x, this.y);
        else
            ctx.drawImage(this.disabledSprite, this.x, this.y);
        if (Input.mouse.x > this.x && Input.mouse.x < this.x + this.width && Input.mouse.y > this.y && Input.mouse.y < this.y + this.height) {
            //console.log("Button tooltip");
            if (this.tooltipArray !== null)
                gameEngine.tooltipArray = this.tooltipArray;
        }
    }
}
//# sourceMappingURL=hudButton.js.map