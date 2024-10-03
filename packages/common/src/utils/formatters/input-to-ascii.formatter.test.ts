// Copyright 2021 Prescryptive Health, Inc.

import { inputToASCIIFormatter } from './input-to-ascii.formatter';

const listOfNamesWithDiacritics = ['Renée', 'Noël', 'Sørina', 'Adrián', 'Zoë', 'François', 'Mary-Jo', 'Mónica', 'Seán', 'Mathéo', 'Ruairí', 'Mátyás', 'Jokūbas', 'John-Paul', 'Siân', 'Agnès', 'Maël', 'János', 'KŠthe', 'Chloë', 'Øyvind', 'Asbjørn', 'Fañch', 'José', 'Nuñez'];

describe('inputToASCIIFormatter', () => {
  it('simplifies accented characters', () => {
    const accentedInput = "Crème Brulée";
    const simplifiedInput = "Creme Brulee";

    expect(inputToASCIIFormatter(accentedInput)).toEqual(simplifiedInput);
  });
  it('simplies 25 most common names with diacritics', () => {
    listOfNamesWithDiacritics.map((currentName, currentIndex) => {
      const simplifiedName = inputToASCIIFormatter(currentName, true);
      
      if (currentIndex === 0) {
        expect(simplifiedName).toEqual('Renee');
      }
      else if (currentIndex === 1) {
        expect(simplifiedName).toEqual('Noel');
      }
      else if (currentIndex === 2) {
        expect(simplifiedName).toEqual('Sorina');
      }
      else if (currentIndex === 3) {
        expect(simplifiedName).toEqual('Adrian');
      }
      else if (currentIndex === 4) {
        expect(simplifiedName).toEqual('Zoe');
      }
      else if (currentIndex === 5) {
        expect(simplifiedName).toEqual('Francois');
      }
      else if (currentIndex === 6) {
        expect(simplifiedName).toEqual('Mary-Jo');
      }
      else if (currentIndex === 7) {
        expect(simplifiedName).toEqual('Monica');
      }
      else if (currentIndex === 8) {
        expect(simplifiedName).toEqual('Sean');
      }
      else if (currentIndex === 9) {
        expect(simplifiedName).toEqual('Matheo');
      }
      else if (currentIndex === 10) {
        expect(simplifiedName).toEqual('Ruairi');
      }
      else if (currentIndex === 11) {
        expect(simplifiedName).toEqual('Matyas');
      }
      else if (currentIndex === 12) {
        expect(simplifiedName).toEqual('Jokubas');
      }
      else if (currentIndex === 13) {
        expect(simplifiedName).toEqual('John-Paul');
      }
      else if (currentIndex === 14) {
        expect(simplifiedName).toEqual('Sian');
      }
      else if (currentIndex === 15) {
        expect(simplifiedName).toEqual('Agnes');
      }
      else if (currentIndex === 16) {
        expect(simplifiedName).toEqual('Mael');
      }
      else if (currentIndex === 17) {
        expect(simplifiedName).toEqual('Janos');
      }
      else if (currentIndex === 18) {
        expect(simplifiedName).toEqual('KSthe');
      }
      else if (currentIndex === 19) {
        expect(simplifiedName).toEqual('Chloe'); 
      }
      else if (currentIndex === 20) {
        expect(simplifiedName).toEqual('Oyvind');
      }
      else if (currentIndex === 21) {
        expect(simplifiedName).toEqual('Asbjorn');
      }
      else if (currentIndex === 22) {
        expect(simplifiedName).toEqual('Fanch');
      }
      else if (currentIndex === 23) {
        expect(simplifiedName).toEqual('Jose');
      }
      else if (currentIndex === 24) {
        expect(simplifiedName).toEqual('Nunez');
      }
    });
  });
  it('conditionally removed special characters from input', () => {
    const specialCharacterInput = 'SP3C!4L';

    expect(inputToASCIIFormatter(specialCharacterInput, true)).toEqual('SPCL');
    expect(inputToASCIIFormatter(specialCharacterInput, false)).toEqual('SP3C!4L');
  });
  it('retains the \'-\' character in each input', () => {
    const dashedInput = 'Dashed-Input';

    expect(inputToASCIIFormatter(dashedInput, true)).toEqual('Dashed-Input');
    expect(inputToASCIIFormatter(dashedInput, false)).toEqual('Dashed-Input');
  });
})