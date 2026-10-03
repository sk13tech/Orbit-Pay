import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-[13px] text-[#86868b]">
          Last updated: 1 January 2026
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#424245]">
          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              1. Information We Collect
            </h2>
            <p>
              When you sign in with Google, we receive your display name, email
              address, and profile photo. We do not access your contacts,
              calendar, or any other Google data.
            </p>
            <p className="mt-2">
              The ledger data you create — names, amounts, phone numbers, UPI
              IDs, notes, and due dates — is stored in Google Cloud Firestore
              under your unique user account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              2. How We Use Your Information
            </h2>
            <p>
              Your data is used solely to provide the Orbit Pay service to you.
              We use it to display your debt and credit cards, calculate
              balances, and generate receipt slips. We do not sell, rent, or
              share your personal data with third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              3. Data Storage & Security
            </h2>
            <p>
              All data is stored in Firebase Firestore, hosted on Google Cloud
              infrastructure. Data in transit is encrypted via TLS. Each user's
              data is isolated under their authenticated account — no other user
              can access your records.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              4. Data Retention & Deletion
            </h2>
            <p>
              Your data is retained as long as your account is active. You may
              delete individual cards at any time from within the app. To delete
              all data and close your account, contact us at{" "}
              <span className="font-medium text-[#1d1d1f]">
                privacy@orbitpay.in
              </span>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              5. Third-Party Services
            </h2>
            <p>
              We use Firebase Authentication (Google sign-in) and Firebase
              Firestore (data storage), both operated by Google LLC. We do not
              use analytics trackers, advertising networks, or any other
              third-party services that collect your personal data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, export, or delete your
              personal data at any time. You may also revoke Google
              sign-in access from your Google account settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Any changes will be
              reflected on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[19px] font-semibold text-[#1d1d1f]">
              8. Contact
            </h2>
            <p>
              If you have any questions about this policy, please reach out to{" "}
              <span className="font-medium text-[#1d1d1f]">
                privacy@orbitpay.in
              </span>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
