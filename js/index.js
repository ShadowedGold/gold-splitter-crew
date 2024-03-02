var playerCount = 5;
var crewCut = 20;
var currencyArr = ["gold", "silver", "copper", "electrum", "platinum"];
var resultCurrencyArr = ["platinum", "gold", "silver", "copper"];

currencyArr.forEach(cur => {
  window[cur] = 0;
});

resultCurrencyArr.forEach((cur, i) => {
  resultCurrencyArr[i] = {name: cur, shorthand: cur[0]+"p"};
});

function createLabel(name, parentEl) {
  let label = document.createElement('div');
  label.innerHTML = name[0].toUpperCase() + name.substring(1);
  label.classList.add("label");
  parentEl.appendChild(label);
}

function createInput(inputName, parentEl, type, defaultValue = 0) {
  // inputHolder
  let inputHolder = document.createElement('div');
  inputHolder.classList.add("inputHolder");

  switch (type) {
    case "field":
      // label
      createLabel(inputName, inputHolder);

      // field
      let field = document.createElement('INPUT');
      field.defaultValue = defaultValue;
      field.type = "number";
      field.classList.add("field");
      let id = inputName.replaceAll(" ", "").replace("%", "");
      field.id = id[0].toLowerCase() + id.substring(1);
      field.onblur = () => {
        if (field.value == '') {
          if (field.id == "playerCount") field.value = 2;
          else field.value = 0;
        }
      }
      inputHolder.appendChild(field);
      break;
    case "button":
      // btn
      let btn = document.createElement('button');
      btn.innerText = inputName;
      btn.classList.add("btn");
      btn.onclick = () => {
        currencyArr.forEach(cur => {
          window[cur] = parseFloat(document.getElementById(cur).value);
        });

        playerCount = parseInt(document.getElementById("playerCount").value);
        crewCut = parseInt(document.getElementById("crewCut").value);

        results.innerHTML = formatResults(divideCurrency());
      }
      inputHolder.appendChild(btn);
      break;
  }
  
  parentEl.appendChild(inputHolder);
}

function divideCurrency() {
  let totalCopper = (gold*100) +
                    (silver*10) +
                    copper +
                    (electrum*50) +
                    (platinum*1000);

  // take crew cut
  totalCopper = Math.sign(totalCopper)*(Math.floor(Math.abs(totalCopper)*((100-crewCut)/100)));

  let dividedCopper = Math.sign(totalCopper)*(Math.floor(Math.abs(totalCopper)/playerCount));
  let remainingCopper = Math.sign(totalCopper)*(Math.abs(totalCopper)%playerCount);

  return [dividedCopper, remainingCopper];
}

function formatResults(dividedCurs) {
  function splitNumIntoArray(amount) {
    return String(Math.abs(amount)).split(/(\d*(?=\d{3}))?(\d?(?=\d{2}))?(\d?(?=\d{1}))?(\d?$)?/).filter(Boolean).map((num)=>{
      return Math.sign(amount)*Number(num);
    });
  }

  function getResultStr(copperArr) {
    let str = "";

    copperArr.forEach((digit, i) => {
      if (digit != 0) {
        let resultCurrencyIndex = resultCurrencyArr.length - copperArr.length + i;
        if (str.slice(-1) == "p") str += " , ";
        str += "<span>"+(digit)+"</span>"+resultCurrencyArr[resultCurrencyIndex].shorthand;
      }
    });

    return str;
  }

  return  "<div class=\"result\">"+
            "<span class=\"label\">Each player gets</span>"+
            "<span class=\"amount\">"+getResultStr(splitNumIntoArray(dividedCurs[0]))+"</span>"+
          "</div>"+
          ((dividedCurs[1] > 0)?
          "<div class=\"result\">"+
            "<span class=\"label\">Indivisible currency</span>"+
            "<span class=\"amount\">"+getResultStr(splitNumIntoArray(dividedCurs[1]))+"</span>"+
          "</div>":
          "");
}

/* -- major containers ------------------------------------------------ */

// outer
let outer = document.createElement('div');
outer.classList.add("outer");

// inner
let inner = document.createElement('div');
inner.classList.add("inner");

// currencyHolder
let currencyHolder = document.createElement('div');
currencyHolder.classList.add("currencyHolder");
currencyArr.forEach(currency => {
  createInput(currency, currencyHolder, "field", window[currency]);
});
inner.appendChild(currencyHolder);

// partyHolder
let partyHolder = document.createElement('div');
partyHolder.classList.add("partyHolder");
createInput("Player Count", partyHolder, "field", playerCount);
createInput("Crew Cut %", partyHolder, "field", crewCut);
createInput("Calculate", partyHolder, "button");

inner.appendChild(partyHolder);

// results
let results = document.createElement('div');
results.innerHTML = "";
results.classList.add("results");
inner.appendChild(results);

/* -- finishing ------------------------------------------------------- */

// close outer
outer.appendChild(inner);
document.body.appendChild(outer);