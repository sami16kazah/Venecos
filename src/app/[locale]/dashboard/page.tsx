import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTranslations } from "next-intl/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Project from "@/models/Project";
import CustomerOrderList from "@/components/CustomerOrderList";
import Link from "next/link";
import { MdAssignment, MdAccountTree, MdReceipt, MdDesignServices } from "react-icons/md";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "client";
  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name || "";
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const isRtl = locale === 'ar';

  let myOrders: any[] = [];
  let activeProjectsCount = 0;
  let paidInvoicesCount = 0;

  if (role === 'client' && userId) {
    await connectToDatabase();
    myOrders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    activeProjectsCount = await Project.countDocuments({
      $or: [{ clientId: userId }, { clientName: userName }],
      status: 'active'
    });

    paidInvoicesCount = myOrders.filter((o: any) => o.paymentStatus === 'paid').length;

    // Convert ObjectIds to strings for Client Components
    myOrders = JSON.parse(JSON.stringify(myOrders));
  }

  return (
    <div className="space-y-8 max-w-6xl w-full mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-venecos-black via-neutral-900 to-venecos-black p-6 md:p-8 rounded-3xl shadow-xl border border-venecos-gold/30 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-block bg-venecos-gold/20 text-venecos-gold border border-venecos-gold/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            {role.toUpperCase()} DASHBOARD
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {t("welcome", { name: userName })}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {t("roleStatus", { role: role.toUpperCase() })}
          </p>
        </div>

        <Link
          href={`/${locale}/services`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-venecos-gold to-yellow-500 hover:opacity-90 text-black font-extrabold text-xs shadow-lg transition-all"
        >
          <MdDesignServices size={18} />
          <span>{isRtl ? 'تصفح جميع الخدمات' : 'Browse All Services'}</span>
        </Link>
      </div>

      {/* Client Quick Stats Grid */}
      {role === 'client' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase">{isRtl ? 'الطلبات' : 'Total Orders'}</span>
              <p className="text-3xl font-extrabold text-venecos-black mt-1">{myOrders.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-venecos-gold/10 text-venecos-gold border border-venecos-gold/20 flex items-center justify-center text-2xl">
              <MdAssignment />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase">{isRtl ? 'مشاريع ناعمة قيد التنفيذ' : 'Active Projects'}</span>
              <p className="text-3xl font-extrabold text-venecos-black mt-1">{activeProjectsCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-2xl">
              <MdAccountTree />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase">{isRtl ? 'فواتير مسددة' : 'Paid Invoices'}</span>
              <p className="text-3xl font-extrabold text-venecos-black mt-1">{paidInvoicesCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center text-2xl">
              <MdReceipt />
            </div>
          </div>
        </div>
      )}

      {/* Main Role Overview Box */}
      <div className="p-6 bg-venecos-gold/5 rounded-2xl border border-venecos-gold/20">
        <h3 className="font-bold text-venecos-black mb-2 text-base">
          {role === 'admin' ? t('adminTitle') : role === 'employee' ? t('employeeTitle') : t('clientTitle')}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {role === 'admin' && t('adminDesc')}
          {role === 'employee' && t('employeeDesc')}
          {role === 'client' && t('clientDesc')}
        </p>
      </div>

      {/* Client Orders List */}
      {role === 'client' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <CustomerOrderList orders={myOrders} />
        </div>
      )}

      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-2">{t("announcementTitle")}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{t("announcementText")}</p>
      </div>
    </div>
  );
}
