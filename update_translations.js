const fs = require('fs');
const path = require('path');

const locales = ['en', 'ar', 'de', 'fr'];
const data = {
  en: {
    Services: {
      "featured": "Featured",
      "allServices": "All Services",
      "viewPackages": "View Packages →",
      "noServices": "No services found for this locale yet.",
      "serviceNotFound": "Service not found.",
      "availablePackages": "Available Packages",
      "noPackages": "No specific packages have been listed for this service yet. Stay tuned!",
      "orderNow": "Order Now"
    },
    Settings: {
      "specialService": "Special Service (Show on Home Page)",
      "homePageChip": "Home Page",
      "deletePermanently": "Delete permanently",
      "untitledPackage": "Untitled Package",
      "noDescProvided": "No description provided"
    },
    Order: {
      "backToPackages": "Back to Packages",
      "totalFee": "Total Fee",
      "firstName": "First Name",
      "lastName": "Last Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "requirements": "Project Requirements & Details",
      "requirementsPlaceholder": "Tell us everything we need to know to get started...",
      "submitRequest": "Submit Request",
      "submitting": "Submitting...",
      "noChargeWarning": "You won't be charged until we review and accept your order.",
      "requestReceived": "Request Received!",
      "requestReceivedDesc": "We've logged your request for {package}. Our team will review your requirements. You will receive a notification and a payment link in your dashboard shortly.",
      "goToDashboard": "Go to My Dashboard",
      "errorLoading": "Failed to fetch pricing information.",
      "subNotFound": "The specific sub-service could not be found.",
      "mainNotFound": "The main service could not be found."
    }
  },
  ar: {
    Services: {
      "featured": "مميز",
      "allServices": "جميع الخدمات",
      "viewPackages": "عرض الباقات ←",
      "noServices": "لم يتم العثور على خدمات حتى الآن.",
      "serviceNotFound": "الخدمة غير موجودة.",
      "availablePackages": "الباقات المتاحة",
      "noPackages": "لم يتم إدراج باقات محددة لهذه الخدمة بعد. ابق على تواصل!",
      "orderNow": "اطلب الآن"
    },
    Settings: {
      "specialService": "خدمة خاصة (عرض على الصفحة الرئيسية)",
      "homePageChip": "الصفحة الرئيسية",
      "deletePermanently": "حذف نهائياً",
      "untitledPackage": "باقة بدون عنوان",
      "noDescProvided": "لا يوجد وصف"
    },
    Order: {
      "backToPackages": "العودة للباقات",
      "totalFee": "إجمالي الرسوم",
      "firstName": "الاسم الأول",
      "lastName": "الاسم الأخير",
      "email": "البريد الإلكتروني",
      "phone": "رقم الهاتف",
      "requirements": "متطلبات المشروع والتفاصيل",
      "requirementsPlaceholder": "أخبرنا بكل ما نحتاج لمعرفته للبدء...",
      "submitRequest": "إرسال الطلب",
      "submitting": "جاري الإرسال...",
      "noChargeWarning": "لن يتم تحصيل أي مبالغ حتى نراجع ونقبل طلبك.",
      "requestReceived": "تم استلام الطلب!",
      "requestReceivedDesc": "لقد سجلنا طلبك لـ {package}. سيقوم فريقنا بمراجعة متطلباتك. ستتلقى إشعارًا ورابط دفع في لوحة التحكم الخاصة بك قريبًا.",
      "goToDashboard": "الذهاب للوحة التحكم",
      "errorLoading": "فشل في جلب معلومات الأسعار.",
      "subNotFound": "تعذر العثور على الباقة الفرعية المحددة.",
      "mainNotFound": "تعذر العثور على الخدمة الرئيسية."
    }
  },
  fr: {
    Services: {
      "featured": "En vedette",
      "allServices": "Tous les services",
      "viewPackages": "Voir les forfaits →",
      "noServices": "Aucun service trouvé pour le moment.",
      "serviceNotFound": "Service non trouvé.",
      "availablePackages": "Forfaits disponibles",
      "noPackages": "Aucun forfait n'a encore été listé pour ce service. Restez à l'écoute!",
      "orderNow": "Commander"
    },
    Settings: {
      "specialService": "Service spécial (Afficher sur la page d'accueil)",
      "homePageChip": "Page d'accueil",
      "deletePermanently": "Supprimer définitivement",
      "untitledPackage": "Forfait sans titre",
      "noDescProvided": "Aucune description fournie"
    },
    Order: {
      "backToPackages": "Retour aux forfaits",
      "totalFee": "Frais totaux",
      "firstName": "Prénom",
      "lastName": "Nom",
      "email": "Adresse e-mail",
      "phone": "Numéro de téléphone",
      "requirements": "Exigences du projet & détails",
      "requirementsPlaceholder": "Dites-nous tout ce que nous devons savoir pour commencer...",
      "submitRequest": "Soumettre la demande",
      "submitting": "Soumission...",
      "noChargeWarning": "Vous ne serez pas facturé avant que nous n'examinions et n'acceptions votre commande.",
      "requestReceived": "Demande reçue!",
      "requestReceivedDesc": "Nous avons enregistré votre demande pour {package}. Notre équipe examinera vos exigences. Vous recevrez une notification et un lien de paiement sur votre tableau de bord sous peu.",
      "goToDashboard": "Aller à mon tableau de bord",
      "errorLoading": "Échec de la récupération des informations de tarification.",
      "subNotFound": "Le sous-service spécifique n'a pas pu être trouvé.",
      "mainNotFound": "Le service principal n'a pas pu être trouvé."
    }
  },
  de: {
    Services: {
      "featured": "Hervorgehoben",
      "allServices": "Alle Dienste",
      "viewPackages": "Pakete anzeigen →",
      "noServices": "Noch keine Dienste gefunden.",
      "serviceNotFound": "Dienst nicht gefunden.",
      "availablePackages": "Verfügbare Pakete",
      "noPackages": "Für diesen Dienst wurden anscheinend noch keine speziellen Pakete aufgeführt.",
      "orderNow": "Jetzt bestellen"
    },
    Settings: {
      "specialService": "Besonderer Service (Auf der Startseite anzeigen)",
      "homePageChip": "Startseite",
      "deletePermanently": "Dauerhaft löschen",
      "untitledPackage": "Unbenanntes Paket",
      "noDescProvided": "Keine Beschreibung"
    },
    Order: {
      "backToPackages": "Zurück zu Paketen",
      "totalFee": "Gesamtgebühr",
      "firstName": "Vorname",
      "lastName": "Nachname",
      "email": "E-Mail-Adresse",
      "phone": "Telefonnummer",
      "requirements": "Projektanforderungen & Details",
      "requirementsPlaceholder": "Teilen Sie uns alles mit, was wir wissen müssen, um loszulegen...",
      "submitRequest": "Anfrage einreichen",
      "submitting": "Wird eingereicht...",
      "noChargeWarning": "Es werden keine Gebühren berechnet, bis wir Ihre Bestellung prüfen und annehmen.",
      "requestReceived": "Anfrage erhalten!",
      "requestReceivedDesc": "Wir haben Ihre Anfrage für {package} protokolliert. Unser Team wird Ihre Anforderungen prüfen. Sie erhalten in Kürze eine Benachrichtigung und einen Zahlungslink auf Ihrem Dashboard.",
      "goToDashboard": "Zu meinem Dashboard",
      "errorLoading": "Fehler beim Abrufen der Preisinformationen.",
      "subNotFound": "Der spezifische Unterdienst wurde nicht gefunden.",
      "mainNotFound": "Der Hauptdienst wurde nicht gefunden."
    }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  let fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!fileData.Services) fileData.Services = {};
  if (!fileData.Settings) fileData.Settings = {};
  if (!fileData.Order) fileData.Order = {};
  
  // Merge
  Object.assign(fileData.Services, data[loc].Services);
  Object.assign(fileData.Settings, data[loc].Settings);
  Object.assign(fileData.Order, data[loc].Order);
  
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
});

console.log("Translations successfully updated.");
