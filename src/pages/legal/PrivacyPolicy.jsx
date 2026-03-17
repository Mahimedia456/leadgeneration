import AppShell from "../../layouts/AppShell";

export default function PrivacyPolicy() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="app-panel p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
              Legal
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                1. Introduction
              </h2>
              <p className="mt-3">
                Mahimedia Solutions Suite (“we,” “our,” or “us”) respects your
                privacy and is committed to protecting your personal data. This
                Privacy Policy explains how we collect, use, store, and protect
                information when you use our platform, including lead management,
                workspace collaboration, Meta integrations, campaign tools, and
                reporting features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                2. Information We Collect
              </h2>
              <div className="mt-3 space-y-3">
                <p>We may collect and process the following categories of data:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Account information such as name, email address, and login credentials.</li>
                  <li>Workspace, brand, and team management data you create inside the platform.</li>
                  <li>Lead data collected through integrated channels such as Meta lead forms, pages, campaigns, and connected social assets.</li>
                  <li>Usage information such as login activity, browser/device data, and operational logs.</li>
                  <li>Communications and support requests submitted to our team.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                3. How We Use Information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>To provide, operate, and maintain our services.</li>
                <li>To manage user accounts, workspaces, roles, and permissions.</li>
                <li>To sync and process campaign, page, Instagram, and lead data from connected integrations.</li>
                <li>To improve product security, reliability, and performance.</li>
                <li>To communicate about service updates, support, and account-related matters.</li>
                <li>To meet legal, compliance, and fraud-prevention obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                4. Meta Platform and Third-Party Integrations
              </h2>
              <p className="mt-3">
                When you connect Meta, Facebook Pages, Instagram business accounts,
                ad accounts, or lead forms to our platform, we process data made
                available through those integrations only to provide requested
                features such as syncing pages, retrieving leads, monitoring
                campaign assets, and routing lead data within your workspace.
              </p>
              <p className="mt-3">
                We do not sell your integration data. We access and use third-party
                data only as necessary to provide core platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                5. Data Sharing
              </h2>
              <p className="mt-3">
                We may share data only in the following situations:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>With authorized users inside your organization or workspace.</li>
                <li>With infrastructure and service providers that help us run the platform.</li>
                <li>Where disclosure is required by law, regulation, or valid legal process.</li>
                <li>To protect our rights, users, systems, or platform security.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                6. Data Retention
              </h2>
              <p className="mt-3">
                We retain data only for as long as necessary to provide services,
                comply with legal obligations, resolve disputes, enforce agreements,
                and maintain business records. Data retention periods may vary based
                on account status, workspace configuration, and integration usage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                7. Security
              </h2>
              <p className="mt-3">
                We use reasonable administrative, technical, and organizational
                safeguards to protect personal data against unauthorized access,
                loss, misuse, or disclosure. However, no internet-based system can
                be guaranteed to be completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                8. Your Rights
              </h2>
              <p className="mt-3">
                Depending on applicable law, you may have rights to access, correct,
                update, delete, or restrict certain personal data. You may also
                request information about how your data is processed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                9. Children’s Privacy
              </h2>
              <p className="mt-3">
                Our services are not intended for children, and we do not knowingly
                collect personal information from children through this platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                10. Changes to This Policy
              </h2>
              <p className="mt-3">
                We may update this Privacy Policy from time to time. When we do, we
                will update the effective date above. Continued use of the platform
                after updates means the revised policy applies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                11. Contact
              </h2>
              <p className="mt-3">
                For privacy questions, contact:
              </p>
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