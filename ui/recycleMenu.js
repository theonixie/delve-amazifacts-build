class RecycleMenu extends HudEntity {
    menuVisible;
    selectedItem;
    slot1;
    slot2;
    result;
    backgroundSprite;
    constructor(game, x, y) {
        super(game, x, y);
        this.backgroundSprite = ASSET_MANAGER.getAsset("./sprites/ui/menu_recycle.png");
        this.slot1 = null;
        this.slot2 = null;
        this.result = null;
        this.selectedItem = game.globalEntities.get("selectedItem");
    }
    update() {
        if ((Input.frameKeys["KeyC"] || Input.frameKeys["KeyI"]) && this.menuVisible) {
            this.menuVisible = false;
            this.game.globalEntities.get("inventoryMenu").menuVisible = false;
        }
        if (this.menuVisible) {
            if (Input.mouse.x < 300) {
                if (Input.leftClick) {
                    if (this.hoveringSlot1()) {
                        if (this.selectedItem.item !== null && this.selectedItem.item instanceof Weapon && this.slot1 === null) {
                            this.slot1 = this.selectedItem.item;
                            this.selectedItem.item = null;
                            if (this.slot2 !== null) {
                                this.recycleItems();
                            }
                        }
                        else if (this.selectedItem.item === null && this.slot1 !== null) {
                            this.selectedItem.item = this.slot1;
                            this.slot1 = null;
                            this.result = null;
                        }
                    }
                    if (this.hoveringSlot2()) {
                        if (this.selectedItem.item !== null && this.selectedItem.item instanceof Weapon && this.slot2 === null) {
                            this.slot2 = this.selectedItem.item;
                            this.selectedItem.item = null;
                            if (this.slot1 !== null) {
                                this.recycleItems();
                            }
                        }
                        else if (this.selectedItem.item === null && this.slot2 !== null) {
                            this.selectedItem.item = this.slot2;
                            this.slot2 = null;
                            this.result = null;
                        }
                    }
                    if (this.hoveringResult()) {
                        if (this.selectedItem.item === null && this.result !== null) {
                            this.selectedItem.item = this.result;
                            this.result = null;
                            this.slot1 = null;
                            this.slot2 = null;
                        }
                    }
                }
            }
        }
    }
    draw(ctx) {
        if (this.menuVisible) {
            // Draw the background first
            ctx.drawImage(this.backgroundSprite, 0, 0);
            ctx.fillStyle = "black";
            ctx.fillRect(32, 32, 48, 72);
            ctx.fillRect(32, 128, 48, 72);
            ctx.fillRect(32, 224, 48, 72);
            if (this.slot1 !== null) {
                ctx.drawImage(this.slot1.sprite, 32, 32);
                if (this.hoveringSlot1()) {
                    this.game.tooltipArray = this.slot1.getTooltip();
                }
            }
            if (this.slot2 !== null) {
                ctx.drawImage(this.slot2.sprite, 32, 128);
                if (this.hoveringSlot2()) {
                    this.game.tooltipArray = this.slot2.getTooltip();
                }
            }
            if (this.result !== null) {
                ctx.drawImage(this.result.sprite, 32, 224);
                if (this.hoveringResult()) {
                    this.game.tooltipArray = this.result.getTooltip();
                }
            }
        }
    }
    recycleItems() {
        let newItem = new Weapon(2, 4, 1, 3, ASSET_MANAGER.getAsset("./sprites/icon/sword0.png"));
        let chosenModifiers1 = [...this.slot1.modifiers].sort((a, b) => { return Math.random() - 0.5; });
        let chosenModifiers2 = [...this.slot2.modifiers].sort((a, b) => { return Math.random() - 0.5; });
        let maxModifiers1 = Math.ceil(chosenModifiers1.length * 0.75);
        let maxModifiers2 = Math.ceil(chosenModifiers2.length * 0.75);
        chosenModifiers1.splice(maxModifiers1, chosenModifiers1.length - maxModifiers1);
        chosenModifiers2.splice(maxModifiers2, chosenModifiers2.length - maxModifiers2);
        let resultModifiers = [];
        // Clone all of the modifiers, that way we don't accidentally modify the original weapon.
        for (let i = 0; i < maxModifiers1; i++) {
            // Why does this work
            resultModifiers.push(Object.create(chosenModifiers1[i]));
            resultModifiers[i].setRank(Math.ceil(resultModifiers[i].rank * 0.75));
        }
        // Go through the second weapon's chosen modifiers, either increasing the stat of
        // a modifier already in the first weapon's chosen set, OR pushing it to the end if
        // its not on the weapon already.
        for (let i = 0; i < maxModifiers2; i++) {
            let matchFound = false;
            for (let j = 0; j < maxModifiers1; j++) {
                // Check if this modifier exists on both objects. If not, then 
                if (resultModifiers[j].constructor === chosenModifiers2[i].constructor) {
                    resultModifiers[j].setRank(resultModifiers[j].rank + chosenModifiers2[i].rank);
                    matchFound = true;
                }
            }
            if (!matchFound) {
                // Not also on first modifier list, so push it to end.
                resultModifiers.push(chosenModifiers2[i]);
            }
        }
        newItem.modifiers = resultModifiers;
        this.result = newItem;
    }
    hoveringSlot1() {
        return (Input.mouse.x > 32 && Input.mouse.x < 32 + 48 && Input.mouse.y > 32 && Input.mouse.y < 32 + 72);
    }
    hoveringSlot2() {
        return (Input.mouse.x > 32 && Input.mouse.x < 32 + 48 && Input.mouse.y > 128 && Input.mouse.y < 128 + 72);
    }
    hoveringResult() {
        return (Input.mouse.x > 32 && Input.mouse.x < 32 + 48 && Input.mouse.y > 224 && Input.mouse.y < 224 + 72);
    }
}
//# sourceMappingURL=recycleMenu.js.map