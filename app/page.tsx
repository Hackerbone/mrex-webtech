import Link from "next/link"
import { ArrowRight, CheckCircle2, FileText, Lock, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl">MRex</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium transition-colors hover:text-primary">
              Benefits
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Secure, Accessible Medical Records
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  MRex helps you manage your medical history in one secure place. Share with doctors, track
                  appointments, and take control of your healthcare journey.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[600px] items-center justify-center">
              <img
                src="/mrex.jpg"
                alt="MRex Dashboard Preview"
                className="rounded-lg border shadow-xl"
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Powerful Features for Your Medical Records
            </h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl">
              Everything you need to manage your health information in one secure platform.
            </p>
          </div>
          <div className="mx-auto mt-12 grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Centralized Records</h3>
              <p className="text-muted-foreground">
                Store all your medical documents, test results, and prescriptions in one secure location.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Doctor Sharing</h3>
              <p className="text-muted-foreground">
                Securely share your medical history with healthcare providers for better care.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Advanced Security</h3>
              <p className="text-muted-foreground">
                Your data is protected with end-to-end encryption and strict access controls.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Privacy Controls</h3>
              <p className="text-muted-foreground">
                Granular permissions let you control exactly who sees what information.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01" />
                  <path d="M17 7h.01" />
                  <path d="M7 17h.01" />
                  <path d="M17 17h.01" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Document Scanning</h3>
              <p className="text-muted-foreground">
                Easily scan and upload paper records directly from your mobile device.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Health Timeline</h3>
              <p className="text-muted-foreground">
                Visualize your medical history chronologically for better understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-muted/50 py-12 md:py-16 lg:py-20">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">Why Choose MRex?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform offers unique advantages for patients and healthcare providers.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Complete Health Picture</h3>
                  <p className="text-muted-foreground">
                    Doctors get a comprehensive view of your medical history for better diagnosis.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Reduce Medical Errors</h3>
                  <p className="text-muted-foreground">
                    Accurate information helps prevent mistakes in treatment and medication.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Emergency Access</h3>
                  <p className="text-muted-foreground">
                    Critical information is available when needed most in emergency situations.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Save Time</h3>
                  <p className="text-muted-foreground">
                    No more filling out the same forms repeatedly at different medical offices.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Take Control</h3>
                  <p className="text-muted-foreground">
                    Be an active participant in your healthcare with complete information access.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Peace of Mind</h3>
                  <p className="text-muted-foreground">
                    Know that your medical information is secure, organized, and accessible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-screen-2xl mx-auto py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[58rem] rounded-lg border bg-card p-8 shadow-lg md:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
              Ready to Take Control of Your Medical Records?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of patients who have simplified their healthcare journey with MRex.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="w-full max-w-screen-2xl mx-auto py-8 md:py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="mx-6">
              <div className="flex items-center gap-2 font-bold">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl">MRex</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Secure medical records management for patients and healthcare providers.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    For Doctors
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    For Patients
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    support@mrex.com
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <address className="not-italic text-muted-foreground">
                    Manipal
                    <br />
                    Karnataka, India
                    </address>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 MRex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

