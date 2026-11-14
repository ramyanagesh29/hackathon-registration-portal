
import {
  ArrowRight,
  Code2,
  Trophy,
  Users,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Menu,
} from 'lucide-react'

const features = [
  {
    icon: Lightbulb,
    title: 'Innovate',
    description: 'Turn your creative ideas into meaningful solutions.',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Connect with talented minds and build together.',
  },
  {
    icon: Trophy,
    title: 'Compete',
    description: 'Showcase your skills and make your project stand out.',
  },
]

const tracks = [
  'Artificial Intelligence & ML',
  'Web Development',
  'Internet of Things',
  'Cyber Security',
  'Blockchain Technology',
  'Open Innovation',
]

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070B18] text-white">

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -right-40 top-60 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-[#070B18]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          <a href="#home" className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 p-2.5">
              <Code2 size={25} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">CODE-A-NOVA</h2>
              <p className="text-[10px] tracking-[3px] text-slate-400">
                HACKATHON PORTAL
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-9 text-sm text-slate-300 md:flex">
            <a href="#home" className="transition hover:text-violet-400">Home</a>
            <a href="#about" className="transition hover:text-violet-400">About</a>
            <a href="#tracks" className="transition hover:text-violet-400">Tracks</a>
            <a href="#process" className="transition hover:text-violet-400">How It Works</a>
          </div>

          <a
            href="/signup"
            className="hidden items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-violet-200 sm:flex"
          >
            Get Started <ArrowRight size={16} />
          </a>

          <button className="text-white md:hidden" aria-label="Menu">
            <Menu size={25} />
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <main id="home" className="relative z-10">
        <section className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-10">

          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Your ideas deserve the spotlight
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Imagine.
              <span className="block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Innovate.
              </span>
              <span className="block">Make It Happen.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
              Bring your ideas to life. Register for the Code-A-Nova Hackathon,
              collaborate with brilliant minds, and build solutions that matter.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#register"
                className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 font-semibold shadow-lg shadow-violet-900/30 transition hover:-translate-y-1 hover:shadow-violet-500/30"
              >
                Start Your Journey
                <ArrowRight size={19} className="transition group-hover:translate-x-1" />
              </a>

              <a
                href="#about"
                className="rounded-xl border border-white/15 px-7 py-4 font-semibold text-slate-200 transition hover:border-violet-400 hover:bg-white/5"
              >
                Explore More
              </a>
            </div>

            <div className="mt-14 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              <div>
                <h3 className="text-2xl font-bold">01</h3>
                <p className="mt-1 text-sm text-slate-500">Think Big</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">02</h3>
                <p className="mt-1 text-sm text-slate-500">Build Together</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">03</h3>
                <p className="mt-1 text-sm text-slate-500">Create Impact</p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-violet-600/30 to-blue-600/20 blur-3xl" />

            <div className="relative rounded-[32px] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="mb-12 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">WELCOME TO</p>
                  <h2 className="mt-2 text-2xl font-bold">The Innovation Zone</h2>
                </div>
                <div className="rounded-2xl bg-violet-500/15 p-4 text-violet-300">
                  <Rocket size={30} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-6">
                  <Code2 className="mb-5 text-violet-300" size={28} />
                  <h3 className="font-bold">Build</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Transform concepts into working prototypes.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6">
                  <Trophy className="mb-5 text-blue-300" size={28} />
                  <h3 className="font-bold">Achieve</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Demonstrate your skills and creativity.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="rounded-xl bg-green-400/10 p-3 text-green-400">
                  <ShieldCheck size={25} />
                </div>
                <div>
                  <h3 className="font-semibold">Your journey starts here</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    One idea can make a difference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About section */}
        <section id="about" className="border-y border-white/10 bg-white/[0.02] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[4px] text-violet-400">
                Why Code-A-Nova?
              </p>
              <h2 className="mt-5 text-3xl font-bold sm:text-5xl">
                More Than Just a Hackathon
              </h2>
              <p className="mt-5 leading-7 text-slate-400">
                A platform to experiment, learn, collaborate, and transform
                innovative thinking into real-world solutions.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-violet-500/[0.06]"
                  >
                    <div className="mb-7 inline-flex rounded-2xl bg-violet-500/15 p-4 text-violet-300">
                      <Icon size={30} />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Tracks section */}
        <section id="tracks" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-[4px] text-blue-400">
              Explore Possibilities
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              Choose Your Innovation Track
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400">
              Pick a domain that inspires you and create something extraordinary.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, index) => (
              <div
                key={track}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-blue-400/40 hover:bg-blue-500/[0.07]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-violet-400">
                    0{index + 1}
                  </span>
                  <h3 className="font-semibold">{track}</h3>
                </div>
                <ArrowRight size={18} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Process section */}
        <section id="process" className="border-y border-white/10 bg-white/[0.02] px-6 py-24">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm font-bold uppercase tracking-[4px] text-violet-400">
              Simple Steps
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              How It Works
            </h2>

            <div className="mt-14 grid gap-8 text-left md:grid-cols-3">
              {[
                ['01', 'Create Your Account', 'Sign up with your details and verify your email address.'],
                ['02', 'Submit Your Project', 'Complete the registration form and share your project details.'],
                ['03', 'Get Ready to Innovate', 'Review your submission and prepare to showcase your ideas.'],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-[#0B1123] p-8">
                  <span className="text-4xl font-extrabold text-violet-400/60">{number}</span>
                  <h3 className="mt-6 text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration CTA placeholder */}
        <section id="register" className="px-6 py-24">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-transparent px-7 py-16 text-center sm:px-14">
            <Rocket className="mx-auto mb-7 text-violet-300" size={42} />
            <h2 className="text-3xl font-extrabold sm:text-5xl">
              Ready to Build Something Amazing?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-7 text-slate-300">
              Your next big idea starts with one step. Create your account
              and get ready to submit your hackathon project.
            </p>
            <p className="mt-8 inline-flex rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-violet-200">
              Registration portal coming soon
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-bold tracking-wide">CODE-A-NOVA</h3>
            <p className="mt-1 text-sm text-slate-500">
              Build. Innovate. Collaborate. Compete.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Code-A-Nova. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
