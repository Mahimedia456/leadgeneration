import AppShell from "../../layouts/AppShell";

export default function TermsOfUse() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="app-panel p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
              Legal
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Terms of Use
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing or using Mahimedia Solutions Suite, you agree to be
                bound by these Terms of Use. If you do not agree, do not use the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                2. Services
              </h2>
              <p className="mt-3">
                Our platform provides tools for campaign operations, lead
                management, workspace collaboration, user administration,
                reporting, and integration with third-party services including
                Meta-related products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                3. Account Responsibility
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>You are responsible for the accuracy of information provided in your account.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You are responsible for all activity performed through your account or workspace access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                4. Acceptable Use
              </h2>
              <p className="mt-3">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Use the platform for unlawful, fraudulent, or abusive purposes.</li>
                <li>Attempt to gain unauthorized access to accounts, systems, or integrations.</li>
                <li>Upload, distribute, or process data in violation of applicable law or third-party rules.</li>
                <li>Interfere with the operation, security, or integrity of the service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                5. Third-Party Services
              </h2>
              <p className="mt-3">
                Certain features depend on third-party services and APIs, including
                Meta products. Your use of such integrations may also be subject to
                those third parties’ terms, policies, and technical limitations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                6. Data and Content
              </h2>
              <p className="mt-3">
                You retain responsibility for the data you submit, connect, or
                manage through the platform. You represent that you have the rights
                and permissions necessary to use such data within the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                7. Service Availability
              </h2>
              <p className="mt-3">
                We may modify, suspend, or discontinue part or all of the service at
                any time, with or without notice, including for maintenance,
                security, legal, or operational reasons.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                8. Intellectual Property
              </h2>
              <p className="mt-3">
                The platform, including its software, branding, design, content
                structure, and operational systems, is owned by or licensed to
                Mahimedia Solutions unless otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                9. Disclaimer
              </h2>
              <p className="mt-3">
                The service is provided on an “as is” and “as available” basis.
                While we aim for reliability and security, we do not guarantee
                uninterrupted service, complete accuracy, or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                10. Limitation of Liability
              </h2>
              <p className="mt-3">
                To the maximum extent permitted by law, Mahimedia Solutions will not
                be liable for indirect, incidental, special, consequential, or
                business interruption damages arising from use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                11. Termination
              </h2>
              <p className="mt-3">
                We may suspend or terminate access to the platform if these terms
                are violated, if required by law, or if necessary to protect the
                service, users, or business operations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                12. Changes to Terms
              </h2>
              <p className="mt-3">
                We may revise these Terms of Use from time to time. Continued use of
                the platform after changes means the updated terms apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                13. Contact
              </h2>
              <p className="mt-3">For legal or terms-related questions, contact:</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                Mahimedia Solutions
              </p>
              <p>Email: aamir@mahimediasolutions.com</p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}