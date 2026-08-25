import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <svg viewBox="0 0 24 24" fill="none" className="stroke-primary h-5 w-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Locably
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Helping communities thrive by connecting people with their best local businesses.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">About Us</Link>
              <Link to="/" className="hover:text-primary">Careers</Link>
              <Link to="/" className="hover:text-primary">Press</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Help Center</Link>
              <Link to="/" className="hover:text-primary">Shop Guidelines</Link>
              <Link to="/" className="hover:text-primary">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Newsletter</h4>
            <p className="mb-3 text-sm text-muted-foreground">Get the best local deals in your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
              />
              <button className="rounded-lg bg-primary px-3 py-2 text-primary-foreground">
                →
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © 2024 Locably Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
