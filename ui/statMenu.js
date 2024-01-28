class StatMenu extends HudEntity {
    menuVisible;
    statNames = ["Integrity", "Battery", "Power", "Reflex"];
    backgroundSprite;
    player;
    /** Child entities that belong to this entity. */
    children;
    constructor(x, y) {
        super(x, y);
        this.menuVisible = false;
        this.backgroundSprite = ASSET_MANAGER.getAsset("./sprites/ui/menu_stats.png");
        this.children = [];
        let tooltipTexts = ["Increases maximum HP.", "Increases maximum EP.", "Increases attack damage.", "Increases recharge speed for skills and dodging."];
        for (let i = 0; i < 4; i++) {
            this.children.push(new HudButton(30, 128 + i * 48, 32, 32));
            this.children[i].tooltipArray = [{
                    text: tooltipTexts[i],
                    fontSize: 12
                }];
        }
    }
    initialize(hero) {
        this.player = hero;
        this.children[0].onClicked = () => {
            if (this.player.statPoints > 0) {
                this.player.baseIntegrity++;
                this.player.health += 2;
                this.player.statPoints--;
            }
        };
        this.children[1].onClicked = () => {
            if (this.player.statPoints > 0) {
                this.player.baseBattery++;
                this.player.energy += 2;
                this.player.statPoints--;
            }
        };
        this.children[2].onClicked = () => {
            if (this.player.statPoints > 0) {
                this.player.basePower++;
                this.player.statPoints--;
            }
        };
        this.children[3].onClicked = () => {
            if (this.player.statPoints > 0) {
                this.player.baseReflex++;
                this.player.statPoints--;
            }
        };
    }
    update() {
        // Toggle the menu visibility if the `C` key is pressed.
        if (Input.frameKeys["KeyC"]) {
            this.menuVisible = !this.menuVisible;
        }
        if (this.menuVisible) {
            if (Input.mouse.x < 300) {
                this.children.forEach((element) => {
                    element.update();
                });
                Input.mousedown = false;
                Input.leftClick = false;
            }
        }
    }
    draw(ctx) {
        if (this.menuVisible) {
            // Draw the background first
            ctx.drawImage(this.backgroundSprite, 0, 0);
            this.children.forEach((element) => {
                element.draw(ctx, this.player.statPoints > 0);
            });
            ctx.fillStyle = "white";
            ctx.font = "bold 12px monospace";
            ctx.textAlign = "left";
            for (let i = 0; i < 4; i++) {
                ctx.fillText(this.statNames[i], 70, 140 + i * 48);
            }
            ctx.fillText(this.player.baseIntegrity.toString(), 70, 152);
            ctx.fillText(this.player.baseBattery.toString(), 70, 200);
            ctx.fillText(this.player.basePower.toString(), 70, 248);
            ctx.fillText(this.player.baseReflex.toString(), 70, 296);
            ctx.fillText("Stat points available: " + this.player.statPoints, 30, 112);
        }
    }
}
//# sourceMappingURL=statMenu.js.map