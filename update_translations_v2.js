const fs = require('fs');
const path = require('path');

const locales = ['en', 'ar', 'de', 'fr'];
const data = {
  en: {
    Dashboard: {
      "myAssignments": "My Assignments",
      "noOrdersFound": "No orders have been placed yet.",
      "customerDetails": "Customer Details",
      "acceptOrder": "Accept & Assign",
      "rejectOrder": "Reject Order",
      "paidStatus": "Paid",
      "unpaidStatus": "Unpaid",
      "rejectedStatus": "Rejected"
    },
    Chat: {
      "orderChat": "Order Chat",
      "completePayment": "Complete Payment",
      "typeMessage": "Type your message...",
      "paySent": "Here is your payment link. You can proceed with the checkout whenever you are ready."
    },
    Notifications: {
      "title": "Notifications",
      "noNotifications": "All caught up!",
      "markAllRead": "Mark all as read"
    }
  },
  ar: {
    Dashboard: {
      "myAssignments": "طلباتي المكلف بها",
      "noOrdersFound": "لم يتم تقديم أي طلبات بعد.",
      "customerDetails": "تفاصيل العميل",
      "acceptOrder": "قبول وتكليف",
      "rejectOrder": "رفض الطلب",
      "paidStatus": "تم الدفع",
      "unpaidStatus": "لم يتم الدفع",
      "rejectedStatus": "مرفوض"
    },
    Chat: {
      "orderChat": "دردشة الطلب",
      "completePayment": "إكمال الدفع",
      "typeMessage": "اكتب رسالتك...",
      "paySent": "إليك رابط الدفع. يمكنك المتابعة لإتمام عملية الشراء عندما تكون مستعدًا."
    },
    Notifications: {
      "title": "التنبيهات",
      "noNotifications": "لا توجد تنبيهات جديدة!",
      "markAllRead": "تحديد الكل كمقروء"
    }
  },
  fr: {
    Dashboard: {
      "myAssignments": "Mes Missions",
      "noOrdersFound": "Aucune commande n'a encore été passée.",
      "customerDetails": "Détails du Client",
      "acceptOrder": "Accepter & Assigner",
      "rejectOrder": "Rejeter la commande",
      "paidStatus": "Payé",
      "unpaidStatus": "Non payé",
      "rejectedStatus": "Rejeté"
    },
    Chat: {
      "orderChat": "Chat de commande",
      "completePayment": "Finaliser le paiement",
      "typeMessage": "Tapez votre message...",
      "paySent": "Voici votre lien de paiement. Vous pouvez procéder au paiement quand vous serez prêt."
    },
    Notifications: {
      "title": "Notifications",
      "noNotifications": "Tout est à jour !",
      "markAllRead": "Tout marquer comme lu"
    }
  },
  de: {
    Dashboard: {
      "myAssignments": "Meine Aufgaben",
      "noOrdersFound": "Es wurden noch keine Bestellungen aufgegeben.",
      "customerDetails": "Kundendetails",
      "acceptOrder": "Annehmen & Zuweisen",
      "rejectOrder": "Bestellung ablehnen",
      "paidStatus": "Bezahlt",
      "unpaidStatus": "Unbezahlt",
      "rejectedStatus": "Abgelehnt"
    },
    Chat: {
      "orderChat": "Bestell-Chat",
      "completePayment": "Zahlung abschließen",
      "typeMessage": "Schreiben Sie eine Nachricht...",
      "paySent": "Hier ist Ihr Zahlungslink. Sie können mit dem Checkout fortfahren, wenn Sie bereit sind."
    },
    Notifications: {
      "title": "Benachrichtigungen",
      "noNotifications": "Alles erledigt!",
      "markAllRead": "Alle als gelesen markieren"
    }
  }
};

locales.forEach(loc => {
  const filePath = path.join(__dirname, 'messages', `${loc}.json`);
  let fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!fileData.Dashboard) fileData.Dashboard = {};
  if (!fileData.Chat) fileData.Chat = {};
  if (!fileData.Notifications) fileData.Notifications = {};
  
  Object.assign(fileData.Dashboard, data[loc].Dashboard);
  Object.assign(fileData.Chat, data[loc].Chat);
  Object.assign(fileData.Notifications, data[loc].Notifications);
  
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
});

console.log("Translations updated for Assignment and Chat.");
