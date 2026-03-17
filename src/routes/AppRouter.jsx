import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import SignUp from "../pages/auth/SignUp";
import WorkspaceSelection from "../pages/auth/WorkspaceSelection";
import AccessDenied from "../pages/auth/AccessDenied";

import Dashboard from "../pages/dashboard/Dashboard";
import Brands from "../pages/brands/Brands";
import BrandDetail from "../pages/brands/BrandDetail";
import BrandSettings from "../pages/brands/BrandSettings";
import AddBrand from "../pages/brands/AddBrand";
import EditBrand from "../pages/brands/EditBrand";

import Notifications from "../pages/notifications/Notifications";
import ActivityLogs from "../pages/activity/ActivityLogs";

import Users from "../pages/users/Users";
import AddUser from "../pages/users/AddUser";
import EditUser from "../pages/users/EditUser";
import UserDetail from "../pages/users/UserDetail";
import RolesPermissions from "../pages/users/RolesPermissions";

import MetaConnections from "../pages/meta/MetaConnections";
import AuthMetaCallback from "../pages/meta/AuthMetaCallback";
import FacebookPages from "../pages/meta/FacebookPages";
import InstagramAccounts from "../pages/meta/InstagramAccounts";
import FacebookPageDetail from "../pages/meta/FacebookPageDetail";
import InstagramAccountDetail from "../pages/meta/InstagramAccountDetail";

import Campaigns from "../pages/campaign/Campaigns";
import CampaignDetail from "../pages/campaign/CampaignDetail";
import AdSet from "../pages/campaign/AdSet";
import AddCampaign from "../pages/campaign/AddCampaign";

import Leads from "../pages/leads/Leads";
import LeadsDetail from "../pages/leads/LeadsDetail";
import LeadExport from "../pages/leads/LeadExport";

import Distribution from "../pages/distribution/Distribution";
import AssignmentRule from "../pages/distribution/AssignmentRule";
import CreateNewRule from "../pages/distribution/CreateNewRule";
import EditOldRule from "../pages/distribution/EditOldRule";
import AssignmentLeads from "../pages/distribution/AssignmentLeads";

import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";
import Security from "../pages/settings/Security";
import NotificationsSetting from "../pages/settings/NotificationsSetting";
import TeamMembers from "../pages/settings/TeamMembers";
import EditProfile from "../pages/settings/EditProfile";

import Workspaces from "../pages/workspaces/Workspaces";
import CreateWorkspace from "../pages/workspaces/CreateWorkspace";
import EditWorkspace from "../pages/workspaces/EditWorkspace";
import WorkspaceDetail from "../pages/workspaces/WorkspaceDetail";
import ManageMembers from "../pages/workspaces/ManageMembers";

import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import TermsOfUse from "../pages/legal/TermsOfUse";

import AppShell from "../layouts/AppShell";

function PlaceholderPage({ title }) {
  return (
    <AppShell>
      <div className="app-panel p-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Page module will be implemented next.
        </p>
      </div>
    </AppShell>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/workspace-selection" element={<WorkspaceSelection />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/auth/meta/callback" element={<AuthMetaCallback />} />
      <Route path="/meta/connections" element={<MetaConnections />} />
      <Route path="/meta/pages" element={<FacebookPages />} />
      <Route path="/meta/pages/:pageId" element={<FacebookPageDetail />} />
      <Route path="/meta/instagram" element={<InstagramAccounts />} />
      <Route path="/meta/instagram/:accountId" element={<InstagramAccountDetail />} />

      <Route path="/brands" element={<Brands />} />
      <Route path="/brands/add" element={<AddBrand />} />
      <Route path="/brands/:brandId" element={<BrandDetail />} />
      <Route path="/brands/:brandId/edit" element={<EditBrand />} />
      <Route path="/brands/:brandId/settings" element={<BrandSettings />} />

      <Route path="/notifications" element={<Notifications />} />
      <Route path="/activity-logs" element={<ActivityLogs />} />

      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/campaigns/add" element={<AddCampaign />} />
      <Route path="/campaigns/:campaignId" element={<CampaignDetail />} />
      <Route path="/adset" element={<AdSet />} />

      <Route path="/leads" element={<Leads />} />
      <Route path="/leads/:leadId" element={<LeadsDetail />} />
      <Route path="/lead-exports" element={<LeadExport />} />

      <Route path="/distribution" element={<Distribution />} />
      <Route path="/distribution/assignment-rules" element={<AssignmentRule />} />
      <Route path="/distribution/create-rule" element={<CreateNewRule />} />
      <Route path="/distribution/edit-rule" element={<EditOldRule />} />
      <Route path="/distribution/assigned-leads" element={<AssignmentLeads />} />

      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/security" element={<Security />} />
      <Route
        path="/settings/notificationssetting"
        element={<NotificationsSetting />}
      />
      <Route path="/settings/team-members" element={<TeamMembers />} />
      <Route path="/profile" element={<EditProfile />} />

      <Route path="/users" element={<Users />} />
      <Route path="/users/add" element={<AddUser />} />
      <Route path="/users/:userId" element={<UserDetail />} />
      <Route path="/users/:userId/edit" element={<EditUser />} />
      <Route path="/roles-permissions" element={<RolesPermissions />} />

      <Route path="/workspaces" element={<Workspaces />} />
      <Route path="/workspaces/create" element={<CreateWorkspace />} />
      <Route path="/workspaces/:workspaceId" element={<WorkspaceDetail />} />
      <Route path="/workspaces/edit/:workspaceId" element={<EditWorkspace />} />
      <Route
        path="/workspaces/:workspaceId/members"
        element={<ManageMembers />}
      />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />

      <Route
        path="/placeholder"
        element={<PlaceholderPage title="Placeholder" />}
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}