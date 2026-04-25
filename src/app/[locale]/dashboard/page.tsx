import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTranslations } from "next-intl/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import CustomerOrderList from "@/components/CustomerOrderList";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "client";
  const userId = (session?.user as any)?.id;
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  let myOrders: any[] = [];
  if (role === 'client' && userId) {
    await connectToDatabase();
    myOrders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    // Convert ObjectIds to strings for Client Components
    myOrders = JSON.parse(JSON.stringify(myOrders));
  }

  return (
    <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl w-full overflow-hidden">
      <h2 className="text-xl md:text-2xl font-extrabold text-venecos-black mb-4">
        {t("welcome", { name: session?.user?.name || "" })}
      </h2>
      
      <p className="text-gray-600 mb-6 text-lg">
        {t("roleStatus", { role: role.toUpperCase() })}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-venecos-gold/5 rounded-xl border border-venecos-gold/10">
          <h3 className="font-bold text-venecos-black mb-2">
            {role === 'admin' ? t('adminTitle') : role === 'employee' ? t('employeeTitle') : t('clientTitle')}
          </h3>
          <p className="text-gray-600 text-sm">
            {role === 'admin' && t('adminDesc')}
            {role === 'employee' && t('employeeDesc')}
            {role === 'client' && t('clientDesc')}
          </p>
        </div>
      </div>

      {role === 'client' && myOrders.length > 0 && (
        <CustomerOrderList orders={myOrders} />
      )}

      <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 mt-8">
        <h3 className="font-bold text-gray-700 mb-2">{t("announcementTitle")}</h3>
        <p className="text-gray-500">{t("announcementText")}</p>
      </div>
    </div>
  );
}
