// Copyright 2021 Prescryptive Health, Inc.
var query = new URLSearchParams(document.location.search);

function parseReferralPharmacy() {
  const referral = query.get('ru');
  const referralUrl = referral ? "https://" + referral.replace('https://', '').replace(`${document.location.host}/`, '') : "";  
  const referralDomain = query.get('rd');
  if (referralUrl && referralDomain){
    const pharmacyLink = document.getElementsByClassName("referralPharmacy");
    for (let i = 0; i < pharmacyLink.length; i++) { 
      pharmacyLink[i].innerText = referralDomain;
      pharmacyLink[i].setAttribute("href", referralUrl);
      pharmacyLink[i].setAttribute("onclick", "");
    } 
  } 
}

function showSavingPricingModal() {
  document.getElementById('savingsModal').className = "modal";
}

function closeSavingPricingModal() {
  document.getElementById('savingsModal').className = "modal hidden";
}

function showPharmaciesModal() {
  document.getElementById('pharmaciesModal').className = "modal";
}

function closePharmaciesModal() {
  document.getElementById('pharmaciesModal').className = "modal hidden";
}

function getSavingsInformation() {
  try {
    fetch("/js/content.json").then(response => response.json()).then(data => {
      
      const title = document.getElementById("savingsModal").getElementsByClassName("header")[0].getElementsByTagName('h1')[0];
      const subtitle = document.getElementById("savingsModal").getElementsByClassName("header")[0].getElementsByTagName('h2')[0];
      title.innerText = data.title;
      subtitle.innerText = data.subtitle;
      
      // Populate products data in "desktop" view content table
      const products = document.getElementById("savingsModal").getElementsByClassName("product");
      data.medicationSavings.forEach( (item,i) => {
        const productName = products[i].getElementsByClassName("name")[0].getElementsByTagName('p');
        productName[0].innerText = item.name;
        productName[1].innerText = item.description.package;

        const smartPrice = products[i].getElementsByClassName("row")[1].getElementsByTagName('div')[0];
        const competitorPrice = products[i].getElementsByClassName("row")[1].getElementsByTagName('div')[1];

        smartPrice.innerText = item.smartPrice;
        competitorPrice.innerText = item.competitorPrice;

      });

      // Populate products data in "mobile" view content
      const productsInTable = document.getElementById("savingsModal").getElementsByClassName("table-product");
      data.medicationSavings.forEach( (item,i) => {
        const productsInTableNames = productsInTable[i].getElementsByTagName('p');
        productsInTableNames[0].innerText = item.name;
        productsInTableNames[1].innerText = item.description.package;

        const prices = productsInTable[i].getElementsByTagName('td');
        prices[1].innerText = item.smartPrice;
        prices[2].innerText = item.competitorPrice;
      });

    })
  } catch (ex) {
		alert(ex.message && ex);
	} finally {
		return false;
	}
}

function closeModal(e){
  if (e.target.className === 'modal'){
    e.target.className = 'modal hidden';
  }
}

function init() {
  document.getElementById('savingsModal').addEventListener('click', closeModal, false);
  document.getElementById('pharmaciesModal').addEventListener('click', closeModal, false);
}

window.onload = function() {
  init();
  parseReferralPharmacy()
  getSavingsInformation();
};

window.onclose = function() {
  document.getElementById('savingsModal').removeEventListener('click', closeModal);
  document.getElementById('pharmaciesModal').removeEventListener('click', closeModal);
}