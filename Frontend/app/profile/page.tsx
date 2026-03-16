import UtilityBar from '@/components/utility-bar'
import Header from '@/components/header'
import DashboardSidebar from '@/components/dashboard/sidebar'
import ProfileHeader from '@/components/profile/profile-header'
import ProfileOverview from '@/components/profile/profile-overview'
import ComplaintSummary from '@/components/profile/complaint-summary'
import PersonalInformation from '@/components/profile/personal-information'
import SecuritySettings from '@/components/profile/security-settings'
import ActivityLog from '@/components/profile/activity-log'

export const metadata = {
  title: 'My Profile | Gujarat CivicTrack',
  description: 'Manage your personal information and account settings',
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <UtilityBar />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Fixed Width */}
        <DashboardSidebar />

        {/* Main Content - Flexible Width */}
        <div className="flex-1 bg-background overflow-y-auto">
          <div className="px-6 sm:px-8 lg:px-10 py-8">
            {/* Profile Header with Breadcrumbs */}
            <ProfileHeader />

            {/* Profile Overview Card */}
            <section className="mb-8">
              <ProfileOverview />
            </section>

            {/* Complaint Summary Mini Dashboard */}
            <section className="mb-8">
              <ComplaintSummary />
            </section>

            {/* Personal Information Section */}
            <section className="mb-8">
              <PersonalInformation />
            </section>

            {/* Security Settings Section */}
            <section className="mb-8">
              <SecuritySettings />
            </section>

            {/* Activity Log Section */}
            <section className="mb-8">
              <ActivityLog />
            </section>

            {/* Danger Zone - Account Actions */}
            <section className="mb-8">
              <div className="bg-white border border-red-200 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-red-200">
                    <div>
                      <p className="font-semibold text-slate-900">Download Complaint History</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Download a copy of all your complaints and resolution history as PDF
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap transition-colors">
                      Download
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
                    <div>
                      <p className="font-semibold text-slate-900">Delete Account</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg whitespace-nowrap transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
