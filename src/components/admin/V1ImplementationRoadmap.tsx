import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Users, Server, Code, Shield, FileText, Rocket, Settings, Database, GitBranch, TestTube, BookOpen } from 'lucide-react';

interface Task {
  name: string;
  hours: number;
  details: string[];
}

interface Week {
  week: number;
  title: string;
  icon: React.ReactNode;
  hours: number;
  tasks: Task[];
}

const roadmap: Week[] = [
  {
    week: 1,
    title: 'Azure Infrastructure & Environment Setup',
    icon: <Server className="h-5 w-5" />,
    hours: 50,
    tasks: [
      {
        name: 'Ornge Azure Infrastructure Configuration',
        hours: 20,
        details: [
          'Provision Azure Resource Groups for Dev, UAT, and Prod environments',
          'Configure Azure App Service Plans with appropriate scaling tiers',
          'Set up Azure SQL Database instances with geo-redundancy for Prod',
          'Configure Azure Key Vault for secrets management (API keys, connection strings)',
          'Set up Azure Application Insights for monitoring and telemetry',
          'Configure network security groups and firewall rules per Ornge IT policy',
          'Implement Azure Front Door for CDN and WAF protection',
        ],
      },
      {
        name: 'Dev, UAT, and Prod Environment Setup',
        hours: 18,
        details: [
          'Create isolated environments with separate resource groups and naming conventions',
          'Configure environment-specific connection strings and app settings',
          'Set up custom domains and SSL certificates for each environment',
          'Implement environment-specific CORS policies and access controls',
          'Configure Azure AD integration for Ornge staff authentication',
          'Set up log analytics workspace per environment for diagnostics',
          'Document environment topology and access matrix',
        ],
      },
      {
        name: 'Azure DevOps Configuration',
        hours: 12,
        details: [
          'Create Azure DevOps project and Git repositories for PTTP codebase',
          'Configure branch policies: main → develop → feature/* branching strategy',
          'Set up YAML CI pipeline for automated build, lint, and unit test on PR',
          'Set up YAML CD pipeline for automated deployment to Dev on merge to develop',
          'Configure manual approval gates for UAT and Prod deployments',
          'Set up artifact management and versioning strategy',
          'Configure pipeline variable groups for environment-specific settings',
        ],
      },
    ],
  },
  {
    week: 2,
    title: 'Core Application Scaffolding & Patient Tracking Foundation',
    icon: <Code className="h-5 w-5" />,
    hours: 55,
    tasks: [
      {
        name: 'Application Architecture & Scaffolding',
        hours: 15,
        details: [
          'Initialize React + TypeScript project with Vite build tooling',
          'Configure Tailwind CSS with Ornge brand design tokens (colors, typography)',
          'Set up component library (shadcn/ui) with branded theme overrides',
          'Implement routing structure with React Router (public vs. authenticated routes)',
          'Configure ESLint, Prettier, and Husky pre-commit hooks for code quality',
          'Set up project folder structure: components, pages, hooks, utils, assets',
        ],
      },
      {
        name: 'Patient Login & Authentication Flow',
        hours: 20,
        details: [
          'Build Transport Reference ID login page with form validation',
          'Implement 16-digit tracking number validation and lookup logic',
          'Create session management for authenticated patient/family users',
          'Build rate limiting: 3 failed attempts trigger 5-minute lockout with countdown',
          'Add privacy notice display confirming no medical data is shown',
          'Implement secure redirect logic — unauthenticated access redirects to login',
          'Add accessibility support (ARIA labels, keyboard navigation, focus management)',
        ],
      },
      {
        name: 'Patient Tracking — Status Timeline (Phase 1)',
        hours: 20,
        details: [
          'Design and build 5-stage horizontal timeline component',
          'Implement stage states: completed (highlighted), active (pulsing), pending',
          'Create timeline data model: Requested → Team Assigned → En Route to Pickup → In Transit → Arrived',
          'Build animation system using Framer Motion for stage transitions',
          'Implement responsive layout for mobile, tablet, and desktop breakpoints',
          'Add demo data hookup for testing all timeline states',
        ],
      },
    ],
  },
  {
    week: 3,
    title: 'Patient Tracking — Full Dashboard Build-Out',
    icon: <Users className="h-5 w-5" />,
    hours: 55,
    tasks: [
      {
        name: 'Transport Header & Route Information',
        hours: 12,
        details: [
          'Build transport header showing reference number and transport mode badge (Air/Land)',
          'Display origin and destination facilities with route visualization',
          'Implement ETA display with highlighted time badge',
          'Add care level and crew type indicators',
          'Build responsive card layout with proper spacing and typography hierarchy',
        ],
      },
      {
        name: 'QR Code & Share Tracking Link',
        hours: 10,
        details: [
          'Integrate QR code generation library (qrcode.react)',
          'Build QR code display panel with scannable code and tracking URL',
          'Implement "Copy Tracking Link" button with clipboard API and success feedback',
          'Add shareable URL generation from tracking number',
          'Test QR code scanning across iOS and Android devices',
        ],
      },
      {
        name: 'Special Messages & Transport Details',
        hours: 13,
        details: [
          'Build special message display area for operations-posted messages',
          'Create predefined message templates (Medical Delay, Weather Delay, etc.)',
          'Implement transport details section: care level, crew type, vehicle info',
          'Build expandable/collapsible detail sections for information density',
          'Add timestamp display for last updated information',
          'Style all components according to Ornge brand guidelines',
        ],
      },
      {
        name: 'Device Frame Preview System',
        hours: 20,
        details: [
          'Build platform selector page with device mockup images (Mobile, Tablet, Desktop)',
          'Create iPhone-style device frame with Dynamic Island notch and home indicator',
          'Create iPad-style device frame with minimal bezel and status bar',
          'Implement automatic mobile detection to skip platform selector on mobile devices',
          'Build responsive iframe-based content rendering within device frames',
          'Add smooth transitions between device preview modes',
        ],
      },
    ],
  },
  {
    week: 4,
    title: 'Operations Administration — Core Management',
    icon: <Settings className="h-5 w-5" />,
    hours: 55,
    tasks: [
      {
        name: 'Admin Authentication & Role-Based Access',
        hours: 12,
        details: [
          'Build admin login page with pre-filled demo credentials',
          'Implement two-tier role system: Full Admin and Read-Only',
          'Create role-based UI rendering (hide action buttons for Read-Only users)',
          'Build account management interface: view, add, edit, delete admin accounts',
          'Add role assignment controls with dropdown selection',
          'Implement session-based admin authentication flow',
        ],
      },
      {
        name: 'Transport Entry & Tracking Number Management',
        hours: 18,
        details: [
          'Build transport entry form with tracking number input and auto-generation',
          'Implement 16-digit tracking number generation algorithm',
          'Create mission number assignment field with validation',
          'Build status selection dropdown with 6 predefined statuses',
          'Implement ETA entry with date/time picker component',
          'Add hospital selection from predefined Ontario facilities list',
          'Build special message attachment (predefined templates + custom notes)',
          'Implement form validation and save/update logic',
        ],
      },
      {
        name: 'Tracking Table & Search',
        hours: 15,
        details: [
          'Build searchable tracking table with sortable columns',
          'Display: tracking number, mission number, status, last updated, ETA',
          'Implement inline edit and delete actions per table row',
          'Build filter/search functionality across tracking number, mission number, status',
          'Add inline QR code panel per table row for quick sharing',
          'Implement copy-to-clipboard for tracking URLs from table view',
          'Add empty state and loading indicators',
        ],
      },
      {
        name: 'Admin QR Code Sharing Panel',
        hours: 10,
        details: [
          'Build dedicated QR code sharing section in admin portal',
          'Generate scannable QR codes linked to patient tracking URLs',
          'Add direct URL display with copy button and success feedback',
          'Include instructional text for sharing with patient families',
          'Test QR code generation and link routing end-to-end',
        ],
      },
    ],
  },
  {
    week: 5,
    title: 'Operations Administration — Advanced Features & Integration',
    icon: <Database className="h-5 w-5" />,
    hours: 50,
    tasks: [
      {
        name: 'Account Management Dashboard',
        hours: 15,
        details: [
          'Build summary statistics cards: Total Accounts, Full Admin count, Read-Only count, Active sessions',
          'Create account listing table with name, email, role, created date, last login',
          'Implement Add Account dialog with form validation',
          'Build Edit Account functionality with role change capability',
          'Add Delete Account with confirmation dialog',
          'Implement role-based visibility: Read-Only users see account list but cannot modify',
        ],
      },
      {
        name: 'Data Model & State Management',
        hours: 15,
        details: [
          'Design mock data models for transports, tracking entries, and admin accounts',
          'Build centralized state management for transport tracking entries',
          'Implement CRUD operations for tracking entries with optimistic UI updates',
          'Create demo data set with realistic Ontario hospital routes and scenarios',
          'Build data validation layer for all form inputs',
          'Implement auto-delete logic for old entries (48-hour expiry display)',
        ],
      },
      {
        name: 'Cross-Cutting Concerns & Polish',
        hours: 20,
        details: [
          'Implement consistent error handling and user feedback (toast notifications)',
          'Add loading states and skeleton screens for all async operations',
          'Build responsive navigation with mobile hamburger menu considerations',
          'Implement keyboard navigation and screen reader compatibility (WCAG 2.1 AA)',
          'Add print stylesheet for tracking information printouts',
          'Performance optimization: lazy loading, code splitting, image optimization',
          'Cross-browser testing: Chrome, Firefox, Safari, Edge',
        ],
      },
    ],
  },
  {
    week: 6,
    title: 'UAT Preparation & Testing',
    icon: <TestTube className="h-5 w-5" />,
    hours: 50,
    tasks: [
      {
        name: 'Test Suite Development',
        hours: 20,
        details: [
          'Write unit tests for all utility functions and data transformations (Vitest)',
          'Create component tests for critical UI flows (React Testing Library)',
          'Build integration tests for authentication and tracking lookup flows',
          'Write end-to-end test scenarios for patient tracking journey',
          'Write end-to-end test scenarios for admin transport management',
          'Achieve minimum 80% code coverage target',
          'Configure test reporting in Azure DevOps pipeline',
        ],
      },
      {
        name: 'UAT Environment Deployment & Validation',
        hours: 15,
        details: [
          'Deploy application to UAT environment via Azure DevOps CD pipeline',
          'Verify all environment-specific configurations (URLs, API endpoints, certificates)',
          'Perform smoke testing of all major user flows in UAT',
          'Validate QR code generation and scanning in UAT environment',
          'Test device frame previews across target devices and browsers',
          'Verify security controls: login lockout, session management, redirect logic',
          'Load demo data set into UAT for stakeholder review',
        ],
      },
      {
        name: 'UAT Stakeholder Review & Approval',
        hours: 15,
        details: [
          'Prepare UAT test plan document with acceptance criteria per feature',
          'Schedule UAT walkthrough sessions with Ornge stakeholders',
          'Facilitate guided testing sessions for patient tracking portal',
          'Facilitate guided testing sessions for operations administration portal',
          'Document and triage UAT feedback: critical, high, medium, low priority',
          'Address critical and high-priority issues identified during UAT',
          'Obtain formal UAT sign-off from designated Ornge approvers',
        ],
      },
    ],
  },
  {
    week: 7,
    title: 'Documentation & Production Preparation',
    icon: <BookOpen className="h-5 w-5" />,
    hours: 50,
    tasks: [
      {
        name: 'User Guide — Patient Tracking Portal',
        hours: 12,
        details: [
          'Document how to access the tracking portal via QR code or direct link',
          'Step-by-step guide for entering a Transport Reference ID',
          'Explanation of the 5-stage timeline and what each stage means',
          'Guide to understanding transport details, ETA, and special messages',
          'FAQ section addressing common family questions and concerns',
          'Include annotated screenshots for all key screens',
          'Provide bilingual considerations and accessibility notes',
        ],
      },
      {
        name: 'Admin Guide — Operations Administration',
        hours: 15,
        details: [
          'Document admin login process and role-based access levels',
          'Step-by-step guide for creating and managing tracking entries',
          'Guide to generating and sharing QR codes and tracking links',
          'Explanation of status options and when to use each one',
          'Guide to special messages: predefined templates and custom messages',
          'Account management procedures: adding, editing, and removing admin users',
          'Troubleshooting guide for common admin operations issues',
          'Include annotated screenshots for all admin portal sections',
        ],
      },
      {
        name: 'Technical Documentation & Runbook',
        hours: 10,
        details: [
          'Document Azure infrastructure architecture diagram',
          'Record environment configurations: Dev, UAT, Prod settings and URLs',
          'Document CI/CD pipeline structure and deployment procedures',
          'Create operational runbook: monitoring, alerting, incident response',
          'Document database schema, API endpoints, and data flows',
          'Record all third-party dependencies and license information',
        ],
      },
      {
        name: 'Production Deployment Preparation',
        hours: 13,
        details: [
          'Conduct final security review: OWASP top 10, dependency vulnerability scan',
          'Perform production readiness checklist review',
          'Configure production monitoring dashboards in Azure Application Insights',
          'Set up alerting rules for error rates, response times, and availability',
          'Prepare rollback plan and disaster recovery procedures',
          'Stage production deployment via Azure DevOps release pipeline',
        ],
      },
    ],
  },
  {
    week: 8,
    title: 'Production Deployment, Sign-Off & GO LIVE',
    icon: <Rocket className="h-5 w-5" />,
    hours: 35,
    tasks: [
      {
        name: 'Production Deployment',
        hours: 10,
        details: [
          'Execute production deployment via approved Azure DevOps release pipeline',
          'Verify DNS configuration and SSL certificate binding for production domain',
          'Run production smoke tests across all major user flows',
          'Validate QR code generation and tracking links resolve correctly in production',
          'Confirm monitoring and alerting are active and receiving telemetry',
          'Verify security controls are enforced in production environment',
        ],
      },
      {
        name: 'Post-Deployment Validation & Hypercare',
        hours: 12,
        details: [
          'Monitor application performance and error rates during initial launch window',
          'Conduct guided walkthrough with Ornge operations staff in production',
          'Address any production-specific issues identified during hypercare',
          'Validate logging and audit trail functionality',
          'Confirm backup and recovery procedures are operational',
          'Performance baseline: document response times, load metrics, and availability',
        ],
      },
      {
        name: 'Final Sign-Off & GO LIVE',
        hours: 8,
        details: [
          'Present final demo to Ornge leadership and project sponsors',
          'Review all deliverables against original requirements',
          'Obtain formal project sign-off from Ornge project owner',
          'Transition to operational support model with documented SLAs',
          'Conduct lessons-learned session and document for future phases',
          'Official GO LIVE announcement and handover to Ornge operations team',
        ],
      },
      {
        name: 'Knowledge Transfer & Handover',
        hours: 5,
        details: [
          'Conduct knowledge transfer sessions with Ornge IT support team',
          'Walk through codebase structure, deployment pipelines, and monitoring',
          'Provide access credentials and admin documentation package',
          'Establish communication channels for ongoing support',
          'Deliver all project documentation: User Guide, Admin Guide, Technical Runbook',
        ],
      },
    ],
  },
];

