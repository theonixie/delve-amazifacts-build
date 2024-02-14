// A class representing a node graph that is a finite state machine
// ment to be used to organize enemy and player logic into composable flows
// that are reliable, composable, and reusable.
class FSM {
    before;
    after;
    currentNode;
    lastActionNode;
    constructor(nodeTree, before, after) {
        this.currentNode = nodeTree;
        this.before = before ?? function () { };
        this.after = after ?? function () { };
    }
    update() {
        this.lastActionNode = undefined;
        this.before();
        // Run nodes until we were just on an action
        // Will traverse the graph until the ai does something, guarranteed one action per run of update.
        // Also saves the last action node, so even if the action just ran for one frame, we will know what it was
        // for the purposes of running animations.
        while (this.lastActionNode == undefined) {
            if (this.currentNode.action) {
                this.lastActionNode = this.currentNode;
            }
            this.currentNode.process();
            this.currentNode = this.currentNode.next;
        }
        this.after();
    }
}
class ProcessNode {
    // Not really necessary for function, but makes debugging way easier
    name;
    do;
    process = function () {
        this.do();
    };
    reset = () => { };
    next;
    action = false;
    constructor(action, name) {
        this.do = action;
        this.name = name;
    }
}
class DecisionNode extends ProcessNode {
    yes;
    no;
    constructor(decision, name) {
        super(function () {
            if (decision()) {
                this.next = this.yes;
            }
            else {
                this.next = this.no;
            }
        }, name);
    }
}
class MultiDecisionNode extends ProcessNode {
    nodes;
    constructor(decision, name) {
        super(function () {
            this.next = this.nodes[decision()];
        }, name);
    }
}
class ActionNode extends ProcessNode {
    constructor(action, state, name) {
        super(action, name);
        this.state = state;
    }
    process = function () {
        if (this.isFirstFrame) {
            this.eventualNext = this.next;
            this.next = this;
            this.setup && this.setup();
        }
        // If the action returns false, or the animation is done, stop the action.
        // If there is no animation, and the action returned something other than false, it should continue
        if ((this.do && this.do() != true) || (this.animation && this.animation.isDone())) {
            this.takedown && this.takedown();
            this.next = this.eventualNext;
            this.isFirstFrame = true;
        }
        else {
            this.isFirstFrame = false;
        }
    };
    action = true;
    setup;
    takedown;
    isFirstFrame = true;
    eventualNext;
    state;
    animation;
}
//# sourceMappingURL=fsm.js.map