class Weapon extends Item {
    damageMin; // Minimum damage dealt per hit.
    damageMax; // Maximum damage dealt per hit.
    // Constructs a new weapon.
    constructor(dMin, dMax, w, h, s) {
        super(1, 2);
        this.damageMin = dMin;
        this.damageMax = dMax;
        this.width = w;
        this.height = h;
        this.sprite = s;
    }
    getTooltip() {
        let tooltipArray = [];
        tooltipArray.push({
            text: "Test Weapon",
            fontSize: 16
        });
        tooltipArray.push({
            text: this.damageMin + "-" + this.damageMax + " damage per hit",
            fontSize: 12
        });
        if (this.modifiers !== null) {
            this.modifiers.forEach((element) => {
                tooltipArray.push(element.tooltip);
            });
        }
        return tooltipArray;
    }
}
//# sourceMappingURL=weapon.js.map