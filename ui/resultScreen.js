class ResultScreen extends HudEntity {
    constructor(x, y) {
        super(x, y);
        //this.titleSprite = ASSET_MANAGER.getAsset("./sprites/ui/title.png");
    }
    update() {
        if (Input.frameKeys["Enter"]) {
            this.removeFromWorld = true;
        }
    }
    draw(ctx) {
        // if(this.hoveringStartButton()) {
        //     ctx.fillStyle = "black";
        //     ctx.fillRect(200, 200, 200, 50);
        // } 
        // else if(this.hoveringCreditsButton()) {
        //     ctx.fillStyle = "black";
        //     ctx.fillRect(200, 275, 200, 50);
        // }
        // ctx.drawImage(this.titleSprite, 0, 0);
        // if(this.showCredits) {
        //     ctx.fillStyle = "black";
        //     ctx.fillRect(125, 25, 350, 150);
        //     ctx.fillStyle = "white";
        //     ctx.font = "12px monospace";
        //     ctx.fillText("Created by:", 130, 40);
        //     ctx.fillText("- Elias Peterson", 130, 60);
        //     ctx.fillText("- Matt Bauchspies", 130, 80);
        //     ctx.fillText("- Rosemary Roach", 130, 100);
        //     ctx.fillText("Made in 2024 for TCSS 491", 130, 120);
        // }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 600, 400);
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.font = "12px monospace";
        let timeTotal = gameEngine.timeElapsed;
        let hours = Math.floor(timeTotal / 3600);
        timeTotal %= 3600;
        let minutes = Math.floor(timeTotal / 60);
        timeTotal %= 60;
        timeTotal = Math.floor(timeTotal);
        let totalScore = 0;
        ctx.fillText("Simulation ended successfully in " + (hours > 0 ? hours.toString() + "h " : "") + (minutes > 0 ? minutes.toString() + "m " : "") + (timeTotal > 0 ? timeTotal.toString() + "s" : ""), 8, 16);
        ctx.fillText("Performance Evaluation", 8, 32);
        ctx.fillText("- Experience Collected: " + gameEngine.globalEntities.get("hero").experiencePoints.toString() + " x 10 = " + (gameEngine.globalEntities.get("hero").experiencePoints * 10).toString() + "pts.", 8, 48);
        totalScore += gameEngine.globalEntities.get("hero").experiencePoints * 10;
        ctx.fillText("- Enemies Defeated: " + gameEngine.enemiesDefeated.toString() + " x 100 = " + (gameEngine.enemiesDefeated * 100).toString() + "pts.", 8, 64);
        totalScore += gameEngine.enemiesDefeated * 100;
        ctx.fillText("- Time Bonus: (900 - " + Math.floor(gameEngine.timeElapsed).toString() + ") x 10 = " + Math.max(((900 - Math.floor(gameEngine.timeElapsed)) * 10), 0).toString() + "pts.", 8, 80);
        totalScore += Math.max(((900 - Math.floor(gameEngine.timeElapsed)) * 10), 0);
        // Add more score bonuses here...
        ctx.fillText("Overall fitness: " + totalScore.toString() + "pts.", 8, 112);
        ctx.fillText("Press [ENTER] to continue...", 8, 128);
    }
}
//# sourceMappingURL=resultScreen.js.map