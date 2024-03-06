class ChasingNodes extends Behavior {
    actor;
    walkDelay;
    moveSpeed;
    lostDelay;
    path;
    currentWaypoint;
    lostTimer = 100;
    walkingTimer = 0;
    idle;
    walkingToTarget;
    walkingToWaypoint;
    directPath;
    lostPlayer;
    pathfind;
    walkTimerDone;
    constructor(actor, walkDelay, moveSpeed, lostDelay) {
        super();
        this.actor = actor;
        this.walkDelay = walkDelay;
        this.moveSpeed = moveSpeed;
        this.lostDelay = lostDelay;
        this.idle = new ActionNode(this.stop, State.STAND, "idle");
        this.walkingToTarget = new ActionNode(this.walkToTarget, State.WALK, "walk to target");
        this.walkingToWaypoint = new ActionNode(this.walkToWaypoint, State.WALK, "walk to waypoint");
        this.directPath = new DecisionNode(this.directPathExists, "direct path");
        this.lostPlayer = new DecisionNode(this.hasLostPlayer, "lost player");
        this.pathfind = new DecisionNode(this.usePath, "path");
        this.walkTimerDone = new DecisionNode(() => { return this.walkingTimer >= this.walkDelay; }, "walk timer done");
        this.idle.next = this.directPath;
        this.directPath.no = this.lostPlayer;
        this.lostPlayer.yes = this.idle;
        this.lostPlayer.no = this.pathfind;
        this.pathfind.yes = this.walkingToWaypoint;
        this.walkingToWaypoint.next = this.walkTimerDone;
        this.walkTimerDone.yes = this.directPath;
        this.walkTimerDone.no = this.walkingToWaypoint;
        this.pathfind.no = this.directPath;
        this.entryNode = this.walkingToTarget;
        this.walkingToTarget.next = this.directPath;
    }
    setExitNode = (node) => {
        this.directPath.yes = node;
    };
    before = () => {
        this.lostTimer += gameEngine.clockTick;
    };
    usePath = () => {
        this.walkingTimer = 0;
        const ourPos = new Coordinate(this.actor.x, this.actor.y, true).toWorldPosition();
        const targetPos = new Coordinate(this.actor.target.x, this.actor.target.y, true).toWorldPosition();
        if (this.currentWaypoint == undefined && this.path != undefined && this.path.length != 0) {
            this.currentWaypoint = this.path.pop();
        }
        else if (this.path == undefined || this.path.length == 0) {
            const path = pathfind(ourPos, targetPos);
            if (path == undefined) {
                this.lostTimer = 100;
                return false;
            }
            if (!!path) {
                this.path = path;
                this.currentWaypoint = this.path.pop();
            }
        }
        return true;
    };
    stop = () => {
        this.actor.velocity = new Vector2(0, 0);
    };
    walkToTarget = () => {
        this.actor.velocity = this.actor.targetDirection.normalized().scale(this.moveSpeed);
    };
    walkToWaypoint = () => {
        if (!this.currentWaypoint) {
            this.walkingTimer = this.walkDelay;
            return;
        }
        let entityDest = this.currentWaypoint.toEntityPosition();
        this.walkingTimer += gameEngine.clockTick;
        if (Math.round(entityDest.x / 16) == Math.round(this.actor.x / 16) && Math.round(entityDest.y / 16) == Math.round(this.actor.y / 16)) {
            this.currentWaypoint = undefined;
            // If we reached a waypoint, we need to run through pathfinding again to either pop the next waypoint or make a new path.
            this.walkingTimer = this.walkDelay;
        }
        else {
            const nextPathDir = new Vector2(entityDest.x - this.actor.x, entityDest.y - this.actor.y);
            this.actor.velocity = nextPathDir.normalized().scale(this.moveSpeed);
        }
    };
    directPathExists = () => {
        const ourPos = new Coordinate(this.actor.x, this.actor.y, true);
        const targetPos = new Coordinate(this.actor.target.x, this.actor.target.y, true);
        let pathIsClear = directPathIsClear(ourPos, targetPos);
        // This needs to be path rather than line because if there is a situation where
        // (a) the direct line is clear, but not the direct path
        // (b) pathfinder fails (either because too much distance or )
        if (pathIsClear) {
            this.lostTimer = 0;
            this.path = undefined;
            this.currentWaypoint = undefined;
        }
        return pathIsClear;
    };
    hasLostPlayer = () => {
        return this.lostTimer >= this.lostDelay;
    };
    waypointsRemain = () => {
        return !!this.path && !!this.currentWaypoint;
    };
    drawWaypoints = (ctx) => {
        if (this.currentWaypoint != undefined) {
            ctx.strokeStyle = "purple";
            drawPoint(ctx, this.currentWaypoint.toEntityPosition().x, this.currentWaypoint.toEntityPosition().y);
        }
        ctx.strokeStyle = "red";
        drawPoint(ctx, this.actor.x, this.actor.y);
        if (this.path != undefined && this.path.length != 0) {
            for (let coord of this.path) {
                coord = coord.toEntityPosition();
                drawPoint(ctx, coord.x, coord.y);
            }
        }
    };
}
//# sourceMappingURL=chasing.js.map