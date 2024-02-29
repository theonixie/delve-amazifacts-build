/** Stores the data for a specific Stemkit, used to heal the player in combat. */
class Stemkit extends Item {
    healAmount; // How much a single stemkit use heals.
    capacity; // How many stempaks can be held at the same time.
    charges;
    constructor(hAmount, cap, s) {
        super(2, 2);
        this.healAmount = hAmount;
        this.capacity = this.charges = cap;
        this.sprite = s;
    }
    getTooltip() {
        let tooltipArray = [];
        tooltipArray.push({
            text: "Stemkit",
            fontSize: 16
        });
        tooltipArray.push({
            text: "Heals " + this.healAmount + "HP when used",
            fontSize: 12
        });
        tooltipArray.push({
            text: "Capacity: " + this.capacity,
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
//# sourceMappingURL=stemkit.js.map