class Hud extends HudEntity {
    hero;
    cave;
    resourceSpritesheet;
    hudSpritesheet;
    hudOverlaySpritesheet;
    backpackSpritesheet;
    constructor(game, x, y) {
        super(game, x, y);
        console.log("hud created");
        this.hero = game.globalEntities.get("hero");
        this.cave = game.globalEntities.get("cave");
        this.resourceSpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/resource_hud.png");
        this.hudSpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/hud_under.png");
        this.hudOverlaySpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/hud_over.png");
        this.backpackSpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/hud_backpack.png");
    }
    update() {
    }
    draw(ctx) {
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        for (let i = 0; i < 7; i++) {
            ctx.fillText(this.hero.heldResources[i + 1].toString(), 16, 12 + (i * 16));
        }
        ctx.drawImage(this.resourceSpritesheet, 0, 0, 16, 112, 0, 0, 16, 112);
        ctx.drawImage(this.hudSpritesheet, 0, 0, 600, 96, 0, 304, 600, 96);
        // Set the text style for the health and energy display.
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        // Draw the health bar. The width is based on how much health the player has left.
        ctx.fillStyle = "red";
        ctx.fillRect(204, 328, (this.hero.health / this.hero.maxHealth) * 96, 16);
        ctx.fillStyle = "white";
        ctx.fillText(this.hero.health.toString() + "/" + this.hero.maxHealth.toString(), 252, 340);
        // Draw the energy bar. The width is based on how much health the player has left.
        ctx.fillStyle = "blue";
        ctx.fillRect(300, 328, (this.hero.energy / this.hero.maxEnergy) * 96, 16);
        ctx.fillStyle = "white";
        ctx.fillText(this.hero.energy.toString() + "/" + this.hero.maxEnergy.toString(), 348, 340);
        // Draw the experience bar.
        ctx.fillStyle = "cyan";
        ctx.fillRect(204, 344, ((this.hero.experiencePoints - (this.hero.level * 100)) / 100) * 192, 8);
        for (let i = 0; i < 4; i++) {
            if (this.hero.heldSkills[i] !== null) {
                ctx.drawImage(this.hero.heldSkills[i].icon, 204 + (i * 48), 352);
                if (this.hero.heldSkills[i].cooldown !== 0 && this.hero.heldSkills[i].cooldownTimer > 0) {
                    ctx.fillStyle = "black";
                    ctx.globalAlpha = 0.4;
                    ctx.fillRect(204 + (i * 48), 352, 48, 48);
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(204 + (i * 48), 352, 48, (this.hero.heldSkills[i].cooldownTimer / this.hero.heldSkills[i].cooldown) * 48);
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = "white";
                    ctx.font = "bold 32px monospace";
                    ctx.fillText(Math.ceil(this.hero.heldSkills[i].cooldownTimer).toString(), 228 + (i * 48), 386);
                }
            }
        }
        ctx.drawImage(this.hudOverlaySpritesheet, 0, 0, 600, 96, 0, 304, 600, 96);
        if (this.game.inCave) {
            // Ideally prioritize drawing any important elements (such as entrance/exit/wall/ore)
            // Otherwise draws floor texture
            ctx.fillStyle = "white";
            ctx.globalAlpha = 0.8;
            let heropositionx = Math.floor((this.hero.x / 64) + ((this.hero.y + 16) / 32));
            let heropositiony = Math.floor(((this.hero.y + 16) / 32) - (this.hero.x / 64));
            // i is x axis, j is y axis adjustments
            for (let i = -19; i < 20; i++) {
                for (let j = -19; j < 20; j++) {
                    if (heropositionx + i >= 0 && heropositionx + i < 255 && heropositiony + j >= 0 && heropositiony + j < 255 &&
                        this.cave.grid[heropositionx + i][heropositiony + j] == 0) {
                        ctx.fillRect(516 + i * 2 - (j * 2), 47 + i + j, 2, 1);
                        ctx.fillRect(515 + i * 2 - (j * 2), 48 + i + j, 4, 1);
                        ctx.fillRect(516 + i * 2 - (j * 2), 49 + i + j, 2, 1);
                    }
                }
            }
            ctx.globalAlpha = 1.0;
        }
        // Draw the level number.
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(this.hero.level.toString(), 300, 335);
        if (this.hero.heldStemkit !== null) {
            ctx.fillText(this.hero.heldStemkit.charges.toString(), 180, 356);
        }
        if (Input.mouse.x > 826 && Input.mouse.x < 890 && Input.mouse.y > 702 && Input.mouse.y < 768) {
            this.game.drawTooltip([{ text: "Open Inventory", fontSize: 10 }]);
        }
    }
}
//# sourceMappingURL=hud.js.map