class Animator3D {
    spritesheet;
    reverse;
    loop;
    frameCount;
    duration;
    elapsedTime;
    totalTime;
    width;
    height;
    isFrameDuration;
    constructor(spritesheet, width, height, frameCount, duration, reverse, loop, isFrameDuration = true) {
        Object.assign(this, { spritesheet, reverse, loop });
        this.frameCount = frameCount;
        this.duration = duration;
        this.elapsedTime = 0;
        this.totalTime = isFrameDuration ? duration * frameCount : duration;
        this.width = width;
        this.height = height;
        this.isFrameDuration = isFrameDuration;
    }
    ;
    drawFrame(ctx, x, y, scale, facingDirection) {
        this.elapsedTime += gameEngine.clockTick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            }
            else {
                this.elapsedTime = this.totalTime;
            }
        }
        let frame = this.currentFrame();
        if (this.reverse)
            frame = this.frameCount - frame - 1;
        ctx.drawImage(this.spritesheet, frame * this.width, this.height * facingDirection, //source from sheet
        this.width, this.height, x, y, this.width * scale, this.height * scale);
        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Green';
        //     ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        // }
    }
    ;
    currentFrame() {
        // If the current frame goes beyond the final frame, limit it to the final frame.
        // Prevents situations where the game renders no animation for a single frame without
        // isDone() becoming true.
        if (this.isFrameDuration) {
            return Math.min(Math.floor(this.elapsedTime / this.duration), this.frameCount - 1);
        }
        else {
            return Math.min(Math.floor(this.elapsedTime / this.duration * this.frameCount), this.frameCount - 1);
        }
    }
    ;
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
    ;
    /** Stops this animation by setting its frame timer to the end of the animation. */
    stop() {
        this.elapsedTime = this.totalTime;
    }
}
;
//# sourceMappingURL=animator3D.js.map