const totalHours = roadmap.reduce((sum, w) => sum + w.hours, 0);

export default function V1ImplementationRoadmap() {
  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{totalHours}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Total Hours</p>
        </div>
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-secondary">8</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Weeks</p>
        </div>
        <div className="bg-accent border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">2</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Months</p>
        </div>
        <div className="bg-accent border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{roadmap.reduce((sum, w) => sum + w.tasks.length, 0)}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Deliverables</p>
        </div>
      </div>

      {/* Week-by-Week Breakdown */}
      <div className="space-y-4">
        {roadmap.map((week, wi) => (
          <motion.details
            key={week.week}
            className="group bg-accent/30 border border-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: wi * 0.04, duration: 0.3 }}
          >
            <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none hover:bg-accent/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {week.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Week {week.week}</span>
                  <span className="text-sm font-semibold text-foreground">{week.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{week.hours} hrs</span>
                <svg className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </summary>

            <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
              {week.tasks.map((task, ti) => (
                <div key={ti} className="bg-card rounded-lg border border-border p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{task.name}</h4>
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.hours} hrs
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {task.details.map((detail, di) => (
                      <li key={di} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.details>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg p-4 space-y-1">
        <p className="font-semibold text-foreground">Notes:</p>
        <p>• Hours are estimates and may vary based on complexity discovered during implementation.</p>
        <p>• Weekly breakdown assumes a blended team of 2–3 resources (developer, DevOps, QA).</p>
        <p>• UAT approval and final sign-off milestones require Ornge stakeholder availability.</p>
        <p>• Total: <span className="font-semibold text-primary">{totalHours} hours</span> over <span className="font-semibold">8 weeks (2 months)</span>.</p>
      </div>
    </div>
  );
}
