import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-[13px] font-medium text-[#0071e3] transition-colors hover:text-[#0077ed]"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
          Back to Orbit Pay
        </Link>

        <h1 className="text-[34px] font-bold tracking-tight text-[#1d1d1f]">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-[13px] text-[#86868b]">
          Last updated: 1 January 2026
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#424245]">
          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Orbit Pay, you agree to be bound by these
              Terms &amp; Conditions. If you do not agree, you must not use the
              service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              2. Description of Service
            </h2>
            <p>
              Orbit Pay is a personal ledger application that helps you track
              money you have lent to or borrowed from other people. It is not a
              financial institution, bank, payment processor, or licensed money
              service. Orbit Pay does not transfer, hold, or process any money
              on your behalf.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              3. User Accounts
            </h2>
            <p>
              You sign in using your Google account. You are responsible for
              maintaining the security of your Google credentials. All activity
              under your account is your responsibility.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              4. User Data
            </h2>
            <p>
              You retain ownership of all data you create within Orbit Pay. We
              store your data in Firebase Firestore to provide the service. You
              may delete your data at any time. See our{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#0071e3] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              5. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Use the service for any illegal or fraudulent purpose</li>
              <li>Attempt to access another user's data</li>
              <li>Interfere with the operation of the service</li>
              <li>Reverse-engineer or scrape the application</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              6. Disclaimer of Warranties
            </h2>
            <p>
              Orbit Pay is provided "as is" without warranty of any kind,
              express or implied. We do not guarantee the accuracy of balances,
              dates, or any calculated figures. Always verify financial records
              independently.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Orbit Pay and its
              operators shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              8. Changes to Terms
            </h2>
            <p>
              We may modify these terms at any time. Continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              9. Contact
            </h2>
            <p>
              Questions about these terms? Reach us at{" "}
              <span className="font-medium text-[#1d1d1f]">
                legal@orbitpay.in
              </span>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
