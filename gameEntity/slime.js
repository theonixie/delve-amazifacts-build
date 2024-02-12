class Slime extends Enemy {
    facingDirection;
    moveSpeed;
    attackTimer = 0;
    attackDelay = 0.5;
    standAnim;
    runAnim;
    attackSwingAnim;
    shadowSprite;
    path;
    currentWaypoint;
    target;
    targetDirection;
    lostTimer = 100;
    ai;
    constructor(x, y) {
        super(x, y);
        this.collisionSize = 8;
        this.health = 15;
        this.removeFromWorld = false;
        this.experiencePoints = 4;
        this.velocity = new Vector2(0, 0);
        this.facingDirection = 0;
        this.moveSpeed = 30;
        this.target = gameEngine.globalEntities.get("hero");
        //this.standSheet = ASSET_MANAGER.getAsset("./sprites/testCharacter.png");
        this.runAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/slime/walk.png"), 64, 64, 15, 0.08, false, true);
        this.standAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/slime/walk.png"), 64, 64, 1, 0.08, false, true);
        this.attackSwingAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/enemy/zombie/attack.png"), 64, 64, 8, 0.05, false, false);
        this.attackSwingAnim.elapsedTime = this.attackSwingAnim.totalTime; // Make the animation start in it's finished state.
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
        const createPath = new ProcessNode(this.usePath);
        const idle = new ActionNode(this.idle);
        const attacking = new ActionNode(this.doingAttack);
        attacking.time = this.attackDelay;
        attacking.setup = this.startingAttack;
        const walkingToTarget = new ActionNode(this.walkToTarget);
        const walkingToWaypoint = new ActionNode(this.walkToWaypoint);
        walkingToTarget.takedown = this.updateFacingDirection;
        walkingToWaypoint.takedown = this.updateFacingDirection;
        walkingToWaypoint.time = 0.1;
        const closeEnough = new DecisionNode(this.isCloseEnough);
        const directPath = new DecisionNode(this.directPathExists);
        const lostPlayer = new DecisionNode(this.hasLostPlayer);
        const waypointsRemaining = new DecisionNode(this.waypointsRemain);
        idle.next = directPath;
        directPath.yes = walkingToTarget;
        walkingToTarget.next = closeEnough;
        closeEnough.yes = attacking;
        attacking.next = closeEnough;
        closeEnough.no = directPath;
        directPath.no = lostPlayer;
        lostPlayer.yes = idle;
        lostPlayer.no = createPath;
        createPath.next = waypointsRemaining;
        waypointsRemaining.yes = walkingToWaypoint;
        walkingToWaypoint.next = directPath;
        waypointsRemaining.no = directPath;
        this.ai = new FSM(idle, this.before, this.after);
    }
    ;
    before = () => {
        this.targetDirection = new Vector2(this.target.x - this.x, this.target.y - this.y);
        this.lostTimer += gameEngine.clockTick;
    };
    after = () => {
        this.checkCollision();
        this.x += this.velocity.x * gameEngine.clockTick;
        this.y += this.velocity.y * gameEngine.clockTick;
    };
    idle = () => {
        this.velocity = new Vector2(0, 0);
    };
    usePath = () => {
        const ourPos = new Coordinate(this.x, this.y, true).toWorldPosition();
        const targetPos = new Coordinate(this.target.x, this.target.y, true).toWorldPosition();
        if (this.currentWaypoint == undefined && this.path != undefined && this.path.length != 0) {
            this.currentWaypoint = this.path.pop();
        }
        else if (this.path == undefined || this.path.length == 0) {
            const path = pathfind(ourPos, targetPos, gameEngine);
            if (!!path) {
                this.path = path;
                this.currentWaypoint = this.path.pop();
            }
        }
    };
    updateFacingDirection = () => {
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
        }
    };
    startingAttack = () => {
        this.attackSwingAnim.elapsedTime = 0;
        let attackDirection = this.targetDirection.normalized();
        let projectile = new Projectile(this.x + (attackDirection.x * 16), this.y + (attackDirection.y * 16), this, 0.05, 2);
        gameEngine.addEntity(projectile);
    };
    doingAttack = () => {
        this.velocity = new Vector2(0, 0);
    };
    walkToTarget = () => {
        this.velocity = this.targetDirection.normalized().scale(this.moveSpeed);
    };
    walkToWaypoint = () => {
        let entityDest = this.currentWaypoint.toEntityPosition();
        if (Math.round(entityDest.x / 16) == Math.round(this.x / 16) && Math.round(entityDest.y / 16) == Math.round(this.y / 16)) {
            this.currentWaypoint = undefined;
        }
        else {
            const nextPathDir = new Vector2(entityDest.x - this.x, entityDest.y - this.y);
            this.velocity = nextPathDir.normalized().scale(this.moveSpeed);
        }
        return this.waypointsRemain();
    };
    isCloseEnough = () => {
        return this.targetDirection.magnitude() <= 32;
    };
    directPathExists = () => {
        const ourPos = new Coordinate(this.x, this.y, true);
        const targetPos = new Coordinate(this.target.x, this.target.y, true);
        let pathIsClear = directPathIsClear(ourPos, targetPos, gameEngine);
        if (directLineIsClear(ourPos, targetPos)) {
            this.lostTimer = 0;
            this.path = undefined;
            this.currentWaypoint = undefined;
        }
        return pathIsClear;
    };
    hasLostPlayer = () => {
        return this.lostTimer >= 50;
    };
    waypointsRemain = () => {
        return !!this.path && !!this.currentWaypoint;
    };
    update = () => {
        this.ai.update();
    };
    // update() {
    //     if(this.attackSwingAnim.isDone()) {
    //         const targetDirection = new Vector2(this.target.x - this.x, this.target.y - this.y);
    //         if(targetDirection.magnitude() > 32){
    //             this.attackTimer = 0;
    //             // if path is not found and we don't have a direct line to the target, make path
    //             const ourPos = new Coordinate(this.x, this.y, true).toWorldPosition();
    //             const targetPos = new Coordinate(this.target.x, this.target.y, true).toWorldPosition();
    //             let pathIsClear = directPathIsClear(ourPos, targetPos, gameEngine)
    //             // If the coordinate is within 4 pixels of an x border, check the line from that box is clear too.
    //             if (this.x % 32 > 28) {
    //                 if (!directPathIsClear(new Coordinate(ourPos.x + 1, ourPos.y, true), targetPos, gameEngine)) {
    //                     pathIsClear = false;
    //                 }
    //             }
    //             if (this.x % 32 < 4) {
    //                 if (!directPathIsClear(new Coordinate(ourPos.x - 1, ourPos.y, true), targetPos, gameEngine)) {
    //                     pathIsClear = false;
    //                 }
    //             }
    //             if (this.y % 32 > 28) {
    //                 if (!directPathIsClear(new Coordinate(ourPos.x, ourPos.y + 1, true), targetPos, gameEngine)) {
    //                     pathIsClear = false;
    //                 }
    //             }
    //             if (this.y % 32 < 4) {
    //                 if (!directPathIsClear(new Coordinate(ourPos.x, ourPos.y - 1, true), targetPos, gameEngine)) {
    //                     pathIsClear = false;
    //                 }
    //             }
    //             if (pathIsClear) {
    //                 this.path = undefined;
    //                 this.velocity = targetDirection.normalized().scale(this.moveSpeed);
    //             } else {
    //             }
    //             // If we are moving, update the faciwang direction.
    //             if (this.velocity.x !== 0 || this.velocity.y !== 0) {
    //                 let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
    //                 this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
    //                 //console.log(this.facingDirection);
    //             }
    //         }
    //         else { // We are close enough to attack!
    //             this.velocity.x = 0;
    //             this.velocity.y = 0;
    //             this.attackTimer += gameEngine.clockTick;
    //             if(this.attackTimer > this.attackDelay) { // If the timer maxes out, reset it and attack.
    //                 this.attackTimer = 0;
    //                 this.attackSwingAnim.elapsedTime = 0;
    //                 let attackDirection = targetDirection.normalized();
    //                 let projectile = new Projectile(gameEngine, this.x + (attackDirection.x * 16), this.y + (attackDirection.y * 16), this, 0.05, 2);
    //                 gameEngine.addEntity(projectile);
    //             }
    //         }
    //     }
    //     else {
    //         this.velocity.x = 0;
    //         this.velocity.y = 0;
    //     }
    // };
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - gameEngine.camera.x - 16, this.y - gameEngine.camera.y - 8, 32, 16);
        const game = gameEngine;
        if (this.ai.lastActionNode?.do == this.doingAttack) {
            this.attackSwingAnim.drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - 24, this.y - gameEngine.camera.y - 40, 1, this.facingDirection);
        }
        else if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.runAnim.drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 40, 1, this.facingDirection);
        }
        else {
            this.standAnim.drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - 32, this.y - gameEngine.camera.y - 40, 1, this.facingDirection);
        }
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
            if (this.currentWaypoint != undefined) {
                ctx.strokeStyle = "purple";
                drawPoint(this.currentWaypoint.toEntityPosition().x, this.currentWaypoint.toEntityPosition().y);
            }
            ctx.strokeStyle = "red";
            drawPoint(this.x, this.y);
            if (this.path != undefined && this.path.length != 0) {
                for (let coord of this.path) {
                    coord = coord.toEntityPosition();
                    drawPoint(coord.x, coord.y);
                }
            }
        }
        function drawPoint(x, y) {
            ctx.beginPath();
            ctx.moveTo(x - game.camera.x, y - game.camera.y);
            ctx.ellipse(x - game.camera.x - 1, y - game.camera.y - 1, 2, 2, 0, 0, 0);
            ctx.stroke();
        }
    }
    ;
}
//# sourceMappingURL=slime.js.map