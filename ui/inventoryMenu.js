class InventoryMenu extends HudEntity {
    /** Width of the inventory grid. */
    width = 10;
    /** Height of the inventory grid. */
    height = 6;
    menuVisible;
    backgroundSprite;
    /** The item currently held by the mouse, when the player clicks on something.
     *  Set to null when nothing is selected.
     */
    selectedItem;
    player;
    inventoryItems;
    constructor(game, x, y) {
        super(game, x, y);
        // // The inventory is loaded before the player. If we do this in the constructor, it will crash.
        //this.player = this.game.globalEntities.get("hero");
        this.menuVisible = false;
        this.backgroundSprite = ASSET_MANAGER.getAsset("./sprites/ui/menu_inventory.png");
        this.selectedItem = game.globalEntities.get("selectedItem");
        this.inventoryItems = [];
    }
    update() {
        // Toggle the menu visibility if the `I` key is pressed.
        if (Input.frameKeys["KeyI"]) {
            this.menuVisible = !this.menuVisible;
        }
        // If the inventory is visible...
        if (this.menuVisible) {
            if (Input.mouse.x > 300) {
                if (Input.leftClick) {
                    if (this.hoveringEquippedWeapon()) {
                        if (this.selectedItem.item === null && this.player.heldWeapon !== null) {
                            this.selectedItem.item = this.player.heldWeapon;
                            this.player.unequipWeapon();
                        }
                        else if (this.selectedItem.item instanceof Weapon) {
                            if (this.player.heldWeapon === null) {
                                this.player.equipWeapon(this.selectedItem.item);
                                this.selectedItem.item = null;
                            }
                        }
                    }
                    else if (this.hoveringEquippedStemkit()) {
                        if (this.selectedItem.item === null && this.player.heldStemkit !== null) {
                            this.selectedItem.item = this.player.heldStemkit;
                            this.player.heldStemkit = null;
                        }
                        else if (this.selectedItem.item instanceof Stemkit) {
                            if (this.player.heldStemkit === null) {
                                this.player.heldStemkit = this.selectedItem.item;
                                this.selectedItem.item = null;
                            }
                        }
                    }
                    else if (this.hoveringEquippedSkill() !== -1) {
                        let skill = this.hoveringEquippedSkill();
                        if (this.selectedItem.item === null && this.player.heldSkills[skill] !== null) {
                            this.selectedItem.item = this.player.heldSkills[skill];
                            this.player.heldSkills[skill] = null;
                        }
                        else if (this.selectedItem.item instanceof Skill) {
                            if (this.player.heldSkills[skill] === null) {
                                this.player.heldSkills[skill] = this.selectedItem.item;
                                this.selectedItem.item = null;
                            }
                        }
                    }
                    else if (this.hoveringInventory()) {
                        if (this.selectedItem.item === null) {
                            let hoveredItem = this.getHoveredInventoryItem();
                            if (hoveredItem !== null) {
                                this.selectedItem.item = hoveredItem.associatedItem;
                                this.inventoryItems.splice(this.inventoryItems.indexOf(hoveredItem), 1);
                            }
                        }
                        else if (this.selectedItem.item !== null) {
                            let cellPosition = this.getHoveredInventoryCell();
                            let itemPosition = { x: cellPosition.x - Math.floor((this.selectedItem.item.width * 0.5) - 0.5), y: cellPosition.y - Math.floor(this.selectedItem.item.height * 0.5) };
                            if (cellPosition.x - Math.floor((this.selectedItem.item.width * 0.5) - 0.5) >= 0 && cellPosition.x + Math.floor(this.selectedItem.item.width * 0.5) < 10 && cellPosition.y - Math.floor(this.selectedItem.item.height * 0.5) >= 0 && cellPosition.y + Math.floor((this.selectedItem.item.height * 0.5) - 0.5) < 6) {
                                if (this.canPlaceItem(itemPosition.x, itemPosition.y, this.selectedItem.item)) {
                                    let newItem = new InventoryItem(itemPosition.x, itemPosition.y, this.selectedItem.item);
                                    this.inventoryItems.push(newItem);
                                    this.selectedItem.item = null;
                                }
                            }
                        }
                    }
                }
                // If we are right-clicking, we can quick-equip or quick-swap items.
                else if (Input.rightClick) {
                    if (this.selectedItem.item === null) {
                        if (this.hoveringInventory()) {
                            let hoveredItem = this.getHoveredInventoryItem();
                            // If it's a weapon, equip it / swap with equipped.
                            if (hoveredItem.associatedItem instanceof Weapon) {
                                let previousWeapon = this.player.heldWeapon;
                                if (this.player.heldWeapon !== null) {
                                    this.player.unequipWeapon();
                                }
                                this.player.equipWeapon(hoveredItem.associatedItem);
                                this.inventoryItems.splice(this.inventoryItems.indexOf(hoveredItem), 1);
                                if (previousWeapon !== null) {
                                    // If we can't add the item back to our inventory, drop it.
                                    if (!this.addItem(previousWeapon)) {
                                        this.game.addEntity(new DroppedItem(this.game, this.player.x, this.player.y, previousWeapon));
                                    }
                                }
                            }
                            else if (hoveredItem.associatedItem instanceof Skill) {
                                for (let i = 0; i < 4; i++) {
                                    if (this.player.heldSkills[i] === null) {
                                        this.player.heldSkills[i] = hoveredItem.associatedItem;
                                        break;
                                    }
                                }
                                this.inventoryItems.splice(this.inventoryItems.indexOf(hoveredItem), 1);
                            }
                        }
                    }
                }
                // This is a hacky solution, but it prevents the player from attacking or mining while we
                // are in the inventory menu.
                Input.mousedown = false;
                Input.leftClick = false;
                Input.rightClick = false;
            }
            else { // Mouse is not hovering right side of screen.
                if (Input.leftClick) {
                    // If we are holding an item and the recycle menu isn't open, drop it.
                    if (this.selectedItem.item !== null && !this.game.globalEntities.get("recycleMenu").menuVisible) {
                        this.game.addEntity(new DroppedItem(this.game, this.player.x, this.player.y, this.selectedItem.item));
                        this.selectedItem.item = null;
                    }
                }
            }
        }
    }
    draw(ctx) {
        if (this.menuVisible) {
            // Draw the background first
            ctx.drawImage(this.backgroundSprite, 0, 0, 300, 400, 300, 0, 300, 400);
            // For testing, try drawing the player's weapon.
            // Only try drawing it if the player is holding a weapon.
            if (this.player.heldWeapon !== null) {
                // Center-align weapons that are 1 cell wide.
                ctx.drawImage(this.player.heldWeapon.sprite, 354 + (this.player.heldWeapon.width === 1 ? 12 : 0), 56);
            }
            // Only try drawing it if the player is holding a stemkit.
            if (this.player.heldStemkit !== null) {
                ctx.drawImage(this.player.heldStemkit.sprite, 430, 32);
            }
            for (let i = 0; i < 4; i++) {
                if (this.player.heldSkills[i] !== null) {
                    ctx.drawImage(this.player.heldSkills[i].sprite, 426 + (i * 32), 88);
                }
                if (this.hoveringEquippedSkill() !== -1) {
                    if (this.player.heldSkills[this.hoveringEquippedSkill()] !== null)
                        this.game.tooltipArray = (this.player.heldSkills[this.hoveringEquippedSkill()].getTooltip());
                }
            }
            this.inventoryItems.forEach((element) => {
                ctx.drawImage(element.associatedItem.sprite, element.x * 24 + 330, element.y * 24 + 160);
            });
            let hoveredItem = this.getHoveredInventoryItem();
            if (hoveredItem !== null) {
                this.game.tooltipArray = (hoveredItem.associatedItem.getTooltip());
            }
            if (this.player.heldWeapon !== null && this.hoveringEquippedWeapon()) {
                this.game.tooltipArray = (this.player.heldWeapon.getTooltip());
            }
            else if (this.player.heldStemkit !== null && this.hoveringEquippedStemkit()) {
                this.game.tooltipArray = (this.player.heldStemkit.getTooltip());
            }
        }
    }
    /** Returns true if the mouse is hovering over the equipped weapon slot. */
    hoveringEquippedWeapon() {
        return (Input.mouse.x > 354 && Input.mouse.x < 402 && Input.mouse.y > 56 && Input.mouse.y < 128);
    }
    /** Returns true if the mouse is hovering over the equipped stemkit slot. */
    hoveringEquippedStemkit() {
        return (Input.mouse.x > 430 && Input.mouse.x < 478 && Input.mouse.y > 32 && Input.mouse.y < 80);
    }
    /** Returns the equipped skill we are hovering over, or -1 if we aren't. */
    hoveringEquippedSkill() {
        // Leave early if we aren't even vertically aligned with the skill icons.
        if (Input.mouse.y < 88 || Input.mouse.y > 88 + 48) {
            return -1;
        }
        if (Input.mouse.x > 426 && Input.mouse.x < 426 + 24) {
            return 0;
        }
        else if (Input.mouse.x > 458 && Input.mouse.x < 458 + 24) {
            return 1;
        }
        else if (Input.mouse.x > 490 && Input.mouse.x < 490 + 24) {
            return 2;
        }
        else if (Input.mouse.x > 522 && Input.mouse.x < 522 + 24) {
            return 3;
        }
        // None matched, return -1.
        return -1;
    }
    /** Returns true if the mouse is hovering over the inventory menu */
    hoveringInventory() {
        return (Input.mouse.x > 330 && Input.mouse.x < 570 && Input.mouse.y > 160 && Input.mouse.y < 304);
    }
    /** Returns the XY cell coordinates for the cell highlighted by the mouse. */
    getHoveredInventoryCell() {
        return { x: Math.floor((Input.mouse.x - 330) / 24), y: Math.floor((Input.mouse.y - 160) / 24) };
    }
    /** Returns the item that the mouse is hovering over in the inventory, or null if there isn't one. */
    getHoveredInventoryItem() {
        let cellPosition = this.getHoveredInventoryCell();
        let result = null;
        this.inventoryItems.forEach((element) => {
            if (cellPosition.x >= element.x && cellPosition.x < element.x + element.associatedItem.width && cellPosition.y >= element.y && cellPosition.y < element.y + element.associatedItem.height) {
                result = element;
            }
        });
        return result;
    }
    /**
     * Returns the item at the specified position in the inventory.
     * If there isn't an item there, it returns null.
     */
    getItemAtPosition(xPos, yPos) {
        let cellPosition = { x: xPos, y: yPos };
        let result = null;
        this.inventoryItems.forEach((element) => {
            if (cellPosition.x >= element.x && cellPosition.x < element.x + element.associatedItem.width && cellPosition.y >= element.y && cellPosition.y < element.y + element.associatedItem.height) {
                result = element;
            }
        });
        return result;
    }
    /**
     * Adds the specified item to the player's inventory.
     * TODO: Make this avoid overlapping with other items.
     *
     * @returns true if the item was successfully added. False if otherwise.
     */
    addItem(item) {
        for (let y = 0; y <= this.height - item.height; y++) {
            for (let x = 0; x <= this.width - item.width; x++) {
                let validPosition = true;
                for (let itemX = x; itemX < x + item.width; itemX++) {
                    for (let itemY = y; itemY < y + item.height; itemY++) {
                        // If there is an item at this location, it is invalid.
                        if (this.getItemAtPosition(itemX, itemY) !== null) {
                            validPosition = false;
                        }
                    }
                }
                if (validPosition) {
                    let newItem = new InventoryItem(x, y, item);
                    this.inventoryItems.push(newItem);
                    return true;
                }
            }
        }
        // We left the loop without ever adding an item.
        return false;
    }
    canPlaceItem(x, y, item) {
        let validPosition = true;
        for (let itemX = x; itemX < x + item.width; itemX++) {
            for (let itemY = y; itemY < y + item.height; itemY++) {
                // If there is an item at this location, it is invalid.
                if (this.getItemAtPosition(itemX, itemY) !== null) {
                    validPosition = false;
                }
            }
        }
        return validPosition;
    }
}
/** Represents an item in the player's inventory. */
class InventoryItem {
    x;
    y;
    associatedItem;
    constructor(x, y, item) {
        this.x = x;
        this.y = y;
        this.associatedItem = item;
    }
}
//# sourceMappingURL=inventoryMenu.js.map