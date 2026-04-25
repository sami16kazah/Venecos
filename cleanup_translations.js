const fs = require('fs');
const path = require('path');

const locales = ['en', 'ar', 'de', 'fr'];
const data = {
  en: {
    Settings: {
      "manageServices": "Manage Services",
      "manageDesc": "Add, edit, or delete the services and packages offered on the platform.",
      "return": "Return",
      "save": "Save Changes"
    }
  },
  ar: {
    Settings: {
      "manageServices": "إدارة الخدمات",
      "manageDesc": "إضافة أو تعديل أو حذف الخدمات والباقات المقدمة على المنصة.",
      "return": "رجوع",
      "save": "حفظ التغييرات"
    }
  },
  fr: {
    Settings: {
      "manageServices": "Gérer les services",
      "manageDesc": "Ajouter, modifier ou supprimer les services et forfaits proposés sur la plateforme.",
      "return": "Retour",
      "save": "Enregistrer les modifications"
    }
  },
  de: {
    Settings: {
      "manageServices": "Dienste verwalten",
      "manageDesc": "Hinzufügen, Bearbeiten oder Löschen der auf der Plattform angebotenen Dienste und Pakete.",
      "return": "Zurück",
      "save": "Änderungen speichern"
    }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  if (!fs.existsSync(filePath)) return;

  let fileContent = fs.readFileSync(filePath, 'utf8').trim();
  const lastBrace = fileContent.lastIndexOf('}');
  if (lastBrace !== fileContent.length - 1) {
      fileContent = fileContent.substring(0, lastBrace + 1);
  }
  
  let fileData = JSON.parse(fileContent);
  if (!fileData.Settings) fileData.Settings = {};
  Object.assign(fileData.Settings, data[loc].Settings);
  
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
});

console.log("Settings translations successfully updated.");
