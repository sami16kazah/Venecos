const fs = require('fs');
const path = require('path');

const locales = ['en', 'ar', 'de', 'fr'];
const data = {
  en: {
    Dashboard: {
      "payNow": "Pay Now",
      "paidStatus": "Paid",
      "unpaidStatus": "Unpaid"
    }
  },
  ar: {
    Dashboard: {
      "payNow": "ادفع الآن",
      "paidStatus": "تم الدفع",
      "unpaidStatus": "لم يتم الدفع"
    }
  },
  fr: {
    Dashboard: {
      "payNow": "Payer maintenant",
      "paidStatus": "Payé",
      "unpaidStatus": "Non payé"
    }
  },
  de: {
    Dashboard: {
      "payNow": "Jetzt bezahlen",
      "paidStatus": "Bezahlt",
      "unpaidStatus": "Unbezahlt"
    }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  let fileContent = fs.readFileSync(filePath, 'utf8').trim();
  const lastBrace = fileContent.lastIndexOf('}');
  if (lastBrace !== fileContent.length - 1) {
      fileContent = fileContent.substring(0, lastBrace + 1);
  }
  
  let fileData = JSON.parse(fileContent);
  if (!fileData.Dashboard) fileData.Dashboard = {};
  Object.assign(fileData.Dashboard, data[loc].Dashboard);
  
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
});

console.log("Translations updated with 'payNow' and status keys.");
