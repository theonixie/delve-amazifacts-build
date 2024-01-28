class Hud extends HudEntity {
    hero;
    cave;
    hudSpritesheet;
    hudOverlaySpritesheet;
    backpackSpritesheet;
    constructor(x, y) {
        super(x, y);
        console.log("hud created");
        this.hero = gameEngine.globalEntities.get("hero");
        this.cave = gameEngine.globalEntities.get("cave");
        this.hudSpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/hud_under.png");
        this.hudOverlaySpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/hud_over.png");
        this.backpackSpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/hud_backpack.png");
    }
    update() {
    }
    draw(ctx) {
        ctx.drawImage(this.hudSpritesheet, 0, 0, 600, 96, 0, 304, 600, 96);
        // Set the text style for the health and energy display.
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        // Draw the health bar. The width is based on how much health the player has left.
        ctx.fillStyle = "red";
        ctx.fillRect(204, 328, (this.hero.health / this.hero.maxHealth) * 96, 16);
        ctx.fillStyle = "#aa0044";
        ctx.fillRect(204, 340, (this.hero.health / this.hero.maxHealth) * 96, 4);
        ctx.fillStyle = "black";
        ctx.fillText(this.hero.health.toString() + "/" + this.hero.maxHealth.toString(), 253, 342);
        ctx.fillStyle = "white";
        ctx.fillText(this.hero.health.toString() + "/" + this.hero.maxHealth.toString(), 252, 341);
        // Draw the energy bar. The width is based on how much health the player has left.
        ctx.fillStyle = "#2255ff";
        ctx.fillRect(396 - ((this.hero.energy / this.hero.maxEnergy) * 96), 328, (this.hero.energy / this.hero.maxEnergy) * 96, 16);
        ctx.fillStyle = "#220099";
        ctx.fillRect(396 - ((this.hero.energy / this.hero.maxEnergy) * 96), 340, (this.hero.energy / this.hero.maxEnergy) * 96, 4);
        ctx.fillStyle = "black";
        ctx.fillText(this.hero.energy.toString() + "/" + this.hero.maxEnergy.toString(), 349, 342);
        ctx.fillStyle = "white";
        ctx.fillText(this.hero.energy.toString() + "/" + this.hero.maxEnergy.toString(), 348, 341);
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
        // Draw the level number.
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(this.hero.level.toString(), 300, 335);
        ctx.font = "bold 16px monospace";
        if (this.hero.heldStemkit !== null) {
            ctx.fillText(this.hero.heldStemkit.charges.toString(), 278, 324);
        }
        if (Input.mouse.x > 826 && Input.mouse.x < 890 && Input.mouse.y > 702 && Input.mouse.y < 768) {
            gameEngine.drawTooltip([{ text: "Open Inventory", fontSize: 10 }]);
        }
    }
}
class MapDisplay extends HudEntity {
    hero;
    cave;
    resourceSpritesheet;
    constructor(x, y) {
        super(x, y);
        //this.hero = gameEngine.globalEntities.get("hero");
        //this.cave = gameEngine.globalEntities.get("cave");
        this.resourceSpritesheet = ASSET_MANAGER.getAsset("./sprites/ui/resource_hud.png");
    }
    draw(ctx) {
        ctx.drawImage(this.resourceSpritesheet, 0, 0, 16, 112, 0, 0, 16, 112);
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        for (let i = 0; i < 7; i++) {
            ctx.fillText(this.hero.heldResources[i + 1].toString(), 16, 12 + (i * 16));
        }
        if (gameEngine.inCave) {
            // Ideally prioritize drawing any important elements (such as entrance/exit/wall/ore)
            // Otherwise draws floor texture
            ctx.fillStyle = "white";
            ctx.globalAlpha = 0.8;
            ctx.lineWidth = 3;
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(517, 10);
            ctx.lineTo(593, 48);
            ctx.lineTo(517, 86);
            ctx.lineTo(441, 48);
            ctx.closePath();
            ctx.stroke();
            let heropositionx = Math.floor((this.hero.x / 64) + ((this.hero.y + 16) / 32));
            let heropositiony = Math.floor(((this.hero.y + 16) / 32) - (this.hero.x / 64));
            // i is x axis, j is y axis adjustments
            for (let i = -19; i < 20; i++) {
                for (let j = -19; j < 20; j++) {
                    if (heropositionx + i >= 0 && heropositionx + i < 255 && heropositiony + j >= 0 && heropositiony + j < 255 &&
                        this.cave.grid[heropositionx + i][heropositiony + j] == 0) {
                        if (heropositionx + i === 128 && heropositiony + j === 128) {
                            ctx.fillStyle = "green";
                        }
                        else {
                            ctx.fillStyle = "white";
                        }
                        ctx.fillRect(516 + (i * 2) - (j * 2), 47 + i + j, 2, 1);
                        ctx.fillRect(515 + (i * 2) - (j * 2), 48 + i + j, 4, 1);
                        ctx.fillRect(516 + (i * 2) - (j * 2), 49 + i + j, 2, 1);
                    }
                }
            }
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "cyan";
            ctx.fillRect(516, 47, 2, 2);
        }
    }
}
//# sourceMappingURL=hud.js.map