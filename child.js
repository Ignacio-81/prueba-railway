//function to get random numbers from 0 to 1000
const randomIntFromInterval = () => {
    return Math.floor(Math.random() * 1001);
};

//function to get rendom number with a quantity definition.
const getRandomNumber = (qty) => {

    const result = {}

    for (let i = 0; i < qty; i++) {

        const rNumber = randomIntFromInterval();
        result[rNumber] = result[rNumber] ? result[rNumber] + 1 : 1;

    }

    return result;

}

process.on("message", (qty) => {
    const response = getRandomNumber(qty);

    process.send(response)

})