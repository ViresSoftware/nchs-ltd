import CISForm from "@/components/form/cis-form/CisForm";
import PageHeader from "@/components/page/header";
import PrivacyContainer from "@/components/privacy/Container";
export default function ClientInformationSheetPage() {
  return (
    <div className="py-20">
      <PageHeader title="Privacy Policy" backgroundImage="/american-eagle-dubai-skyline-blackwhite.jpg" description="How We Collect, Use, and Protect Your Information"/>
      <PrivacyContainer/>
    </div>
  )
}