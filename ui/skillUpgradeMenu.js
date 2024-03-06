class SkillUpgradeMenu extends HudEntity {
    menuVisible;
    selectedItem;
    slot1;
    slot2;
    upgradeButton;
    backgroundSprite;
    constructor(x, y) {
        super(x, y);
        // TODO: replace with a new sprite for this particular menu, unless we decide to reuse this
        this.backgroundSprite = ASSET_MANAGER.getAsset("./sprites/ui/menu_recycle.png");
        this.slot1 = null;
        this.slot2 = null;
        this.upgradeButton = new HudButton(64, 32, 32, 32);
        this.upgradeButton.tooltipArray = [{
                text: "Upgrade skill in slot 1.",
                fontSize: 12
            }];
        this.selectedItem = gameEngine.globalEntities.get("selectedItem");
    }
    update() {
        if ((Input.frameKeys["KeyC"] || Input.frameKeys["KeyI"]) && this.menuVisible) {
            this.menuVisible = false;
            gameEngine.globalEntities.get("inventoryMenu").menuVisible = false;
        }
        if (this.menuVisible) {
            if (Input.mouse.x < 300) {
                if (Input.leftClick) {
                    if (this.hoveringSlot1()) {
                        if (this.selectedItem.item !== null && this.selectedItem.item instanceof Skill && this.slot1 === null) {
                            this.slot1 = this.selectedItem.item;
                            this.selectedItem.item = null;
                        }
                        else if (this.selectedItem.item === null && this.slot1 !== null) {
                            this.selectedItem.item = this.slot1;
                            this.slot1 = null;
                        }
                    }
                    if (this.hoveringSlot2()) {
                        if (this.selectedItem.item !== null && this.selectedItem.item instanceof Skill && this.slot2 === null) {
                            this.slot2 = this.selectedItem.item;
                            this.selectedItem.item = null;
                        }
                        else if (this.selectedItem.item === null && this.slot2 !== null) {
                            this.selectedItem.item = this.slot2;
                            this.slot2 = null;
                        }
                    }
                }
            }
            this.upgradeButton.update();
        }
    }
    initialize() {
        this.upgradeButton.onClicked = () => {
            if (this.slot1 !== null && this.slot2 !== null) {
                // TODO: make this check for which perk tier we are upgrading
                // Only upgrade skill if both are same skill category
                if (this.slot1 instanceof Skill && this.slot2 instanceof Skill && this.slot1.skillCategory == this.slot2.skillCategory) {
                    this.upgradeSkill(this.slot1, 0);
                }
            }
        };
    }
    draw(ctx) {
        if (this.menuVisible) {
            // Draw the background first
            ctx.drawImage(this.backgroundSprite, 0, 0);
            ctx.fillStyle = "black";
            ctx.fillRect(32, 32, 24, 48);
            ctx.fillRect(32, 128, 24, 48);
            this.upgradeButton.draw(ctx);
            if (this.slot1 === null) {
                if (this.hoveringSlot1()) {
                    let tt = [{
                            text: "Place a skill here to upgrade it.",
                            fontSize: 12
                        },
                        {
                            text: "You must sacrifice a skill below with a matching category.",
                            fontSize: 12
                        }];
                    gameEngine.tooltipArray = tt;
                }
            }
            else {
                ctx.drawImage(this.slot1.sprite, 32, 32);
                if (this.hoveringSlot1()) {
                    gameEngine.tooltipArray = this.slot1.getTooltip();
                }
            }
            if (this.slot2 === null) {
                if (this.hoveringSlot2()) {
                    let tt = [{
                            text: "Place a skill here to sacrifice it.",
                            fontSize: 12
                        },
                        {
                            text: "It must match categories with the skill you're upgrading.",
                            fontSize: 12
                        }];
                    gameEngine.tooltipArray = tt;
                }
            }
            else {
                ctx.drawImage(this.slot2.sprite, 32, 128);
                if (this.hoveringSlot2()) {
                    gameEngine.tooltipArray = this.slot2.getTooltip();
                }
            }
        }
    }
    upgradeSkill(skill, tier) {
        if (tier < 5) {
            skill.tier += 1;
            this.slot2 = null;
        }
    }
    hoveringSlot1() {
        return (Input.mouse.x > 32 && Input.mouse.x < 32 + 24 && Input.mouse.y > 32 && Input.mouse.y < 32 + 48);
    }
    hoveringSlot2() {
        return (Input.mouse.x > 32 && Input.mouse.x < 32 + 24 && Input.mouse.y > 128 && Input.mouse.y < 128 + 48);
    }
}
//# sourceMappingURL=skillUpgradeMenu.js.map