
//this shuffle method uses the Fisher-Yates algorithm
//https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj

export const shuffle = (array) => {
    let shuffledArray = array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[j];
      shuffledArray[j] = temp;
    }
    return shuffledArray
  }