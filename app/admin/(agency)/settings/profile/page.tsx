import Profile from "@/features/settings/profile"
import { ImageUploadForm } from "@/components/rumech-ui/forms/image-upload"
export default async function ProfilePage() {
  
  return (
    <div className="flex flex-col gap-4">
      <Profile  />
      <ImageUploadForm />
    </div>
  )
}
