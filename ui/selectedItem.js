class SelectedItem extends HudEntity {
    item;
    constructor(x, y) {
        super(x, y);
        this.item = null;
    }
    update() {
    }
    draw(ctx) {
        if (this.item !== null)
            ctx.drawImage(this.item.sprite, Input.mouse.x - this.item.width * 12, Input.mouse.y - this.item.height * 12);
    }
}
//# sourceMappingURL=selectedItem.js.map