export function createHeader() {
    const header = document.createElement('h2');
    header.textContent = 'Holidays in India';
    header.style.textTransform = 'uppercase';
    header.style.display = "flex";
    header.style.justifyContent ="center";
    header.style.paddingBottom = "10px";
    return header;
  }