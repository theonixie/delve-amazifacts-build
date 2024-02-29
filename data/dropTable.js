class DropTable {
    table;
    overallWeight;
    length;
    constructor() {
        this.table = [];
        this.overallWeight = 0;
        this.length = 0;
    }
    add(item, quantity = 1, weight = 1) {
        this.length += 1;
        this.overallWeight += weight;
        this.table.push({ item, weight, quantity });
    }
    roll(quantity = 1) {
        let itemdrops = [];
        for (let i = 0; i < quantity; i++) {
            const randomWeightRoll = Math.random() * this.overallWeight;
            console.log("overall weight " + randomWeightRoll);
            let result = -1;
            let weight = 0;
            for (let j = 0; j < this.table.length; j++) {
                weight += this.table[j].weight;
                console.log(weight);
                if (randomWeightRoll <= weight) {
                    result = j;
                    break;
                }
            }
            itemdrops.push(this.table[result].item);
        }
        return itemdrops;
    }
}
//# sourceMappingURL=dropTable.js.map