import CISForm from "@/components/form/CisForm";
import PageHeader from "@/components/page/header";


export default function ClientInformationSheetPage() {
  return (
    <div className="py-20">
      <PageHeader title="Client Information Sheet" backgroundImage="/american-eagle-dubai-skyline-blackwhite.jpg" description="We are a specialized, multi-sector firm focused on the acquisition, management, and strategic structuring of high-value commodities and advanced infrastructure assets."/>
      <CISForm/>
      <div className="max-w-2xl mx-auto p-6 space-y-6 text-center">
        <p>
          <small className="text-gray-400">In accordance with Articles two (2) through five (5) of the Due Diligence Convention and the Federal Marketing Commission Circular of December 1998, concerning the prevention of money laundering, the following information may be supplied to banks and/or other Federal Institutions for purposes of verification</small>
        </p>
      </div>
    </div>
  )
}