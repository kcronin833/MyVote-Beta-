import { PoliticalSpectrumBar } from "@/components/political-spectrum-bar"
import { PoliticalProfile } from "@/components/political-profile"

const ProfilePage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Existing content */}
          <PoliticalProfile />
        </div>
        <div className="space-y-6">
          {/* Political Position - Make this prominent */}
          <PoliticalSpectrumBar />

          {/* Other sidebar content */}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
