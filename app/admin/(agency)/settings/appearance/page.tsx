import { Metadata } from "next"
import { AppearanceForm } from "@/features/settings/appearance/appearance-form"
import ContentSection from "@/features/settings/components/content-section"

export const metadata: Metadata = {
  title: "Appearance",
  description: "Customize the appearance of your application.",
}

export default function AppearancePage() {
  return (
    <ContentSection
    title='Appearance'
    desc='Customize the appearance of the app. Automatically switch between day
        and night themes.'
  >
    <AppearanceForm />
  </ContentSection>
  )
}
