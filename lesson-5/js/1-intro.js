async function startProgram() {

    setMainLed(getRandomColor());

    await scrollMatrixText("Hello World!", getRandomColor(), 24, false)

    await roll(0,30,2);

    exitProgram();


}
w