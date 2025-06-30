export default function Footer() {
  return (
    <footer className="text-sm py-10 px-4 border-t bg-card">
      <div className="max-w-7xl mx-auto text-center space-y-2">
        <p>© {new Date().getFullYear()} NCHS LTD. All rights reserved.</p>
        <p className="text-[#b28f3f]">
          This site is confidential and monitored. Unauthorized use is prohibited.
        </p>
        <a
          href="/privacy-policy"
          className="underline text-xs opacity-50 hover:opacity-100"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
